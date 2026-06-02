import { IS_SUPABASE_CONFIGURED } from "../../../backend/supabase/config.js";
import { supabaseAdapter } from "../../../backend/supabase/supabaseAdapter.js";
import { getMockDb, saveMockDb } from "../../../backend/mockDb.js";

export const StudentRepository = {
  async getById(id) {
    if (IS_SUPABASE_CONFIGURED) {
      return await supabaseAdapter.getStudentById(id);
    }
    const db = getMockDb();
    return db.students.find((s) => s.id === id) || null;
  },

  async listAll(schoolSlug) {
    if (IS_SUPABASE_CONFIGURED) {
      return await supabaseAdapter.listAllStudents(schoolSlug);
    }
    const db = getMockDb();
    const all = [...db.students];
    return schoolSlug ? all.filter(s => s.school_slug === schoolSlug) : all;
  },

  async searchByName(query, schoolSlug) {
    if (IS_SUPABASE_CONFIGURED) {
      return await supabaseAdapter.searchStudentsByName(query, schoolSlug);
    }
    const db = getMockDb();
    const q = query.toLowerCase();
    const results = db.students.filter(s => s.name.toLowerCase().includes(q));
    return schoolSlug ? results.filter(s => s.school_slug === schoolSlug) : results;
  },

  async findByClass(className, schoolSlug) {
    if (IS_SUPABASE_CONFIGURED) {
      return await supabaseAdapter.findStudentsByClass(className, schoolSlug);
    }
    const db = getMockDb();
    const results = db.students.filter(s => s.kelas === className);
    return schoolSlug ? results.filter(s => s.school_slug === schoolSlug) : results;
  },

  async create(student) {
    // student must include school_slug
    if (IS_SUPABASE_CONFIGURED) {
      return await supabaseAdapter.createStudent(student);
    }
    const db = getMockDb();
    const newStudent = {
      ...student,
      statusMap: student.statusMap || {},
      target: student.target || 15,
      enroll: student.enroll || new Date().toISOString().split("T")[0]
    };
    db.students.push(newStudent);
    saveMockDb(db);
    return newStudent;
  },

  async update(id, updates) {
    if (IS_SUPABASE_CONFIGURED) {
      return await supabaseAdapter.updateStudent(id, updates);
    }
    const db = getMockDb();
    const index = db.students.findIndex((s) => s.id === id);
    if (index === -1) throw new Error("Student not found");
    const updated = { ...db.students[index], ...updates };
    db.students[index] = updated;
    saveMockDb(db);
    return updated;
  },

  async delete(id) {
    if (IS_SUPABASE_CONFIGURED) {
      return await supabaseAdapter.deleteStudent(id);
    }
    const db = getMockDb();
    const filtered = db.students.filter((s) => s.id !== id);
    if (filtered.length === db.students.length) throw new Error("Student not found");
    db.students = filtered;
    db.tasmik_records = db.tasmik_records.filter((r) => r.studentId !== id);
    saveMockDb(db);
    return true;
  },

  async bulkCreate(students) {
    // each student must include school_slug
    if (IS_SUPABASE_CONFIGURED) {
      return await supabaseAdapter.bulkCreateStudents(students);
    }
    const db = getMockDb();
    db.students.push(...students);
    saveMockDb(db);
    return students;
  }
};
