/* ===========================================================================
   Maqra — shared login + Teacher flow
   =========================================================================== */

/* ---------- login (shared by teacher & admin) ---------- */
function LoginScreen({ role, slug, defaultEmail, onLogin }) {
  const [email, setEmail] = useState(defaultEmail);
  const [pw, setPw] = useState("tahfiz2026");
  const [loading, setLoading] = useState(false);
  const submit = (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(); }, 650);
  };
  return (
    <div style={{ minHeight: "100%", display: "grid", placeItems: "center", padding: 28 }}>
      <div style={{ width: "100%", maxWidth: 400 }} className="animate-up">
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 22 }}><Wordmark size={24} /></div>
        <div className="card" style={{ padding: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span style={{ width: 36, height: 36, borderRadius: 10, background: "var(--accent-soft)", color: "var(--accent-deep)", display: "grid", placeItems: "center" }}>
              <Icon name={role === "admin" ? "shield" : role === "owner" ? "globe" : "cap"} size={19} />
            </span>
            <div>
              <h2 style={{ margin: 0, fontSize: 19, fontWeight: 800 }}>{role === "admin" ? "Admin Sekolah" : role === "owner" ? "Pemilik Platform" : "Log Masuk Guru"}</h2>
              <p style={{ margin: 0, fontSize: 12.5, color: "var(--ink-3)" }} className="mono">{role === "owner" ? "maqra.app/platform" : "/school/" + slug + "/admin"}</p>
            </div>
          </div>
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 18 }}>
            <div className="field"><label>Emel</label><input className="input" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <div className="field"><label>Kata Laluan</label><input className="input" type="password" value={pw} onChange={(e) => setPw(e.target.value)} /></div>
            <button type="button" onClick={submit} className="btn btn-primary" style={{ justifyContent: "center", marginTop: 4 }} disabled={loading}>
              {loading ? "Memuatkan…" : <>Log Masuk <Icon name="arrowR" size={16} /></>}
            </button>
          </form>
          <div style={{ marginTop: 16, fontSize: 11.5, color: "var(--ink-3)", display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
            <Icon name="lock" size={13} /> Dilindungi RLS · akses terhad ke sekolah anda
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- toast ---------- */
function useToast() {
  const [toast, setToast] = useState(null);
  const show = (msg, tone) => { setToast({ msg, tone }); setTimeout(() => setToast(null), 2600); };
  const node = toast ? (
    <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 90 }} className="animate-up">
      <div style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--ink)", color: "var(--bg)", padding: "11px 18px", borderRadius: 12, boxShadow: "0 18px 44px -14px hsl(var(--shadow-color)/.5)", fontWeight: 600, fontSize: 14 }}>
        <span style={{ color: tone === "ok" ? "var(--st-hafazan-fill)" : "var(--bg)", display: "flex" }}><Icon name="check" size={17} /></span>{toast.msg}
      </div>
    </div>
  ) : null;
  return [node, show];
}

