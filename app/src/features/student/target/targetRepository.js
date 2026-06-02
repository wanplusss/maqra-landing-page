import { IS_SUPABASE_CONFIGURED } from "../../../backend/supabase/config.js";
import { supabaseAdapter } from "../../../backend/supabase/supabaseAdapter.js";
import { getMockDb, saveMockDb } from "../../../backend/mockDb.js";

export const targetRepository = {
  async listAll() {
    if (IS_SUPABASE_CONFIGURED) {
      return await supabaseAdapter.listStudentTargets();
    }
    const db = getMockDb();
    return Object.entries(db.student_targets || {}).map(([studentId, pagesPerMonth]) => ({ studentId, pagesPerMonth }));
  },

  async getTarget(studentId) {
    if (IS_SUPABASE_CONFIGURED) {
      return await supabaseAdapter.getStudentTarget(studentId);
    }
    const db = getMockDb();
    return db.student_targets[studentId] || null;
  },

  async deleteTarget(studentId) {
    if (IS_SUPABASE_CONFIGURED) {
      return await supabaseAdapter.deleteStudentTarget(studentId);
    }
    const db = getMockDb();
    delete db.student_targets[studentId];
    const idx = db.students.findIndex(s => s.id === studentId);
    if (idx !== -1) db.students[idx].target = 15;
    saveMockDb(db);
    return true;
  },

  async setTarget(studentId, pagesPerMonth) {
    if (IS_SUPABASE_CONFIGURED) {
      return await supabaseAdapter.setStudentTarget(studentId, pagesPerMonth);
    }
    const db = getMockDb();
    db.student_targets[studentId] = pagesPerMonth;
    
    // Sync to student target field directly as well for fast reading
    const index = db.students.findIndex((s) => s.id === studentId);
    if (index !== -1) {
      db.students[index].target = pagesPerMonth;
    }
    
    saveMockDb(db);
    return { studentId, pagesPerMonth };
  }
};
