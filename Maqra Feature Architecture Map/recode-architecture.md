# Recode Architecture Document

## Maqra Grid Domain Model
**Pattern:** Domain Model
**Risk:** low
**Effort:** 1 week
**Business Reason:** Core differentiator that enables the entire product; accurate tracking and visualization of Quran memorization progress in a Madani mushaf-specific grid.
**Data Flow:** Represents the 604-page grid state, derives surah/juz from page numbers, computes status colors and progress metrics. Input: page number, statuses array; output: structured grid data with computed fields.
**NFR Tags:** Scalability, Performance
**Dependencies:** None

## Maqra Grid Service
**Pattern:** Service Layer
**Risk:** low
**Effort:** 3 days
**Business Reason:** Orchestrates domain logic with data retrieval, enabling other modules to read and write progress without direct domain knowledge.
**Data Flow:** Acts as an intermediary between the domain model and external consumers (facades). Fetches student's tasmik records from repository, constructs MaqraGrid instance, provides methods to compute tallies, update statuses, and retrieve grid state. Input: studentId; output: MaqraGrid with computed properties.
**NFR Tags:** Performance
**Dependencies:** maqra-domain, tasmik-repository

## Student Repository
**Pattern:** Repository
**Risk:** low
**Effort:** 3 days
**Business Reason:** Centralizes student data access, ensuring consistent validation and data integrity across all roles.
**Data Flow:** Handles all data operations for the Student entity: findById, search, create, update, delete. Communicates with the database (SQL/NoSQL). Input: query parameters; output: Student objects.
**NFR Tags:** Security, Scalability
**Dependencies:** None

## Tasmik Repository
**Pattern:** Repository
**Risk:** low
**Effort:** 3 days
**Business Reason:** Persistence of memorization progress and quality assessments is the core of the system; must be reliable and fast.
**Data Flow:** Manages TasmikRecord persistence: create (with optional metadata), getByStudentAndPage, getRecentActivity. Stores category, grade, ulasan, date, teacherId. Input: studentId, page; output: TasmikRecord[] or single record.
**NFR Tags:** Performance
**Dependencies:** None

## Teacher Repository
**Pattern:** Repository
**Risk:** low
**Effort:** 2 days
**Business Reason:** Teacher accounts are critical for controlled access to progress updates.
**Data Flow:** Handles Teacher account data: findByEmail, listAll, create, delete. Used for authentication and admin management.
**NFR Tags:** Security
**Dependencies:** None

## School Repository
**Pattern:** Repository
**Risk:** low
**Effort:** 2 days
**Business Reason:** Public landing page and admin-editable school information for visibility and fundraising.
**Data Flow:** Handles school profile data: name, description, address, phone, email, donation QR, founded year, enrolled count, teacher count. Single-tenant per school in multi-tenant setup; one record per school.
**NFR Tags:** Scalability
**Dependencies:** None

## Authentication Service
**Pattern:** Service Layer
**Risk:** medium
**Effort:** 1 week
**Business Reason:** Protects sensitive teacher and admin actions, ensuring only authorized users can update student progress or manage data.
**Data Flow:** Handles teacher/admin login, session management, and RLS (role-level security). Issues JWT tokens with role claims, validates on every request. Input: email, password; output: auth token.
**NFR Tags:** Security
**Dependencies:** teacher-repository

## Parent Facade
**Pattern:** Facade
**Risk:** low
**Effort:** 2 weeks
**Business Reason:** Provides a secure, read-only view for parents to monitor their child's progress, fostering engagement and trust.
**Data Flow:** Unifies all parent-facing views: student ID lookup, dashboard, progress grid, detail popover, Analitik, Profil, History. Fetches data from maqra-grid-service, student-repository, tasmik-repository, analytics-service and presents a simplified API for the UI. Does not allow writes.
**NFR Tags:** Performance
**Dependencies:** maqra-grid-service, student-repository, tasmik-repository, analytics-service

