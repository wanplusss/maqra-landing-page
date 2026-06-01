/* ===========================================================================
   Maqra — insights: cohort stats, peer pace, milestones + small cards
   (loads after analytics.jsx — uses getAnalytics, TARGET_PPM, Ring)
   =========================================================================== */

const MEMORIZED = new Set(["hafazan", "murajaah", "talaqqi", "syahadah"]);

function paceOf(st) { return getAnalytics(st).ppm; }

/* completed juzuk = every page in the juz is memorized */
function milestonesOf(st) {
  const done = [];
  for (let j = 1; j <= 30; j++) {
    const [s0, s1] = MAQRA.juzPages(j);
    let ok = true;
    for (let p = s0; p <= s1; p++) { if (!MEMORIZED.has(st.status[p])) { ok = false; break; } }
    if (ok) done.push(j);
  }
  return { juz: done, count: done.length, khatam: done.length === 30 };
}

const mean = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);

/* per-class aggregates across a student list */
function cohortStats(students) {
  const byClass = {};
  students.forEach((s) => { (byClass[s.kelas] || (byClass[s.kelas] = [])).push(s); });
  const order = (k) => parseInt(k.replace(/\D/g, "")) || 0;
  return Object.keys(byClass).sort((a, b) => order(a) - order(b)).map((kelas) => {
    const list = byClass[kelas];
    const paces = list.map(paceOf);
    const onTrack = list.filter((s) => paceOf(s) >= targetOf(s)).length;
    return {
      kelas, n: list.length, list,
      avgProg: Math.round(mean(list.map((s) => s.progress)) * 10) / 10,
      avgPace: Math.round(mean(paces) * 10) / 10,
      onTrack, behind: list.length - onTrack,
    };
  });
}

/* a single student's standing within their class */
function peerStanding(students, st) {
  const peers = students.filter((s) => s.kelas === st.kelas);
  const paces = peers.map(paceOf).sort((a, b) => b - a);
  const myPace = paceOf(st);
  const avgPace = Math.round(mean(peers.map(paceOf)) * 10) / 10;
  const avgProg = Math.round(mean(peers.map((s) => s.progress)) * 10) / 10;
  const rank = peers.slice().sort((a, b) => b.progress - a.progress).findIndex((s) => s.id === st.id) + 1;
  const max = Math.max(...paces, targetOf(st), myPace);
  return { n: peers.length, myPace: Math.round(myPace * 10) / 10, avgPace, avgProg, rank, max };
}

