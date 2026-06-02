import { IS_SUPABASE_CONFIGURED } from "../../../backend/supabase/config.js";
import { supabaseAdapter } from "../../../backend/supabase/supabaseAdapter.js";
import { getMockDb, saveMockDb } from "../../../backend/mockDb.js";

export const TeacherRepository = {
  async findByEmail(email) {
    if (IS_SUPABASE_CONFIGURED) {
      return await supabaseAdapter.getTeacherByEmail(email);
    }
    const db = getMockDb();
    return db.teachers.find((t) => t.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async listAll(schoolSlug) {
    if (IS_SUPABASE_CONFIGURED) {
      return await supabaseAdapter.listAllTeachers(schoolSlug);
    }
    const db = getMockDb();
    const all = [...db.teachers];
    return schoolSlug ? all.filter(t => t.school_slug === schoolSlug) : all;
  },

  async update(id, updates) {
    if (IS_SUPABASE_CONFIGURED) {
      return await supabaseAdapter.updateTeacher(id, updates);
    }
    const db = getMockDb();
    const idx = db.teachers.findIndex(t => t.id === id);
    if (idx === -1) throw new Error("Teacher not found");
    db.teachers[idx] = { ...db.teachers[idx], ...updates };
    saveMockDb(db);
    return db.teachers[idx];
  },

  async create(teacher) {
    // teacher must include school_slug
    if (IS_SUPABASE_CONFIGURED) {
      return await supabaseAdapter.createTeacher(teacher);
    }
    const db = getMockDb();
    const newTeacher = {
      id: "t" + (db.teachers.length + 1),
      password: "password123",
      ...teacher
    };
    db.teachers.push(newTeacher);
    saveMockDb(db);
    return newTeacher;
  },

  async delete(id) {
    if (IS_SUPABASE_CONFIGURED) {
      return await supabaseAdapter.deleteTeacher(id);
    }
    const db = getMockDb();
    const filtered = db.teachers.filter((t) => t.id !== id);
    if (filtered.length === db.teachers.length) throw new Error("Teacher not found");
    db.teachers = filtered;
    saveMockDb(db);
    return true;
  }
};