## Teacher Facade
**Pattern:** Facade
**Risk:** low
**Effort:** 2 weeks
**Business Reason:** Empowers teachers to update memorization progress live, record assessments, and track class-level progress, making the system functional.
**Data Flow:** Teacher-facing UI: login screen, student list with search, stat cards, per-student dashboard, editable progress grid, update modal, tasmik log. Uses auth-service for login, maqra-grid-service for grid data and updates, student-repository for list, tasmik-repository for log. Manages state for current selected student.
**NFR Tags:** Security, Performance
**Dependencies:** auth-service, maqra-grid-service, student-repository, tasmik-repository

## Admin Facade
**Pattern:** Facade
**Risk:** low
**Effort:** 1.5 weeks
**Business Reason:** Central management for school administrators to maintain student and teacher records and school profile, enabling multi-tenancy operations.
**Data Flow:** Admin portal: student CRUD (searchable table, add/edit/delete with modals and toasts), school page editor (name, description, etc. + donation QR upload), teacher management grid (add/remove). Uses StudentRepository, SchoolRepository, TeacherRepository, and auth-service for login. Manages admin state.
**NFR Tags:** Security
**Dependencies:** auth-service, student-repository, school-repository, teacher-repository

## Analytics Service
**Pattern:** Service Layer
**Risk:** medium
**Effort:** 1.5 weeks
**Business Reason:** Motivates students and parents by projecting completion dates, comparing against targets, and suggesting revision priorities based on memory strength.
**Data Flow:** Provides analytics computations: khatam 30-juzuk prediction (uses current pace from tasmik records), target vs achieved (progress ring, 6-month bar chart against 15 pages/month target, yearly juz target), murajaah plan (decay-based memory strength scoring per juzuk). Receives student progress data and returns projections, charts data, and revision plan.
**NFR Tags:** Performance
**Dependencies:** maqra-domain, tasmik-repository

## School Page Facade
**Pattern:** Facade
**Risk:** low
**Effort:** 3 days
**Business Reason:** Public visibility and fundraising for the school; encourages community support via wakaf donations.
**Data Flow:** Public-facing landing page: displays school bio (name, description, founded year, enrolled students, teacher count), stats, and donation/wakaf card (QR image, bank details). Data fetched from SchoolRepository. No authentication required.
**NFR Tags:** Performance
**Dependencies:** school-repository

## Tweaks Strategy
**Pattern:** Strategy
**Risk:** low
**Effort:** 3 days
**Business Reason:** Enhances user experience and accessibility by allowing personalization, common in modern apps.
**Data Flow:** Manages UI customization settings: accent color (4 options), dark mode toggle, UI font (3 options), grid density (padat/sederhana/lapang). Stores preferences in local storage or user profile. Applies changes by injecting CSS variables or classes. Communicates changes to other components via event or context.
**NFR Tags:** Performance
**Dependencies:** None

## Teacher Tasmik Queue
**Pattern:** Service Layer
**Risk:** medium
**Effort:** 4 days
**Business Reason:** Teachers currently see only one student at a time; a prioritised daily worklist based on memory decay dramatically reduces planning effort and ensures no student falls behind on revision.
**Data Flow:** Computes a daily worklist of students due for tasmik by querying latest tasmik records from TasmikRepository, fetching murajaah decay scores per juzuk from AnalyticsService, and applying a prioritisation algorithm. Outputs an ordered list of student IDs with due pages and priority scores.
**NFR Tags:** Performance, Usability
**Dependencies:** tasmik-repository, analytics-service, student-repository

## Teacher Class-level View
**Pattern:** Facade
**Risk:** medium
**Effort:** 5 days
**Business Reason:** Enables teachers to compare cohort progress at a glance, identify students falling behind targets, and triage attention across classes, addressing the biggest monitoring gap.
**Data Flow:** Aggregates progress data for all students in a given class (e.g. Tahun 4) by fetching each student’s MaqraGrid via MaqraGridService, computing total pages memorised, comparing against yearly juz targets from AnalyticsService, and producing a heatmap or ranking table. Returns class-level statistics and per-student risk indicators.
**NFR Tags:** Performance, Scalability
**Dependencies:** student-repository, maqra-grid-service, analytics-service

