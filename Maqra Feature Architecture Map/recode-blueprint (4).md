# Project Blueprint

## Directory Overview

### Maqra Grid Domain Model
```
src/features/maqra/domain/
  MaqraGrid.js
  pageMapping.js
  statusColors.js
```
**Owned files:**
- `src/features/maqra/domain/MaqraGrid.js`
- `src/features/maqra/domain/pageMapping.js`
- `src/features/maqra/domain/statusColors.js`
**Imports from other nodes:**
- `src/features/maqra/domain/pageMapping.js` (owned by **Maqra Grid Domain Model**) — `getJuzukFromPage, getSurahFromPage`

### Maqra Grid Service
```
src/features/maqra/service/
  MaqraGridService.js
```
**Owned files:**
- `src/features/maqra/service/MaqraGridService.js`
**Imports from other nodes:**
- `src/features/maqra/domain/MaqraGrid.js` (owned by **Maqra Grid Domain Model**) — `MaqraGrid`
- `src/features/maqra/domain/pageMapping.js` (owned by **Maqra Grid Domain Model**) — `getJuzukFromPage`

### Student Repository
```
src/features/student/repository/
  StudentRepository.js
  types.js
```
**Owned files:**
- `src/features/student/repository/StudentRepository.js`
- `src/features/student/repository/types.js`
**Imports from other nodes:**
- `src/features/student/repository/types.js` (owned by **Student Repository**) — `StudentInterface`

### Tasmik Repository
```
src/features/tasmik/repository/
  TasmikRepository.js
  types.js
```
**Owned files:**
- `src/features/tasmik/repository/TasmikRepository.js`
- `src/features/tasmik/repository/types.js`
**Imports from other nodes:**
- `src/features/tasmik/repository/types.js` (owned by **Tasmik Repository**) — `TasmikRecordInterface`

### Teacher Repository
```
src/features/teacher/repository/
  TeacherRepository.js
  types.js
```
**Owned files:**
- `src/features/teacher/repository/TeacherRepository.js`
- `src/features/teacher/repository/types.js`

### School Repository
```
src/features/school/repository/
  SchoolRepository.js
  types.js
```
**Owned files:**
- `src/features/school/repository/SchoolRepository.js`
- `src/features/school/repository/types.js`

### Authentication Service
```
src/features/auth/
  authService.js
  authMiddleware.js
  roles.js
```
**Owned files:**
- `src/features/auth/authService.js`
- `src/features/auth/authMiddleware.js`
- `src/features/auth/roles.js`
**Imports from other nodes:**
- `src/features/auth/roles.js` (owned by **Authentication Service**) — `ROLES`

### Parent Facade
```
src/features/parent/
  ParentDashboard.js
  StudentLookup.js
  GridView.js
  CellPopover.js
  SubPages/
    Analitik.js
    ProfilAnak.js
    ProgressGrid.js
    HistoryLog.js
```
**Owned files:**
- `src/features/parent/ParentDashboard.js`
- `src/features/parent/StudentLookup.js`
- `src/features/parent/GridView.js`
- `src/features/parent/CellPopover.js`
- `src/features/parent/SubPages/Analitik.js`
- `src/features/parent/SubPages/ProfilAnak.js`
- `src/features/parent/SubPages/ProgressGrid.js`
- `src/features/parent/SubPages/HistoryLog.js`
**Imports from other nodes:**
- `src/features/maqra/service/MaqraGridService.js` (owned by **Maqra Grid Service**) — `MaqraGridService`
- `src/features/student/repository/StudentRepository.js` (owned by **Student Repository**) — `StudentRepository`
- `src/features/tasmik/repository/TasmikRepository.js` (owned by **Tasmik Repository**) — `TasmikRepository`
- `src/features/analytics/service/AnalyticsService.js` (owned by **Analytics Service**) — `AnalyticsService`

### Teacher Facade
```
src/features/teacher/
  TeacherLogin.js
  StudentList.js
  StudentDashboard.js
  UpdateModal.js
  TasmicLog.js
```
**Owned files:**
- `src/features/teacher/TeacherLogin.js`
- `src/features/teacher/StudentList.js`
- `src/features/teacher/StudentDashboard.js`
- `src/features/teacher/UpdateModal.js`
- `src/features/teacher/TasmicLog.js`
**Imports from other nodes:**
- `src/features/auth/authService.js` (owned by **Authentication Service**) — `login, validateToken`
- `src/features/maqra/service/MaqraGridService.js` (owned by **Maqra Grid Service**) — `MaqraGridService`
- `src/features/student/repository/StudentRepository.js` (owned by **Student Repository**) — `StudentRepository`
- `src/features/tasmik/repository/TasmikRepository.js` (owned by **Tasmik Repository**) — `TasmikRepository`

### Admin Facade
```
src/features/admin/
  AdminLogin.js
  StudentManagement.js
  SchoolEditor.js
  TeacherManagement.js
```
**Owned files:**
- `src/features/admin/AdminLogin.js`
- `src/features/admin/StudentManagement.js`
- `src/features/admin/SchoolEditor.js`
- `src/features/admin/TeacherManagement.js`
**Imports from other nodes:**
- `src/features/auth/authService.js` (owned by **Authentication Service**) — `login, validateToken`
- `src/features/student/repository/StudentRepository.js` (owned by **Student Repository**) — `StudentRepository`
- `src/features/school/repository/SchoolRepository.js` (owned by **School Repository**) — `SchoolRepository`
- `src/features/teacher/repository/TeacherRepository.js` (owned by **Teacher Repository**) — `TeacherRepository`

### Analytics Service
```
src/features/analytics/
  service/
    AnalyticsService.js
    prediction.js
    targetTracker.js
    murajaahPlan.js
```
**Owned files:**
- `src/features/analytics/service/AnalyticsService.js`
- `src/features/analytics/service/prediction.js`
- `src/features/analytics/service/targetTracker.js`
- `src/features/analytics/service/murajaahPlan.js`
**Imports from other nodes:**
- `src/features/maqra/domain/pageMapping.js` (owned by **Maqra Grid Domain Model**) — `getJuzukFromPage`
- `src/features/tasmik/repository/TasmikRepository.js` (owned by **Tasmik Repository**) — `TasmikRepository`

### School Page Facade
```
src/features/school/
  public/
    SchoolLanding.js
    DonationCard.js
```
**Owned files:**
- `src/features/school/public/SchoolLanding.js`
- `src/features/school/public/DonationCard.js`
**Imports from other nodes:**
- `src/features/school/repository/SchoolRepository.js` (owned by **School Repository**) — `SchoolRepository`

