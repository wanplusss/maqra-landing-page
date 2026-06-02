import { IS_SUPABASE_CONFIGURED } from "../../../backend/supabase/config.js";
import { supabaseAdapter } from "../../../backend/supabase/supabaseAdapter.js";
import { getMockDb, saveMockDb } from "../../../backend/mockDb.js";

export const PengumumanRepository = {
  async create(announcement) {
    // announcement must include school_slug
    if (IS_SUPABASE_CONFIGURED) {
      return await supabaseAdapter.createAnnouncement(announcement);
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
