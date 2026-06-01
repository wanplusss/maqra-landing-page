/* ===========================================================================
   Maqra — School Admin flow (student CRUD, school editor, teachers)
   =========================================================================== */

/* ---------- add / edit student modal ---------- */
function StudentForm({ initial, onSave, onClose }) {
  const [f, setF] = useState(initial || { name: "", id: "", kelas: "Tahun 1", parent: "", enroll: "2026-01-08", target: 15 });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const valid = f.name.trim() && f.id.trim();
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div><h3>{initial ? "Edit Pelajar" : "Tambah Pelajar"}</h3><p>Maklumat akan diasingkan mengikut sekolah (RLS)</p></div>
          <button className="iconbtn" onClick={onClose}><Icon name="x" size={18} /></button>
        </div>
        <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="field"><label>Nama Penuh</label><input className="input" value={f.name} onChange={set("name")} placeholder="cth. Muhammad Danish Bin Ahmad" autoFocus /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="field"><label>ID Pelajar</label><input className="input mono" value={f.id} onChange={set("id")} placeholder="STU00xxx" /></div>
            <div className="field"><label>Kelas</label>
              <select className="select" value={f.kelas} onChange={set("kelas")}>{["Tahun 1","Tahun 2","Tahun 3","Tahun 4","Tahun 5","Tahun 6"].map((k) => <option key={k}>{k}</option>)}</select>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="field"><label>No. Ibu Bapa</label><input className="input" value={f.parent} onChange={set("parent")} placeholder="01x-xxx xxxx" /></div>
            <div className="field"><label>Tarikh Daftar</label><input className="input" type="date" value={f.enroll} onChange={set("enroll")} /></div>
          </div>
          <div className="field"><label>Sasaran Peribadi (muka surat / bulan)</label>
            <input className="input mono" type="number" min="1" max="60" value={f.target || 15} onChange={(e) => setF({ ...f, target: parseInt(e.target.value) || 15 })} />
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={onClose}>Batal</button>
          <button className="btn btn-primary" disabled={!valid} style={{ opacity: valid ? 1 : 0.5 }} onClick={() => onSave(f)}><Icon name="save" size={15} /> Simpan</button>
        </div>
      </div>
    </div>
  );
}

function ConfirmModal({ title, body, onYes, onClose }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 400 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-head"><div><h3>{title}</h3></div><button className="iconbtn" onClick={onClose}><Icon name="x" size={18} /></button></div>
        <div className="modal-body"><p style={{ margin: 0, color: "var(--ink-2)", fontSize: 14 }}>{body}</p></div>
        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={onClose}>Batal</button>
          <button className="btn btn-danger" onClick={onYes}><Icon name="trash" size={15} /> Padam</button>
        </div>
      </div>
    </div>
  );
}

