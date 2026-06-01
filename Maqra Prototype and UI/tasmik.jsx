/* ===========================================================================
   Maqra — teacher: Tasmik Hari Ini queue + Kohort (class) view
   =========================================================================== */

function daysSinceTasmik(st) {
  if (!st.history || !st.history.length) return 99;
  const last = st.history.reduce((m, h) => (h.date > m ? h.date : m), st.history[0].date);
  return Math.max(0, Math.round((TODAY - last) / 86400000));
}

/* weakest memorized juz for a student (lowest strength) */
function weakestJuz(st) {
  const a = getAnalytics(st);
  if (!a.murajaah.length) return null;
  let best = null;
  a.murajaah.forEach((m) => {
    const strength = strengthOf(m.days);
    if (!best || strength < best.strength) best = { ...m, strength };
  });
  return best;
}

/* ---------- Tasmik Hari Ini ---------- */
function TasmikQueue({ data, onOpen }) {
  const [mode, setMode] = useState("perlu"); // perlu | semua

  const rows = useMemo(() => data.map((st) => {
    const a = getAnalytics(st);
    const strengths = a.murajaah.map((m) => strengthOf(m.days));
    const health = strengths.length ? Math.round(strengths.reduce((x, y) => x + y, 0) / strengths.length) : 0;
    const weakCount = strengths.filter((s) => s < 70).length;
    const w = weakestJuz(st);
    const idle = daysSinceTasmik(st);
    const urgency = (100 - health) + weakCount * 4 + Math.min(idle, 30) * 1.4;
    return { st, w, idle, health, weakCount, urgency, due: weakCount > 0 || idle >= 4 };
  }).sort((a, b) => b.urgency - a.urgency), [data]);

  const shown = mode === "perlu" ? rows.filter((r) => r.due) : rows;
  const dueCount = rows.filter((r) => r.due).length;

  return (
    <>
      <div className="pagehead">
        <div><h1>Tasmik Hari Ini</h1><p>{MAQRA.fmtDate(TODAY)} · senarai keutamaan tasmik berdasarkan kekuatan murajaah</p></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 20 }}>
        <StatCard icon="flame" label="Perlu Tasmik" value={dueCount} sub="keutamaan hari ini" tone="syahadah" />
        <StatCard icon="users" label="Jumlah Pelajar" value={data.length} sub="dalam bimbingan" />
        <StatCard icon="check" label="Purata Idle" value={Math.round(rows.reduce((a, r) => a + r.idle, 0) / Math.max(rows.length, 1)) + "h"} sub="sejak tasmik terakhir" tone="murajaah" />
      </div>
      <div className="persona" style={{ background: "var(--surface-2)", marginBottom: 16, width: "fit-content" }}>
        <button className={mode === "perlu" ? "on" : ""} onClick={() => setMode("perlu")}>Perlu Tasmik ({dueCount})</button>
        <button className={mode === "semua" ? "on" : ""} onClick={() => setMode("semua")}>Semua Pelajar</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {shown.map(({ st, w, idle, health, weakCount, due }, i) => {
          const band = strengthBand(health);
          return (
            <div key={st.id} className="card" style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <div style={{ width: 26, textAlign: "center", flex: "none", fontWeight: 800, color: due ? "var(--st-syahadah-ink)" : "var(--ink-3)", fontFamily: "var(--font-mono)" }}>{i + 1}</div>
              <Avatar name={st.name} sex={st.sex} size={44} />
              <div style={{ width: 210, flex: "none" }}>
                <div style={{ fontWeight: 700, fontSize: 14.5 }}>{st.name}</div>
                <div className="mono" style={{ fontSize: 11.5, color: "var(--ink-3)" }}>{st.id} · {st.kelas}</div>
              </div>
              {w && (
                <div style={{ flex: 1, minWidth: 180 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
                    <span style={{ color: "var(--ink-2)", fontWeight: 600 }}>Fokus: Juz {w.juz} · {w.surah}</span>
                    <span className="mono" style={{ color: `var(--st-${band.css}-ink)`, fontWeight: 700 }}>{weakCount} juz lemah</span>
                  </div>
                  <Bar value={health} tone={`var(--st-${band.css}-ink)`} height={7} />
                </div>
              )}
              <div style={{ width: 100, flex: "none", textAlign: "center" }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: idle >= 4 ? "var(--st-syahadah-ink)" : "var(--ink-2)" }}>{idle} hari</div>
                <div style={{ fontSize: 11, color: "var(--ink-3)" }}>sejak tasmik</div>
              </div>
              <button className="btn btn-primary btn-sm" style={{ flex: "none", whiteSpace: "nowrap" }} onClick={() => onOpen(st.id)}>
                <Icon name="edit" size={14} /> Mula Tasmik
              </button>
            </div>
          );
        })}
        {shown.length === 0 && <div className="empty"><Icon name="check" size={30} /><div style={{ marginTop: 6 }}>Semua pelajar telah dimurajaah baru-baru ini. Syabas!</div></div>}
      </div>
    </>
  );
}

