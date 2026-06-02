import { PengumumanRepository } from "../repository/PengumumanRepository.js";
import { requireRole } from "../../auth/authMiddleware.js";

export const PengumumanService = {
  async createAnnouncement(title, body, tag = "Pengumuman", schoolSlug) {
    requireRole(["admin", "superadmin"]);

    if (!title || !body) {
      throw new Error("Tajuk dan kandungan pengumuman adalah wajib");
    }

    const ann = {
      title,
      body,
      tag,
      date: new Date().toISOString().split("T")[0],
      school_slug: schoolSlug,
    };

    return await PengumumanRepository.create(ann);
  },

  async getActiveAnnouncements(schoolSlug) {
    return await PengumumanRepository.getAllActive(schoolSlug);
  },

  async updateAnnouncement(id, title, body, tag) {
    requireRole(["admin", "superadmin"]);
    if (!title || !body) throw new Error("Tajuk dan kandungan adalah wajib");
    return await PengumumanRepository.update(id, { title, body, tag });
  },

  async deleteAnnouncement(id) {
    requireRole(["admin", "superadmin"]);
    return await PengumumanRepository.delete(id);
  }
};
