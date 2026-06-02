# School Multitenancy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scope students, teachers, and announcements to individual schools so superadmin can manage multiple tenants from one Supabase project.

**Architecture:** Add `school_slug` FK to `students`, `teachers`, and `announcements` tables. All repository queries filter by slug. The app passes the active school slug down from `App.jsx` (already loaded via `SchoolRepository.getProfile()`). Superadmin bypasses slug filtering and sees all schools.

**Tech Stack:** React 19, Supabase (PostgreSQL), supabaseAdapter pattern (no ORM), mockDb fallback.

---

## File Map

| File | Change |
|---|---|
| `app/src/backend/supabase/supabaseAdapter.js` | Add `schoolSlug` param to student/teacher/announcement queries |
| `app/src/backend/mockDb.js` | Add `school_slug` field to mock students/teachers/announcements |
| `app/src/features/student/repository/StudentRepository.js` | Pass `schoolSlug` through to adapter |
| `app/src/features/teacher/repository/TeacherRepository.js` | Pass `schoolSlug` through to adapter |
| `app/src/features/pengumuman/repository/PengumumanRepository.js` | Pass `schoolSlug` through to adapter |
| `app/src/App.jsx` | Pass `school.slug` into repositories/components that need it |

---

## Task 1: DB Migration — Add `school_slug` to tables

**Files:**
- No code files — Supabase MCP migration only

No test suite exists. Verify by querying the tables after migration.

- [ ] **Step 1: Apply migration via Supabase MCP**

Run via `mcp__supabase__apply_migration` with name `add_school_slug_multitenancy`:

```sql
-- Add school_slug to students
ALTER TABLE public.students
  ADD COLUMN IF NOT EXISTS school_slug text REFERENCES public.schools(slug);

-- Backfill existing rows to al-furqan (the only school in DB now)
UPDATE public.students SET school_slug = 'al-furqan' WHERE school_slug IS NULL;

-- Make non-nullable after backfill
ALTER TABLE public.students ALTER COLUMN school_slug SET NOT NULL;

-- Add school_slug to teachers
ALTER TABLE public.teachers
  ADD COLUMN IF NOT EXISTS school_slug text REFERENCES public.schools(slug);

UPDATE public.teachers SET school_slug = 'al-furqan' WHERE school_slug IS NULL;

ALTER TABLE public.teachers ALTER COLUMN school_slug SET NOT NULL;

-- Add school_slug to announcements
ALTER TABLE public.announcements
  ADD COLUMN IF NOT EXISTS school_slug text REFERENCES public.schools(slug);

UPDATE public.announcements SET school_slug = 'al-furqan' WHERE school_slug IS NULL;

ALTER TABLE public.announcements ALTER COLUMN school_slug SET NOT NULL;

-- Indexes for query performance
CREATE INDEX IF NOT EXISTS idx_students_school_slug ON public.students(school_slug);
CREATE INDEX IF NOT EXISTS idx_teachers_school_slug ON public.teachers(school_slug);
CREATE INDEX IF NOT EXISTS idx_announcements_school_slug ON public.announcements(school_slug);
```

- [ ] **Step 2: Verify migration**

Run via `mcp__supabase__execute_sql`:
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name IN ('students','teachers','announcements')
  AND column_name = 'school_slug';
```
Expected: 3 rows returned, `is_nullable = NO`.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(db): add school_slug FK to students, teachers, announcements"
```

---

## Task 2: Update mockDb — add `school_slug` to seed data

**Files:**
- Modify: `app/src/backend/mockDb.js`

- [ ] **Step 1: Add `school_slug` to student objects**

In `mockDb.js`, inside the `.map()` that builds students (around line 140), add `school_slug` to the returned object:

```js
return {
  id: s.id,
  name: s.name,
  kelas: s.kelas,
  umur: s.umur,
  frontier: s.frontier,
  sex: s.sex,
  parent: s.parent,
  beginner: !!s.beginner,
  enroll: ["2024-01-08", "2023-09-02", "2024-01-08", "2022-06-15", "2025-01-13", "2024-01-08"][i],
  target,
  statusMap: status,
  school_slug: "al-furqan",   // ← add this
};
```

- [ ] **Step 2: Add `school_slug` to teacher objects**

In the `teachers` array (around line 166):