/* ---------- Kohort (class-level) ---------- */
function KohortView({ data, onOpen }) {
  const cohorts = useMemo(() => cohortStats(data), [data]);
  const [kelas, setKelas] = useState("semua");

  const ranked = useMemo(() => {
    const list = kelas === "semua" ? data : data.filter((s) => s.kelas === kelas);
    return list.slice().sort((a, b) => b.progress - a.progress);
  }, [data, kelas]);

  return (
    <>
      <div className="pagehead">
        <div><h1>Kohort</h1><p>Perbandingan prestasi mengikut kelas · {MAQRA.school.name}</p></div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))", gap: 14, marginBottom: 24 }}>
        {cohorts.map((c) => {
          const onTrackPct = Math.round((c.onTrack / c.n) * 100);
          return (
            <button key={c.kelas} onClick={() => setKelas(c.kelas)} className="card"
              style={{ padding: 18, textAlign: "left", border: kelas === c.kelas ? "1.5px solid var(--accent)" : "1px solid var(--line)", background: "var(--surface)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontWeight: 800, fontSize: 16 }}>{c.kelas}</span>
                <span className="badge"><Icon name="users" size={12} /> {c.n}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--ink-3)", marginBottom: 5 }}>
                <span>Purata progres</span><span className="mono" style={{ fontWeight: 700, color: "var(--ink-2)" }}>{c.avgProg}%</span>
              </div>
              <Bar value={c.avgProg} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontSize: 12 }}>
                <span style={{ color: "var(--ink-3)" }}>Kadar {c.avgPace} m.s./bln</span>
                <span style={{ fontWeight: 700, color: onTrackPct >= 50 ? "var(--st-hafazan-ink)" : "var(--st-syahadah-ink)" }}>{c.onTrack}/{c.n} on-track</span>
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>Ranking</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
          <button className="chip" onClick={() => setKelas("semua")} style={{ borderColor: kelas === "semua" ? "var(--accent)" : "var(--line)", color: kelas === "semua" ? "var(--accent-deep)" : "var(--ink-2)", fontWeight: 700 }}>Semua</button>
          {cohorts.map((c) => (
            <button key={c.kelas} className="chip" onClick={() => setKelas(c.kelas)} style={{ borderColor: kelas === c.kelas ? "var(--accent)" : "var(--line)", color: kelas === c.kelas ? "var(--accent-deep)" : "var(--ink-2)", fontWeight: kelas === c.kelas ? 700 : 600 }}>{c.kelas}</button>
          ))}
        </div>
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        <div className="scroll" style={{ overflowX: "auto" }}>
          <table className="tbl" style={{ minWidth: 760 }}>
            <thead><tr><th style={{ width: 50 }}>#</th><th>Pelajar</th><th>Kelas</th><th>Juz</th><th>Kadar</th><th style={{ minWidth: 160 }}>Progres</th><th></th></tr></thead>
            <tbody>
              {ranked.map((s, i) => {
                const pace = paceOf(s);
                const ok = pace >= targetOf(s);
                return (
                  <tr key={s.id} style={{ cursor: "pointer" }} onClick={() => onOpen(s.id)}>
                    <td className="mono" style={{ fontWeight: 800, color: i < 3 ? "var(--accent-deep)" : "var(--ink-3)" }}>{i + 1}</td>
                    <td><div style={{ display: "flex", alignItems: "center", gap: 11 }}><Avatar name={s.name} sex={s.sex} size={32} /><span style={{ fontWeight: 650 }}>{s.name}</span></div></td>
                    <td style={{ color: "var(--ink-2)" }}>{s.kelas}</td>
                    <td className="mono">Juz {s.juzuk}</td>
                    <td><span className="badge" style={{ background: ok ? "var(--st-hafazan-fill)" : "var(--st-syahadah-fill)", color: ok ? "var(--st-hafazan-ink)" : "var(--st-syahadah-ink)", borderColor: "transparent" }}>{Math.round(pace * 10) / 10} m.s.</span></td>
                    <td><div style={{ display: "flex", alignItems: "center", gap: 9 }}><div style={{ flex: 1 }}><Bar value={s.progress} /></div><span className="mono" style={{ fontSize: 12, color: "var(--ink-3)", width: 40, textAlign: "right" }}>{s.progress}%</span></div></td>
                    <td><Icon name="chevR" size={16} style={{ color: "var(--ink-3)" }} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

Object.assign(window, { TasmikQueue, KohortView, daysSinceTasmik, weakestJuz });