/* ---------- update modal (teacher writes) ---------- */
function UpdateModal({ student, page, onSave, onClose }) {
  const [status, setStatus] = useState(student.status[page] === "belum" ? "bacaan" : student.status[page]);
  const [log, setLog] = useState(true);
  const [kategori, setKategori] = useState(MAQRA.KATEGORI[0]);
  const [gred, setGred] = useState("Jayyid");
  const [ulasan, setUlasan] = useState("");
  const [masalah, setMasalah] = useState("");
  const [cadangan, setCadangan] = useState("");

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <h3>Kemas Kini Muka Surat {page}</h3>
            <p>{student.name.split(" ").slice(0, 2).join(" ")} · Surah {MAQRA.surahOf(page)} · Juz {MAQRA.juzukOf(page)}</p>
          </div>
          <button className="iconbtn" onClick={onClose}><Icon name="x" size={18} /></button>
        </div>
        <div className="modal-body scroll" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <label style={{ fontSize: 12.5, fontWeight: 700, color: "var(--ink-2)", display: "block", marginBottom: 10 }}>Status Hafazan</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
              {MAQRA.STATUS.map((s) => {
                const on = status === s.key;
                return (
                  <button key={s.key} onClick={() => setStatus(s.key)} style={{
                    display: "flex", alignItems: "center", gap: 9, padding: "10px 12px", borderRadius: 10,
                    border: `1.5px solid ${on ? `var(--st-${s.css}-ink)` : "var(--line)"}`,
                    background: on ? `var(--st-${s.css}-fill)` : "var(--surface)",
                    color: on ? `var(--st-${s.css}-ink)` : "var(--ink-2)", fontWeight: 650, fontSize: 13, textAlign: "left",
                  }}>
                    <span className="dot" style={{ width: 10, height: 10, borderRadius: 3, background: `var(--st-${s.css}-ink)`, flex: "none" }} />{s.label}
                  </button>
                );
              })}
            </div>
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 13.5, fontWeight: 650 }}>
            <input type="checkbox" checked={log} onChange={(e) => setLog(e.target.checked)} style={{ width: 17, height: 17, accentColor: "var(--accent)" }} />
            Rekod dalam log progres (tasmik)
          </label>

          {log && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingLeft: 4, borderLeft: "2px solid var(--accent-soft)", marginLeft: 4, paddingLeft: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="field"><label>Kategori</label>
                  <select className="select" value={kategori} onChange={(e) => setKategori(e.target.value)}>{MAQRA.KATEGORI.map((k) => <option key={k}>{k}</option>)}</select>
                </div>
                <div className="field"><label>Gred</label>
                  <select className="select" value={gred} onChange={(e) => setGred(e.target.value)}>{MAQRA.GRED.map((g) => <option key={g.key}>{g.key}</option>)}</select>
                </div>
              </div>
              <div className="field"><label>Ulasan</label><textarea className="textarea" value={ulasan} onChange={(e) => setUlasan(e.target.value)} placeholder="cth. Bacaan lancar, tajwid baik." /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="field"><label>Masalah</label><input className="input" value={masalah} onChange={(e) => setMasalah(e.target.value)} placeholder="(jika ada)" /></div>
                <div className="field"><label>Cadangan</label><input className="input" value={cadangan} onChange={(e) => setCadangan(e.target.value)} placeholder="cth. Ulang 3 kali" /></div>
              </div>
            </div>
          )}
        </div>
        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={onClose}>Batal</button>
          <button className="btn btn-primary" onClick={() => onSave({ status, log, kategori, gred, ulasan, masalah, cadangan })}><Icon name="save" size={15} /> Simpan</button>
        </div>
      </div>
    </div>
  );
}

/* ---------- student row ---------- */
function StudentRow({ st, onOpen }) {
  return (
    <button onClick={onOpen} style={{
      display: "flex", alignItems: "center", gap: 16, width: "100%", textAlign: "left", flexWrap: "wrap",
      background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 14, padding: "14px 18px",
      transition: "border-color .14s, background .14s, transform .06s",
    }}
      onMouseOver={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.background = "var(--surface-2)"; }}
      onMouseOut={(e) => { e.currentTarget.style.borderColor = "var(--line)"; e.currentTarget.style.background = "var(--surface)"; }}>
      <Avatar name={st.name} sex={st.sex} size={46} />
      <div style={{ width: 220, flex: "none" }}>
        <div style={{ fontWeight: 700, fontSize: 14.5 }}>{st.name}</div>
        <div style={{ display: "flex", gap: 8, marginTop: 3, alignItems: "center" }}>
          <span className="mono" style={{ fontSize: 11.5, color: "var(--ink-3)" }}>{st.id}</span>
          <span style={{ fontSize: 11.5, color: "var(--ink-3)" }}>· {st.kelas}</span>
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12.5 }}>
          <span style={{ color: "var(--ink-2)", fontWeight: 600 }}>Juz {st.juzuk} · {st.surah}</span>
          <span className="mono" style={{ color: "var(--ink-3)" }}>{st.progress}%</span>
        </div>
        <Bar value={st.progress} />
      </div>
      <div style={{ width: 100, flex: "none", display: "flex", justifyContent: "flex-end" }}><StatusChip s={lastActive(st)} /></div>
      <Icon name="chevR" size={18} style={{ color: "var(--ink-3)" }} />
    </button>
  );
}
function lastActive(st) {
  // dominant non-belum/non-hafazan recent status near frontier
  const s = st.status[st.frontier] || "bacaan";
  return s === "belum" ? "bacaan" : s;
}

