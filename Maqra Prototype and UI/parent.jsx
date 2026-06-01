/* ===========================================================================
   Maqra — Parent flow (public page, ID entry, dashboard, sub-pages)
   =========================================================================== */

/* ---------- public school landing ---------- */
function PublicSchoolPage({ school, onEnter, columnsSample }) {
  const [sid, setSid] = useState("");
  const [err, setErr] = useState("");
  const submit = (e) => {
    if (e) e.preventDefault();
    const found = MAQRA.students.find((s) => s.id.toLowerCase() === sid.trim().toLowerCase());
    if (!found) { setErr("ID Pelajar tidak dijumpai. Cuba STU00123."); return; }
    onEnter(found);
  };
  return (
    <div className="scroll" style={{ maxWidth: 1080, margin: "0 auto", padding: "44px 28px 70px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
        <Wordmark />
        <span className="badge"><Icon name="pin" size={13} /> Kajang, Selangor</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.35fr 1fr", gap: 28, alignItems: "start" }}>
        <div className="animate-up">
          <span className="badge badge-ok" style={{ marginBottom: 16 }}><Icon name="cap" size={13} /> Program Tahfiz 30 Juzuk</span>
          <h1 style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.08, margin: "0 0 16px" }}>{school.name}</h1>
          <p style={{ fontSize: 16, color: "var(--ink-2)", lineHeight: 1.65, maxWidth: 540, margin: "0 0 24px" }}>{school.description}</p>
          <div style={{ display: "flex", gap: 26, marginBottom: 30, flexWrap: "wrap" }}>
            {[["Tahun ditubuhkan", school.founded], ["Pelajar berdaftar", school.enrolled + " orang"], ["Tenaga pengajar", school.teachers.length + " ustaz/ah"]].map(([k, v]) => (
              <div key={k}>
                <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", whiteSpace: "nowrap" }}>{v}</div>
                <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 2 }}>{k}</div>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: 22 }}>
            <h3 style={{ margin: "0 0 4px", fontSize: 17, fontWeight: 800 }}>Semak Progres Anak</h3>
            <p style={{ margin: "0 0 16px", color: "var(--ink-3)", fontSize: 13.5 }}>Masukkan ID Pelajar anak anda untuk melihat perkembangan hafazan.</p>
            <form onSubmit={submit} style={{ display: "flex", gap: 10 }}>
              <div className="search" style={{ flex: 1 }}>
                <span className="ic"><Icon name="user" size={17} /></span>
                <input value={sid} onChange={(e) => { setSid(e.target.value); setErr(""); }} placeholder="cth. STU00123" autoFocus />
              </div>
              <button type="button" onClick={submit} className="btn btn-primary">Semak <Icon name="arrowR" size={16} /></button>
            </form>
            {err && <div style={{ color: "var(--gr-sederhana)", fontSize: 12.5, marginTop: 10, fontWeight: 600 }}>{err}</div>}
            <div style={{ marginTop: 14, fontSize: 12, color: "var(--ink-3)" }}>
              ID contoh: <button className="mono" onClick={() => setSid("STU00123")} style={{ border: "none", background: "var(--surface-2)", padding: "2px 7px", borderRadius: 6, color: "var(--accent-deep)", fontWeight: 700 }}>STU00123</button>
            </div>
          </div>
        </div>

        {/* donation card */}
        <div className="card animate-up" style={{ padding: 24, position: "sticky", top: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 4 }}>
            <Icon name="award" size={18} style={{ color: "var(--accent)" }} />
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>Sumbangan & Wakaf</h3>
          </div>
          <p style={{ margin: "0 0 18px", fontSize: 13, color: "var(--ink-3)", lineHeight: 1.55 }}>Imbas kod QR untuk menyumbang kepada dana operasi maahad.</p>
          <div style={{ display: "grid", placeItems: "center", padding: 16, background: "var(--surface-2)", borderRadius: 14, border: "1px solid var(--line)" }}>
            <FauxQR size={150} seed={4} />
          </div>
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 9 }}>
            {[["Bank", "Maybank Islamic"], ["No. Akaun", "5621 0098 4412"], ["Nama", "Maahad Tahfiz Al-Furqan"]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span style={{ color: "var(--ink-3)" }}>{k}</span>
                <span className={k === "No. Akaun" ? "mono" : ""} style={{ fontWeight: 700 }}>{v}</span>
              </div>
            ))}
          </div>
          <button className="btn" style={{ width: "100%", justifyContent: "center", marginTop: 18 }}><Icon name="copy" size={15} /> Salin maklumat bank</button>
        </div>
      </div>

      <div style={{ marginTop: 26, display: "flex", gap: 18, color: "var(--ink-3)", fontSize: 13, flexWrap: "wrap" }}>
        <span style={{ display: "inline-flex", gap: 7, alignItems: "center" }}><Icon name="pin" size={15} /> {school.address}</span>
        <span style={{ display: "inline-flex", gap: 7, alignItems: "center" }}><Icon name="phone" size={15} /> {school.phone}</span>
        <span style={{ display: "inline-flex", gap: 7, alignItems: "center" }}><Icon name="mail" size={15} /> {school.email}</span>
      </div>

      {school.announcements && school.announcements.length > 0 && (
        <div style={{ marginTop: 34 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 16 }}>
            <Icon name="megaphone" size={18} style={{ color: "var(--accent)" }} />
            <h2 style={{ margin: 0, fontSize: 19, fontWeight: 800, letterSpacing: "-0.01em" }}>Pengumuman</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
            {school.announcements.map((an) => (
              <div key={an.id} className="card" style={{ padding: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 9 }}>
                  <span className="badge badge-ok">{an.tag}</span>
                  <span className="mono" style={{ fontSize: 11.5, color: "var(--ink-3)" }}>{an.date}</span>
                </div>
                <h3 style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 800, lineHeight: 1.3 }}>{an.title}</h3>
                <p style={{ margin: 0, fontSize: 13, color: "var(--ink-3)", lineHeight: 1.55 }}>{an.body}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- history list (right rail + full page) ---------- */
function HistoryItem({ h }) {
  return (
    <div style={{ position: "relative", paddingLeft: 16 }}>
      <span style={{ position: "absolute", left: 0, top: 5, bottom: 5, width: 3, borderRadius: 9, background: "var(--accent)", opacity: 0.5 }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 5 }}>
        <span className="mono" style={{ fontSize: 12, color: "var(--ink-3)" }}>{MAQRA.fmtDate(h.date)}</span>
        <span className="badge" style={{ fontSize: 11 }}>{h.kategori}</span>
      </div>
      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Muka surat {h.from}–{h.to} <span style={{ color: "var(--ink-3)", fontWeight: 500 }}>· Juz {h.juzuk}</span></div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <span style={{ fontSize: 12.5, color: "var(--ink-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{h.ulasan}</span>
        <GredBadge g={h.gred} />
      </div>
    </div>
  );
}

function RujukanCard() {
  return (
    <div className="card" style={{ padding: 20 }}>
      <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 800 }}>Rujukan</h3>
      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 9 }}>Skala Gred</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 16 }}>
        {MAQRA.GRED.map((g) => <GredBadge key={g.key} g={g.key} />)}
      </div>
      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 9 }}>Kategori Bacaan</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {MAQRA.KATEGORI.map((k) => <span key={k} className="badge" style={{ fontSize: 11.5 }}>{k}</span>)}
      </div>
    </div>
  );
}

