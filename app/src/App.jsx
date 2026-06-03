import React, { useState, useEffect, useCallback, useMemo } from "react";
import { TweaksProvider, useTweaks } from "./features/tweaks/tweaksContext.jsx";
import { ResponsiveProvider } from "./features/responsive/responsiveContext.jsx";
import { TweaksPanel, TweakSection, TweakColor, TweakToggle, TweakSelect, TweakRadio } from "./features/tweaks/TweaksPanel.jsx";
import { ACCENTS, FONTS, DENSITY } from "./features/tweaks/tweaksStrategies.js";
import { Icon, Wordmark, useIsMobile } from "./components/Shared.jsx";

// Import Persona Flow facades
import { SchoolLanding } from "./features/school/public/SchoolLanding.jsx";
import { ParentDashboard } from "./features/parent/ParentDashboard.jsx";
import { TeacherLogin } from "./features/teacher/TeacherLogin.jsx";
import { StudentList } from "./features/teacher/StudentList.jsx";
import { StudentDashboard } from "./features/teacher/StudentDashboard.jsx";
import { TasmikQueue } from "./features/teacher/TasmikQueue.jsx";
import { ClassView } from "./features/teacher/ClassView.jsx";
import { UpdateModal } from "./features/teacher/UpdateModal.jsx";
import { SekolahDashboard } from "./features/admin/SekolahDashboard.jsx";
import { StudentManagement } from "./features/admin/StudentManagement.jsx";
import { SchoolEditor } from "./features/admin/SchoolEditor.jsx";
import { TeacherManagement } from "./features/admin/TeacherManagement.jsx";
import { SuperAdminDashboard } from "./features/superadmin/SuperAdminDashboard.jsx";

// Services and Repositories
import { StudentRepository } from "./features/student/repository/StudentRepository.js";
import { TeacherRepository } from "./features/teacher/repository/TeacherRepository.js";
import { SchoolRepository } from "./features/school/repository/SchoolRepository.js";
import { MaqraGridService } from "./features/maqra/service/MaqraGridService.js";
import { TasmikRepository } from "./features/tasmik/repository/TasmikRepository.js";
import { authService } from "./features/auth/authService.js";
import { useRealtimeStudents } from "./backend/supabase/useRealtimeStudents.js";
import { targetRepository } from "./features/student/target/targetRepository.js";