### Tweaks Strategy
```
src/features/tweaks/
  tweaksContext.js
  tweaksStrategies.js
  TweaksPanel.js
```
**Owned files:**
- `src/features/tweaks/tweaksContext.js`
- `src/features/tweaks/tweaksStrategies.js`
- `src/features/tweaks/TweaksPanel.js`

### Teacher Tasmik Queue
```
src/features/teacher/
  TasmikQueue.js
  TasmikQueueService.js
```
**Owned files:**
- `src/features/teacher/TasmikQueueService.js`
- `src/features/teacher/TasmikQueue.js`
**Imports from other nodes:**
- `src/features/analytics/service/murajaahPlan.js` (owned by **Analytics Service**) — `getDecayScores`
- `src/features/tasmik/repository/TasmikRepository.js` (owned by **Tasmik Repository**) — `getRecentActivity`
- `src/features/tasmik/repository/TasmikRepository.js` (owned by **Tasmik Repository**) — `getByStudentAndPage`

### Teacher Class-level View
```
src/features/teacher/
  ClassView.js
  ClassViewService.js
```
**Owned files:**
- `src/features/teacher/ClassViewService.js`
- `src/features/teacher/ClassView.js`
**Imports from other nodes:**
- `src/features/maqra/service/MaqraGridService.js` (owned by **Maqra Grid Service**) — `getGridForStudent`
- `src/features/analytics/service/targetTracker.js` (owned by **Analytics Service**) — `getYearlyTarget`
- `src/features/student/repository/StudentRepository.js` (owned by **Student Repository**) — `findByClass`

### Parent Slip Prestasi (Report Card)
```
src/features/parent/
  SlipPrestasiService.js
  slipPrestasiTemplate.js
```
**Owned files:**
- `src/features/parent/SlipPrestasiService.js`
- `src/features/parent/slipPrestasiTemplate.js`
**Imports from other nodes:**
- `src/features/student/repository/StudentRepository.js` (owned by **Student Repository**) — `findById`
- `src/features/tasmik/repository/TasmikRepository.js` (owned by **Tasmik Repository**) — `getRecentActivity`
- `src/features/analytics/service/AnalyticsService.js` (owned by **Analytics Service**) — `getProgressRing`
- `src/features/analytics/service/AnalyticsService.js` (owned by **Analytics Service**) — `getKhatamPrediction`
- `src/features/maqra/service/MaqraGridService.js` (owned by **Maqra Grid Service**) — `getGridForStudent`

### Parent Peer Context
```
src/features/parent/
  PeerContextService.js
```
**Owned files:**
- `src/features/parent/PeerContextService.js`
**Imports from other nodes:**
- `src/features/student/repository/StudentRepository.js` (owned by **Student Repository**) — `findByClass`
- `src/features/maqra/service/MaqraGridService.js` (owned by **Maqra Grid Service**) — `getGridForStudent`
- `src/features/analytics/service/prediction.js` (owned by **Analytics Service**) — `getPace`

### Admin Sekolah Dashboard
```
src/features/admin/
  SekolahDashboard.js
  DashboardService.js
```
**Owned files:**
- `src/features/admin/DashboardService.js`
- `src/features/admin/SekolahDashboard.js`
**Imports from other nodes:**
- `src/features/student/repository/StudentRepository.js` (owned by **Student Repository**) — `listAll`
- `src/features/maqra/service/MaqraGridService.js` (owned by **Maqra Grid Service**) — `getGridSummaries`
- `src/features/analytics/service/targetTracker.js` (owned by **Analytics Service**) — `batchCheckTargets`
- `src/features/tasmik/repository/TasmikRepository.js` (owned by **Tasmik Repository**) — `getMonthlyThroughput`

### Pengumuman Repository
```
src/features/pengumuman/repository/
  PengumumanRepository.js
  types.js
```
**Owned files:**
- `src/features/pengumuman/repository/PengumumanRepository.js`
- `src/features/pengumuman/repository/types.js`

### Pengumuman Service
```
src/features/pengumuman/service/
  PengumumanService.js
```
**Owned files:**
- `src/features/pengumuman/service/PengumumanService.js`
**Imports from other nodes:**
- `src/features/pengumuman/repository/PengumumanRepository.js` (owned by **Pengumuman Repository**) — `PengumumanRepository`
- `src/features/auth/authMiddleware.js` (owned by **Authentication Service**) — `requireRole`

### Sijil Service
```
src/features/sijil/
  SijilService.js
  sijilTemplate.js
```
**Owned files:**
- `src/features/sijil/SijilService.js`
- `src/features/sijil/sijilTemplate.js`
**Imports from other nodes:**
- `src/features/student/repository/StudentRepository.js` (owned by **Student Repository**) — `findById`
- `src/features/school/repository/SchoolRepository.js` (owned by **School Repository**) — `getSchool`

### Responsive Layout Strategy
```
src/features/responsive/
  responsiveStrategy.js
  responsiveContext.js
  useResponsive.js
```
**Owned files:**
- `src/features/responsive/responsiveStrategy.js`
- `src/features/responsive/responsiveContext.js`
- `src/features/responsive/useResponsive.js`
**Imports from other nodes:**
- `src/features/tweaks/tweaksContext.js` (owned by **Tweaks Strategy**) — `useTweaks`

### Super Admin Dashboard (Multi-tenant)
```
src/features/superadmin/
  SuperAdminLogin.js
  SuperAdminDashboard.js
  SuperAdminSchoolDetail.js
  superAdminService.js
```
**Owned files:**
- `src/features/superadmin/SuperAdminLogin.js`
- `src/features/superadmin/SuperAdminDashboard.js`
- `src/features/superadmin/SuperAdminSchoolDetail.js`
- `src/features/superadmin/superAdminService.js`
**Imports from other nodes:**
- `src/features/auth/authService.js` (owned by **Authentication Service**) — `authenticate`
- `src/features/admin/DashboardService.js` (owned by **Admin Sekolah Dashboard**) — `getSchoolDashboardData`
- `src/features/school/repository/SchoolRepository.js` (owned by **School Repository**) — `SchoolRepository`

### Individual Student Target Service
```
src/features/student/target/
  StudentTargetService.js
  targetRepository.js
  targetTypes.js
```
**Owned files:**
- `src/features/student/target/StudentTargetService.js`
- `src/features/student/target/targetRepository.js`
- `src/features/student/target/targetTypes.js`
**Imports from other nodes:**
- `src/features/student/repository/StudentRepository.js` (owned by **Student Repository**) — `StudentRepository`
- `src/features/analytics/service/targetTracker.js` (owned by **Analytics Service**) — `calculateTargetProgress`
- `src/features/auth/authMiddleware.js` (owned by **Authentication Service**) — `requireRole`

