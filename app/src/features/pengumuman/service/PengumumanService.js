import { PengumumanRepository } from "../repository/PengumumanRepository.js";
import { requireRole } from "../../auth/authMiddleware.js";

export const PengumumanService = {
  async createAnnouncement(title, body, tag = "Pengumuman") {
    // Enforce admin permission for creating announcements
    requireRole(["admin", "superadmin"]);

    if (!title || !body) {
      throw new Error("Tajuk dan kandungan pengumuman adalah wajib");
    }

    const ann = {
      title,
      body,
      tag,
      date: new Date().toISOString().split("T")[0]
    };

    return await PengumumanRepository.create(ann);
  },

  async getActiveAnnouncements() {
    return await PengumumanRepository.getAllActive();
  },

  async deleteAnnouncement(id) {
    requireRole(["admin", "superadmin"]);
    return await PengumumanRepository.delete(id);
  }
};