## Parent Slip Prestasi (Report Card)
**Pattern:** Service Layer
**Risk:** medium
**Effort:** 1 week
**Business Reason:** Parents and tahfiz schools require a physical or digital report card each term; this builds trust and engagement, and is the #1 requested parent-facing feature.
**Data Flow:** On demand, generates a one-page PDF report for a student. Collects profile from StudentRepository, tasmik log from TasmikRepository, progress ring and khatam projection from AnalyticsService, and current grid status from MaqraGridService. Formats them into a styled PDF using a PDF-generation adapter.
**NFR Tags:** Reliability, Performance
**Dependencies:** student-repository, tasmik-repository, analytics-service, maqra-grid-service

## Parent Peer Context
**Pattern:** Service Layer
**Risk:** low
**Effort:** 2 days
**Business Reason:** Gives parents meaningful context for their child’s memorisation rate by showing it against the class average, turning a raw number into an understandable benchmark.
**Data Flow:** Computes average memorisation pace for all students in the same class (or school) by aggregating tasmik records from TasmikRepository for each student via MaqraGridService pace calculations. Compares the given student’s pace to the average and returns a descriptive metric (e.g. '7.1 m.s./bulan vs purata 9.3').
**NFR Tags:** Performance
**Dependencies:** student-repository, maqra-grid-service, analytics-service

## Admin Sekolah Dashboard
**Pattern:** Facade
**Risk:** medium
**Effort:** 1 week
**Business Reason:** Admin currently has no overview of collective student progress; this dashboard provides critical daily visibility for tahfiz school management and reporting.
**Data Flow:** Aggregates school-wide statistics: total juzuk memorised (sum across all students via student-repository and maqra-grid-service), count of students on-track/behind target (via analytics-service targetTracker), monthly new-page throughput (aggregation of recent tasmik records). Compiles these into a dashboard data object for the admin UI.
**NFR Tags:** Performance, Scalability
**Dependencies:** student-repository, maqra-grid-service, analytics-service, tasmik-repository

## Pengumuman Repository
**Pattern:** Repository
**Risk:** low
**Effort:** 1 day
**Business Reason:** Enables admin to post time-sensitive announcements visible to parents on the school page, improving communication.
**Data Flow:** Stores and retrieves announcements for the school. Each announcement has id, title, message, createdBy (adminId), createdAt, expiresAt (optional). Provides create, getAllActive, delete operations. Persists to the database.
**NFR Tags:** Consistency
**Dependencies:** None

## Pengumuman Service
**Pattern:** Service Layer
**Risk:** low
**Effort:** 1 day
**Business Reason:** Adds a layer of security and validation to announcement operations, ensuring only authorised admins can post.
**Data Flow:** Acts as business logic layer between admin-facade / school-page-facade and PengumumanRepository. Handles input sanitisation, expiration logic, and enforces admin role for create/delete.
**NFR Tags:** Security
**Dependencies:** pengumuman-repository, auth-service

## Sijil Service
**Pattern:** Service Layer
**Risk:** low
**Effort:** 3 days
**Business Reason:** Tangible achievement certificates increase motivation for students and are cherished by parents, enhancing product stickiness.
**Data Flow:** Generates a certificate PDF when a student reaches a juzuk or khatam milestone. Detects milestones by comparing new tasmik status (from teacher-facade or admin-facade) against previous state. Collects student name, milestone description, date, and optionally school branding from SchoolRepository. Produces a styled PDF for download.
**NFR Tags:** Reliability
**Dependencies:** student-repository, school-repository