### Supabase Backend Integration
```
src/backend/supabase/
  supabaseClient.js
  supabaseAdapter.js
  config.js
```
**Owned files:**
- `src/backend/supabase/supabaseClient.js`
- `src/backend/supabase/supabaseAdapter.js`
- `src/backend/supabase/config.js`

---

## Node Details

### Maqra Grid Domain Model
| Field | Value |
|-------|-------|
| Pattern | Domain Model |
| Risk | low |
| Effort | 1 week |
| NFR Tags | Scalability, Performance |
| Dependencies | None |

**Business Reason:** Core differentiator that enables the entire product; accurate tracking and visualization of Quran memorization progress in a Madani mushaf-specific grid.

**Data Flow:** Represents the 604-page grid state, derives surah/juz from page numbers, computes status colors and progress metrics. Input: page number, statuses array; output: structured grid data with computed fields.

**Agent Prompt:**
```
Implement the Maqra grid domain model. Create MaqraGrid.js that accepts an array of statuses for 604 pages and generates the grid data with juzuk, surah, status colors, progress %, and current frontier. Use pageMapping.js to map page numbers to juzuk and surah. Ensure performance for real-time updates. Export the main class and utility functions.
```

### Maqra Grid Service
| Field | Value |
|-------|-------|
| Pattern | Service Layer |
| Risk | low |
| Effort | 3 days |
| NFR Tags | Performance |
| Dependencies | Maqra Grid Domain Model, Tasmik Repository |

**Business Reason:** Orchestrates domain logic with data retrieval, enabling other modules to read and write progress without direct domain knowledge.

**Data Flow:** Acts as an intermediary between the domain model and external consumers (facades). Reads `statusMap` directly from the student record (denormalized field updated on every tasmik save), constructs MaqraGrid instance, provides methods to compute tallies, update statuses, and retrieve grid state. `buildGrid(student)` accepts an already-fetched student object (sync, no DB call). `getGridForStudent(studentId)` fetches the student then delegates to `buildGrid`. Input: studentId or student object; output: MaqraGrid with computed properties.

**Agent Prompt:**
```
Implement MaqraGridService that uses MaqraGrid domain. Provide: buildGrid(student) -> grid (sync, no DB); getGridForStudent(studentId) -> grid (fetches student then delegates to buildGrid); updatePageStatus(studentId, page, status, tasmikRecord) -> updated grid (writes statusMap + frontier back to student row, appends tasmik log record). TasmikRepository is used only for log writes, not for grid reconstruction.
```

### Student Repository
| Field | Value |
|-------|-------|
| Pattern | Repository |
| Risk | low |
| Effort | 3 days |
| NFR Tags | Security, Scalability |
| Dependencies | None |

**Business Reason:** Centralizes student data access, ensuring consistent validation and data integrity across all roles.

**Data Flow:** Handles all data operations for the Student entity: findById, search, create, update, delete. Communicates with the database (SQL/NoSQL). Input: query parameters; output: Student objects.

**Agent Prompt:**
```
Create a StudentRepository with methods: getById, searchByName, listAll, create, update, delete. Use a generic database adapter. Return typed objects as defined in types.js.
```

### Tasmik Repository
| Field | Value |
|-------|-------|
| Pattern | Repository |
| Risk | low |
| Effort | 3 days |
| NFR Tags | Performance |
| Dependencies | None |

**Business Reason:** Persistence of memorization progress and quality assessments is the core of the system; must be reliable and fast.

**Data Flow:** Manages TasmikRecord persistence: create (with optional metadata), getByStudentAndPage, getRecentActivity. Stores category, grade, ulasan, date, teacherId. Input: studentId, page; output: TasmikRecord[] or single record.

**Agent Prompt:**
```
Implement TasmikRepository: saveRecord(record), getRecordsForStudent(studentId), getRecordByPage(studentId, page), getRecentActivity(studentId, limit). Ensure indexing on studentId and date for performance.
```

### Teacher Repository
| Field | Value |
|-------|-------|
| Pattern | Repository |
| Risk | low |
| Effort | 2 days |
| NFR Tags | Security |
| Dependencies | None |

**Business Reason:** Teacher accounts are critical for controlled access to progress updates.

**Data Flow:** Handles Teacher account data: findByEmail, listAll, create, delete. Used for authentication and admin management.

**Agent Prompt:**
```
Create TeacherRepository with standard CRUD and a findByEmail method for login. Store hashed passwords; integrate with auth service.
```

### School Repository
| Field | Value |
|-------|-------|
| Pattern | Repository |
| Risk | low |
| Effort | 2 days |
| NFR Tags | Scalability |
| Dependencies | None |

**Business Reason:** Public landing page and admin-editable school information for visibility and fundraising.

**Data Flow:** Handles school profile data: name, description, address, phone, email, donation QR, founded year, enrolled count, teacher count. Single-tenant per school in multi-tenant setup; one record per school.

**Agent Prompt:**
```
Implement SchoolRepository with getProfile and updateProfile methods. The repository enforces single school record per tenant.
```

### Authentication Service
| Field | Value |
|-------|-------|
| Pattern | Service Layer |
| Risk | medium |
| Effort | 1 week |
| NFR Tags | Security |
| Dependencies | Teacher Repository |

**Business Reason:** Protects sensitive teacher and admin actions, ensuring only authorized users can update student progress or manage data.

**Data Flow:** Handles teacher/admin login, session management, and RLS (role-level security). Issues JWT tokens with role claims, validates on every request. Input: email, password; output: auth token.

**Agent Prompt:**
```
Implement authService with login (validates against TeacherRepository), token generation, and middleware that checks roles. Use JWT. Export roles constant: { PARENT: 'parent', TEACHER: 'teacher', ADMIN: 'admin' }. The middleware should extract user from token and attach to request.
```

### Parent Facade
| Field | Value |
|-------|-------|
| Pattern | Facade |
| Risk | low |
| Effort | 2 weeks |
| NFR Tags | Performance |
| Dependencies | Maqra Grid Service, Student Repository, Tasmik Repository, Analytics Service |

**Business Reason:** Provides a secure, read-only view for parents to monitor their child's progress, fostering engagement and trust.

**Data Flow:** Unifies all parent-facing views: student ID lookup, dashboard, progress grid, detail popover, Analitik, Profil, History. Fetches data from maqra-grid-service, student-repository, tasmik-repository, analytics-service and presents a simplified API for the UI. Does not allow writes.

