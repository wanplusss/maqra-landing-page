/* ===========================================================================
   Maqra — Admin: Sekolah dashboard (aggregate) + Pengumuman manager
   =========================================================================== */

function AdminDashboard({ data }) {
  const yr = TODAY.getFullYear();
  const agg = useMemo(() => {
    const ys = data.map((s) => getYearSeries(s, yr));
    const schoolTarget = data.reduce((a, s) => a + targetOf(s), 0);
    const months = MONTHS_SHORT.map((label, m) => {
      let actual = 0, cumActual = 0;
      ys.forEach((y) => { actual += y.monthly[m].actual; cumActual += y.monthly[m].cumActual; });
      return { label, actual, target: schoolTarget, cumActual, cumTarget: schoolTarget * (m + 1) };
    });
    const totalJuz = data.reduce((a, s) => a + milestonesOf(s).count, 0);
    const onTrack = data.filter((s) => paceOf(s) >= targetOf(s)).length;
    const avgProg = Math.round(data.reduce((a, s) => a + s.progress, 0) / Math.max(data.length, 1) * 10) / 10;
    const thisMonth = months[Math.min(TODAY.getMonth(), 11)].actual;
    const leaders = data.map((s) => ({ s, pace: paceOf(s) })).sort((a, b) => b.pace - a.pace).slice(0, 5);
    return { months, totalJuz, onTrack, avgProg, thisMonth, leaders };
  }, [data, yr]);

  const cohorts = useMemo(() => cohortStats(data), [data]);
  const nowMonth = TODAY.getFullYear() === yr ? TODAY.getMonth() : 11;
  const maxClassProg = Math.max(...cohorts.map((c) => c.avgProg), 1);

  return (
    <>
      <div className="pagehead">
        <div><h1>Dashboard Sekolah</h1><p>Ringkasan prestasi keseluruhan · {MAQRA.school.name}</p></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 22 }}>
        <StatCard icon="users" label="Jumlah Pelajar" value={data.length} sub="berdaftar aktif" />
        <StatCard icon="book" label="Juzuk Dihafaz" value={agg.totalJuz} sub="merentas semua pelajar" tone="hafazan" />
        <StatCard icon="trendUp" label="On-Track" value={`${agg.onTrack}/${data.length}`} sub="capai sasaran peribadi" tone="murajaah" />
        <StatCard icon="check" label="M.S. Bulan Ini" value={agg.thisMonth} sub="seluruh maahad" tone="bacaan" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 22, alignItems: "start", marginBottom: 22 }}>
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 6 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Icon name="trendUp" size={18} style={{ color: "var(--accent)" }} />
                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800 }}>Output Kumulatif {yr}</h3>
              </div>
              <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--ink-3)" }}>Jumlah muka surat seluruh maahad vs sasaran</p>
            </div>
            <ChartLegend items={[{ label: "Sasaran", color: "var(--ink-3)", dashed: true }, { label: "Sebenar", color: "var(--accent)" }]} />
          </div>
          <LineChart rows={agg.months} pick={(d) => ({ label: d.label, target: d.cumTarget, actual: d.cumActual })}
            yLabel="Jumlah m.s. (maahad)" niceStep={250} nowMonth={nowMonth} />
        </div>

        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ margin: "0 0 4px", fontSize: 17, fontWeight: 800 }}>Prestasi Mengikut Kelas</h3>
          <p style={{ margin: "0 0 18px", fontSize: 13, color: "var(--ink-3)" }}>Purata progres setiap kohort</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {cohorts.map((c) => (
              <div key={c.kelas}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 6 }}>
                  <span style={{ fontWeight: 700 }}>{c.kelas} <span style={{ color: "var(--ink-3)", fontWeight: 500 }}>· {c.n} pelajar</span></span>
                  <span className="mono" style={{ color: "var(--ink-2)", fontWeight: 700 }}>{c.avgProg}%</span>
                </div>
                <Bar value={(c.avgProg / maxClassProg) * 100} />
                <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 5 }}>{c.onTrack}/{c.n} on-track · kadar {c.avgPace} m.s./bln</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <Icon name="trophy" size={18} style={{ color: "var(--accent)" }} />
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800 }}>Pelajar Terpantas</h3>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))", gap: 12 }}>
          {agg.leaders.map(({ s, pace }, i) => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", border: "1px solid var(--line)", borderRadius: 14, background: "var(--surface-2)" }}>
              <div style={{ width: 22, textAlign: "center", fontWeight: 800, color: i === 0 ? "var(--accent-deep)" : "var(--ink-3)", fontFamily: "var(--font-mono)" }}>{i + 1}</div>
              <Avatar name={s.name} sex={s.sex} size={38} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 13.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name.split(" ").slice(0, 2).join(" ")}</div>
                <div style={{ fontSize: 11.5, color: "var(--ink-3)" }}>{s.kelas} · {Math.round(pace * 10) / 10} m.s./bln</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ---------- announcement editor ---------- */
function AnnouncementForm({ initial, onSave, onClose }) {
  const [f, setF] = useState(initial || { title: "", tag: "Umum", body: "", date: "2026-06-01" });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const valid = f.title.trim() && f.body.trim();
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-head"><div><h3>{initial ? "Edit Pengumuman" : "Pengumuman Baharu"}</h3><p>Dipaparkan di laman awam sekolah</p></div><button className="iconbtn" onClick={onClose}><Icon name="x" size={18} /></button></div>
        <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="field"><label>Tajuk</label><input className="input" value={f.title} onChange={set("title")} placeholder="cth. Majlis Khatam Tahunan" autoFocus /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="field"><label>Kategori</label>
              <select className="select" value={f.tag} onChange={set("tag")}>{["Umum", "Peperiksaan", "Majlis", "Cuti", "Yuran"].map((k) => <option key={k}>{k}</option>)}</select>
            </div>
            <div className="field"><label>Tarikh</label><input className="input" type="date" value={f.date} onChange={set("date")} /></div>
          </div>
          <div className="field"><label>Kandungan</label><textarea className="textarea" style={{ minHeight: 90 }} value={f.body} onChange={set("body")} placeholder="Butiran pengumuman…" /></div>
        </div>
        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={onClose}>Batal</button>
          <button className="btn btn-primary" disabled={!valid} style={{ opacity: valid ? 1 : 0.5 }} onClick={() => onSave(f)}><Icon name="save" size={15} /> Simpan</button>
        </div>
      </div>
    </div>
  );
}