/* ---------- teacher: single student grid view ---------- */
function TeacherStudent({ st, columns, onBack, onCell, onTarget }) {
  return (
    <div>
      <button className="btn btn-ghost btn-sm" onClick={onBack} style={{ marginBottom: 16 }}><Icon name="chevR" size={15} style={{ transform: "rotate(180deg)" }} /> Senarai pelajar</button>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 320px", gap: 22, alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 22, minWidth: 0 }}>
          <ProfileCard st={st} school={MAQRA.school} />
          <div className="card" style={{ padding: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>Grid Progres — klik untuk kemas kini</h3>
                <p style={{ margin: "3px 0 0", fontSize: 12.5, color: "var(--ink-3)" }}>Pilih muka surat untuk mengubah status & merekod tasmik</p>
              </div>
              <span className="badge badge-ok"><Icon name="edit" size={13} /> Mod Guru</span>
            </div>
            <div style={{ marginBottom: 16 }}><Legend /></div>
            <PageGrid statusMap={st.status} columns={columns} onCellClick={onCell} />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22, position: "sticky", top: 0 }}>
          {onTarget && <SasaranEditor st={st} onTarget={onTarget} />}
          <KhatamMini st={st} />
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 800 }}>Log Tasmik</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {st.history.slice(0, 6).map((h) => <HistoryItem key={h.id} h={h} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- per-student target editor (teacher) ---------- */
function SasaranEditor({ st, onTarget }) {
  const v = st.target || 15;
  const step = (d) => onTarget(Math.max(1, Math.min(60, v + d)));
  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <Icon name="award" size={16} style={{ color: "var(--accent)" }} />
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>Sasaran Peribadi</h3>
      </div>
      <p style={{ margin: "0 0 14px", fontSize: 12, color: "var(--ink-3)" }}>Muka surat sasaran setiap bulan untuk pelajar ini</p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <button className="iconbtn" style={{ border: "1px solid var(--line)", width: 38, height: 38 }} onClick={() => step(-1)}><Icon name="x" size={14} style={{ transform: "rotate(45deg)" }} /></button>
        <div style={{ textAlign: "center" }}>
          <div className="mono" style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1 }}>{v}</div>
          <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 3 }}>m.s. / bulan</div>
        </div>
        <button className="iconbtn" style={{ border: "1px solid var(--line)", width: 38, height: 38 }} onClick={() => step(1)}><Icon name="plus" size={15} /></button>
      </div>
      <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
        {[8, 12, 15, 18, 20].map((p) => (
          <button key={p} className="chip" onClick={() => onTarget(p)} style={{ flex: 1, justifyContent: "center", borderColor: v === p ? "var(--accent)" : "var(--line)", color: v === p ? "var(--accent-deep)" : "var(--ink-2)", fontWeight: v === p ? 700 : 600 }}>{p}</button>
        ))}
      </div>
    </div>
  );
}

