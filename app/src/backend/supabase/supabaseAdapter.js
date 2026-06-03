import { supabase } from "./supabaseClient.js";
import { IS_SUPABASE_CONFIGURED } from "./config.js";

// Helper to check if Supabase is active
const checkActive = () => {
  if (!IS_SUPABASE_CONFIGURED || !supabase) {
    throw new Error("Supabase is not configured. Please supply VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your env.");
  }
};

export const supabaseAdapter = {
  // ---- STUDENTS ----
  async getStudentById(id) {
    checkActive();
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  },

  async listAllStudents(schoolSlug) {
    checkActive();
    let q = supabase.from("students").select("*").order("name", { ascending: true });
    if (schoolSlug) q = q.eq("school_slug", schoolSlug);
    const { data, error } = await q;
    if (error) throw error;
    return data;
  },

  async searchStudentsByName(query, schoolSlug) {
    checkActive();
    let q = supabase.from("students").select("*").ilike("name", `%${query}%`);
    if (schoolSlug) q = q.eq("school_slug", schoolSlug);
    const { data, error } = await q;
    if (error) throw error;
    return data;
  },

  async findStudentsByClass(className, schoolSlug) {
    checkActive();
    let q = supabase.from("students").select("*").eq("kelas", className);
    if (schoolSlug) q = q.eq("school_slug", schoolSlug);
    const { data, error } = await q;
    if (error) throw error;
    return data;
  },

  async createStudent(student) {
    // student must include school_slug
    checkActive();
    const { data, error } = await supabase
      .from("students")
      .insert([student])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateStudent(id, updates) {
    checkActive();
    const { data, error } = await supabase
      .from("students")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteStudent(id) {
    checkActive();
    const { error } = await supabase
      .from("students")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return true;
  },

  async bulkCreateStudents(students) {
    // each student must include school_slug
    checkActive();
    const { data, error } = await supabase
      .from("students")
      .insert(students)
      .select();
    if (error) throw error;
    return data;
  },

  // ---- TASMIK RECORDS ----
  async saveTasmikRecord(record) {
    checkActive();
    const { data, error } = await supabase
      .from("tasmik_records")
      .insert([record])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getTasmikRecordsForStudent(studentId) {
    checkActive();
    const { data, error } = await supabase
      .from("tasmik_records")
      .select("*")
      .eq("studentId", studentId)
      .order("date", { ascending: false });
    if (error) throw error;
    return data;
  },

  async getTasmikRecordByPage(studentId, page) {
    checkActive();
    const { data, error } = await supabase
      .from("tasmik_records")
      .select("*")
      .eq("studentId", studentId)
      .eq("to", page)
      .order("date", { ascending: false });
    if (error) throw error;
    return data;
  },

  async getRecentTasmikActivity(studentId, limit = 10) {
    checkActive();
    let query = supabase
      .from("tasmik_records")
      .select("*")
      .order("date", { ascending: false })
      .limit(limit);
    if (studentId) {
      query = query.eq("studentId", studentId);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getMonthlyTasmikThroughput() {
    checkActive();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const { data, error } = await supabase
      .from("tasmik_records")
      .select("*")
      .gte("date", thirtyDaysAgo.toISOString());
    if (error) throw error;
    return data;
  },

  // ---- TEACHERS ----
  async getTeacherByEmail(email) {
    checkActive();
    const { data, error } = await supabase
      .from("teachers")
      .select("*")
      .eq("email", email)
      .single();
    if (error) throw error;
    return data;
  },

  async listAllTeachers(schoolSlug) {
    checkActive();
    let q = supabase.from("teachers").select("*").order("name", { ascending: true });
    if (schoolSlug) q = q.eq("school_slug", schoolSlug);
    const { data, error } = await q;
    if (error) throw error;
    return data;
  },

  async createTeacher(teacher) {
    // teacher must include school_slug
    checkActive();
    const { data, error } = await supabase
      .from("teachers")
      .insert([teacher])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateTeacher(id, updates) {
    checkActive();
    const { data, error } = await supabase
      .from("teachers")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteTeacher(id) {
    checkActive();
    const { error } = await supabase
      .from("teachers")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return true;
  },

  // ---- SCHOOLS ----
  async getSchoolProfile(slug = "al-furqan") {
    checkActive();
    const { data, error } = await supabase
      .from("schools")
      .select("*")
      .eq("slug", slug)
      .single();
    if (error) throw error;
    return data;
  },

  async getPlatformOwnerByEmail(email) {
    checkActive();
    const { data, error } = await supabase
      .from("platform_owners")
      .select("*")
      .eq("email", email)
      .limit(1);
    if (error) throw error;
    return data?.[0] ?? null;
  },

  async getSchoolByAdminEmail(email) {
    checkActive();
    const { data, error } = await supabase
      .from("schools")
      .select("*")
      .eq("admin_email", email)
      .limit(1);
    if (error) throw error;
    return data?.[0] ?? null;
  },

  async listAllSchools() {
    checkActive();
    const { data, error } = await supabase
      .from("schools")
      .select("*")
      .order("name", { ascending: true });
    if (error) throw error;
    return data;
  },

  async createSchool(school) {
    checkActive();
    const { data, error } = await supabase
      .from("schools")
      .insert([school])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateSchoolProfile(slug, updates) {
    checkActive();
    const { data, error } = await supabase
      .from("schools")
      .update(updates)
      .eq("slug", slug)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getSchoolStats() {
    checkActive();
    const { data: schools, error: schoolErr } = await supabase
      .from("schools")
      .select("*")
      .order("name", { ascending: true });
    if (schoolErr) throw schoolErr;

    const { data: studentData, error: countErr } = await supabase
      .from("students")
      .select("school_slug, progress");
    if (countErr) throw countErr;

    const { data: teacherCounts, error: tErr } = await supabase
      .from("teachers")
      .select("school_slug");
    if (tErr) throw tErr;

    const studentMap = {};
    const progressMap = {};
    studentData.forEach((s) => {
      studentMap[s.school_slug] = (studentMap[s.school_slug] || 0) + 1;
      if (!progressMap[s.school_slug]) progressMap[s.school_slug] = [];
      progressMap[s.school_slug].push(s.progress || 0);
    });
    const teacherMap = teacherCounts.reduce((acc, t) => {
      acc[t.school_slug] = (acc[t.school_slug] || 0) + 1;
      return acc;
    }, {});

    return schools.map(sch => {
      const progs = progressMap[sch.slug] || [];
      const avgProg = progs.length > 0
        ? Math.round((progs.reduce((a, b) => a + b, 0) / progs.length) * 10) / 10
        : null;
      return {
        ...sch,
        students: studentMap[sch.slug] || 0,
        teachers: teacherMap[sch.slug] || 0,
        avgProg,
      };
    });
  },

  // ---- ANNOUNCEMENTS ----
  async createAnnouncement(announcement) {
    // announcement must include school_slug
    checkActive();
    const { data, error } = await supabase
      .from("announcements")
      .insert([announcement])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async listActiveAnnouncements(schoolSlug) {
    checkActive();
    let q = supabase.from("announcements").select("*").order("date", { ascending: false });
    if (schoolSlug) q = q.eq("school_slug", schoolSlug);
    const { data, error } = await q;
    if (error) throw error;
    return data;
  },

  async updateAnnouncement(id, updates) {
    checkActive();
    const { data, error } = await supabase
      .from("announcements")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteAnnouncement(id) {
    checkActive();
    const { error } = await supabase
      .from("announcements")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return true;
  },

  // ---- STUDENT TARGETS ----
  async listStudentTargets() {
    checkActive();
    const { data, error } = await supabase.from("student_targets").select("studentId, pagesPerMonth");
    if (error) throw error;
    return data || [];
  },

  async getStudentTarget(studentId) {
    checkActive();
    const { data, error } = await supabase
      .from("student_targets")
      .select("*")
      .eq("studentId", studentId)
      .maybeSingle();
    if (error) throw error;
    return data || null;
  },

  async deleteStudentTarget(studentId) {
    checkActive();
    const { error } = await supabase
      .from("student_targets")
      .delete()
      .eq("studentId", studentId);
    if (error) throw error;
    return true;
  },

  async deleteTasmikRecord(id) {
    checkActive();
    const { error } = await supabase
      .from("tasmik_records")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return true;
  },

  async setStudentTarget(studentId, pagesPerMonth) {
    checkActive();
    const { data, error } = await supabase
      .from("student_targets")
      .upsert({ studentId, pagesPerMonth, updatedAt: new Date().toISOString() })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // ---- REALTIME ----
  subscribeToStudents(onUpdate) {
    if (!supabase) return null;
    return supabase
      .channel("students-changes")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "students" },
        (payload) => onUpdate(payload.new)
      )
      .subscribe();
  },

  unsubscribeFromStudents(channel) {
    if (!supabase || !channel) return;
    supabase.removeChannel(channel);
  },
};