**Agent Prompt:**
```
Build the Parent Facade with React components (or framework-agnostic). StudentLookup accepts ID, validates via StudentRepository, then opens ParentDashboard. Dashboard shows stat cards, MaqraGrid (using MaqraGridService for the specific student), activity log (TasmikRepository.getRecentActivity), and khatam prediction (from AnalyticsService). CellPopover onclick shows detailed tasmik record. Sub-pages: Analitik uses AnalyticsService, ProfilAnak shows student info + status distribution bars, ProgressGrid with filter chips, HistoryLog sortable table. All read-only.
```

### Teacher Facade
| Field | Value |
|-------|-------|
| Pattern | Facade |
| Risk | low |
| Effort | 2 weeks |
| NFR Tags | Security, Performance |
| Dependencies | Authentication Service, Maqra Grid Service, Student Repository, Tasmik Repository |

**Business Reason:** Empowers teachers to update memorization progress live, record assessments, and track class-level progress, making the system functional.

**Data Flow:** Teacher-facing UI: login screen, student list with search, stat cards, per-student dashboard, editable progress grid, update modal, tasmik log. Uses auth-service for login, maqra-grid-service for grid data and updates, student-repository for list, tasmik-repository for log. Manages state for current selected student.

**Agent Prompt:**
```
Create Teacher Facade. Login uses authService.login, then redirect to StudentList (searchable, with stat cards from aggregated student data). Clicking a student opens StudentDashboard with editable MaqraGrid (using MaqraGridService), khatam prediction, and TasmicLog. When a grid cell is clicked, open UpdateModal: select status from predefined list and optionally add tasmik details (category, grade, ulasan, masalah, cadangan). On submit, call MaqraGridService.updatePageStatus which updates grid and saves tasmik record. Show confirmation toast. Use Teacher role auth middleware.
```

### Admin Facade
| Field | Value |
|-------|-------|
| Pattern | Facade |
| Risk | low |
| Effort | 1.5 weeks |
| NFR Tags | Security |
| Dependencies | Authentication Service, Student Repository, School Repository, Teacher Repository |

**Business Reason:** Central management for school administrators to maintain student and teacher records and school profile, enabling multi-tenancy operations.

**Data Flow:** Admin portal: student CRUD (searchable table, add/edit/delete with modals and toasts), school page editor (name, description, etc. + donation QR upload), teacher management grid (add/remove). Uses StudentRepository, SchoolRepository, TeacherRepository, and auth-service for login. Manages admin state.

**Agent Prompt:**
```
Build Admin Facade. Login uses Admin role. StudentManagement: table with search, inline edit/delete triggering StudentRepository methods, with confirm modals and success/error toasts. SchoolEditor: form to edit school fields (image upload for QR); uses SchoolRepository.updateProfile; show live-publish note toggle. TeacherManagement: grid of teacher accounts; add form (email, password) and delete confirmation; calls TeacherRepository. All protected with admin role middleware.
```

### Analytics Service
| Field | Value |
|-------|-------|
| Pattern | Service Layer |
| Risk | medium |
| Effort | 1.5 weeks |
| NFR Tags | Performance |
| Dependencies | Maqra Grid Domain Model, Tasmik Repository |

**Business Reason:** Motivates students and parents by projecting completion dates, comparing against targets, and suggesting revision priorities based on memory strength.

**Data Flow:** Provides analytics computations: khatam 30-juzuk prediction (uses current pace from tasmik records), target vs achieved (progress ring, 6-month bar chart against 15 pages/month target, yearly juz target), murajaah plan (decay-based memory strength scoring per juzuk). Receives student progress data and returns projections, charts data, and revision plan.

**Agent Prompt:**
```
Implement AnalyticsService with three methods: 1) predictKhatam(studentId) — calculates pages memorized per day from TasmikRepository, projects date to complete 604. Returns SVG data points for progress vs projection (dashed). 2) getTargetVsAchieved(studentId) — returns progress ring %, 6-month bar chart data against 15 pages/month, and yearly juz target completion. 3) getMurajaahPlan(studentId) — scores each juzuk's memory strength based on recency and frequency of murajaah marks; decay function over time; returns sorted list weakest first with 'mark revised' capability (integration with TasmikRepository to update). Use pageMapping for juzuk boundaries.
```

### School Page Facade
| Field | Value |
|-------|-------|
| Pattern | Facade |
| Risk | low |
| Effort | 3 days |
| NFR Tags | Performance |
| Dependencies | School Repository |

**Business Reason:** Public visibility and fundraising for the school; encourages community support via wakaf donations.

**Data Flow:** Public-facing landing page: displays school bio (name, description, founded year, enrolled students, teacher count), stats, and donation/wakaf card (QR image, bank details). Data fetched from SchoolRepository. No authentication required.

**Agent Prompt:**
```
Build SchoolLanding component that fetches school profile from SchoolRepository.getProfile. Display school details, stats. DonationCard shows QR image (uploaded by admin) and static bank account info. Minimal styling.
```

### Tweaks Strategy
| Field | Value |
|-------|-------|
| Pattern | Strategy |
| Risk | low |
| Effort | 3 days |
| NFR Tags | Performance |
| Dependencies | None |

**Business Reason:** Enhances user experience and accessibility by allowing personalization, common in modern apps.

**Data Flow:** Manages UI customization settings: accent color (4 options), dark mode toggle, UI font (3 options), grid density (padat/sederhana/lapang). Stores preferences in local storage or user profile. Applies changes by injecting CSS variables or classes. Communicates changes to other components via event or context.

**Agent Prompt:**
```
Implement TweaksStrategy using React Context. tweaksStrategies defines available accent colors, fonts, densities. TweaksPanel renders controls; changes update context and persist to localStorage. Apply changes via CSS custom properties on root, and toggling dark mode class. Ensure grid density is adjustable (pass to MaqraGrid via props/context).
```

### Teacher Tasmik Queue
| Field | Value |
|-------|-------|
| Pattern | Service Layer |
| Risk | medium |
| Effort | 4 days |
| NFR Tags | Performance, Usability |
| Dependencies | Tasmik Repository, Analytics Service, Student Repository |

**Business Reason:** Teachers currently see only one student at a time; a prioritised daily worklist based on memory decay dramatically reduces planning effort and ensures no student falls behind on revision.

**Data Flow:** Computes a daily worklist of students due for tasmik by querying latest tasmik records from TasmikRepository, fetching murajaah decay scores per juzuk from AnalyticsService, and applying a prioritisation algorithm. Outputs an ordered list of student IDs with due pages and priority scores.

