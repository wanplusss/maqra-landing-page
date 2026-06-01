import { targetRepository } from "./targetRepository.js";
import { requireRole } from "../../auth/authMiddleware.js";

export const StudentTargetService = {
  async getTarget(studentId) {
    const val = await targetRepository.getTarget(studentId);
    return val || 15; // default fallback to 15 pages per month
  },

  async setTarget(studentId, pagesPerMonth) {
    // Restrict writes to teachers and administrators
    requireRole(["teacher", "admin", "superadmin"]);
    
    const pages = parseInt(pagesPerMonth);
    if (isNaN(pages) || pages < 1 || pages > 100) {
      throw new Error("Sasaran bulanan mestilah antara 1 hingga 100 muka surat");
    }

    return await targetRepository.setTarget(studentId, pages);
  }
};
