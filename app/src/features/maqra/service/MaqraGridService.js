import { MaqraGrid } from "../domain/MaqraGrid.js";
import { StudentRepository } from "../../student/repository/StudentRepository.js";
import { TasmikRepository } from "../../tasmik/repository/TasmikRepository.js";
import { SijilService } from "../../sijil/SijilService.js";
import { getJuzukFromPage } from "../domain/pageMapping.js";

export const MaqraGridService = {
  buildGrid(student) {
    return new MaqraGrid(student.statusMap || {});
  },

  async getGridForStudent(studentId) {
    const student = await StudentRepository.getById(studentId);
    if (!student) {
      throw new Error(`Pelajar dengan ID ${studentId} tidak dijumpai`);
    }
    return this.buildGrid(student);
  },

  async updatePageStatus(studentId, page, status, tasmikInput = null, schoolSlug = null) {
    const student = await StudentRepository.getById(studentId);
    if (!student) {
      throw new Error(`Pelajar dengan ID ${studentId} tidak dijumpai`);
    }
    const resolvedSlug = schoolSlug || student.school_slug || null;

    const grid = new MaqraGrid(student.statusMap || {});
    const updatedGrid = grid.updatePageStatus(page, status);

    // Save student statusMap and new computed frontier
    const updates = {
      statusMap: updatedGrid.statusMap,
      frontier: updatedGrid.frontier
    };

    await StudentRepository.update(studentId, updates);

    // Save tasmik log entry if supplied
    if (tasmikInput) {
      const record = {
        studentId,
        date: new Date().toISOString(),
        kategori: tasmikInput.kategori || "Talaqqi",
        gred: tasmikInput.gred || "Mumtaz",
        from: tasmikInput.from || page,
        to: tasmikInput.to || page,
        juzuk: getJuzukFromPage(page),
        ulasan: tasmikInput.ulasan || "",
        masalah: tasmikInput.masalah || "",
        cadangan: tasmikInput.cadangan || "",
        guru: tasmikInput.guru || "Guru Penguji",
        ...(resolvedSlug && { school_slug: resolvedSlug }),
      };
      await TasmikRepository.saveRecord(record);

      // Check milestones for sijil issuing
      // If student reaches a juzuk boundary (e.g. 1 juzuk finished)
      // We will check if all pages of the juzuk are memorized/completed.
      // For simplicity, let's trigger certificate offering if new frontier or milestone is reached
      if (SijilService && SijilService.checkForMilestones) {
        await SijilService.checkForMilestones(studentId, updatedGrid, page);
      }
    }

    return updatedGrid;
  },

  async getGridSummaries(schoolSlug) {
    const students = await StudentRepository.listAll(schoolSlug);
    const summaries = {};
    for (const student of students) {
      const grid = new MaqraGrid(student.statusMap || {});
      summaries[student.id] = {
        frontier: grid.frontier,
        progressPercent: grid.progressPercent,
        tally: grid.tally
      };
    }
    return summaries;
  }
};
