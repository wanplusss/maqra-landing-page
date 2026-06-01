/* ===========================================================================
   Maqra — analytics: khatam projection, murajaah strength, targets
   =========================================================================== */

const TODAY = new Date(2026, 4, 31);
const MONTHS_MS = ["Januari", "Februari", "Mac", "April", "Mei", "Jun", "Julai", "Ogos", "September", "Oktober", "November", "Disember"];
const MONTHS_SHORT = ["Jan", "Feb", "Mac", "Apr", "Mei", "Jun", "Jul", "Ogos", "Sep", "Okt", "Nov", "Dis"];
const monthYear = (d) => `${MONTHS_MS[d.getMonth()]} ${d.getFullYear()}`;

function rngA(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
function monthsBetween(a, b) { return (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth()) + (b.getDate() - a.getDate()) / 30.4; }
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

const TARGET_PPM = 15; // sasaran lalai maahad: 15 muka surat / bulan
function targetOf(st) { return st && st.target ? st.target : TARGET_PPM; }

function getAnalytics(st) {
  const seed = parseInt(st.id.replace(/\D/g, "")) || 1;
  const enroll = new Date(st.enroll || "2024-01-08");
  const months = Math.max(1.5, monthsBetween(enroll, TODAY));
  const ppm = st.frontier / months;                 // pace muka surat / bulan
  const remaining = 604 - st.frontier;
  const monthsLeft = ppm > 0.5 ? remaining / ppm : null;
  let khatamDate = null;
  if (monthsLeft != null) { khatamDate = new Date(TODAY); khatamDate.setMonth(khatamDate.getMonth() + Math.round(monthsLeft)); }
  const ready = st.frontier >= 5;

  // 6-month achieved series (seeded around pace)
  const r = rngA(seed * 13 + 7);
  const series = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(TODAY); d.setMonth(d.getMonth() - i);
    let val = Math.round(ppm * (0.6 + r() * 0.85));
    val = clamp(val, 2, 26);
    series.push({ label: MONTHS_SHORT[d.getMonth()], val });
  }
  const achieved = series[series.length - 1].val;

  // yearly target — juzuk sasaran menjelang akhir tahun
  const monthsToDec = monthsBetween(TODAY, new Date(2026, 11, 31));
  const projDecPage = clamp(Math.round(st.frontier + ppm * monthsToDec), st.frontier, 604);
  const targetJuz = clamp(MAQRA.juzukOf(st.frontier) + 4, 1, 30);
  const currentJuz = MAQRA.juzukOf(st.frontier);

  // murajaah: per-juzuk memory strength (decays since last revision)
  const rm = rngA(seed * 31 + 3);
  const juzScope = Math.max(1, MAQRA.juzukOf(st.frontier));
  const murajaah = [];
  for (let j = 1; j <= juzScope; j++) {
    const [s0, s1] = MAQRA.juzPages(j);
    if (st.frontier < s0) break;
    const days = 1 + Math.floor(rm() * 74);
    murajaah.push({ juz: j, days, surah: MAQRA.surahOf(s0), pages: [s0, Math.min(s1, st.frontier)] });
  }

  return { enroll, months, ppm, remaining, monthsLeft, khatamDate, ready, series, achieved, targetJuz, currentJuz, projDecPage, monthsToDec, murajaah, target: targetOf(st) };
}

const strengthOf = (days) => clamp(Math.round(100 - days * 1.45), 4, 100);
function strengthBand(s) {
  if (s >= 70) return { key: "kukuh", label: "Kukuh", css: "hafazan" };
  if (s >= 42) return { key: "sederhana", label: "Sederhana", css: "murajaah" };
  return { key: "lemah", label: "Perlu Ulang", css: "syahadah" };
}