**Agent Prompt:**
```
Implement TasmikQueueService that accepts a teacherId (or all students) and returns an array of {studentId, page, juzNumber, priorityScore, lastTasmikDate}. Use existing TasmikRepository.getRecentActivity to get latest tasmik per student, then call AnalyticsService.getDecayScores to obtain murajaah strength. Sort by ascending strength (weakest first). Build a React component TasmikQueue that renders the list with student name, page, and colour-coded priority. Add it to the teacher dashboard. Reuse existing student-repository for student names.
```

### Teacher Class-level View
| Field | Value |
|-------|-------|
| Pattern | Facade |
| Risk | medium |
| Effort | 5 days |
| NFR Tags | Performance, Scalability |
| Dependencies | Student Repository, Maqra Grid Service, Analytics Service |

**Business Reason:** Enables teachers to compare cohort progress at a glance, identify students falling behind targets, and triage attention across classes, addressing the biggest monitoring gap.

**Data Flow:** Aggregates progress data for all students in a given class (e.g. Tahun 4) by fetching each student’s MaqraGrid via MaqraGridService, computing total pages memorised, comparing against yearly juz targets from AnalyticsService, and producing a heatmap or ranking table. Returns class-level statistics and per-student risk indicators.

**Agent Prompt:**
```
Build ClassViewService that accepts a class identifier (e.g. 'Tahun 4') and fetches all students of that class via StudentRepository.findByClass. For each student, retrieve their MaqraGrid via MaqraGridService.getGridForStudent, compute total pages memorised and last-month pace. Compare against yearly juz target from AnalyticsService.getYearlyTarget. Return a ranking list with ahead/behind status. Create a React heatmap component ClassView showing students on rows, juz columns coloured by completion percentage, with sorting and filtering. Integrate into teacher dashboard navigation.
```

### Parent Slip Prestasi (Report Card)
| Field | Value |
|-------|-------|
| Pattern | Service Layer |
| Risk | medium |
| Effort | 1 week |
| NFR Tags | Reliability, Performance |
| Dependencies | Student Repository, Tasmik Repository, Analytics Service, Maqra Grid Service |

**Business Reason:** Parents and tahfiz schools require a physical or digital report card each term; this builds trust and engagement, and is the #1 requested parent-facing feature.

**Data Flow:** On demand, generates a one-page PDF report for a student. Collects profile from StudentRepository, tasmik log from TasmikRepository, progress ring and khatam projection from AnalyticsService, and current grid status from MaqraGridService. Formats them into a styled PDF using a PDF-generation adapter.

**Agent Prompt:**
```
Create SlipPrestasiService.js that exports generatePdf(studentId). Use the PDF generation library already configured (e.g. puppeteer or jspdf). Fetch student profile via StudentRepository.findById, recent tasmik records via TasmikRepository.getRecentActivity, progress ring and khatam prediction from AnalyticsService, and grid summary from MaqraGridService.getGridForStudent. Assemble into a template defined in slipPrestasiTemplate.js with school branding, progress bar, and status breakdown. Return a downloadable PDF buffer. Add a ‘Cetak Slip Prestasi’ button in the parent dashboard subpage (ProfilAnak or Analitik).
```

### Parent Peer Context
| Field | Value |
|-------|-------|
| Pattern | Service Layer |
| Risk | low |
| Effort | 2 days |
| NFR Tags | Performance |
| Dependencies | Student Repository, Maqra Grid Service, Analytics Service |

**Business Reason:** Gives parents meaningful context for their child’s memorisation rate by showing it against the class average, turning a raw number into an understandable benchmark.

**Data Flow:** Computes average memorisation pace for all students in the same class (or school) by aggregating tasmik records from TasmikRepository for each student via MaqraGridService pace calculations. Compares the given student’s pace to the average and returns a descriptive metric (e.g. '7.1 m.s./bulan vs purata 9.3').

**Agent Prompt:**
```
Build PeerContextService.js with method getPeerAverage(studentId). Determine the student’s class via StudentRepository.findById or from parent context. Fetch all students in that class via StudentRepository.findByClass. For each classmate, call MaqraGridService.getGridForStudent and use AnalyticsService.getPace to compute pages per month. Compute the mean. Return an object { studentPace, classAverage, comparisonText }. Integrate into the parent Analitik page near the pace display.
```

### Admin Sekolah Dashboard
| Field | Value |
|-------|-------|
| Pattern | Facade |
| Risk | medium |
| Effort | 1 week |
| NFR Tags | Performance, Scalability |
| Dependencies | Student Repository, Maqra Grid Service, Analytics Service, Tasmik Repository |

**Business Reason:** Admin currently has no overview of collective student progress; this dashboard provides critical daily visibility for tahfiz school management and reporting.

**Data Flow:** Aggregates school-wide statistics: total juzuk memorised (sum across all students via student-repository and maqra-grid-service), count of students on-track/behind target (via analytics-service targetTracker), monthly new-page throughput (aggregation of recent tasmik records). Compiles these into a dashboard data object for the admin UI.

**Agent Prompt:**
```
Create DashboardService.js that fetches all students via StudentRepository.listAll, then uses MaqraGridService.getGridSummaries to compute total juzuk, and AnalyticsService.batchCheckTargets to classify on-track/behind. Use TasmikRepository.getMonthlyThroughput (you will need to implement this aggregation) to get pages added in the last 30 days. Build a React component SekolahDashboard with summary cards, a progress chart, and a quick list of behind students. Add to the admin portal navigation.
```

### Pengumuman Repository
| Field | Value |
|-------|-------|
| Pattern | Repository |
| Risk | low |
| Effort | 1 day |
| NFR Tags | Consistency |
| Dependencies | None |

**Business Reason:** Enables admin to post time-sensitive announcements visible to parents on the school page, improving communication.

**Data Flow:** Stores and retrieves announcements for the school. Each announcement has id, title, message, createdBy (adminId), createdAt, expiresAt (optional). Provides create, getAllActive, delete operations. Persists to the database.

**Agent Prompt:**
```
Implement PengumumanRepository with methods create(announcement), getAllActive(), delete(id). Use the existing database connection (same as other repositories). Define types in types.js. Write validation that title and message are required.
```

### Pengumuman Service
| Field | Value |
|-------|-------|
| Pattern | Service Layer |
| Risk | low |
| Effort | 1 day |
| NFR Tags | Security |
| Dependencies | Pengumuman Repository, Authentication Service |

**Business Reason:** Adds a layer of security and validation to announcement operations, ensuring only authorised admins can post.

**Data Flow:** Acts as business logic layer between admin-facade / school-page-facade and PengumumanRepository. Handles input sanitisation, expiration logic, and enforces admin role for create/delete.