```js
const teachers = [
  { id: "t1", name: "Ustazah Aisyah Binti Hamzah", email: "aisyah@alfurqan.edu.my", kelas: "Tahun 4 & 5", password: "password123", school_slug: "al-furqan" },
  { id: "t2", name: "Ustaz Hakim Bin Rashid",      email: "hakim@alfurqan.edu.my",  kelas: "Tahun 2 & 3", password: "password123", school_slug: "al-furqan" },
  { id: "t3", name: "Ustazah Mariam Binti Idris",   email: "mariam@alfurqan.edu.my", kelas: "Tahun 6",     password: "password123", school_slug: "al-furqan" }
];
```

- [ ] **Step 3: Add `school_slug` to announcements**

Find the `announcements` array in mockDb. Add `school_slug: "al-furqan"` to each entry. If the array is built dynamically, add it there. Example shape:

```js
{ id: "a1", title: "...", content: "...", date: "...", category: "...", school_slug: "al-furqan" }
```

- [ ] **Step 4: Commit**

```bash
git add app/src/backend/mockDb.js
git commit -m "feat(mock): add school_slug to seed students, teachers, announcements"
```

---

## Task 3: Update `supabaseAdapter` — scope queries by `school_slug`

**Files:**
- Modify: `app/src/backend/supabase/supabaseAdapter.js`

The pattern: every method that lists/creates for a specific school now accepts a `schoolSlug` param and filters. Superadmin methods that need all schools pass no slug (omit the `.eq` filter).

- [ ] **Step 1: Update student list/search/findByClass/create/bulkCreate**

Replace the four methods:

```js
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
  // student object must already include school_slug — caller's responsibility
  checkActive();
  const { data, error } = await supabase
    .from("students")
    .insert([student])
    .select()
    .single();
  if (error) throw error;
  return data;
},

async bulkCreateStudents(students) {
  // each student object must include school_slug
  checkActive();
  const { data, error } = await supabase
    .from("students")
    .insert(students)
    .select();
  if (error) throw error;
  return data;
},
```

- [ ] **Step 2: Update teacher list/create**

```js
async listAllTeachers(schoolSlug) {
  checkActive();
  let q = supabase.from("teachers").select("*").order("name", { ascending: true });
  if (schoolSlug) q = q.eq("school_slug", schoolSlug);
  const { data, error } = await q;
  if (error) throw error;
  return data;
},

async createTeacher(teacher) {
  // teacher object must already include school_slug
  checkActive();
  const { data, error } = await supabase
    .from("teachers")
    .insert([teacher])
    .select()
    .single();
  if (error) throw error;
  return data;
},
```

- [ ] **Step 3: Update announcement list/create**

```js
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
```

- [ ] **Step 4: Commit**

```bash
git add app/src/backend/supabase/supabaseAdapter.js
git commit -m "feat(adapter): scope student/teacher/announcement queries by school_slug"
```

---

## Task 4: Update repositories — thread `schoolSlug` through

**Files:**
- Modify: `app/src/features/student/repository/StudentRepository.js`
- Modify: `app/src/features/teacher/repository/TeacherRepository.js`
- Modify: `app/src/features/pengumuman/repository/PengumumanRepository.js`

- [ ] **Step 1: Update StudentRepository**

```js
export const StudentRepository = {
  async getById(id) {
    if (IS_SUPABASE_CONFIGURED) return await supabaseAdapter.getStudentById(id);
    const db = getMockDb();
    return db.students.find((s) => s.id === id) || null;
  },

  async listAll(schoolSlug) {
    if (IS_SUPABASE_CONFIGURED) return await supabaseAdapter.listAllStudents(schoolSlug);
    const db = getMockDb();
    const all = [...db.students];
    return schoolSlug ? all.filter(s => s.school_slug === schoolSlug) : all;
  },

  async searchByName(query, schoolSlug) {
    if (IS_SUPABASE_CONFIGURED) return await supabaseAdapter.searchStudentsByName(query, schoolSlug);
    const db = getMockDb();
    const q = query.toLowerCase();
    const results = db.students.filter(s => s.name.toLowerCase().includes(q));
    return schoolSlug ? results.filter(s => s.school_slug === schoolSlug) : results;
  },

  async findByClass(className, schoolSlug) {
    if (IS_SUPABASE_CONFIGURED) return await supabaseAdapter.findStudentsByClass(className, schoolSlug);
    const db = getMockDb();
    const results = db.students.filter(s => s.kelas === className);
    return schoolSlug ? results.filter(s => s.school_slug === schoolSlug) : results;
  },

  async create(student) {
    // student must include school_slug before calling
    if (IS_SUPABASE_CONFIGURED) return await supabaseAdapter.createStudent(student);
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
    if (IS_SUPABASE_CONFIGURED) return await supabaseAdapter.updateStudent(id, updates);
    const db = getMockDb();
    const index = db.students.findIndex(s => s.id === id);
    if (index === -1) throw new Error("Student not found");
    const updated = { ...db.students[index], ...updates };
    db.students[index] = updated;
    saveMockDb(db);
    return updated;
  },

  async delete(id) {
    if (IS_SUPABASE_CONFIGURED) return await supabaseAdapter.deleteStudent(id);
    const db = getMockDb();
    const filtered = db.students.filter(s => s.id !== id);
    if (filtered.length === db.students.length) throw new Error("Student not found");
    db.students = filtered;
    db.tasmik_records = db.tasmik_records.filter(r => r.studentId !== id);
    saveMockDb(db);
    return true;
  },

  async bulkCreate(students) {
    // each student must include school_slug
    if (IS_SUPABASE_CONFIGURED) return await supabaseAdapter.bulkCreateStudents(students);
    const db = getMockDb();
    db.students.push(...students);
    saveMockDb(db);
    return students;
  }
};
```