/* ---------- profile header card ---------- */
function ProfileCard({ st, school }) {
  return (
    <div className="card" style={{ padding: 22, display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
      <Avatar name={st.name} sex={st.sex} size={68} ring />
      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", rowGap: 8 }}>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em" }}>{st.name}</h2>
          <span className="badge badge-ok" style={{ flex: "none" }}><span className="dot" style={{ background: "var(--accent)" }} /> Aktif</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
          <span style={{ fontSize: 13, color: "var(--ink-3)" }}>ID Pelajar</span>
          <span className="mono" style={{ background: "var(--surface-2)", border: "1px solid var(--line)", padding: "3px 9px", borderRadius: 7, fontSize: 12.5, fontWeight: 700 }}>{st.id}</span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {[["user", "Umur", st.umur + " Tahun"], ["cap", "Kelas", st.kelas], ["school", "Sekolah", school.name]].map(([ic, k, v]) => (
          <div key={k} style={{ background: "var(--surface-2)", border: "1px solid var(--line)", borderRadius: 12, padding: "10px 14px", minWidth: 120 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--ink-3)", fontSize: 11.5, fontWeight: 600, marginBottom: 4 }}><Icon name={ic} size={14} />{k}</div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- parent dashboard ---------- */
function ParentDashboard({ st, school, columns, onCell, onOpenAnalitik, onSijil }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 348px", gap: 22, alignItems: "start" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 22, minWidth: 0 }}>
        <ProfileCard st={st} school={school} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          <StatCard icon="book" label="Juzuk Semasa" value={"Juz " + st.juzuk} sub={"Surah " + st.surah} />
          <StatCard icon="check" label="Hafazan Terakhir" value={st.lastHafazan} sub={st.lastHafazanSurah} tone="hafazan" />
          <StatCard icon="eye" label="Bacaan Semasa" value={st.frontier} sub={st.surah} tone="bacaan" />
          <StatCard icon="award" label="Jumlah Progres" value={st.progress + "%"} sub={st.frontier + " / 604 m.s."} tone="murajaah" />
        </div>

        <div className="card" style={{ padding: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800 }}>Grid Progres Maqra'</h3>
              <p style={{ margin: "3px 0 0", fontSize: 12.5, color: "var(--ink-3)" }}>604 muka surat · klik mana-mana sel untuk perincian</p>
            </div>
            <span className="badge"><Icon name="info" size={13} /> Petunjuk warna di bawah</span>
          </div>
          <div style={{ marginBottom: 16 }}><Legend /></div>
          <PageGrid statusMap={st.status} columns={columns} onCellClick={onCell} />
          <hr className="divider" style={{ margin: "18px 0 14px" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12.5, color: "var(--ink-3)" }}>
            <span>Kemas kini terakhir: {MAQRA.fmtDate(st.history[0].date)} · {st.history[0].guru}</span>
            <span className="mono">{st.frontier}/604</span>
          </div>
        </div>
      </div>

      {/* right rail */}
      <div style={{ display: "flex", flexDirection: "column", gap: 22, position: "sticky", top: 0 }}>
        <KhatamMini st={st} onOpen={onOpenAnalitik} />
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>Log Terkini</h3>
            <span className="mono" style={{ fontSize: 12, color: "var(--ink-3)" }}>{st.history.length} rekod</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {st.history.slice(0, 5).map((h) => <HistoryItem key={h.id} h={h} />)}
          </div>
        </div>
        <SijilCard st={st} onOpen={onSijil} />
        <RujukanCard />
      </div>
    </div>
  );
}

/* ---------- cell detail popover (parent, read-only) ---------- */
function CellDetail({ st, page, onClose }) {
  const s = st.status[page];
  const stt = MAQRA.STATUS_MAP[s];
  const rec = st.history.find((h) => page >= h.from && page <= h.to);
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <h3>Muka Surat {page}</h3>
            <p>Surah {MAQRA.surahOf(page)} · Juzuk {MAQRA.juzukOf(page)}</p>
          </div>
          <button className="iconbtn" onClick={onClose}><Icon name="x" size={18} /></button>
        </div>
        <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ color: "var(--ink-3)", fontSize: 13 }}>Status hafazan</span>
            <StatusChip s={s} />
          </div>
          {rec ? (
            <div style={{ background: "var(--surface-2)", border: "1px solid var(--line)", borderRadius: 12, padding: 14, display: "flex", flexDirection: "column", gap: 9 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="mono" style={{ fontSize: 12, color: "var(--ink-3)" }}>{MAQRA.fmtDate(rec.date)}</span>
                <GredBadge g={rec.gred} />
              </div>
              <Row k="Kategori" v={rec.kategori} />
              <Row k="Ulasan" v={rec.ulasan} />
              {rec.masalah !== "—" && <Row k="Masalah" v={rec.masalah} />}
              <Row k="Cadangan" v={rec.cadangan} />
              <Row k="Guru" v={rec.guru} />
            </div>
          ) : (
            <div className="empty" style={{ padding: "26px 10px" }}>
              <Icon name="info" size={26} /><div style={{ marginTop: 6, fontSize: 13 }}>Belum ada rekod tasmik untuk muka surat ini.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
function Row({ k, v }) {
  return (
    <div style={{ display: "flex", gap: 12, fontSize: 13 }}>
      <span style={{ color: "var(--ink-3)", width: 78, flex: "none" }}>{k}</span>
      <span style={{ fontWeight: 600, color: "var(--ink)" }}>{v}</span>
    </div>
  );
}

/* ---------- sub-page: full progress grid ---------- */
function ParentGridPage({ st, columns, onCell }) {
  const [filter, setFilter] = useState(null);
  const filtered = useMemo(() => {
    if (!filter) return st.status;
    const m = {};
    for (let p = 1; p <= 604; p++) m[p] = st.status[p] === filter ? st.status[p] : "belum";
    return m;
  }, [filter, st]);
  return (
    <div className="card" style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 18 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
          <button className="chip" onClick={() => setFilter(null)} style={{ borderColor: !filter ? "var(--accent)" : "var(--line)", color: !filter ? "var(--accent-deep)" : "var(--ink-2)", fontWeight: 700 }}>Semua</button>
          {MAQRA.STATUS.filter((s) => s.key !== "belum").map((s) => (
            <button key={s.key} className="chip" onClick={() => setFilter(filter === s.key ? null : s.key)}
              style={{ borderColor: filter === s.key ? `var(--st-${s.css}-ink)` : "var(--line)" }}>
              <span className="dot" style={{ background: `var(--st-${s.css}-ink)` }} />{s.label}
              <span className="mono" style={{ opacity: 0.6, fontSize: 11 }}>{st.tally[s.key]}</span>
            </button>
          ))}
        </div>
      </div>
      <PageGrid statusMap={filtered} columns={columns} onCellClick={onCell} />
    </div>
  );
}

/* ---------- sub-page: full history table ---------- */
function ParentHistoryPage({ st }) {
  const [sort, setSort] = useState("date");
  const rows = useMemo(() => [...st.history].sort((a, b) => sort === "date" ? b.date - a.date : b.to - a.to), [sort, st]);
  return (
    <div className="card" style={{ overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--line)" }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>Log Progres Penuh</h3>
        <div className="persona" style={{ background: "var(--surface-2)" }}>
          <button className={sort === "date" ? "on" : ""} onClick={() => setSort("date")}>Tarikh</button>
          <button className={sort === "page" ? "on" : ""} onClick={() => setSort("page")}>Muka Surat</button>
        </div>
      </div>
      <div className="scroll" style={{ overflowX: "auto" }}>
        <table className="tbl" style={{ minWidth: 880 }}>
          <thead><tr>
            <th>Tarikh</th><th>Muka Surat</th><th>Juz</th><th>Kategori</th><th>Gred</th><th>Ulasan</th><th>Masalah</th><th>Guru</th>
          </tr></thead>
          <tbody>
            {rows.map((h) => (
              <tr key={h.id}>
                <td className="mono" style={{ whiteSpace: "nowrap" }}>{MAQRA.fmtDate(h.date)}</td>
                <td className="mono" style={{ whiteSpace: "nowrap", fontWeight: 600 }}>{h.from}–{h.to}</td>
                <td className="mono">{h.juzuk}</td>
                <td><span className="badge" style={{ fontSize: 11.5 }}>{h.kategori}</span></td>
                <td><GredBadge g={h.gred} /></td>
                <td style={{ color: "var(--ink-2)" }}>{h.ulasan}</td>
                <td style={{ color: "var(--ink-3)" }}>{h.masalah}</td>
                <td style={{ whiteSpace: "nowrap" }}>{h.guru}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- parent flow root ---------- */
function ParentFlow({ columns, setPath }) {
  const [student, setStudent] = useState(null);
  const [tab, setTab] = useState("dash");
  const [cell, setCell] = useState(null);
  const [slip, setSlip] = useState(false);
  const [sijil, setSijil] = useState(null);
  const school = MAQRA.school;

  useEffect(() => {
    if (!student) setPath("");
    else setPath("/" + student.id.toLowerCase() + (tab === "dash" ? "" : "/" + tab));
  }, [student, tab]);

  if (!student) return <PublicSchoolPage school={school} onEnter={(s) => { setStudent(s); setTab("dash"); }} />;

  const nav = [
    { section: "Menu" },
    { key: "dash", label: "Dashboard", icon: "home" },
    { key: "analitik", label: "Analitik", icon: "sparkle" },
    { key: "profil", label: "Profil Anak", icon: "user" },
    { key: "grid", label: "Progress Grid", icon: "grid" },
    { key: "log", label: "History Log", icon: "clock" },
  ];

  return (
    <div className="shell">
      <Sidebar roleIcon="users" roleTitle="Ibu Bapa" roleSub="Akses lihat sahaja" items={nav}
        active={tab} onNav={setTab} onLogout={() => setStudent(null)}
        footerNote={"Dipaparkan untuk " + student.name.split(" ").slice(0, 2).join(" ")} />
      <main className="main"><div className="main-wide">
        <div className="pagehead">
          <div>
            <h1>{nav.find((n) => n.key === tab).label}</h1>
            <p>{school.name} · {student.name}</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn" onClick={() => setSlip(true)}><Icon name="print" size={15} /> Cetak Slip</button>
            {tab !== "dash" && <button className="btn" onClick={() => setTab("dash")}><Icon name="home" size={15} /> Ke Dashboard</button>}
          </div>
        </div>
        {tab === "dash" && <ParentDashboard st={student} school={school} columns={columns} onCell={setCell} onOpenAnalitik={() => setTab("analitik")} onSijil={setSijil} />}
        {tab === "analitik" && <Analitik st={student} />}
        {tab === "profil" && <ParentProfile st={student} school={school} onSijil={setSijil} />}
        {tab === "grid" && <ParentGridPage st={student} columns={columns} onCell={setCell} />}
        {tab === "log" && <ParentHistoryPage st={student} />}
      </div></main>
      {cell && <CellDetail st={student} page={cell} onClose={() => setCell(null)} />}
      {slip && <SlipPrestasi st={student} school={school} onClose={() => setSlip(false)} />}
      {sijil && <SijilCertificate st={student} target={sijil} school={school} onClose={() => setSijil(null)} />}
    </div>
  );
}

/* ---------- sub-page: profile ---------- */
function ParentProfile({ st, school, onSijil }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 22, alignItems: "start" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <ProfileCard st={st} school={school} />
        <div className="card" style={{ padding: 22 }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 800 }}>Taburan Status Hafazan</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            {MAQRA.STATUS.filter((s) => st.tally[s.key] > 0).map((s) => (
              <div key={s.key} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ width: 110, flex: "none", display: "flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 600 }}>
                  <StatusDot s={s.key} />{s.label}
                </span>
                <div style={{ flex: 1 }}><Bar value={(st.tally[s.key] / 604) * 100} tone={`var(--st-${s.css}-ink)`} /></div>
                <span className="mono" style={{ width: 40, textAlign: "right", fontSize: 12.5, color: "var(--ink-2)" }}>{st.tally[s.key]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 800 }}>Maklumat Pelajar</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Row k="Nama" v={st.name} />
            <Row k="ID Pelajar" v={st.id} />
            <Row k="Kelas" v={st.kelas} />
            <Row k="Umur" v={st.umur + " Tahun"} />
            <Row k="No. Ibu Bapa" v={st.parent} />
            <Row k="Tarikh Daftar" v={st.enroll} />
          </div>
        </div>
        <SijilCard st={st} onOpen={onSijil} />
        <RujukanCard />
      </div>
    </div>
  );
}

Object.assign(window, { ParentFlow, PublicSchoolPage });
