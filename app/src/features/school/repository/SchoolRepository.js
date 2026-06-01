import { IS_SUPABASE_CONFIGURED } from "../../../backend/supabase/config.js";
import { supabaseAdapter } from "../../../backend/supabase/supabaseAdapter.js";
import { getMockDb, saveMockDb } from "../../../backend/mockDb.js";

export const SchoolRepository = {
  async getProfile(slug = "al-furqan") {
    if (IS_SUPABASE_CONFIGURED) {
      return await supabaseAdapter.getSchoolProfile(slug);
    }
    const db = getMockDb();
    return db.school.slug === slug ? db.school : { ...db.school, slug };
  },

  async listAllSchools() {
    if (IS_SUPABASE_CONFIGURED) {
      return await supabaseAdapter.listAllSchools();
    }
    const db = getMockDb();
    return [...db.schools];
  },

  async updateProfile(slug, updates) {
    if (IS_SUPABASE_CONFIGURED) {
      return await supabaseAdapter.updateSchoolProfile(slug, updates);
    }
    const db = getMockDb();
    if (db.school.slug === slug) {
      db.school = { ...db.school, ...updates };
      
      // Sync schools array as well
      const idx = db.schools.findIndex((s) => s.slug === slug);
      if (idx !== -1) {
        db.schools[idx] = { ...db.schools[idx], name: db.school.name };
      }
      
      saveMockDb(db);
      return db.school;
    }
    throw new Error("School not found");
  }
};