/* ---------- projection chart ---------- */
function ProjectionChart({ st, a }) {
  const W = 640, H = 230, padL = 38, padR = 16, padT = 18, padB = 28;
  const t0 = a.enroll.getTime(), tEnd = (a.khatamDate || TODAY).getTime(), tNow = TODAY.getTime();
  const span = Math.max(tEnd - t0, 1);
  const xT = (t) => padL + ((t - t0) / span) * (W - padL - padR);
  const yP = (p) => H - padB - (p / 604) * (H - padT - padB);

  const hist = [...st.history].sort((x, y) => x.date - y.date);
  const pts = [[t0, 0], ...hist.map((h) => [h.date.getTime(), h.to]), [tNow, st.frontier]]
    .filter((p) => p[0] >= t0 && p[0] <= tNow);
  const line = pts.map((p) => `${xT(p[0]).toFixed(1)},${yP(p[1]).toFixed(1)}`).join(" ");
  const area = `${xT(t0).toFixed(1)},${yP(0).toFixed(1)} ${line} ${xT(tNow).toFixed(1)},${yP(0).toFixed(1)}`;
  const proj = `${xT(tNow).toFixed(1)},${yP(st.frontier).toFixed(1)} ${xT(tEnd).toFixed(1)},${yP(604).toFixed(1)}`;

  const yTicks = [0, 151, 302, 453, 604];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id="projfill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {yTicks.map((p) => (
        <g key={p}>
          <line x1={padL} y1={yP(p)} x2={W - padR} y2={yP(p)} stroke="var(--line-2)" strokeWidth="1" strokeDasharray={p === 604 ? "3 3" : ""} />
          <text x={padL - 8} y={yP(p) + 3} textAnchor="end" fontSize="10" fill="var(--ink-3)" fontFamily="var(--font-mono)">{p}</text>
        </g>
      ))}
      <polygon points={area} fill="url(#projfill)" />
      <polyline points={line} fill="none" stroke="var(--accent)" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
      <polyline points={proj} fill="none" stroke="var(--accent)" strokeWidth="2.2" strokeDasharray="5 5" strokeOpacity="0.65" />
      {/* today marker */}
      <line x1={xT(tNow)} y1={padT} x2={xT(tNow)} y2={H - padB} stroke="var(--ink-3)" strokeWidth="1" strokeDasharray="2 3" strokeOpacity="0.5" />
      <circle cx={xT(tNow)} cy={yP(st.frontier)} r="4.5" fill="var(--accent)" stroke="var(--surface)" strokeWidth="2" />
      <circle cx={xT(tEnd)} cy={yP(604)} r="5" fill="none" stroke="var(--accent)" strokeWidth="2" />
      <text x={xT(tNow)} y={H - 8} textAnchor="middle" fontSize="10" fill="var(--ink-2)" fontWeight="700">Kini</text>
      <text x={xT(t0)} y={H - 8} textAnchor="start" fontSize="10" fill="var(--ink-3)" fontFamily="var(--font-mono)">{a.enroll.getFullYear()}</text>
      <text x={W - padR} y={H - 8} textAnchor="end" fontSize="10" fill="var(--accent-deep)" fontWeight="700">{a.khatamDate ? monthYear(a.khatamDate) : "—"}</text>
    </svg>
  );
}

/* ---------- khatam prediction card ---------- */
function KhatamCard({ st }) {
  const a = getAnalytics(st);
  if (!a.ready) return (
    <div className="card" style={{ padding: 22 }}>
      <div className="empty" style={{ padding: "28px 10px" }}><Icon name="sparkle" size={26} /><div style={{ marginTop: 8 }}>Belum cukup data untuk ramalan.</div></div>
    </div>
  );
  return (
    <div className="card" style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="sparkle" size={18} style={{ color: "var(--accent)" }} />
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800 }}>Ramalan Khatam 30 Juzuk</h3>
          </div>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--ink-3)" }}>Unjuran berdasarkan kadar hafazan semasa</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 25, fontWeight: 800, letterSpacing: "-0.02em", color: "var(--accent-deep)" }}>{monthYear(a.khatamDate)}</div>
          <div style={{ fontSize: 12, color: "var(--ink-3)" }}>± 2 bulan · anggaran</div>
        </div>
      </div>
      <ProjectionChart st={st} a={a} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginTop: 18 }}>
        <MiniStat label="Kadar hafazan" value={a.ppm.toFixed(1)} unit="m.s./bulan" />
        <MiniStat label="Baki muka surat" value={a.remaining} unit={`dari 604`} />
        <MiniStat label="Anggaran baki" value={Math.round(a.monthsLeft)} unit="bulan lagi" />
      </div>
    </div>
  );
}
function MiniStat({ label, value, unit }) {
  return (
    <div style={{ background: "var(--surface-2)", border: "1px solid var(--line)", borderRadius: 12, padding: "12px 14px" }}>
      <div style={{ fontSize: 11.5, color: "var(--ink-3)", fontWeight: 600, marginBottom: 5 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
        <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em" }} className="mono">{value}</span>
        <span style={{ fontSize: 11.5, color: "var(--ink-3)" }}>{unit}</span>
      </div>
    </div>
  );
}

/* ---------- compact khatam teaser (dashboards) ---------- */
function KhatamMini({ st, onOpen }) {
  const a = getAnalytics(st);
  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <Icon name="sparkle" size={16} style={{ color: "var(--accent)" }} />
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>Ramalan Khatam</h3>
      </div>
      {a.ready ? (
        <>
          <div style={{ fontSize: 27, fontWeight: 800, letterSpacing: "-0.02em", color: "var(--accent-deep)", lineHeight: 1.1 }}>{monthYear(a.khatamDate)}</div>
          <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 4 }}>pada kadar {a.ppm.toFixed(1)} m.s./bulan · {Math.round(a.monthsLeft)} bulan lagi</div>
          <div style={{ marginTop: 14 }}><Bar value={st.progress} /></div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 7, fontSize: 11.5, color: "var(--ink-3)" }} className="mono"><span>{st.frontier} m.s.</span><span>604 m.s.</span></div>
          {onOpen && <button className="btn btn-sm" style={{ width: "100%", justifyContent: "center", marginTop: 14 }} onClick={onOpen}>Lihat analitik penuh <Icon name="arrowR" size={14} /></button>}
        </>
      ) : <div style={{ fontSize: 13, color: "var(--ink-3)" }}>Belum cukup data.</div>}
    </div>
  );
}