**Agent Prompt:**
```
Build PengumumanService.js exporting createAnnouncement(title, message, creatorId) and getActiveAnnouncements(). Use PengumumanRepository.create with expiration (default 30 days). Use requireRole('admin') middleware for create/delete. Provide getActiveAnnouncements that filters out expired entries. Wire into admin-facade and school-page-facade.
```

### Sijil Service
| Field | Value |
|-------|-------|
| Pattern | Service Layer |
| Risk | low |
| Effort | 3 days |
| NFR Tags | Reliability |
| Dependencies | Student Repository, School Repository |

**Business Reason:** Tangible achievement certificates increase motivation for students and are cherished by parents, enhancing product stickiness.

**Data Flow:** Generates a certificate PDF when a student reaches a juzuk or khatam milestone. Detects milestones by comparing new tasmik status (from teacher-facade or admin-facade) against previous state. Collects student name, milestone description, date, and optionally school branding from SchoolRepository. Produces a styled PDF for download.

**Agent Prompt:**
```
Implement SijilService.js with method issueCertificate(studentId, milestoneType). Fetch student name and school details. Use a PDF generation library (same as slip prestasi) and sijilTemplate.js to render an official-looking certificate. Return a download URL or buffer. Integrate milestone detection: when teacher updates a page to completed and the new total reaches a juzuk boundary or khatam, call this service from teacher-facade or admin-facade and offer the certificate as a download in the UI.
```

### Responsive Layout Strategy
| Field | Value |
|-------|-------|
| Pattern | Strategy |
| Risk | medium |
| Effort | 1 week |
| NFR Tags | Performance, Usability |
| Dependencies | Parent Facade, Teacher Facade, Admin Facade, School Page Facade, Tweaks Strategy |

**Business Reason:** Parents in Malaysia primarily check on mobile; responsive redesign prevents high bounce rate and poor mobile experience, directly impacting user retention and trust.

**Data Flow:** Detects viewport width (<480px mobile) and applies CSS transforms: collapses sidebar navigation into a hamburger menu, stacks card components vertically, adjusts Grid (604-page) to reflow columns (e.g., from 10 to 4 or 2), and optimizes touch targets. Pulls layout configuration from tweaks-strategy for density and dark mode. Communicates state changes to parent-facade, teacher-facade, admin-facade, and school-page-facade via a shared context or media query listener. Outputs a set of CSS class toggles and responsive classes.

**Agent Prompt:**
```
Implement a responsive layout strategy that applies mobile-first transformations to all facades. Use a context provider to detect viewport size via window.matchMedia('(max-width: 480px)'). Provide hooks to toggle sidebar collapse, stack card components, and adjust the maqra grid columns (e.g., 10->4->2). Import useTweaks from tweaksStrategy to respect user's density and dark mode settings. Apply responsive classes to parent-facade, teacher-facade, admin-facade, and school-page-facade by wrapping their root components with a ResponsiveProvider. Ensure no horizontal scrollbars and touch-friendly tap targets.
```

### Super Admin Dashboard (Multi-tenant)
| Field | Value |
|-------|-------|
| Pattern | Facade |
| Risk | high |
| Effort | 2 weeks |
| NFR Tags | Security, Scalability |
| Dependencies | Authentication Service, School Repository, Admin Sekolah Dashboard |

**Business Reason:** Platform owners (maqra.app as a SaaS) need to monitor all tenant schools, assess adoption, and identify underperforming schools for support or upselling. Essential for multi-tenant business intelligence.

**Data Flow:** Authenticates platform owner via auth-service (role: superadmin). Fetches list of all schools from a new SchoolRepository method (getAllSchools). For each school, aggregates school-level statistics by querying per-school data using the existing admin-sekolah-dashboard (but scoped to schoolId) or a new dashboard service. Compiles a table/dashboard of all schools with key metrics: total students, total memorisation pages, average pacing, number of schools on track. Optionally allows drill-down into a specific school’s admin dashboard. Uses a new super-admin repository for persistent preferences if needed.

**Agent Prompt:**
```
Create a super-admin facade at src/features/superadmin/. Implement SuperAdminLogin using authService to authenticate with role='superadmin'. Build SuperAdminDashboard that, on mount, calls schoolRepository.getAllSchools() (add get all method to SchoolRepository), then for each school fetch aggregated stats via getSchoolDashboardData(schoolId) (modify admin-sekolah-dashboard to accept schoolId parameter). Display a table with school names, student counts, total pages memorised, average pace, and on-track percentage. Add a drill-down to SuperAdminSchoolDetail that renders the admin-sekolah-dashboard for that school. Ensure role-based access via authMiddleware.
```

### Individual Student Target Service
| Field | Value |
|-------|-------|
| Pattern | Service Layer |
| Risk | medium |
| Effort | 1 week |
| NFR Tags | Consistency, Performance |
| Dependencies | Student Repository, Analytics Service, Authentication Service |

**Business Reason:** Beginner students (e.g., 5 pages/month) and advanced huffaz (30+ pages/month) need individualised goals; a flat target demotivates both. Accurate analytics improve teacher/parent trust and intervention targeting.

**Data Flow:** Manages per-student memorisation targets (sasaran) as a monthly page goal. Allows teachers/admins to set or update a target for a student via teacher-facade/admin-facade. Stores target in a new database field or table (part of Student entity). When analytics-service computes target vs. achieved, it first checks this per‑student target; if absent, falls back to the default 15 pages/month. Provides getTarget(studentId) and setTarget(studentId, pagesPerMonth). Integrates with analytics-service's targetTracker to use the dynamic target.

**Agent Prompt:**
```
Create a StudentTargetService that manages per‑student monthly page targets. Add a new collection/table 'student_targets' (fields: studentId, pagesPerMonth, setBy, updatedAt) via targetRepository. Expose methods: getTarget(studentId) (returns pagesPerMonth or null) and setTarget(studentId, pagesPerMonth, userId). Protect setTarget with authMiddleware.requireRole(['teacher','admin']). Modify analytics-service's calculateTargetProgress to accept an optional target parameter; if not provided, call studentTargetService.getTarget(studentId), falling back to 15. Integrate the target input form into teacher-facade's student detail view and admin-facade's student editor. Update parent-facade's analytics view to reflect the custom target.
```

### Supabase Backend Integration
| Field | Value |
|-------|-------|
| Pattern | Adapter |
| Risk | medium |
| Effort | 2–3 weeks |
| NFR Tags | Scalability, Security, Performance |
| Dependencies | None |

