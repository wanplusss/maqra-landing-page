# Performance & Realtime Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate N+1 DB queries on student list load, add DB indexes, and wire Supabase Realtime so parent dashboards update live when teachers save tasmik.

**Architecture:** `MaqraGridService` gets a sync `buildGrid(student)` method that builds a grid from an already-fetched student object (no DB call). App.jsx load loop uses this instead of `getGridForStudent`. A new `useRealtimeStudents` hook in the Adapter node subscribes to the `students` Postgres channel and calls a refresh callback on UPDATE. Indexes applied directly via Supabase MCP.

**Tech Stack:** React 19, Supabase JS v2, Vite, existing Repository/Adapter/Service Layer/Facade patterns.

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `app/src/features/maqra/service/MaqraGridService.js` | Modify | Add `buildGrid(student)` — builds MaqraGrid from student object, no DB call |
| `app/src/App.jsx` | Modify | Fix N+1 load loop; wire realtime hook |
| `app/src/backend/supabase/useRealtimeStudents.js` | Create | Realtime hook — subscribes to `students` UPDATE, calls onUpdate callback |
| `app/src/backend/supabase/supabaseAdapter.js` | Modify | Add `subscribeToStudents(callback)` and `unsubscribeFromStudents(channel)` |
| `Maqra Feature Architecture Map/recode-blueprint (4).md` | Modify | Fix MaqraGridService data flow; document realtime |

---

## Task 1: Add `buildGrid` to MaqraGridService

**Files:**
- Modify: `app/src/features/maqra/service/MaqraGridService.js`

`MaqraGridService.getGridForStudent(studentId)` calls `StudentRepository.getById` internally. When App.jsx already has the student list, this is a wasted round-trip. Add a sync method that accepts an already-fetched student object.

- [ ] **Step 1: Add `buildGrid` method**

Open `app/src/features/maqra/service/MaqraGridService.js`. Add the method after `getGridSummaries`:

```js
export const MaqraGridService = {
  async getGridForStudent(studentId) {
    const student = await StudentRepository.getById(studentId);
    if (!student) {
      throw new Error(`Pelajar dengan ID ${studentId} tidak dijumpai`);
    }
    return new MaqraGrid(student.statusMap || {});
  },

  // Sync — use when student object already fetched. No DB call.
  buildGrid(student) {
    return new MaqraGrid(student.statusMap || {});
  },

  async updatePageStatus(studentId, page, status, tasmikInput = null) {
    // ... existing code unchanged ...
  },

  async getGridSummaries() {
    // ... existing code unchanged ...
  }
};
```

- [ ] **Step 2: Verify no breakage**

Run `npm run lint` from `app/`. Expected: no errors related to MaqraGridService.

- [ ] **Step 3: Commit**

```bash
git add app/src/features/maqra/service/MaqraGridService.js
git commit -m "feat(maqra): add buildGrid(student) to avoid redundant DB call"
```

---

## Task 2: Fix N+1 Load Loop in App.jsx

**Files:**
- Modify: `app/src/App.jsx` lines 115–138

The current loop calls `MaqraGridService.getGridForStudent(st.id)` and `TasmikRepository.getRecordsForStudent(st.id)` for every student. `getGridForStudent` calls `StudentRepository.getById` internally — so 1 student = 2 extra DB calls. With 100 students = 200 extra round-trips.

Fix: use `MaqraGridService.buildGrid(st)` (added in Task 1) since `st` is already the full student object from `listAll()`. Remove the per-student history fetch from this loop — history is only needed when a specific student is opened, not on list load.

- [ ] **Step 1: Replace the load loop**

Find this block in `App.jsx` (around line 115):

```js
useEffect(() => {
    async function load() {
      const studs = await StudentRepository.listAll();
      const tea = await TeacherRepository.listAll();
      const sch = await SchoolRepository.getProfile();
      
      // Calculate dynamic progress percent per student
      const resolvedStuds = [];
      for (const st of studs) {
        const grid = await MaqraGridService.getGridForStudent(st.id);
        resolvedStuds.push({
          ...st,
          progress: grid.progressPercent,
          juzuk: grid.frontier > 0 ? Math.floor(grid.frontier / 20) + 1 : 1,
          surah: grid.pages[grid.frontier > 0 ? grid.frontier - 1 : 0].surah,
          history: await TasmikRepository.getRecordsForStudent(st.id)
        });
      }

      setStudents(resolvedStuds);
      setTeachers(tea);
      setSchool(sch);
    }
    load();
  }, [refreshTrigger, persona]);
```

Replace with:

```js
useEffect(() => {
    async function load() {
      const [studs, tea, sch] = await Promise.all([
        StudentRepository.listAll(),
        TeacherRepository.listAll(),
        SchoolRepository.getProfile(),
      ]);

      const resolvedStuds = studs.map((st) => {
        const grid = MaqraGridService.buildGrid(st);
        return {
          ...st,
          progress: grid.progressPercent,
          juzuk: grid.frontier > 0 ? Math.floor(grid.frontier / 20) + 1 : 1,
          surah: grid.pages[grid.frontier > 0 ? grid.frontier - 1 : 0].surah,
        };
      });

      setStudents(resolvedStuds);
      setTeachers(tea);
      setSchool(sch);
    }
    load();
  }, [refreshTrigger, persona]);
```

Key changes:
- 3 top-level fetches run in parallel with `Promise.all` (was sequential)
- Grid built from already-fetched student via `buildGrid(st)` — sync, no DB call
- `history` removed from list load — it was never used by the student list UI, only by individual student views which fetch on demand

- [ ] **Step 2: Verify history is fetched on demand**

Search for `history` usage in the teacher and parent flows. The teacher `StudentDashboard` receives `history` as a prop:

```js
history={students.find(s => s.id === teacherSelectedStudent.id)?.history || []}
```

This now returns `[]` always from the list since `history` is no longer pre-fetched. Fix this: when a teacher opens a student, fetch history then. Find `handleTeacherTasmikSave` and the `onOpenStudent` callbacks. Each `onOpenStudent` already calls `StudentRepository.getById` and `MaqraGridService.getGridForStudent`. Add history fetch there:

Find all three `onOpenStudent` callbacks in App.jsx (teacherView === "murid", "tasmik", "kohort"). Each has this shape:

```js
onOpenStudent={async (sid) => {
  const s = await StudentRepository.getById(sid);
  const grid = await MaqraGridService.getGridForStudent(sid);
  setTeacherSelectedStudent({
    ...s,
    progress: grid.progressPercent,
    statusMap: grid.statusMap,
    juzuk: grid.frontier > 0 ? Math.floor(grid.frontier / 20) + 1 : 1,
    surah: grid.pages[grid.frontier > 0 ? grid.frontier - 1 : 0].surah,
    lastHafazan: grid.frontier > 0 ? grid.frontier : 1,
    lastHafazanSurah: grid.pages[grid.frontier > 0 ? grid.frontier - 1 : 0].surah,
  });
}}
```

Update all three to also fetch history (run in parallel with getById):

```js
onOpenStudent={async (sid) => {
  const [s, grid, history] = await Promise.all([
    StudentRepository.getById(sid),
    MaqraGridService.getGridForStudent(sid),
    TasmikRepository.getRecordsForStudent(sid),
  ]);
  setTeacherSelectedStudent({
    ...s,
    progress: grid.progressPercent,
    statusMap: grid.statusMap,
    juzuk: grid.frontier > 0 ? Math.floor(grid.frontier / 20) + 1 : 1,
    surah: grid.pages[grid.frontier > 0 ? grid.frontier - 1 : 0].surah,
    lastHafazan: grid.frontier > 0 ? grid.frontier : 1,
    lastHafazanSurah: grid.pages[grid.frontier > 0 ? grid.frontier - 1 : 0].surah,
    history,
  });
}}
```

Also update `handleTeacherTasmikSave` (around line 161) — it reloads the selected student after save. Add history fetch there too:

```js
const handleTeacherTasmikSave = async (patch) => {
    if (teacherSelectedStudent && teacherUpdateCellPage) {
      await MaqraGridService.updatePageStatus(
        teacherSelectedStudent.id,
        teacherUpdateCellPage,
        patch.status,
        patch.log ? {
          kategori: patch.kategori,
          gred: patch.gred,
          ulasan: patch.ulasan,
          masalah: patch.masalah,
          cadangan: patch.cadangan,
          guru: teacherSession.name
        } : null
      );
      setTeacherUpdateCellPage(null);

      const [updatedStudent, grid, history] = await Promise.all([
        StudentRepository.getById(teacherSelectedStudent.id),
        MaqraGridService.getGridForStudent(teacherSelectedStudent.id),
        TasmikRepository.getRecordsForStudent(teacherSelectedStudent.id),
      ]);

      setTeacherSelectedStudent({
        ...updatedStudent,
        progress: grid.progressPercent,
        statusMap: grid.statusMap,
        juzuk: grid.frontier > 0 ? Math.floor(grid.frontier / 20) + 1 : 1,
        surah: grid.pages[grid.frontier > 0 ? grid.frontier - 1 : 0].surah,
        lastHafazan: grid.frontier > 0 ? grid.frontier : 1,
        lastHafazanSurah: grid.pages[grid.frontier > 0 ? grid.frontier - 1 : 0].surah,
        history,
      });

      triggerRefresh();
    }
  };
```