/* ---------- ring ---------- */
function Ring({ pct, size = 132, stroke = 13, color = "var(--accent)", children }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r, off = c * (1 - clamp(pct, 0, 1));
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line-2)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={off} style={{ transition: "stroke-dashoffset .7s cubic-bezier(.2,.8,.2,1)" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center" }}>{children}</div>
    </div>
  );
}

/* ---------- target vs achieved ---------- */
function TargetCard({ st }) {
  const a = getAnalytics(st);
  const TGT = a.target;
  const pct = a.achieved / TGT;
  const max = Math.max(TGT, ...a.series.map((s) => s.val)) * 1.15;
  return (
    <div className="card" style={{ padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <Icon name="award" size={18} style={{ color: "var(--accent)" }} />
        <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800 }}>Sasaran vs Pencapaian</h3>
      </div>
      <p style={{ margin: "0 0 18px", fontSize: 13, color: "var(--ink-3)" }}>Sasaran pelajar: {TGT} muka surat sebulan{st.target ? " · peribadi" : " · lalai maahad"}</p>
      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 24, alignItems: "center" }}>
        <Ring pct={pct} color={pct >= 1 ? "var(--st-hafazan-ink)" : pct >= 0.7 ? "var(--accent)" : "var(--st-murajaah-ink)"}>
          <div>
            <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.03em" }}>{Math.round(pct * 100)}%</div>
            <div style={{ fontSize: 11, color: "var(--ink-3)" }}>bulan ini</div>
          </div>
        </Ring>
        <div>
          <div style={{ display: "flex", gap: 20, marginBottom: 16 }}>
            <div><div className="mono" style={{ fontSize: 22, fontWeight: 800 }}>{a.achieved}</div><div style={{ fontSize: 12, color: "var(--ink-3)" }}>Dicapai (m.s.)</div></div>
            <div><div className="mono" style={{ fontSize: 22, fontWeight: 800, color: "var(--ink-3)" }}>{TGT}</div><div style={{ fontSize: 12, color: "var(--ink-3)" }}>Disasarkan</div></div>
            <div><div className="mono" style={{ fontSize: 22, fontWeight: 800, color: a.achieved >= TGT ? "var(--st-hafazan-ink)" : "var(--st-syahadah-ink)" }}>{a.achieved >= TGT ? "+" : ""}{a.achieved - TGT}</div><div style={{ fontSize: 12, color: "var(--ink-3)" }}>Beza</div></div>
          </div>
          {/* 6-month bars */}
          <div className="keepgrid" style={{ position: "relative", display: "grid", gridTemplateColumns: `repeat(${a.series.length},1fr)`, gap: 10, alignItems: "end", height: 96, paddingTop: 4 }}>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: `${(TGT / max) * 92 + 4}px`, borderTop: "1.5px dashed var(--st-murajaah-ink)", opacity: 0.6 }} />
            {a.series.map((m, i) => {
              const h = (m.val / max) * 92;
              const hit = m.val >= TGT;
              return (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <div style={{ height: 92, display: "flex", alignItems: "flex-end", width: "100%" }}>
                    <div style={{ width: "100%", height: Math.max(h, 3), borderRadius: 5, background: hit ? "var(--accent)" : "var(--line)", transition: "height .5s" }} title={`${m.val} m.s.`} />
                  </div>
                  <span style={{ fontSize: 10.5, color: "var(--ink-3)" }}>{m.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <hr className="divider" style={{ margin: "18px 0 14px" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div style={{ fontSize: 13, color: "var(--ink-2)" }}>Sasaran tahunan: <strong>Juz {a.targetJuz}</strong> menjelang {monthYear(new Date(2026, 11, 31))}</div>
        <span className="badge" style={{ background: "var(--accent-soft)", color: "var(--accent-deep)", borderColor: "transparent" }}>Kini Juz {a.currentJuz} · unjuran Juz {MAQRA.juzukOf(a.projDecPage)}</span>
      </div>
    </div>
  );
}

/* ---------- murajaah plan ---------- */
function MurajaahPanel({ st }) {
  const a = useMemo(() => getAnalytics(st), [st]);
  const [days, setDays] = useState(() => Object.fromEntries(a.murajaah.map((m) => [m.juz, m.days])));
  const [toast, showToast] = useToast();

  const rows = a.murajaah.map((m) => ({ ...m, days: days[m.juz], strength: strengthOf(days[m.juz]) }))
    .sort((x, y) => x.strength - y.strength);
  const due = rows.filter((r) => r.strength < 70).length;
  const avg = Math.round(rows.reduce((s, r) => s + r.strength, 0) / Math.max(rows.length, 1));

  const mark = (juz) => { setDays((d) => ({ ...d, [juz]: 0 })); showToast(`Juz ${juz} ditanda telah dimurajaah`, "ok"); };

  return (
    <div className="card" style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="refresh" size={18} style={{ color: "var(--accent)" }} />
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800 }}>Pelan Murajaah</h3>
          </div>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--ink-3)" }}>Kekuatan ingatan menurun mengikut masa — utamakan juzuk paling lemah</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <span className="badge" style={{ background: "var(--st-syahadah-fill)", color: "var(--st-syahadah-ink)", borderColor: "transparent" }}>{due} juzuk perlu ulang</span>
          <span className="badge">Purata {avg}%</span>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(232px, 1fr))", gap: 12 }}>
        {rows.map((r) => {
          const band = strengthBand(r.strength);
          return (
            <div key={r.juz} style={{ border: "1px solid var(--line)", borderRadius: 14, padding: 15, background: "var(--surface-2)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <span style={{ fontWeight: 800, fontSize: 15 }}>Juzuk {r.juz}</span>
                <span className="badge" style={{ background: `var(--st-${band.css}-fill)`, color: `var(--st-${band.css}-ink)`, borderColor: "transparent", fontSize: 11 }}>{band.label}</span>
              </div>
              <div style={{ fontSize: 12, color: "var(--ink-3)", marginBottom: 12 }}>Surah {r.surah} · m.s. {r.pages[0]}–{r.pages[1]}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 6 }}>
                <div style={{ flex: 1 }}><Bar value={r.strength} tone={`var(--st-${band.css}-ink)`} height={7} /></div>
                <span className="mono" style={{ fontSize: 12, fontWeight: 700, width: 34, textAlign: "right" }}>{r.strength}%</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                <span style={{ fontSize: 11.5, color: "var(--ink-3)" }}>{r.days === 0 ? "Dimurajaah hari ini" : `${r.days} hari lalu`}</span>
                <button className="btn btn-sm" onClick={() => mark(r.juz)} disabled={r.days === 0} style={{ opacity: r.days === 0 ? 0.5 : 1 }}>
                  <Icon name="check" size={13} /> Tanda
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {toast}
    </div>
  );
}

/* ---------- full analytics page ---------- */
function Analitik({ st }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.55fr 1fr", gap: 22, alignItems: "stretch" }}>
        <KhatamCard st={st} />
        <TargetCard st={st} />
      </div>
      <PeerContextCard st={st} />
      <YearTrendCard st={st} />
      <MurajaahPanel st={st} />
    </div>
  );
}

Object.assign(window, { getAnalytics, Analitik, KhatamCard, KhatamMini, TargetCard, MurajaahPanel, monthYear, TODAY, targetOf });