**Business Reason:** Supabase provides a managed PostgreSQL database, built‑in authentication, real‑time subscriptions, and storage—reducing infrastructure overhead, improving developer velocity, and offering scalable Row‑Level Security for multi‑tenant data access.

**Data Flow:** Initializes the Supabase client with project URL and anon key. Provides a unified export of the Supabase client instance and a set of CRUD helper functions tailored to each entity (students, tasmik_records, teachers, schools, pengumuman). Handles real‑time subscription setup for live updates. Existing repositories and the authentication service consume this adapter instead of direct database drivers.

**Agent Prompt:**
```
You are integrating Supabase as the backend for the Quran memorization tracking app. Implement the following steps:
- Install @supabase/supabase-js and create a Supabase client in src/backend/supabase/supabaseClient.js using environment variables SUPABASE_URL and SUPABASE_ANON_KEY. Export the configured client.
- In src/backend/supabase/supabaseAdapter.js, write a set of helper functions for each entity (students, tasmik_records, teachers, schools, pengumuman). Each function should wrap the Supabase client methods (e.g., supabase.from('table').select(), .insert(), .update(), .delete()) and return normalized data. Ensure they match the existing repository query patterns found in files like src/features/student/repository/StudentRepository.js and src/features/tasmik/repository/TasmikRepository.js.
- Update all repository files (StudentRepository, TasmikRepository, TeacherRepository, SchoolRepository, PengumumanRepository) to import and use the adapter functions instead of their current database drivers.
- Configure Row‑Level Security (RLS) policies in the Supabase project to enforce multi‑tenant data isolation (e.g., each school's teachers can only access their own students’ records).
- Modify the authentication service (src/features/auth/authService.js) to use Supabase Auth for login and token validation: replace existing login logic with supabase.auth.signInWithPassword, and adjust the auth middleware (src/features/auth/authMiddleware.js) to verify the Supabase‑issued JWT.
- Test all CRUD operations and authentication flow to ensure compatibility with the existing frontend facades and services.
- Implement realtime in `src/backend/supabase/useRealtimeStudents.js`: a React hook that subscribes to `postgres_changes` on the `students` table (UPDATE events) and calls a callback with the updated student row. Subscription helpers (`subscribeToStudents`, `unsubscribeFromStudents`) live in `supabaseAdapter.js`. Hook cleans up subscription on unmount.
```

---

## Dependencies Graph

- **Maqra Grid Service** → **Maqra Grid Domain Model** _(uses domain model for grid logic and page mapping)_
- **Maqra Grid Service** → **Tasmik Repository** _(writes tasmik log records on status update; does NOT read tasmik records for grid reconstruction — grid state is denormalized into student.statusMap)_
- **Parent Facade** → **Maqra Grid Service** _(reads student grid progress via service)_
- **Parent Facade** → **Student Repository** _(looks up student by ID)_
- **Parent Facade** → **Tasmik Repository** _(fetches recent activity log)_
- **Parent Facade** → **Analytics Service** _(gets predictions and target tracking)_
- **Teacher Facade** → **Authentication Service** _(authenticates teacher login and validates role)_
- **Teacher Facade** → **Maqra Grid Service** _(reads and updates student grid via service)_
- **Teacher Facade** → **Student Repository** _(lists and searches students)_
- **Teacher Facade** → **Tasmik Repository** _(records new tasmik entries and views log)_
- **Teacher Facade** → **Tweaks Strategy** _(applies user UI preferences)_
- **Admin Facade** → **Authentication Service** _(authenticates admin and enforces role)_
- **Admin Facade** → **Student Repository** _(performs full student CRUD)_
- **Admin Facade** → **School Repository** _(edits school profile and donation QR)_
- **Admin Facade** → **Teacher Repository** _(manages teacher accounts)_
- **Analytics Service** → **Maqra Grid Domain Model** _(uses page mapping for juzuk boundaries)_
- **Analytics Service** → **Tasmik Repository** _(queries historical progress for pace calculation)_
- **School Page Facade** → **School Repository** _(fetches public school profile)_
- **Authentication Service** → **Teacher Repository** _(validates teacher credentials during login)_
- **Teacher Tasmik Queue** → **Tasmik Repository** _(queries recent tasmik records)_
- **Teacher Tasmik Queue** → **Analytics Service** _(fetches murajaah decay scores)_
- **Teacher Tasmik Queue** → **Student Repository** _(resolves student names)_
- **Teacher Facade** → **Teacher Tasmik Queue** _(renders daily tasmik worklist)_
- **Teacher Class-level View** → **Student Repository** _(lists students by class)_
- **Teacher Class-level View** → **Maqra Grid Service** _(fetches per-student grid progress)_
- **Teacher Class-level View** → **Analytics Service** _(compares against targets)_
- **Teacher Facade** → **Teacher Class-level View** _(displays cohort heatmap/ranking)_
- **Parent Slip Prestasi (Report Card)** → **Student Repository** _(reads student profile)_
- **Parent Slip Prestasi (Report Card)** → **Tasmik Repository** _(gets recent tasmik activity)_
- **Parent Slip Prestasi (Report Card)** → **Analytics Service** _(obtains progress ring & khatam prediction)_
- **Parent Slip Prestasi (Report Card)** → **Maqra Grid Service** _(retrieves grid status)_
- **Parent Facade** → **Parent Slip Prestasi (Report Card)** _(offers ‘Cetak Slip Prestasi’ button)_
- **Parent Peer Context** → **Student Repository** _(gets classmates)_
- **Parent Peer Context** → **Maqra Grid Service** _(computes classmate pace)_
- **Parent Peer Context** → **Analytics Service** _(retrieves student pace)_
- **Parent Facade** → **Parent Peer Context** _(shows peer comparison in Analitik)_
- **Admin Sekolah Dashboard** → **Student Repository** _(lists all students)_
- **Admin Sekolah Dashboard** → **Maqra Grid Service** _(aggregates grid summaries)_
- **Admin Sekolah Dashboard** → **Analytics Service** _(batch-checks targets)_
- **Admin Sekolah Dashboard** → **Tasmik Repository** _(computes monthly throughput)_
- **Admin Facade** → **Admin Sekolah Dashboard** _(renders sekolah dashboard)_
- **Pengumuman Service** → **Pengumuman Repository** _(persists and retrieves announcements)_
- **Pengumuman Service** → **Authentication Service** _(enforces admin role for writes)_
- **Admin Facade** → **Pengumuman Service** _(creates and deletes announcements)_
- **School Page Facade** → **Pengumuman Service** _(reads active announcements for public page)_
- **Sijil Service** → **Student Repository** _(fetches student details)_
- **Sijil Service** → **School Repository** _(gets school branding)_
- **Teacher Facade** → **Sijil Service** _(triggers certificate on milestone)_
- **Admin Facade** → **Sijil Service** _(optionally issues certificate manually)_
- **Responsive Layout Strategy** → **Parent Facade** _(applies responsive classes to parent views)_
- **Responsive Layout Strategy** → **Teacher Facade** _(collapses sidebar and stacks teacher cards)_
- **Responsive Layout Strategy** → **Admin Facade** _(reflows admin tables and modals)_
- **Responsive Layout Strategy** → **School Page Facade** _(stacks public landing page sections)_
- **Responsive Layout Strategy** → **Tweaks Strategy** _(reads density and dark mode preferences)_
- **Super Admin Dashboard (Multi-tenant)** → **Authentication Service** _(authenticates superadmin role)_
- **Super Admin Dashboard (Multi-tenant)** → **School Repository** _(fetches all schools)_
- **Super Admin Dashboard (Multi-tenant)** → **Admin Sekolah Dashboard** _(aggregates per-school dashboard data)_
- **Individual Student Target Service** → **Student Repository** _(extends student entity to store target)_
- **Individual Student Target Service** → **Analytics Service** _(provides dynamic per-student target to target tracker)_
- **Individual Student Target Service** → **Authentication Service** _(enforces teacher/admin role on target writes)_
- **Teacher Facade** → **Individual Student Target Service** _(sets/updates individual target from student dashboard)_
- **Admin Facade** → **Individual Student Target Service** _(manages per-student target in student editor)_
- **Parent Facade** → **Individual Student Target Service** _(reads target for analytics display)_
- **Student Repository** → **Supabase Backend Integration** _(Uses Supabase client for student entity persistence)_
- **Tasmik Repository** → **Supabase Backend Integration** _(Uses Supabase client for tasmik record persistence)_
- **Teacher Repository** → **Supabase Backend Integration** _(Uses Supabase client for teacher entity persistence)_
- **School Repository** → **Supabase Backend Integration** _(Uses Supabase client for school entity persistence)_
- **Pengumuman Repository** → **Supabase Backend Integration** _(Uses Supabase client for announcement persistence)_
- **Authentication Service** → **Supabase Backend Integration** _(Uses Supabase Auth for login and token validation)_