/* ---------- peer context strip (parent analytics) ---------- */
function PeerContextCard({ st }) {
  const ps = peerStanding(MAQRA.students, st);
  const diff = Math.round((ps.myPace - ps.avgPace) * 10) / 10;
  const ahead = diff >= 0;
  const pct = (v) => `${Math.min(100, (v / ps.max) * 100)}%`;
  return (
    <div className="card" style={{ padding: 22 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <Icon name="trendUp" size={18} style={{ color: "var(--accent)" }} />
        <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800 }}>Kedudukan dalam Kelas</h3>
      </div>
      <p style={{ margin: "0 0 18px", fontSize: 13, color: "var(--ink-3)" }}>Berbanding {ps.n} pelajar {st.kelas}</p>
      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 26, alignItems: "center" }}>
        <div style={{ textAlign: "center", paddingRight: 22, borderRight: "1px solid var(--line)" }}>
          <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-0.03em", color: "var(--accent-deep)", lineHeight: 1 }}>#{ps.rank}</div>
          <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 5 }}>daripada {ps.n}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 6 }}>
              <span style={{ fontWeight: 700 }}>{st.name.split(" ").slice(0, 2).join(" ")}</span>
              <span className="mono" style={{ color: "var(--accent-deep)", fontWeight: 700 }}>{ps.myPace} m.s./bln</span>
            </div>
            <div style={{ height: 9, background: "var(--line-2)", borderRadius: 99 }}>
              <div style={{ height: "100%", width: pct(ps.myPace), background: "var(--accent)", borderRadius: 99, transition: "width .5s" }} />
            </div>
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 6 }}>
              <span style={{ fontWeight: 600, color: "var(--ink-2)" }}>Purata kelas</span>
              <span className="mono" style={{ color: "var(--ink-3)", fontWeight: 700 }}>{ps.avgPace} m.s./bln</span>
            </div>
            <div style={{ height: 9, background: "var(--line-2)", borderRadius: 99 }}>
              <div style={{ height: "100%", width: pct(ps.avgPace), background: "var(--ink-3)", borderRadius: 99, opacity: 0.55, transition: "width .5s" }} />
            </div>
          </div>
        </div>
      </div>
      <hr className="divider" style={{ margin: "18px 0 14px" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <span style={{ fontSize: 13, color: "var(--ink-2)" }}>
          Anak anda membaca <strong style={{ color: ahead ? "var(--st-hafazan-ink)" : "var(--st-syahadah-ink)" }}>{ahead ? `${diff} m.s. lebih pantas` : `${Math.abs(diff)} m.s. lebih perlahan`}</strong> daripada purata kelas
        </span>
        <span className="badge" style={{ background: ahead ? "var(--st-hafazan-fill)" : "var(--st-syahadah-fill)", color: ahead ? "var(--st-hafazan-ink)" : "var(--st-syahadah-ink)", borderColor: "transparent" }}>
          <Icon name={ahead ? "trendUp" : "info"} size={13} /> {ahead ? "Di atas purata" : "Di bawah purata"}
        </span>
      </div>
    </div>
  );
}

/* ---------- sijil / milestone list (parent) ---------- */
function SijilCard({ st, onOpen }) {
  const ms = milestonesOf(st);
  const nextJuz = ms.count < 30 ? ms.count + 1 : null;
  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="trophy" size={17} style={{ color: "var(--accent)" }} />
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>Sijil & Pencapaian</h3>
        </div>
        <span className="mono" style={{ fontSize: 12, color: "var(--ink-3)" }}>{ms.count}/30 juz</span>
      </div>
      <p style={{ margin: "0 0 14px", fontSize: 12.5, color: "var(--ink-3)" }}>
        {ms.khatam ? "Tahniah — telah khatam 30 juzuk!" : `${ms.count} juzuk lengkap dihafaz`}
      </p>
      {ms.count === 0 ? (
        <div className="empty" style={{ padding: "20px 10px" }}><Icon name="trophy" size={24} /><div style={{ marginTop: 6, fontSize: 12.5 }}>Belum ada juzuk lengkap dihafaz.</div></div>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {ms.juz.map((j) => (
            <button key={j} onClick={() => onOpen({ type: "juz", juz: j })}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 99,
                border: "1px solid var(--accent)", background: "var(--accent-soft)", color: "var(--accent-deep)", fontWeight: 700, fontSize: 12.5 }}>
              <Icon name="star" size={13} /> Juz {j}
            </button>
          ))}
          {ms.khatam && (
            <button onClick={() => onOpen({ type: "khatam" })}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 99,
                border: "1px solid var(--gr-mumtaz)", background: "color-mix(in oklch, var(--gr-mumtaz) 12%, var(--surface))", color: "var(--gr-mumtaz)", fontWeight: 800, fontSize: 12.5 }}>
              <Icon name="trophy" size={13} /> Sijil Khatam
            </button>
          )}
        </div>
      )}
      {nextJuz && (
        <div style={{ marginTop: 14, fontSize: 12, color: "var(--ink-3)", display: "flex", alignItems: "center", gap: 7 }}>
          <Icon name="flame" size={14} style={{ color: "var(--st-murajaah-ink)" }} /> Seterusnya: lengkapkan <strong style={{ color: "var(--ink-2)" }}>Juz {nextJuz}</strong>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { paceOf, milestonesOf, cohortStats, peerStanding, PeerContextCard, SijilCard, MEMORIZED });