/* ---------- admin: students page ---------- */
function AdminStudents({ data, setData, showToast }) {
  const [q, setQ] = useState("");
  const [form, setForm] = useState(null); // {mode, student}
  const [del, setDel] = useState(null);
  const filtered = data.filter((s) => (s.name + s.id).toLowerCase().includes(q.toLowerCase()));

  const save = (f) => {
    if (form.mode === "edit") {
      setData((p) => p.map((s) => (s.id === form.student.id ? { ...s, ...f } : s)));
      showToast("Maklumat pelajar dikemas kini", "ok");
    } else {
      const blank = {};
      for (let p = 1; p <= 604; p++) blank[p] = "belum";
      setData((p) => [{ ...f, sex: f.name.includes("Binti") ? "f" : "m", umur: 7, status: blank, history: [], tally: {}, frontier: 0, juzuk: 1, surah: "Al-Fatihah", lastHafazan: 0, lastHafazanSurah: "—", progress: 0 }, ...p]);
      showToast("Pelajar baharu ditambah", "ok");
    }
    setForm(null);
  };
  const remove = () => { setData((p) => p.filter((s) => s.id !== del.id)); setDel(null); showToast("Pelajar dipadam", "ok"); };

  return (
    <>
      <div className="pagehead">
        <div><h1>Pengurusan Pelajar</h1><p>{data.length} pelajar berdaftar · {MAQRA.school.name}</p></div>
        <button className="btn btn-primary" onClick={() => setForm({ mode: "add" })}><Icon name="plus" size={16} /> Tambah Pelajar</button>
      </div>
      <div className="search" style={{ marginBottom: 16, maxWidth: 420 }}>
        <span className="ic"><Icon name="search" size={17} /></span>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari nama atau ID…" />
      </div>
      <div className="card" style={{ overflow: "hidden" }}>
        <div className="scroll" style={{ overflowX: "auto" }}>
          <table className="tbl" style={{ minWidth: 820 }}>
            <thead><tr><th>Pelajar</th><th>ID</th><th>Kelas</th><th>No. Ibu Bapa</th><th>Progres</th><th>Daftar</th><th style={{ textAlign: "right" }}>Tindakan</th></tr></thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id}>
                  <td><div style={{ display: "flex", alignItems: "center", gap: 11 }}><Avatar name={s.name} sex={s.sex} size={34} /><span style={{ fontWeight: 650 }}>{s.name}</span></div></td>
                  <td className="mono" style={{ fontSize: 13 }}>{s.id}</td>
                  <td>{s.kelas}</td>
                  <td className="mono" style={{ fontSize: 13, color: "var(--ink-2)" }}>{s.parent || "—"}</td>
                  <td style={{ width: 150 }}><div style={{ display: "flex", alignItems: "center", gap: 9 }}><div style={{ flex: 1 }}><Bar value={s.progress} /></div><span className="mono" style={{ fontSize: 12, color: "var(--ink-3)", width: 38, textAlign: "right" }}>{s.progress}%</span></div></td>
                  <td className="mono" style={{ fontSize: 12.5, color: "var(--ink-3)", whiteSpace: "nowrap" }}>{s.enroll}</td>
                  <td><div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                    <button className="iconbtn" title="Edit" onClick={() => setForm({ mode: "edit", student: s })}><Icon name="edit" size={16} /></button>
                    <button className="iconbtn" title="Padam" onClick={() => setDel(s)}><Icon name="trash" size={16} /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="empty"><Icon name="users" size={28} /><div>Tiada pelajar sepadan.</div></div>}
      </div>
      {form && <StudentForm initial={form.mode === "edit" ? form.student : null} onSave={save} onClose={() => setForm(null)} />}
      {del && <ConfirmModal title="Padam pelajar?" body={`"${del.name}" dan semua rekod progresnya akan dipadam secara kekal.`} onYes={remove} onClose={() => setDel(null)} />}
    </>
  );
}

/* ---------- admin: school editor ---------- */
function AdminSchool({ school, setSchool, showToast }) {
  const [f, setF] = useState(school);
  const [dirty, setDirty] = useState(false);
  const set = (k) => (e) => { setF({ ...f, [k]: e.target.value }); setDirty(true); };
  const save = () => { setSchool(f); setDirty(false); showToast("Laman sekolah dikemas kini", "ok"); };
  return (
    <>
      <div className="pagehead">
        <div><h1>Laman Sekolah</h1><p className="mono">maqra.app/school/{school.slug}</p></div>
        <button className="btn btn-primary" disabled={!dirty} style={{ opacity: dirty ? 1 : 0.5 }} onClick={save}><Icon name="save" size={16} /> Simpan Perubahan</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 22, alignItems: "start" }}>
        <div className="card" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="field"><label>Nama Sekolah</label><input className="input" value={f.name} onChange={set("name")} /></div>
          <div className="field"><label>Penerangan</label><textarea className="textarea" style={{ minHeight: 100 }} value={f.description} onChange={set("description")} /></div>
          <div className="field"><label>Alamat</label><input className="input" value={f.address} onChange={set("address")} /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div className="field"><label>No. Telefon</label><input className="input" value={f.phone} onChange={set("phone")} /></div>
            <div className="field"><label>Emel</label><input className="input" value={f.email} onChange={set("email")} /></div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 800 }}>Kod QR Sumbangan</h3>
            <p style={{ margin: "0 0 14px", fontSize: 12.5, color: "var(--ink-3)" }}>Dipaparkan di laman awam sekolah.</p>
            <div style={{ display: "grid", placeItems: "center", padding: 16, background: "var(--surface-2)", borderRadius: 12, border: "1px solid var(--line)" }}><FauxQR size={140} seed={4} /></div>
            <button className="btn" style={{ width: "100%", justifyContent: "center", marginTop: 14 }}><Icon name="external" size={15} /> Muat Naik QR Baharu</button>
          </div>
          <div className="card" style={{ padding: 18, background: "var(--accent-soft)", border: "1px solid transparent" }}>
            <div style={{ display: "flex", gap: 10 }}>
              <Icon name="info" size={18} style={{ color: "var(--accent-deep)", flex: "none", marginTop: 1 }} />
              <p style={{ margin: 0, fontSize: 12.5, color: "var(--accent-deep)", lineHeight: 1.55 }}>Perubahan dipaparkan serta-merta di laman awam <span className="mono">/school/{school.slug}</span> selepas disimpan.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------- admin: teachers ---------- */