## Responsive Layout Strategy
**Pattern:** Strategy
**Risk:** medium
**Effort:** 1 week
**Business Reason:** Parents in Malaysia primarily check on mobile; responsive redesign prevents high bounce rate and poor mobile experience, directly impacting user retention and trust.
**Data Flow:** Detects viewport width (<480px mobile) and applies CSS transforms: collapses sidebar navigation into a hamburger menu, stacks card components vertically, adjusts Grid (604-page) to reflow columns (e.g., from 10 to 4 or 2), and optimizes touch targets. Pulls layout configuration from tweaks-strategy for density and dark mode. Communicates state changes to parent-facade, teacher-facade, admin-facade, and school-page-facade via a shared context or media query listener. Outputs a set of CSS class toggles and responsive classes.
**NFR Tags:** Performance, Usability
**Dependencies:** parent-facade, teacher-facade, admin-facade, school-page-facade, tweaks-strategy

## Super Admin Dashboard (Multi-tenant)
**Pattern:** Facade
**Risk:** high
**Effort:** 2 weeks
**Business Reason:** Platform owners (maqra.app as a SaaS) need to monitor all tenant schools, assess adoption, and identify underperforming schools for support or upselling. Essential for multi-tenant business intelligence.
**Data Flow:** Authenticates platform owner via auth-service (role: superadmin). Fetches list of all schools from a new SchoolRepository method (getAllSchools). For each school, aggregates school-level statistics by querying per-school data using the existing admin-sekolah-dashboard (but scoped to schoolId) or a new dashboard service. Compiles a table/dashboard of all schools with key metrics: total students, total memorisation pages, average pacing, number of schools on track. Optionally allows drill-down into a specific school’s admin dashboard. Uses a new super-admin repository for persistent preferences if needed.
**NFR Tags:** Security, Scalability
**Dependencies:** auth-service, school-repository, admin-sekolah-dashboard

## Individual Student Target Service
**Pattern:** Service Layer
**Risk:** medium
**Effort:** 1 week
**Business Reason:** Beginner students (e.g., 5 pages/month) and advanced huffaz (30+ pages/month) need individualised goals; a flat target demotivates both. Accurate analytics improve teacher/parent trust and intervention targeting.
**Data Flow:** Manages per-student memorisation targets (sasaran) as a monthly page goal. Allows teachers/admins to set or update a target for a student via teacher-facade/admin-facade. Stores target in a new database field or table (part of Student entity). When analytics-service computes target vs. achieved, it first checks this per‑student target; if absent, falls back to the default 15 pages/month. Provides getTarget(studentId) and setTarget(studentId, pagesPerMonth). Integrates with analytics-service's targetTracker to use the dynamic target.
**NFR Tags:** Consistency, Performance
**Dependencies:** student-repository, analytics-service, auth-service

## SaaS Plan Configuration
**Pattern:** Configuration Object
**Risk:** low
**Effort:** done
**Business Reason:** Single source of truth for plan tiers prevents pricing logic from scattering across UI, service, and gating code.
**Data Flow:** `planConfig.js` exports `PLANS` map, `calcMRR()` helper, `PLAN_OPTIONS`/`STATUS_OPTIONS` arrays. All plan-aware components import from here — never hardcode plan names or prices.
**Plan tiers:**
- **Percubaan** — Free, 30 pelajar max, 60 days, tasmik only
- **Asas** — RM 480/tahun (RM 40 MRR), 150 pelajar, + pengumuman + laporan PDF
- **Premium** — RM 960/tahun (RM 80 MRR), unlimited, + analitik penuh + sijil PDF + export
**NFR Tags:** Maintainability
**Dependencies:** None

## Supabase Backend Integration
**Pattern:** Adapter
**Risk:** medium
**Effort:** 2–3 weeks
**Business Reason:** Supabase provides a managed PostgreSQL database, built‑in authentication, real‑time subscriptions, and storage—reducing infrastructure overhead, improving developer velocity, and offering scalable Row‑Level Security for multi‑tenant data access.
**Data Flow:** Initializes the Supabase client with project URL and anon key. Provides a unified export of the Supabase client instance and a set of CRUD helper functions tailored to each entity (students, tasmik_records, teachers, schools, pengumuman). Handles real‑time subscription setup for live updates. Existing repositories and the authentication service consume this adapter instead of direct database drivers.
**NFR Tags:** Scalability, Security, Performance
**Dependencies:** None
