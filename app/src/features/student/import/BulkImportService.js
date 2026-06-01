import { MaqraGrid } from "../../maqra/domain/MaqraGrid.js";
import { StudentRepository } from "../repository/StudentRepository.js";
import { JsonImportStrategy, CsvImportStrategy } from "./ImportStrategies.js";

// Builder Pattern: Standardizes raw records and populates default learning fields
export class StudentImportBuilder {
  constructor(rawRecord) {
    this.raw = rawRecord;
  }

  build() {
    if (!this.raw.name || this.raw.name.trim() === "") {
      throw new Error("Nama pelajar wajib diisi.");
    }

    const id = this.raw.id ? this.raw.id.trim().toUpperCase() : "STU" + Math.floor(10000 + Math.random() * 90000);
    const defaultGrid = new MaqraGrid({});

    return {
      id,
      name: this.raw.name.trim(),
      kelas: this.raw.kelas || "Tahun 4",
      umur: parseInt(this.raw.umur) || 10,
      parent: this.raw.parent || "—",
      sex: (this.raw.sex || "m").toLowerCase() === "f" ? "f" : "m",
      beginner: this.raw.beginner === "true" || this.raw.beginner === true,
      target: parseInt(this.raw.target) || 15,
      frontier: parseInt(this.raw.frontier) || 1,
      juzuk: parseInt(this.raw.juzuk) || 1,
      surah: this.raw.surah || "Al-Fatihah",
      progress: parseFloat(this.raw.progress) || 0.0,
      lastHafazan: parseInt(this.raw.lastHafazan) || 1,
      lastHafazanSurah: this.raw.lastHafazanSurah || "Al-Fatihah",
      statusMap: defaultGrid.statusMap
    };
  }
}

// Service Coordinator
export const BulkImportService = {
  async importData(rawContent, fileType) {
    let strategy;
    const type = fileType.toLowerCase();
    
    if (type === "json") {
      strategy = new JsonImportStrategy();
    } else if (type === "csv") {
      strategy = new CsvImportStrategy();
    } else {
      throw new Error("Format fail '" + fileType + "' tidak disokong. Sila guna CSV atau JSON.");
    }

    const parsedRecords = strategy.parse(rawContent);
    if (!parsedRecords || parsedRecords.length === 0) {
      throw new Error("Fail kosong atau tiada data untuk diimport.");
    }

    const validStudents = [];
    const errors = [];

    parsedRecords.forEach((record, index) => {
      try {
        const builder = new StudentImportBuilder(record);
        validStudents.push(builder.build());
      } catch (err) {
        errors.push(`Rekod ${index + 1}: ${err.message}`);
      }
    });

    if (errors.length > 0) {
      throw new Error("Ralat import:\n" + errors.slice(0, 10).join("\n") + (errors.length > 10 ? `\n...dan ${errors.length - 10} ralat lagi.` : ""));
    }

    // Call bulk repository persistence
    if (validStudents.length > 0) {
      await StudentRepository.bulkCreate(validStudents);
    }

    return validStudents.length;
  }
};
