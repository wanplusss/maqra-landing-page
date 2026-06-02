# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands run from the `app/` directory.

```bash
cd app
npm run dev      # Start Vite dev server (http://localhost:5173)
npm run build    # Production build
npm run lint     # ESLint check
npm run preview  # Preview production build
```

No test suite exists yet.

## Environment

`app/.env` requires:
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

When these are absent or misconfigured, the app falls back to `mockDb.js` (in-memory data). Auth also falls back to local credential checks in `authService.js`.

## Architecture

**Stack:** React 19 + Vite, Supabase (PostgreSQL + Auth), jsPDF. No router — persona switching is pure state.

### Persona-driven SPA

`App.jsx` is the single root. It renders one of four "persona flows" based on a `persona` state: `parent`, `teacher`, `admin`, `owner`. There is no URL router; the URL bar display is simulated. Each persona switches via the `Chrome` switcher component at the top.

### Feature directory structure

```
src/features/
  maqra/         — Core domain: MaqraGrid class, pageMapping, statusColors
  student/       — StudentRepository, BulkImport, StudentTargetService
  teacher/       — TeacherRepository, facades: StudentList, StudentDashboard, ClassView, TasmikQueue
  admin/         — SekolahDashboard, StudentManagement, TeacherManagement, SchoolEditor
  parent/        — ParentDashboard, StudentLookup, sub-pages: Analitik, HistoryLog, ProfilAnak, ProgressGrid
  school/        — SchoolRepository, SchoolLanding (public page)
  tasmik/        — TasmikRepository (tasmik_records table)
  analytics/     — AnalyticsService, prediction, targetTracker, murajaahPlan
  auth/          — authService, authMiddleware, roles
  pengumuman/    — PengumumanRepository, PengumumanService (announcements)
  sijil/         — SijilService, sijilTemplate (certificate PDF generation)
  superadmin/    — SuperAdminDashboard, superAdminService
  responsive/    — responsiveContext, responsiveStrategy, useResponsive
  tweaks/        — TweaksPanel, tweaksContext, tweaksStrategies (UI personalizer)
src/backend/
  supabase/      — supabaseClient.js, supabaseAdapter.js, config.js
  mockDb.js      — Fallback in-memory data when Supabase is not configured
src/components/
  Shared.jsx     — Icon, Wordmark, useIsMobile (shared across all features)
```

### Core domain: MaqraGrid

`MaqraGrid` (in `features/maqra/domain/`) is an immutable-style class representing the 604-page Madani mushaf. It computes:
- `statusMap` — page number → status string (`belum`, `hafazan`, `talaqqi`, `murajaah`, `syahadah`, `iqra`, `tilawah`, `bacaan`)
- `frontier` — highest page with any non-`belum` status
- `tally` — count per status
- `progressPercent` — % of memorized pages (excludes `belum` and `bacaan`)

`MaqraGridService` wraps it: fetches tasmik records from `TasmikRepository`, builds the `MaqraGrid`, and exposes `getGridForStudent(studentId)` and `updatePageStatus(...)`.

### Data layer pattern

Each entity has a **Repository** that delegates to `supabaseAdapter` (live) or `mockDb` (fallback). The adapter is the only file that calls Supabase directly. Repositories do not know about React state.

### Auth flow

`authService.login()` tries Supabase Auth first, falls back to local credential matching in `mockDb`. Role is inferred from email pattern (`admin` → ADMIN, `owner`/`super` → SUPERADMIN, else TEACHER). Sessions stored in `localStorage` as `maqra_session`.

### UI customization (Tweaks)

`TweaksProvider` / `useTweaks()` provides accent color, dark mode, font, and grid density. Settings persist in `localStorage`. Grid column count is derived from density setting via `DENSITY` map in `tweaksStrategies.js`.

### Supabase tables

`schools`, `students`, `teachers`, `tasmik_records`, `announcements`, `student_targets`. **RLS is currently disabled on all tables** — this is a known security gap to address before production.

### Design docs

`Maqra Feature Architecture Map/` contains planning docs (`recode-architecture.md`, `recode-blueprint.md`) describing intended architecture patterns (Repository, Facade, Service Layer, Strategy). The `Maqra Prototype and UI/` folder holds early prototype JSX files — these are reference only, not part of the built app.

RULES
Ask, dont assume. If something's unclear, ask before writing a line and no silent guesses about intent, architecture, or requirements.

Simplest solution first and implement the minimum thing that works. No abstractions you didn't request.

Dont touch unrelated code and if a file isnt part of the current task, leave it.

Flag uncertainty explicitly or if you're not confident, say so before proceeding as confidence without certainty causes more damage than admitting a gap.