function AdminPengumuman({ items, setItems, showToast }) {
  const [form, setForm] = useState(null);
  const [del, setDel] = useState(null);
  const save = (f) => {
    if (form.item) { setItems((p) => p.map((x) => (x.id === form.item.id ? { ...x, ...f } : x))); showToast("Pengumuman dikemas kini", "ok"); }
    else { setItems((p) => [{ ...f, id: "a" + Date.now() }, ...p]); showToast("Pengumuman diterbitkan", "ok"); }
    setForm(null);
  };
  return (
    <>
      <div className="pagehead">
        <div><h1>Pengumuman</h1><p>{items.length} pengumuman · dipaparkan di laman awam</p></div>
        <button className="btn btn-primary" onClick={() => setForm({})}><Icon name="plus" size={16} /> Pengumuman Baharu</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {items.map((an) => (
          <div key={an.id} className="card" style={{ padding: 18, display: "flex", gap: 16, alignItems: "flex-start" }}>
            <span style={{ width: 38, height: 38, borderRadius: 11, background: "var(--accent-soft)", color: "var(--accent-deep)", display: "grid", placeItems: "center", flex: "none" }}><Icon name="megaphone" size={18} /></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 4 }}>
                <span className="badge badge-ok">{an.tag}</span>
                <span className="mono" style={{ fontSize: 11.5, color: "var(--ink-3)" }}>{an.date}</span>
              </div>
              <h3 style={{ margin: "0 0 5px", fontSize: 15.5, fontWeight: 800 }}>{an.title}</h3>
              <p style={{ margin: 0, fontSize: 13, color: "var(--ink-3)", lineHeight: 1.55 }}>{an.body}</p>
            </div>
            <div style={{ display: "flex", gap: 4, flex: "none" }}>
              <button className="iconbtn" title="Edit" onClick={() => setForm({ item: an })}><Icon name="edit" size={16} /></button>
              <button className="iconbtn" title="Padam" onClick={() => setDel(an)}><Icon name="trash" size={16} /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="empty"><Icon name="megaphone" size={28} /><div>Belum ada pengumuman.</div></div>}
      </div>
      {form && <AnnouncementForm initial={form.item} onSave={save} onClose={() => setForm(null)} />}
      {del && <ConfirmModal title="Padam pengumuman?" body={`"${del.title}" akan dibuang dari laman awam.`} onYes={() => { setItems((p) => p.filter((x) => x.id !== del.id)); setDel(null); showToast("Pengumuman dipadam", "ok"); }} onClose={() => setDel(null)} />}
    </>
  );
}

Object.assign(window, { AdminDashboard, AdminPengumuman });
