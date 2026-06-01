/* ===========================================================================
   Maqra — Super Admin / Pemilik Platform (multi-tenant owner view)
   =========================================================================== */

const PLAN_STYLE = {
  "Premium":   { bg: "color-mix(in oklch, var(--gr-mumtaz) 13%, var(--surface))", fg: "var(--gr-mumtaz)" },
  "Asas":      { bg: "var(--accent-soft)", fg: "var(--accent-deep)" },
  "Percubaan": { bg: "var(--st-murajaah-fill)", fg: "var(--st-murajaah-ink)" },
};
const STATUS_STYLE = {
  "aktif":       { bg: "var(--st-hafazan-fill)", fg: "var(--st-hafazan-ink)" },
  "percubaan":   { bg: "var(--st-murajaah-fill)", fg: "var(--st-murajaah-ink)" },
  "tidak aktif": { bg: "var(--st-belum-fill)", fg: "var(--st-belum-ink)" },
};

function OwnerDashboard({ schools }) {
  const [q, setQ] = useState("");
  const [plan, setPlan] = useState("semua");

  const totStudents = schools.reduce((a, s) => a + s.students, 0);
  const totTeachers = schools.reduce((a, s) => a + s.teachers, 0);
  const active = schools.filter((s) => s.status === "aktif").length;
  const avgProg = Math.round(schools.reduce((a, s) => a + s.avgProg * s.students, 0) / Math.max(totStudents, 1) * 10) / 10;
  const byPlan = ["Premium", "Asas", "Percubaan"].map((p) => ({ plan: p, n: schools.filter((s) => s.plan === p).length }));

  const filtered = schools
    .filter((s) => (plan === "semua" || s.plan === plan))
    .filter((s) => (s.name + s.city).toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => b.students - a.students);
  const maxStudents = Math.max(...schools.map((s) => s.students), 1);

  return (
    <>
      <div className="pagehead">
        <div><h1>Platform Maqra'</h1><p>Pandangan pemilik · {schools.length} maahad berdaftar</p></div>
        <span className="badge badge-ok"><Icon name="globe" size={13} /> Semua wilayah</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 22 }}>
        <StatCard icon="school" label="Maahad Aktif" value={`${active}/${schools.length}`} sub="berlangganan aktif" />
        <StatCard icon="users" label="Jumlah Pelajar" value={totStudents.toLocaleString()} sub="seluruh platform" tone="hafazan" />
        <StatCard icon="cap" label="Tenaga Pengajar" value={totTeachers} sub="merentas semua maahad" tone="bacaan" />
        <StatCard icon="award" label="Purata Progres" value={avgProg + "%"} sub="berwajaran pelajar" tone="murajaah" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 22, alignItems: "start", marginBottom: 22 }}>
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, borderBottom: "1px solid var(--line)", flexWrap: "wrap" }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>Senarai Maahad</h3>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <div className="search" style={{ padding: "7px 11px" }}>
                <span className="ic"><Icon name="search" size={15} /></span>
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari maahad…" style={{ width: 150 }} />
              </div>
              <div className="persona" style={{ background: "var(--surface-2)" }}>
                {["semua", "Premium", "Asas", "Percubaan"].map((p) => (
                  <button key={p} className={plan === p ? "on" : ""} onClick={() => setPlan(p)}>{p === "semua" ? "Semua" : p}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="scroll" style={{ overflowX: "auto" }}>
            <table className="tbl" style={{ minWidth: 720 }}>
              <thead><tr><th>Maahad</th><th>Pelajar</th><th>Guru</th><th style={{ minWidth: 150 }}>Purata Progres</th><th>Pelan</th><th>Status</th></tr></thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.slug}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{s.name}</div>
                      <div className="mono" style={{ fontSize: 11.5, color: "var(--ink-3)" }}>{s.city} · sejak {s.since}</div>
                    </td>
                    <td className="mono" style={{ fontWeight: 700 }}>{s.students}</td>
                    <td className="mono" style={{ color: "var(--ink-2)" }}>{s.teachers}</td>
                    <td><div style={{ display: "flex", alignItems: "center", gap: 9 }}><div style={{ flex: 1 }}><Bar value={s.avgProg} /></div><span className="mono" style={{ fontSize: 12, color: "var(--ink-3)", width: 42, textAlign: "right" }}>{s.avgProg}%</span></div></td>
                    <td><span className="badge" style={{ background: PLAN_STYLE[s.plan].bg, color: PLAN_STYLE[s.plan].fg, borderColor: "transparent" }}>{s.plan}</span></td>
                    <td><span className="badge" style={{ background: STATUS_STYLE[s.status].bg, color: STATUS_STYLE[s.status].fg, borderColor: "transparent", textTransform: "capitalize" }}><span className="dot" style={{ background: STATUS_STYLE[s.status].fg }} />{s.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <div className="empty"><Icon name="school" size={28} /><div>Tiada maahad sepadan.</div></div>}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div className="card" style={{ padding: 22 }}>
            <h3 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 800 }}>Pelajar Mengikut Maahad</h3>
            <p style={{ margin: "0 0 16px", fontSize: 12.5, color: "var(--ink-3)" }}>Saiz relatif setiap maahad</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              {schools.slice().sort((a, b) => b.students - a.students).map((s) => (
                <div key={s.slug}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
                    <span style={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name.replace(/^(Maahad|Tahfiz|Pusat Tahfiz|Maahad Tahfiz) /, "")}</span>
                    <span className="mono" style={{ color: "var(--ink-3)" }}>{s.students}</span>
                  </div>
                  <Bar value={(s.students / maxStudents) * 100} />
                </div>
              ))}
            </div>
          </div>
          <div className="card" style={{ padding: 22 }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 800 }}>Langganan</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {byPlan.map((p) => (
                <div key={p.plan} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 3, background: PLAN_STYLE[p.plan].fg }} />{p.plan}
                  </span>
                  <span className="mono" style={{ fontWeight: 700 }}>{p.n} maahad</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function SuperAdminFlow({ setPath }) {
  const [authed, setAuthed] = useState(false);
  useEffect(() => { setPath(authed ? "" : "/login"); }, [authed]);

  if (!authed) return <LoginScreen role="owner" slug="platform" defaultEmail="owner@maqra.app" onLogin={() => setAuthed(true)} />;

  const nav = [
    { section: "Pemilik Platform" },
    { key: "maahad", label: "Semua Maahad", icon: "school" },
  ];
  return (
    <div className="shell">
      <Sidebar roleIcon="globe" roleTitle="Pemilik Platform" roleSub="Maqra' SaaS" items={nav}
        active="maahad" onNav={() => {}} onLogout={() => setAuthed(false)} footerNote="Akses semua maahad" />
      <main className="main"><div className="main-wide">
        <OwnerDashboard schools={MAQRA.schools} />
      </div></main>
    </div>
  );
}

Object.assign(window, { SuperAdminFlow, OwnerDashboard });