function AdminTeachers({ teachers, setTeachers, showToast }) {
  const [del, setDel] = useState(null);
  const add = () => {
    const n = teachers.length + 1;
    setTeachers([...teachers, { id: "t" + Date.now(), name: "Ustaz/ah Baharu " + n, email: "guru" + n + "@alfurqan.edu.my", kelas: "Belum ditetapkan" }]);
    showToast("Akaun guru ditambah", "ok");
  };
  return (
    <>
      <div className="pagehead">
        <div><h1>Pengurusan Guru</h1><p>{teachers.length} akaun guru aktif</p></div>
        <button className="btn btn-primary" onClick={add}><Icon name="plus" size={16} /> Tambah Guru</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }}>
        {teachers.map((t) => (
          <div key={t.id} className="card" style={{ padding: 18, display: "flex", alignItems: "center", gap: 14 }}>
            <Avatar name={t.name.replace("Ustazah ", "").replace("Ustaz ", "")} sex={t.name.includes("Ustazah") ? "f" : "m"} size={44} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 14.5 }}>{t.name}</div>
              <div className="mono" style={{ fontSize: 12, color: "var(--ink-3)", overflow: "hidden", textOverflow: "ellipsis" }}>{t.email}</div>
              <span className="badge" style={{ marginTop: 7, fontSize: 11.5 }}><Icon name="cap" size={12} /> {t.kelas}</span>
            </div>
            <button className="iconbtn" onClick={() => setDel(t)}><Icon name="trash" size={16} /></button>
          </div>
        ))}
      </div>
      {del && <ConfirmModal title="Buang akaun guru?" body={`Akaun "${del.name}" akan kehilangan akses ke sekolah.`} onYes={() => { setTeachers(teachers.filter((x) => x.id !== del.id)); setDel(null); showToast("Akaun guru dibuang", "ok"); }} onClose={() => setDel(null)} />}
    </>
  );
}

/* ---------- admin flow root ---------- */
function AdminFlow({ setPath }) {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState("dashboard");
  const [data, setData] = useState(() => MAQRA.students.map((s) => ({ ...s })));
  const [school, setSchool] = useState({ ...MAQRA.school });
  const [teachers, setTeachers] = useState(MAQRA.school.teachers.map((t) => ({ ...t })));
  const [announcements, setAnnouncements] = useState(MAQRA.school.announcements.map((a) => ({ ...a })));
  const [toast, showToast] = useToast();

  useEffect(() => { setPath(authed ? "/admin/" + tab : "/admin"); }, [authed, tab]);

  if (!authed) return <LoginScreen role="admin" slug={MAQRA.school.slug} defaultEmail="admin@alfurqan.edu.my" onLogin={() => setAuthed(true)} />;

  const nav = [
    { section: "Admin Sekolah" },
    { key: "dashboard", label: "Dashboard", icon: "home" },
    { key: "murid", label: "Pelajar", icon: "users" },
    { key: "pengumuman", label: "Pengumuman", icon: "megaphone" },
    { key: "sekolah", label: "Laman Sekolah", icon: "school" },
    { key: "guru", label: "Guru", icon: "cap" },
  ];

  return (
    <div className="shell">
      <Sidebar roleIcon="shield" roleTitle="Admin Sekolah" roleSub={school.name} items={nav}
        active={tab} onNav={setTab} onLogout={() => setAuthed(false)} footerNote="Akses penuh sekolah anda" />
      <main className="main"><div className="main-wide">
        {tab === "dashboard" && <AdminDashboard data={data} />}
        {tab === "murid" && <AdminStudents data={data} setData={setData} showToast={showToast} />}
        {tab === "pengumuman" && <AdminPengumuman items={announcements} setItems={setAnnouncements} showToast={showToast} />}
        {tab === "sekolah" && <AdminSchool school={school} setSchool={setSchool} showToast={showToast} />}
        {tab === "guru" && <AdminTeachers teachers={teachers} setTeachers={setTeachers} showToast={showToast} />}
      </div></main>
      {toast}
    </div>
  );
}

Object.assign(window, { AdminFlow });