- [ ] **Step 2: Read TeacherRepository to see current shape, then update listAll/create**

Open `app/src/features/teacher/repository/TeacherRepository.js`. Find `listAll` and `create`. Apply the same pattern:

```js
async listAll(schoolSlug) {
  if (IS_SUPABASE_CONFIGURED) return await supabaseAdapter.listAllTeachers(schoolSlug);
  const db = getMockDb();
  const all = [...db.teachers];
  return schoolSlug ? all.filter(t => t.school_slug === schoolSlug) : all;
},

async create(teacher) {
  // teacher must include school_slug
  if (IS_SUPABASE_CONFIGURED) return await supabaseAdapter.createTeacher(teacher);
  const db = getMockDb();
  db.teachers.push(teacher);
  saveMockDb(db);
  return teacher;
},
```

Also update `getByEmail` — no slug needed (email is globally unique for auth).

- [ ] **Step 3: Read PengumumanRepository, update list/create**

Open `app/src/features/pengumuman/repository/PengumumanRepository.js`. Apply:

```js
async listAll(schoolSlug) {
  if (IS_SUPABASE_CONFIGURED) return await supabaseAdapter.listActiveAnnouncements(schoolSlug);
  const db = getMockDb();
  const all = [...(db.announcements || [])];
  return schoolSlug ? all.filter(a => a.school_slug === schoolSlug) : all;
},

async create(announcement) {
  // announcement must include school_slug
  if (IS_SUPABASE_CONFIGURED) return await supabaseAdapter.createAnnouncement(announcement);
  const db = getMockDb();
  if (!db.announcements) db.announcements = [];
  db.announcements.push(announcement);
  saveMockDb(db);
  return announcement;
},
```

- [ ] **Step 4: Commit**

```bash
git add app/src/features/student/repository/StudentRepository.js
git add app/src/features/teacher/repository/TeacherRepository.js
git add app/src/features/pengumuman/repository/PengumumanRepository.js
git commit -m "feat(repos): thread schoolSlug into student/teacher/announcement queries"
```

---

## Task 5: Wire `school.slug` into App.jsx call sites

**Files:**
- Modify: `app/src/App.jsx`

The `school` object is already loaded at the top of `App.jsx` via `SchoolRepository.getProfile()`. Every call to `StudentRepository.listAll()`, `TeacherRepository.listAll()`, etc. must now pass `school.slug`.

- [ ] **Step 1: Find all repository calls in App.jsx**

Search for:
```
StudentRepository.listAll
TeacherRepository.listAll
StudentRepository.searchByName
StudentRepository.findByClass
StudentRepository.create
StudentRepository.bulkCreate
TeacherRepository.create
```

For each call to `.listAll()`, `.searchByName()`, `.findByClass()`, pass `school.slug` as the first argument:

```js
// Before
const data = await StudentRepository.listAll();
// After
const data = await StudentRepository.listAll(school.slug);
```

```js
// Before
const data = await TeacherRepository.listAll();
// After
const data = await TeacherRepository.listAll(school.slug);
```

- [ ] **Step 2: Wire school_slug into create/bulkCreate calls**

When creating a student or teacher, spread `school_slug` into the object:

```js
// Example — student creation
await StudentRepository.create({ ...newStudent, school_slug: school.slug });

// Example — bulk import
await StudentRepository.bulkCreate(students.map(s => ({ ...s, school_slug: school.slug })));

// Example — teacher creation
await TeacherRepository.create({ ...newTeacher, school_slug: school.slug });
```

