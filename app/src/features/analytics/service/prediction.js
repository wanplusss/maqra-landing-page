import { TasmikRepository } from "../../tasmik/repository/TasmikRepository.js";
import { StudentRepository } from "../../student/repository/StudentRepository.js";

export const PredictionService = {
  async getPace(studentId) {
    const student = await StudentRepository.getById(studentId);
    if (!student) return 15; // default 15 pages/month

    const records = await TasmikRepository.getRecordsForStudent(studentId);
    if (records.length < 2) {
      // Estimate based on enrollment date
      const enrollDate = new Date(student.enroll || "2024-01-08");
      const today = new Date(); // fixed relative current time
      const months = Math.max(1, (today - enrollDate) / (1000 * 60 * 60 * 24 * 30.4));
      return Math.round((student.frontier / months) * 10) / 10;
    }

    // Sort ascending
    const sorted = [...records].sort((a, b) => new Date(a.date) - new Date(b.date));
    const first = sorted[0];
    const last = sorted[sorted.length - 1];

    const pages = Math.max(1, last.to - first.from);
    const timeDiff = Math.max(1, (new Date(last.date) - new Date(first.date)) / (1000 * 60 * 60 * 24 * 30.4));
    
    const pace = Math.round((pages / timeDiff) * 10) / 10;
    return pace > 0 ? pace : 15; // fallback to 15
  },

  async predictKhatam(studentId) {
    const student = await StudentRepository.getById(studentId);
    if (!student) return null;

    const pace = await this.getPace(studentId);
    const pagesPerDay = pace / 30.4;
    const remainingPages = 604 - student.frontier;
    const daysToKhatam = Math.ceil(remainingPages / pagesPerDay);

    const khatamDate = new Date(); // system baseline date
    khatamDate.setDate(khatamDate.getDate() + daysToKhatam);

    // Generate chart data coordinates for rendering SVG charts in frontend
    // Past 6 months of actual pages
    const today = new Date();
    const chartData = [];
    const frontier = student.frontier;

    for (let i = 5; i >= 0; i--) {
      const d = new Date(today);
      d.setMonth(d.getMonth() - i);
      const label = d.toLocaleDateString("ms-MY", { month: "short", year: "2-digit" });
      const pages = Math.max(10, Math.round(frontier - (i * pace)));
      chartData.push({ label, actual: pages, projected: null });
    }

    // Next 6 months of projected dashed line
    const projectionStart = chartData[chartData.length - 1].actual;
    for (let i = 1; i <= 6; i++) {
      const d = new Date(today);
      d.setMonth(d.getMonth() + i);
      const label = d.toLocaleDateString("ms-MY", { month: "short", year: "2-digit" });
      const pages = Math.min(604, Math.round(projectionStart + (i * pace)));
      chartData.push({ label, actual: null, projected: pages });
    }

    return {
      pace,
      daysToKhatam,
      khatamDate: khatamDate.toLocaleDateString("ms-MY", { day: "numeric", month: "long", year: "numeric" }),
      chartData
    };
  }
};
export const getPace = PredictionService.getPace.bind(PredictionService);
export const predictKhatam = PredictionService.predictKhatam.bind(PredictionService);