- [ ] **Step 3: Smoke test in browser**

Run `npm run dev`. Switch to Teacher persona → login → verify student list loads. Click a student → verify history tab works. Save a tasmik update → verify it reflects.

- [ ] **Step 4: Commit**

```bash
git add app/src/App.jsx
git commit -m "perf(app): eliminate N+1 queries on student list load

- listAll, listAllTeachers, getSchoolProfile now run in parallel
- Grid built from already-fetched student object (no extra DB call)
- History fetched on-demand when student is opened, not on list load"
```

---

## Task 3: Add DB Indexes via Supabase

**Files:**
- Supabase project: `pyhhxmlmvfoztivbudne.supabase.co`

Apply indexes directly via Supabase MCP `apply_migration`. These make `tasmik_records` queries fast as data grows.

- [ ] **Step 1: Apply indexes migration**

Use Supabase MCP tool `apply_migration` with this SQL:

```sql
-- Index for fetching all records for a student (used by TasmikRepository.getRecordsForStudent)
CREATE INDEX IF NOT EXISTS idx_tasmik_records_student_id
  ON tasmik_records("studentId");

-- Index for recent activity queries sorted by date
CREATE INDEX IF NOT EXISTS idx_tasmik_records_student_date
  ON tasmik_records("studentId", date DESC);

-- Index for class-based student queries (used by ClassView, PeerContext)
CREATE INDEX IF NOT EXISTS idx_students_kelas
  ON students(kelas);
```

- [ ] **Step 2: Verify indexes exist**

Use Supabase MCP `list_migrations` or `execute_sql`:

```sql
SELECT indexname, tablename 
FROM pg_indexes 
WHERE tablename IN ('tasmik_records', 'students')
  AND indexname LIKE 'idx_%';
```

Expected: 3 rows returned.

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "perf(db): add indexes on tasmik_records(studentId, date) and students(kelas)"
```

---

## Task 4: Add Realtime Subscription to Supabase Adapter

**Files:**
- Create: `app/src/backend/supabase/useRealtimeStudents.js`
- Modify: `app/src/backend/supabase/supabaseAdapter.js`

Per blueprint, the Supabase Backend Integration (Adapter node) owns realtime subscription setup. The hook subscribes to Postgres changes on the `students` table and calls a callback on UPDATE events.

- [ ] **Step 1: Add subscription helpers to supabaseAdapter**

Open `app/src/backend/supabase/supabaseAdapter.js`. Add these two methods at the end of the `supabaseAdapter` object (before the closing `}`):

```js
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
```

- [ ] **Step 2: Create `useRealtimeStudents` hook**

Create `app/src/backend/supabase/useRealtimeStudents.js`:

```js
import { useEffect } from "react";
import { IS_SUPABASE_CONFIGURED } from "./config.js";
import { supabaseAdapter } from "./supabaseAdapter.js";

export function useRealtimeStudents(onUpdate) {
  useEffect(() => {
    if (!IS_SUPABASE_CONFIGURED) return;

    const channel = supabaseAdapter.subscribeToStudents(onUpdate);
    return () => supabaseAdapter.unsubscribeFromStudents(channel);
  }, [onUpdate]);
}
```

- [ ] **Step 3: Wire the hook in App.jsx**

Add import at top of `app/src/App.jsx`:

```js
import { useRealtimeStudents } from "./backend/supabase/useRealtimeStudents.js";
```

Inside `MainAppContent`, after the existing state declarations, add (use `useCallback` to stabilize the callback reference):

```js
import React, { useState, useEffect, useCallback } from "react";
```

Then inside `MainAppContent` after `const triggerRefresh = () => setRefreshTrigger(prev => prev + 1);`:

```js
const handleRealtimeStudentUpdate = useCallback((updatedStudent) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== updatedStudent.id) return s;
        const grid = MaqraGridService.buildGrid(updatedStudent);
        return {
          ...updatedStudent,
          progress: grid.progressPercent,
          juzuk: grid.frontier > 0 ? Math.floor(grid.frontier / 20) + 1 : 1,
          surah: grid.pages[grid.frontier > 0 ? grid.frontier - 1 : 0].surah,
        };
      })
    );
  }, []);

  useRealtimeStudents(handleRealtimeStudentUpdate);
