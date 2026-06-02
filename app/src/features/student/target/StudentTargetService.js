import { targetRepository } from "./targetRepository.js";
import { requireRole } from "../../auth/authMiddleware.js";

export const StudentTargetService = {
  async getTarget(studentId) {
    const rec = await targetRepository.getTarget(studentId);
    if (!rec) return 15;
    // adapter now returns full record object; mock returns scalar
    return typeof rec === "object" ? (rec.pagesPerMonth || 15) : (rec || 15);
  },

  async setTarget(studentId, pagesPerMonth) {
    requireRole(["teacher", "admin", "superadmin"]);
    const pages = parseInt(pagesPerMonth);
    if (isNaN(pages) || pages < 1 || pages > 100) {
      throw new Error("Sasaran bulanan mestilah antara 1 hingga 100 muka surat");
    }
    return await targetRepository.setTarget(studentId, pages);
  },

  async deleteTarget(studentId) {
    requireRole(["teacher", "admin", "superadmin"]);
    return await targetRepository.deleteTarget(studentId);
  }
};
