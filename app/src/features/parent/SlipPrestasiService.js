import { slipPrestasiTemplate } from "./slipPrestasiTemplate.js";
import { StudentRepository } from "../student/repository/StudentRepository.js";
import { TasmikRepository } from "../tasmik/repository/TasmikRepository.js";
import { SchoolRepository } from "../school/repository/SchoolRepository.js";
import { AnalyticsService } from "../analytics/service/AnalyticsService.js";
import { MaqraGridService } from "../maqra/service/MaqraGridService.js";

export const SlipPrestasiService = {
  async generatePdf(studentId) {
    const student = await StudentRepository.getById(studentId);
    if (!student) throw new Error("Student not found");

    const school = await SchoolRepository.getProfile();
    const grid = await MaqraGridService.getGridForStudent(studentId);
    const prediction = await AnalyticsService.predictKhatam(studentId);
    const tasmikLog = await TasmikRepository.getRecordsForStudent(studentId);

    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    // Render A4 layout using the template
    slipPrestasiTemplate.render(doc, student, school, grid, prediction, tasmikLog);

    // Save/Download in browser
    const cleanName = student.name.toLowerCase().replace(/[^a-z0-9]/g, "_");
    doc.save(`Slip_Prestasi_Maqra_${cleanName}.pdf`);
    return true;
  }
};