/* ---------- teacher flow root ---------- */
function TeacherFlow({ columns, setPath }) {
  const [authed, setAuthed] = useState(false);
  const [data, setData] = useState(() => MAQRA.students.map(cloneStudent));
  const [openId, setOpenId] = useState(null);
  const [view, setView] = useState("murid");
  const [q, setQ] = useState("");
  const [cell, setCell] = useState(null);
  const [toast, showToast] = useToast();

  const open = data.find((s) => s.id === openId);

  useEffect(() => {
    if (!authed) setPath("/admin");
    else setPath("/admin/guru/" + view + (open ? "/" + open.id.toLowerCase() : ""));
  }, [authed, openId, view]);

  if (!authed) return <LoginScreen role="teacher" slug={MAQRA.school.slug} defaultEmail="aisyah@alfurqan.edu.my" onLogin={() => setAuthed(true)} />;

  const filtered = data.filter((s) => (s.name + s.id).toLowerCase().includes(q.toLowerCase()));
  const avg = Math.round(data.reduce((a, s) => a + s.progress, 0) / data.length * 10) / 10;
  const todayCount = data.reduce((a, s) => a + s.history.filter((h) => h.fresh).length, 0);

  const save = (patch) => {
    setData((prev) => prev.map((s) => {
      if (s.id !== openId) return s;
      const status = { ...s.status, [cell]: patch.status };
      let history = s.history;
      if (patch.log) {
        history = [{
          id: "new" + Date.now(), date: new Date(2026, 4, 31), fresh: true,
          kategori: patch.kategori, gred: patch.gred, from: cell, to: cell,
          juzuk: MAQRA.juzukOf(cell), ulasan: patch.ulasan || "—", masalah: patch.masalah || "—",
          cadangan: patch.cadangan || "—", guru: "Ustazah Aisyah",
        }, ...s.history];
      }
      return recompute({ ...s, status, history });
    }));
    setCell(null);
    showToast(`Muka surat ${cell} dikemas kini`, "ok");
  };

  const nav = [
    { section: "Guru" },
    { key: "murid", label: "Senarai Pelajar", icon: "users" },
    { key: "tasmik", label: "Tasmik Hari Ini", icon: "flame" },
    { key: "kohort", label: "Kohort", icon: "grid" },
  ];

  return (
    <div className="shell">
      <Sidebar roleIcon="cap" roleTitle="Ustazah Aisyah" roleSub="Guru · Tahun 4 & 5" items={nav}
        active={view} onNav={(k) => { setView(k); setOpenId(null); }} onLogout={() => { setAuthed(false); setOpenId(null); }}
        footerNote={MAQRA.school.name} />
      <main className="main"><div className="main-wide">
        {open ? (
          <>
            <div className="pagehead"><div><h1>{open.name}</h1><p className="mono">{open.id} · {open.kelas}</p></div></div>
            <TeacherStudent st={open} columns={columns} onBack={() => setOpenId(null)} onCell={setCell}
              onTarget={(val) => setData((prev) => prev.map((s) => (s.id === open.id ? { ...s, target: val } : s)))} />
          </>
        ) : view === "tasmik" ? (
          <TasmikQueue data={data} onOpen={setOpenId} />
        ) : view === "kohort" ? (
          <KohortView data={data} onOpen={setOpenId} />
        ) : (
          <>
            <div className="pagehead">
              <div><h1>Senarai Pelajar</h1><p>{MAQRA.school.name} · {data.length} pelajar dibimbing</p></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 22 }}>
              <StatCard icon="users" label="Jumlah Pelajar" value={data.length} sub="dalam bimbingan anda" />
              <StatCard icon="award" label="Purata Progres" value={avg + "%"} sub="merentas semua pelajar" tone="murajaah" />
              <StatCard icon="check" label="Tasmik Hari Ini" value={todayCount} sub="rekod baharu disimpan" tone="hafazan" />
            </div>
            <div className="search" style={{ marginBottom: 16, maxWidth: 420 }}>
              <span className="ic"><Icon name="search" size={17} /></span>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari nama atau ID pelajar…" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {filtered.map((s) => <StudentRow key={s.id} st={s} onOpen={() => setOpenId(s.id)} />)}
              {filtered.length === 0 && <div className="empty"><Icon name="search" size={28} /><div>Tiada pelajar sepadan.</div></div>}
            </div>
          </>
        )}
      </div></main>
      {cell && open && <UpdateModal student={open} page={cell} onSave={save} onClose={() => setCell(null)} />}
      {toast}
    </div>
  );
}

/* ---------- helpers ---------- */
function cloneStudent(s) { return { ...s, status: { ...s.status }, history: s.history.map((h) => ({ ...h })) }; }
function recompute(s) {
  let frontier = 0;
  for (let p = 1; p <= 604; p++) if (s.status[p] !== "belum") frontier = p;
  const tally = {}; MAQRA.STATUS.forEach((x) => (tally[x.key] = 0));
  for (let p = 1; p <= 604; p++) tally[s.status[p]]++;
  return { ...s, frontier, tally, juzuk: MAQRA.juzukOf(frontier), surah: MAQRA.surahOf(frontier), progress: Math.round(frontier / 604 * 1000) / 10 };
}

Object.assign(window, { TeacherFlow, LoginScreen, useToast, UpdateModal });