function Chrome({ persona, setPersona, path, slug }) {
  const personas = [
    { key: "parent", label: "Ibu Bapa", icon: "users" },
    { key: "teacher", label: "Guru", icon: "cap" },
    { key: "admin", label: "Admin", icon: "shield" },
    { key: "owner", label: "Pemilik", icon: "globe" }
  ];

  const isOwner = persona === "owner";

  return (
    <div className="chrome">
      <div className="chrome-dots"><i /><i /><i /></div>
      <div className="urlbar">
        <span className="lock"><Icon name="lock" size={13} /></span>
        <span className="url">
          {isOwner ? (
            <><span className="dim">maqra.app</span><span className="hot">/platform</span><span className="dim">{path}</span></>
          ) : (
            <><span className="dim">maqra.app/school/</span><span className="hot">{slug || "al-furqan"}</span><span className="dim">{path}</span></>
          )}
        </span>
      </div>
      <div className="persona">
        {personas.map((p) => (
          <button key={p.key} className={persona === p.key ? "on" : ""} onClick={() => setPersona(p.key)}>
            <Icon name={p.icon} size={15} />{p.label}
          </button>
        ))}
      </div>
    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(p) { super(p); this.state = { err: null }; }
  static getDerivedStateFromError(err) { return { err }; }
  componentDidUpdate(pp) { if (pp.flowKey !== this.props.flowKey && this.state.err) this.setState({ err: null }); }
  render() {
    if (this.state.err) return (
      <div style={{ display: "grid", placeItems: "center", minHeight: "60vh", padding: 30 }}>
        <div className="card" style={{ padding: 28, maxWidth: 440, textAlign: "center" }}>
          <Icon name="info" size={28} style={{ color: "var(--st-syahadah-ink)" }} />
          <h3 style={{ margin: "10px 0 6px", fontSize: 17, fontWeight: 800 }}>Ralat memaparkan halaman</h3>
          <p style={{ margin: "0 0 16px", fontSize: 13, color: "var(--ink-3)" }}>{String(this.state.err && this.state.err.message || this.state.err)}</p>
          <button className="btn btn-primary" style={{ margin: "0 auto" }} onClick={() => this.setState({ err: null })}>Cuba semula</button>
        </div>
      </div>
    );
    return this.props.children;
  }
}

function SchoolPicker({ onSelect }) {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    SchoolRepository.listAllSchools()
      .then((list) => setSchools(list.filter((s) => s.status !== "tidak aktif")))
      .catch(() => setSchools([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = schools.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    (s.city || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: "grid", placeItems: "center", minHeight: "80vh", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 480 }} className="animate-up">
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 22 }}>
          <Wordmark size={24} />
        </div>
        <div className="card" style={{ padding: 28 }}>
          <h3 style={{ margin: "0 0 6px", fontSize: 17, fontWeight: 800, textAlign: "center" }}>Pilih Institusi</h3>
          <p style={{ margin: "0 0 18px", color: "var(--ink-3)", fontSize: 13.5, textAlign: "center" }}>
            Pilih maahad anak anda untuk melihat perkembangan hafazan.
          </p>
          <div className="search" style={{ marginBottom: 14 }}>
            <span className="ic"><Icon name="search" size={16} /></span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama maahad atau bandar..."
              autoFocus
            />
          </div>
          {loading ? (
            <div style={{ textAlign: "center", padding: 24, color: "var(--ink-3)", fontSize: 13 }}>Memuatkan...</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: 24, color: "var(--ink-3)", fontSize: 13 }}>Tiada institusi dijumpai.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {filtered.map((s) => (
                <button
                  key={s.slug}
                  className="btn"
                  onClick={() => onSelect(s.slug)}
                  style={{ justifyContent: "flex-start", gap: 14, padding: "12px 16px", textAlign: "left" }}
                >
                  <span style={{ width: 36, height: 36, borderRadius: 10, background: "var(--accent-soft)", color: "var(--accent-deep)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                    <Icon name="school" size={18} />
                  </span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: "block", fontWeight: 700, fontSize: 14 }}>{s.name}</span>
                    {s.city && <span style={{ display: "block", fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>{s.city}</span>}
                  </span>
                  <Icon name="arrowR" size={15} style={{ color: "var(--ink-3)", flexShrink: 0 }} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MainAppContent() {
  const [t, setTweak] = useTweaks();
  const [persona, setPersona] = useState("parent");
  const isMobile = useIsMobile();

  // --- Dynamic Application States ---
  const [activeStudentId, setActiveStudentId] = useState(null); // Parent flow active kid
  
  // Teacher Flow States
  const [teacherSession, setTeacherSession] = useState(null);
  const [teacherSelectedStudent, setTeacherSelectedStudent] = useState(null);
  const [teacherView, setTeacherView] = useState("murid"); // 'murid' | 'tasmik' | 'kohort'
  const [teacherUpdateCellPage, setTeacherUpdateCellPage] = useState(null);

  // Admin Flow States
  const [adminSession, setAdminSession] = useState(null);
  const [adminView, setAdminView] = useState("dash"); // 'dash' | 'pelajar' | 'guru' | 'profil'

  // Platform Owner States
  const [ownerSession, setOwnerSession] = useState(null);

  // Parent school selection
  const [selectedSchoolSlug, setSelectedSchoolSlug] = useState(null);

  // General Database Triggers to reload lists
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [school, setSchool] = useState({ name: "Maahad Tahfiz Al-Furqan" });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = () => setRefreshTrigger(prev => prev + 1);

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

  // Fetch basic lists
  useEffect(() => {
    async function load() {
      const sch = await SchoolRepository.getProfile();
      const [studs, tea, targets] = await Promise.all([
        StudentRepository.listAll(sch.slug),
        TeacherRepository.listAll(sch.slug),
        targetRepository.listAll(),
      ]);

      const targetMap = {};
      targets.forEach((t) => { targetMap[t.studentId] = t.pagesPerMonth; });

      const resolvedStuds = studs.map((st) => {
        const grid = MaqraGridService.buildGrid(st);
        return {
          ...st,
          target: targetMap[st.id] ?? 15,
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

  const path = useMemo(() => {
    if (persona === "parent") return activeStudentId ? `/parent/${activeStudentId.toLowerCase()}` : "";
    if (persona === "teacher") {
      if (!teacherSession) return "/teacher/login";
      if (teacherSelectedStudent) return `/teacher/student/${teacherSelectedStudent.id.toLowerCase()}`;
      return `/teacher/${teacherView}`;
    }
    if (persona === "admin") return adminSession ? `/admin/${adminView}` : "/admin/login";
    if (persona === "owner") return ownerSession ? "/owner/dashboard" : "/owner/login";
    return "";
  }, [persona, activeStudentId, teacherSession, teacherSelectedStudent, teacherView, adminSession, adminView, ownerSession]);

  const columns = isMobile ? 13 : (DENSITY[t.density] || 20);

  // Handle cell tasmik save inside Teacher dashboard
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
        } : null,
        school.slug
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

  const logoutAll = () => {
    authService.logout();
    setTeacherSession(null);
    setTeacherSelectedStudent(null);
    setAdminSession(null);
    setOwnerSession(null);
    setActiveStudentId(null);
  };

  const navAdmin = [
    { section: "Admin Pentadbir" },
    { key: "dash", label: "Dashboard Utama", icon: "home" },
    { key: "pelajar", label: "Pengurusan Pelajar", icon: "users" },
    { key: "guru", label: "Pengurusan Guru", icon: "cap" },
    { key: "profil", label: "Konfigurasi Maahad", icon: "settings" }
  ];

  return (
    <div className="app">
      <Chrome persona={persona} setPersona={(p) => { setPersona(p); logoutAll(); }} path={path} schoolName={school.name} slug={school.slug} />
      
      <div className="viewport scroll">
        <ErrorBoundary flowKey={persona}>
          
          {/* ==============================================
              1. PERSONA: PARENT FLOW
              ============================================== */}
          {persona === "parent" && (
            activeStudentId ? (
              <ParentDashboard
                studentId={activeStudentId}
                columns={columns}
                onLogout={() => { setActiveStudentId(null); setSelectedSchoolSlug(null); }}
              />
            ) : selectedSchoolSlug ? (
              <SchoolLanding
                slug={selectedSchoolSlug}
                onBack={() => setSelectedSchoolSlug(null)}
                onEnterLookup={async (id) => {
                  const s = await StudentRepository.getById(id);
                  if (s) {
                    setActiveStudentId(s.id);
                    return s;
                  }
                  return null;
                }}
              />
            ) : (
              <SchoolPicker onSelect={setSelectedSchoolSlug} />
            )
          )}

          {/* ==============================================
              2. PERSONA: TEACHER FLOW
              ============================================== */}
          {persona === "teacher" && (
            !teacherSession ? (
              <TeacherLogin
                role="teacher"
                slug={school.slug || "al-furqan"}
                defaultEmail="aisyah@alfurqan.edu.my"
                onLoginSuccess={(session) => setTeacherSession(session)} 
              />
            ) : teacherSelectedStudent ? (
              <div className="shell" style={{ minHeight: "100vh" }}>
                <main className="main" style={{ padding: "20px 24px" }}>
                  <StudentDashboard
                    st={students.find(s => s.id === teacherSelectedStudent.id) || teacherSelectedStudent}
                    school={school}
                    columns={columns}
                    onBack={() => setTeacherSelectedStudent(null)}
                    onCellClick={(page) => setTeacherUpdateCellPage(page)}
                    onTargetChange={() => triggerRefresh()}
                    history={students.find(s => s.id === teacherSelectedStudent.id)?.history || []}
                  />
                </main>
                
                {/* Tasmik modal updates popover */}
                {teacherUpdateCellPage && (
                  <UpdateModal 
                    student={teacherSelectedStudent}
                    page={teacherUpdateCellPage}
                    onSave={handleTeacherTasmikSave}
                    onClose={() => setTeacherUpdateCellPage(null)}
                  />
                )}
              </div>
            ) : (
              <div className="shell">
                <SidebarWrapper 
                  roleIcon="cap" 
                  roleTitle={teacherSession.name} 
                  roleSub={`Guru · ${teacherSession.kelas}`}
                  footerNote={school.name}
                  active={teacherView}
                  onNav={setTeacherView}
                  onLogout={() => setTeacherSession(null)}
                  items={[
                    { section: "Bimbingan Guru" },
                    { key: "murid", label: "Senarai Pelajar", icon: "users" },
                    { key: "tasmik", label: "Tasmik Hari Ini", icon: "flame" },
                    { key: "kohort", label: "Peta Hafazan Kelas", icon: "grid" }
                  ]}
                />
                <main className="main">
                  <div className="main-wide">
                    {teacherView === "murid" && (
                      <StudentList
                        students={students}
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
                        schoolName={school.name}
                      />
                    )}
                    {teacherView === "tasmik" && (
                      <TasmikQueue
                        schoolSlug={school.slug}
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
                      />
                    )}
                    {teacherView === "kohort" && (
                      <ClassView
                        schoolSlug={school.slug}
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
                      />
                    )}
                  </div>
                </main>
              </div>
            )
          )}

          {/* ==============================================
              3. PERSONA: ADMIN FLOW
              ============================================== */}
          {persona === "admin" && (
            !adminSession ? (
              <TeacherLogin
                role="admin"
                slug={school.slug || "al-furqan"}
                defaultEmail="admin@alfurqan.edu.my"
                onLoginSuccess={(session) => setAdminSession(session)} 
              />
            ) : (
              <div className="shell">
                <SidebarWrapper 
                  roleIcon="shield" 
                  roleTitle="Admin Pentadbir" 
                  roleSub={adminSession.name} 
                  footerNote={school.name}
                  active={adminView}
                  onNav={setAdminView}
                  onLogout={() => setAdminSession(null)}
                  items={navAdmin}
                />
                <main className="main">
                  <div className="main-wide">
                    {adminView === "dash" && (
                      <SekolahDashboard
                        schoolSlug={school.slug}
                        onOpenStudent={() => {
                          alert("Pemerhatian data. Buka mod Guru untuk menyemak/tasmik terus!");
                        }}
                      />
                    )}
                    {adminView === "pelajar" && (
                      <StudentManagement
                        students={students}
                        schoolSlug={school.slug}
                        onRefresh={triggerRefresh}
                      />
                    )}
                    {adminView === "guru" && (
                      <TeacherManagement
                        teachers={teachers}
                        schoolSlug={school.slug}
                        onRefresh={triggerRefresh}
                      />
                    )}
                    {adminView === "profil" && <SchoolEditor />}
                  </div>
                </main>
              </div>
            )
          )}

          {/* ==============================================
              4. PERSONA: PLATFORM OWNER (SUPER ADMIN)
              ============================================== */}
          {persona === "owner" && (
            !ownerSession ? (
              <TeacherLogin 
                role="superadmin" 
                slug="platform"
                defaultEmail="owner@maqra.app"
                onLoginSuccess={(session) => setOwnerSession(session)} 
              />
            ) : (
              <div className="shell">
                <SidebarWrapper 
                  roleIcon="globe" 
                  roleTitle="Platform Owner" 
                  roleSub={ownerSession.name}
                  footerNote="maqra.app"
                  active="super"
                  onNav={() => {}}
                  onLogout={() => setOwnerSession(null)}
                  items={[{ section: "SaaS Cockpit" }, { key: "super", label: "Sistem Platform", icon: "globe" }]}
                />
                <main className="main">
                  <div className="main-wide">
                    <SuperAdminDashboard />
                  </div>
                </main>
              </div>
            )
          )}

        </ErrorBoundary>
      </div>

      {/* Persistent floating personalizer panel */}
      <TweaksPanel title="Personalizer Reka Bentuk">
        <TweakSection label="Aksen & Warna" />
        <TweakColor 
          label="Aksen Utama" 
          value={t.accent}
          options={Object.keys(ACCENTS)} 
          onChange={(v) => setTweak("accent", v)} 
        />
        <TweakToggle 
          label="Mod Gelap Skema" 
          value={t.dark} 
          onChange={(v) => setTweak("dark", v)} 
        />
        <TweakSection label="Tipografi Sistem" />
        <TweakSelect 
          label="Muka Fon UI" 
          value={t.font}
          options={Object.keys(FONTS)} 
          onChange={(v) => setTweak("font", v)} 
        />
        <TweakSection label="Kepadatan Grid 604" />
        <TweakRadio 
          label="Kepadatan Sel" 
          value={t.density}
          options={["padat", "sederhana", "lapang"]} 
          onChange={(v) => setTweak("density", v)} 
        />
        <div style={{ fontSize: 11, color: "var(--ink-3)", padding: "4px 2px 0", lineHeight: 1.4 }}>
          {columns} petak baris
        </div>
      </TweaksPanel>
    </div>
  );
}

// Sidebar modular wrap safely importing custom roles
function SidebarWrapper({ roleIcon, roleTitle, roleSub, items, active, onNav, onLogout, footerNote }) {
  return (
    <div style={{ flex: "none", width: 248, position: "sticky", top: 0, height: "100vh", background: "var(--surface)" }}>
      <div 
        style={{
          display: "flex", flexDirection: "column", gap: 20, padding: 18, 
          height: "100%", borderRight: "1px solid var(--line)"
        }}
      >
        <Wordmark size={18} />
        <div className="role-card">
          <span className="ic" style={{ color: "var(--accent)" }}><Icon name={roleIcon} size={18} /></span>
          <div>
            <div className="t" style={{ fontWeight: 700, fontSize: 13.5 }}>{roleTitle}</div>
            <div className="s" style={{ fontSize: 11.5, color: "var(--ink-3)" }}>{roleSub}</div>
          </div>
        </div>
        <nav className="nav" style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
          {items.map((it, idx) => it.section ? (
            <div className="lbl" key={"s" + idx} style={{ fontSize: 10, fontWeight: 750, color: "var(--ink-3)", margin: "8px 0 2px" }}>
              {it.section}
            </div>
          ) : (
            <button 
              key={it.key} 
              className={active === it.key ? "on" : ""} 
              onClick={() => onNav(it.key)}
              style={{
                display: "flex", alignItems: "center", gap: 10, background: active === it.key ? "var(--accent-soft)" : "transparent",
                color: active === it.key ? "var(--accent-deep)" : "var(--ink-2)", border: "none", width: "100%",
                padding: "8px 10px", borderRadius: 8, fontSize: 13.5, fontWeight: 650, textAlign: "left"
              }}
            >
              <Icon name={it.icon} size={16} /> {it.label}
            </button>
          ))}
          <div style={{ flex: 1 }} />
          {footerNote && <div style={{ fontSize: 11, color: "var(--ink-3)", padding: "4px 8px" }}>{footerNote}</div>}
          <button 
            onClick={onLogout}
            style={{
              display: "flex", alignItems: "center", gap: 10, background: "transparent",
              color: "var(--gr-sederhana)", border: "none", width: "100%", borderTop: "1px solid var(--line)",
              padding: "12px 10px 4px", borderRadius: 0, fontSize: 13.5, fontWeight: 700, textAlign: "left"
            }}
          >
            <Icon name="logout" size={16} /> Log Keluar
          </button>
        </nav>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ResponsiveProvider>
      <TweaksProvider>
        <MainAppContent />
      </TweaksProvider>
    </ResponsiveProvider>
  );
}