```

This merges the incoming student row (which includes updated `statusMap` + `frontier`) directly into local state — no full refresh needed.

- [ ] **Step 4: Smoke test realtime**

Run `npm run dev`. Open two browser tabs:
- Tab 1: Parent persona → look up a student → open dashboard
- Tab 2: Teacher persona → login → open same student → save a tasmik update

Expected: Tab 1 grid updates within ~1 second without manual refresh.

- [ ] **Step 5: Commit**

```bash
git add app/src/backend/supabase/useRealtimeStudents.js app/src/backend/supabase/supabaseAdapter.js app/src/App.jsx
git commit -m "feat(realtime): live student grid updates via Supabase Postgres channel

- supabaseAdapter gains subscribeToStudents/unsubscribeFromStudents
- useRealtimeStudents hook (Adapter node) handles subscription lifecycle
- App.jsx merges realtime updates into local state without full refresh"
```

---

## Task 5: Update Blueprint

**Files:**
- Modify: `Maqra Feature Architecture Map/recode-blueprint (4).md`

Correct two factual gaps found during implementation.

- [ ] **Step 1: Fix MaqraGridService data flow**

Find this text in the blueprint (Node Details → Maqra Grid Service → Data Flow):

```
**Data Flow:** Acts as an intermediary between the domain model and external consumers (facades). Fetches student's tasmik records from repository, constructs MaqraGrid instance, provides methods to compute tallies, update statuses, and retrieve grid state. Input: studentId; output: MaqraGrid with computed properties.
```

Replace with:

```
**Data Flow:** Acts as an intermediary between the domain model and external consumers (facades). Reads `statusMap` directly from the student record (denormalized field updated on every tasmik save), constructs MaqraGrid instance, provides methods to compute tallies, update statuses, and retrieve grid state. `buildGrid(student)` accepts an already-fetched student object (no DB call). `getGridForStudent(studentId)` fetches the student then delegates to `buildGrid`. Input: studentId or student object; output: MaqraGrid with computed properties.
```

- [ ] **Step 2: Fix MaqraGridService Agent Prompt**

Find:

```
Implement MaqraGridService that uses MaqraGrid domain and TasmikRepository. Provide methods: getGridForStudent(studentId) -> grid, updatePageStatus(studentId, page, status, tasmikRecord) -> updated grid. Ensure optimistic updates and recomputation.
```

Replace with:

```
Implement MaqraGridService that uses MaqraGrid domain. Provide: buildGrid(student) -> grid (sync, no DB); getGridForStudent(studentId) -> grid (fetches student then delegates to buildGrid); updatePageStatus(studentId, page, status, tasmikRecord) -> updated grid (writes statusMap + frontier back to student row, appends tasmik log record). TasmikRepository is used only for log writes, not for grid reconstruction.
```

- [ ] **Step 3: Fix Supabase Backend Integration data flow**

Find the Agent Prompt for Supabase Backend Integration and append after the last bullet:

```
- Implement realtime in src/backend/supabase/useRealtimeStudents.js: a React hook that subscribes to `postgres_changes` on the `students` table (UPDATE events). The hook calls a callback with the updated student row. Subscription helpers (subscribeToStudents, unsubscribeFromStudents) live in supabaseAdapter.js.
```

- [ ] **Step 4: Fix dependencies graph**

Find:

```
- **Maqra Grid Service** → **Tasmik Repository** _(fetches tasmik records to construct current grid state)_
```

Replace with:

```
- **Maqra Grid Service** → **Tasmik Repository** _(writes tasmik log records on status update; does NOT read tasmik records for grid reconstruction — grid state is denormalized into student.statusMap)_
```

- [ ] **Step 5: Commit**

```bash
git add "Maqra Feature Architecture Map/recode-blueprint (4).md"
git commit -m "docs(blueprint): correct MaqraGridService data flow and add realtime documentation"
```

---

## Self-Review Checklist

- [x] **N+1 fix**: Task 2 eliminates per-student DB calls in load loop
- [x] **History on-demand**: Task 2 Step 2 restores history fetch at open-student time
- [x] **handleTeacherTasmikSave**: Updated to parallel fetch + include history
- [x] **Indexes**: Task 3 covers all three indexes; verification step included
- [x] **Realtime cleanup**: `useEffect` return calls `unsubscribeFromStudents` to prevent leaks
- [x] **Stable callback**: `useCallback` prevents subscription re-fire on every render
- [x] **mockDb fallback**: `IS_SUPABASE_CONFIGURED` guard in hook means local mode unaffected
- [x] **Blueprint**: Both MaqraGridService and Supabase Integration nodes updated; dependency graph corrected
- [x] **No new abstractions**: No new files beyond the realtime hook; patterns follow existing Adapter/Service/Repository structure
