import { sijilTemplate } from "./sijilTemplate.js";
import { StudentRepository } from "../student/repository/StudentRepository.js";
import { SchoolRepository } from "../school/repository/SchoolRepository.js";
import { getJuzukFromPage, getJuzukPages } from "../maqra/domain/pageMapping.js";

export const SijilService = {
  // Check if updating a page has achieved a new Juzuk completion milestone
  async checkForMilestones(studentId, updatedGrid, updatedPage) {
    const juz = getJuzukFromPage(updatedPage);
    const [start, end] = getJuzukPages(juz);

    // Check if ALL pages of this Juz' are memorized
    const memorizedKeys = ["hafazan", "talaqqi", "murajaah", "syahadah", "iqra", "tilawah"];
    let complete = true;
    for (let p = start; p <= end; p++) {
      if (!memorizedKeys.includes(updatedGrid.statusMap[p])) {
        complete = false;
        break;
      }
    }

    if (complete) {
      // Store milestone achievement in memory/localStorage to alert the teacher
      const milestone = juz === 30 ? "Khatam Al-Quran 30 Juzuk" : `Hafazan Lengkap Juzuk ${juz}`;
      const alerts = JSON.parse(localStorage.getItem("maqra_milestone_alerts") || "[]");
      alerts.push({ studentId, milestone, page: updatedPage, date: new Date().toISOString() });
      localStorage.setItem("maqra_milestone_alerts", JSON.stringify(alerts));
    }
  },

  async issueCertificate(studentId, milestoneType) {
    const student = await StudentRepository.getById(studentId);
    if (!student) throw new Error("Student not found");

    const school = await SchoolRepository.getProfile();
    const dateStr = new Date().toLocaleDateString("ms-MY", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });

    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4"
    });

    sijilTemplate.render(doc, student.name, milestoneType, school.name, dateStr);
    
    // Trigger download
    const cleanName = student.name.toLowerCase().replace(/[^a-z0-9]/g, "_");
    doc.save(`Sijil_Maqra_${cleanName}.pdf`);
    return true;
  }
};
