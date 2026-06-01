import { IS_SUPABASE_CONFIGURED } from "../../../backend/supabase/config.js";
import { supabaseAdapter } from "../../../backend/supabase/supabaseAdapter.js";
import { getMockDb, saveMockDb } from "../../../backend/mockDb.js";

export const targetRepository = {
  async getTarget(studentId) {
    if (IS_SUPABASE_CONFIGURED) {
      return await supabaseAdapter.getStudentTarget(studentId);
    }
    const db = getMockDb();
    return db.student_targets[studentId] || null;
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