---

## Updates Log

### 2026-06-02 — Live DB Audit & Bug Findings

#### What Changed Since Blueprint

**Multitenancy (school_slug scoping) — implemented, not in original blueprint**
Every repository method now accepts a `schoolSlug` parameter and filters queries via `.eq("school_slug", schoolSlug)`. All tables (`students`, `teachers`, `tasmik_records`, `announcements`) carry a `school_slug` column. `SchoolRepository.getProfile(slug = "al-furqan")` is the entry point — App.jsx fetches the active school on mount and threads its `slug` into every downstream call.

**DuitNow QR on SchoolLanding — implemented, not in blueprint**
`SchoolLanding` now renders a `<DuitNowQR>` component (or `<FauxQR>` fallback) using `school.qrCode` (base64 stored in the `schools` table). Admin uploads QR image via `SchoolEditor`. The blueprint listed a static donation card; actual implementation supports live QR payloads.

**`useRealtimeStudents` hook — implemented, not in blueprint**
`src/backend/supabase/useRealtimeStudents.js` subscribes to `postgres_changes` on the `students` table (UPDATE events) and merges the updated row into App-level state via a callback. Declared in the Supabase Backend Integration node but now documented here as a live, wired feature.

**Super Admin auth via `schools` table (Option A) — diverges from blueprint**
Blueprint assumed Supabase Auth with role in JWT `app_metadata`. Actual implementation checks `admin_email` / `admin_password` columns directly in the `schools` table. Supabase Auth is used for teacher login; admin/superadmin fall back to plain-text credential match in the DB row. This is a known security debt — see Known Issues below.

**`SekolahDashboard` owns `Pengumuman` management — not in blueprint**
Admin's `SekolahDashboard` now includes a full announcement CRUD panel (post, edit, delete). Blueprint scoped announcement management only to "Admin Facade → Pengumuman Service" generically.

---

#### Known Bugs (found during audit, not yet fixed)

**[CRITICAL] Announcements: `body`/`tag` vs DB columns `content`/`category`**
- DB schema: columns `content`, `category`
- Code throughout: field names `body`, `tag`
- Affected files: `PengumumanService.js:13-15` (creates record with wrong field names → Supabase rejects insert), `SekolahDashboard.jsx:179,186` (reads `an.tag`, `an.body` → both `undefined`), `SchoolLanding.jsx:185,189` (same)
- Effect: All 3 existing announcements in DB render with blank badge and blank body. Creating new announcements fails silently.
- Fix needed: Rename DB columns OR rename all code references. Rename code to match DB (`body→content`, `tag→category`) touches fewer files.

**[MINOR] `StudentRow` renders `st.target` as `undefined`**
- `students` table has no `target` column; target lives in `student_targets` table (separate entity)
- `StudentRepository.listAll()` does not join `student_targets`
- `StudentRow` (line 31): renders `Sasaran: {st.target} m.s.` → "Sasaran:  m.s."
- Fix needed: merge target into student list (join query or secondary fetch in App.jsx after `listAll`)

**[MINOR] `StudentList` "Tasmik Hari Ini" stat card hardcoded date**
- `StudentList.jsx:60`: `const today = new Date(2026, 4, 30)` — hardcoded May 30, 2026
- Should be `new Date()` — stat always shows 0 since today ≠ May 30
- Quick one-liner fix

**[DATA] `student_targets` missing entry for STU00160**
- 5 of 6 students have rows in `student_targets`; Aina Sofea (STU00160) has none
- Analytics fallback to default 15 pages/month but target display will be blank

---

#### Current DB Schema (actual, as verified)

| Table | Key columns |
|-------|-------------|
| `schools` | `slug` (PK), `name`, `city`, `plan`, `status`, `admin_email`, `admin_password`, `qrCode`, `bankName`, `bankAccount`, `donationTarget`, `donationRaised` |
| `students` | `id` (PK), `name`, `sex`, `umur`, `kelas`, `frontier`, `statusMap` (jsonb), `school_slug` |
| `teachers` | `name`, `kelas`, `school_slug` |
| `tasmik_records` | per-student tasmik log, `school_slug` |
| `announcements` | `id`, `title`, `content`, `category`, `date`, `school_slug` ← **note: NOT `body`/`tag`** |
| `student_targets` | `studentId`, `pagesPerMonth`, `updatedAt` |

RLS is currently disabled on all tables — flagged in CLAUDE.md as known security gap.