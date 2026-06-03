import { IS_SUPABASE_CONFIGURED } from "../../../backend/supabase/config.js";
import { supabaseAdapter } from "../../../backend/supabase/supabaseAdapter.js";
import { getMockDb, saveMockDb } from "../../../backend/mockDb.js";

export const PengumumanRepository = {
  async create(announcement) {
    // announcement must include school_slug
    if (IS_SUPABASE_CONFIGURED) {
      const full = {
        id: "ann_" + Date.now(),
        date: new Date().toISOString().split("T")[0],
        ...announcement,
      };
      return await supabaseAdapter.createAnnouncement(full);
    }
    const db = getMockDb();
    const newAnn = {
      id: "ann_" + Date.now(),
      date: new Date().toISOString().split("T")[0],
      ...announcement
    };
    db.announcements.unshift(newAnn);
    saveMockDb(db);
    return newAnn;
  },

  async getAllActive(schoolSlug) {
    if (IS_SUPABASE_CONFIGURED) {
      return await supabaseAdapter.listActiveAnnouncements(schoolSlug);
    }
    const db = getMockDb();
    const all = [...db.announcements];
    return schoolSlug ? all.filter(a => a.school_slug === schoolSlug) : all;
  },

  async update(id, updates) {
    if (IS_SUPABASE_CONFIGURED) {
      return await supabaseAdapter.updateAnnouncement(id, updates);
    }
    const db = getMockDb();
    const idx = db.announcements.findIndex(a => a.id === id);
    if (idx === -1) throw new Error("Announcement not found");
    db.announcements[idx] = { ...db.announcements[idx], ...updates };
    saveMockDb(db);
    return db.announcements[idx];
  },

  async delete(id) {
    if (IS_SUPABASE_CONFIGURED) {
      return await supabaseAdapter.deleteAnnouncement(id);
    }
    const db = getMockDb();
    const filtered = db.announcements.filter((a) => a.id !== id);
    if (filtered.length === db.announcements.length) throw new Error("Announcement not found");
    db.announcements = filtered;
    saveMockDb(db);
    return true;
  }
};