Find these call sites in `App.jsx` and the admin panels (`StudentManagement.jsx`, `TeacherManagement.jsx`, `BulkImport` component) and apply the same pattern.

- [ ] **Step 3: Commit**

```bash
git add app/src/App.jsx
git add app/src/features/admin/StudentManagement.jsx
git add app/src/features/admin/TeacherManagement.jsx
git commit -m "feat(app): pass school.slug to all scoped repository calls"
```

---

## Task 6: Superadmin — unscoped queries for cross-school view

**Files:**
- Modify: `app/src/features/superadmin/superAdminService.js`
- Modify: `app/src/backend/supabase/supabaseAdapter.js` (add `getSchoolStats` RPC or aggregated query)

Superadmin needs per-school student/teacher counts and average progress. The current `schools` table stores these as denormalized columns (`students`, `teachers`, `avgProg`). For live Supabase, these should be computed from actual data.

- [ ] **Step 1: Add aggregated school stats query to supabaseAdapter**

```js
async getSchoolStats() {
  checkActive();
  // Get schools with live counts via subquery
  const { data: schools, error: schoolErr } = await supabase
    .from("schools")
    .select("*")
    .order("name", { ascending: true });
  if (schoolErr) throw schoolErr;

  const { data: studentCounts, error: countErr } = await supabase
    .from("students")
    .select("school_slug");
  if (countErr) throw countErr;

  const { data: teacherCounts, error: tErr } = await supabase
    .from("teachers")
    .select("school_slug");
  if (tErr) throw tErr;

  const studentMap = studentCounts.reduce((acc, s) => {
    acc[s.school_slug] = (acc[s.school_slug] || 0) + 1;
    return acc;
  }, {});
  const teacherMap = teacherCounts.reduce((acc, t) => {
    acc[t.school_slug] = (acc[t.school_slug] || 0) + 1;
    return acc;
  }, {});

  return schools.map(sch => ({
    ...sch,
    students: studentMap[sch.slug] || 0,
    teachers: teacherMap[sch.slug] || 0,
  }));
},
```

- [ ] **Step 2: Update SuperAdminService to use live counts**

```js
import { SchoolRepository } from "../school/repository/SchoolRepository.js";
import { IS_SUPABASE_CONFIGURED } from "../../backend/supabase/config.js";
import { supabaseAdapter } from "../../backend/supabase/supabaseAdapter.js";

export const SuperAdminService = {
  async getPlatformDashboardData() {
    if (IS_SUPABASE_CONFIGURED) {
      return await supabaseAdapter.getSchoolStats();
    }
    const schools = await SchoolRepository.listAllSchools();
    return schools.map((sch) => ({
      slug: sch.slug,
      name: sch.name,
      city: sch.city || "Selangor",
      students: sch.students || 6,
      teachers: sch.teachers || 3,
      avgProg: sch.avgProg || 45.2,
      plan: sch.plan || "Premium",
      status: sch.status || "aktif",
      since: sch.since || "2024"
    }));
  }
};
```

- [ ] **Step 3: Commit**

```bash
git add app/src/features/superadmin/superAdminService.js
git add app/src/backend/supabase/supabaseAdapter.js
git commit -m "feat(superadmin): live cross-school stats from scoped student/teacher counts"
```

---

## Task 7: Smoke test end-to-end

No test suite exists — manual verification steps.

- [ ] **Step 1: Dev server**

```bash
cd app && npm run dev
```

- [ ] **Step 2: Verify teacher persona — only sees al-furqan students**

Login as `aisyah@alfurqan.edu.my`. Confirm student list shows only al-furqan students (6 students from mockDb). No cross-school bleed.

- [ ] **Step 3: Verify admin persona — student/teacher management scoped**

Login as `admin@alfurqan.edu.my`. Go to student management and teacher management. Only al-furqan data visible.

- [ ] **Step 4: Verify superadmin — sees all schools with counts**

Login as `owner@maqra.app`. Platform dashboard should show all 7 schools with their student/teacher counts.

- [ ] **Step 5: Add a student and confirm school_slug saved**

In admin view, create a new student. If using Supabase, verify via MCP:

```sql
SELECT id, name, school_slug FROM students ORDER BY id DESC LIMIT 3;
```

Expected: new student has `school_slug = 'al-furqan'`.

- [ ] **Step 6: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix(multitenancy): address smoke test findings"
```
