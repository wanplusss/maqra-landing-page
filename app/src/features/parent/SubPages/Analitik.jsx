import { useState, useEffect } from "react";
import { Icon, Bar } from "../../../components/Shared.jsx";
import { AnalyticsService } from "../../analytics/service/AnalyticsService.js";
import { TasmikRepository } from "../../tasmik/repository/TasmikRepository.js";

const strengthBand = (s) => {
  if (s >= 70) return { key: "kukuh", label: "Kukuh", css: "hafazan" };
  if (s >= 42) return { key: "sederhana", label: "Sederhana", css: "murajaah" };
  return { key: "lemah", label: "Perlu Ulang", css: "syahadah" };
};

/* ---------- 1. Projection Chart component ---------- */
function ProjectionChart({ st, analytics }) {
  const W = 640, H = 230, padL = 38, padR = 16, padT = 18, padB = 28;
  const innerW = W - padL - padR, innerH = H - padT - padB;

  const t0 = new Date(st.enroll || "2024-01-08").getTime();
  const tNow = new Date().getTime(); // Baseline current date
  const daysToKhatam = analytics.daysToKhatam || 300;
  
  const tEnd = tNow + (daysToKhatam * 24 * 60 * 60 * 1000);
  const span = Math.max(tEnd - t0, 1);

  const xT = (t) => padL + ((t - t0) / span) * innerW;
  const yP = (p) => H - padB - (p / 604) * innerH;

  // Render path for past progress
  const chartData = analytics.chartData || [];
  const pastData = chartData.filter(d => d.actual !== null);

  const linePoints = [];
  // Build a realistic progress path from t0 to tNow
  linePoints.push(`${xT(t0).toFixed(1)},${yP(0).toFixed(1)}`);
  
  pastData.forEach((d, idx) => {
    const segmentTime = t0 + ((idx + 1) / (pastData.length)) * (tNow - t0);
    linePoints.push(`${xT(segmentTime).toFixed(1)},${yP(d.actual).toFixed(1)}`);
  });

  const line = linePoints.join(" ");
  const area = `${xT(t0).toFixed(1)},${yP(0).toFixed(1)} ${line} ${xT(tNow).toFixed(1)},${yP(0).toFixed(1)}`;
  
  const projPoints = [
    `${xT(tNow).toFixed(1)},${yP(st.frontier).toFixed(1)}`,
    `${xT(tEnd).toFixed(1)},${yP(604).toFixed(1)}`
  ];
  const proj = projPoints.join(" ");

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
      
      {/* indicators */}
      <line x1={xT(tNow)} y1={padT} x2={xT(tNow)} y2={H - padB} stroke="var(--ink-3)" strokeWidth="1" strokeDasharray="2 3" strokeOpacity="0.5" />
      <circle cx={xT(tNow)} cy={yP(st.frontier)} r="4.5" fill="var(--accent)" stroke="var(--surface)" strokeWidth="2" />
      <circle cx={xT(tEnd)} cy={yP(604)} r="5" fill="none" stroke="var(--accent)" strokeWidth="2" />
      
      <text x={xT(tNow)} y={H - 8} textAnchor="middle" fontSize="10" fill="var(--ink-2)" fontWeight="700">Kini</text>
      <text x={xT(t0)} y={H - 8} textAnchor="start" fontSize="10" fill="var(--ink-3)" fontFamily="var(--font-mono)">{new Date(st.enroll).getFullYear()}</text>
      <text x={W - padR} y={H - 8} textAnchor="end" fontSize="10" fill="var(--accent-deep)" fontWeight="700">
        {analytics.khatamDate ? analytics.khatamDate.split(" ")[1] + " " + analytics.khatamDate.split(" ")[2] : "—"}
      </text>
    </svg>
  );
}

/* ---------- 2. Circular SVG Progress Ring component ---------- */
function Ring({ pct, size = 132, stroke = 13, color = "var(--accent)", children }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const cl = Math.max(0, Math.min(1, pct));
  const off = c * (1 - cl);

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line-2)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={off} style={{ transition: "stroke-dashoffset .7s cubic-bezier(.2,.8,.2,1)" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center" }}>
        {children}
      </div>
    </div>
  );
}

/* ---------- 3. Year Trend Line Chart component ---------- */
function LineChart({ rows, pick, yLabel, niceStep, nowMonth }) {
  const W = 660, H = 250, padL = 46, padR = 18, padT = 18, padB = 30;
  const innerW = W - padL - padR, innerH = H - padT - padB;

  const target = rows.map((d) => pick(d).target);
  const actual = rows.map((d) => pick(d).actual);
  const rawMax = Math.max(...target, ...actual, 1);
  const yMax = Math.ceil(rawMax / niceStep) * niceStep;

  const x = (i) => padL + (rows.length === 1 ? 0 : (i / (rows.length - 1)) * innerW);
  const y = (v) => padT + innerH - (v / yMax) * innerH;

  const ticks = [];
  for (let t = 0; t <= yMax; t += niceStep) ticks.push(t);

  const path = (arr) => arr.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");

  const SERIES = [
    { key: "target", color: "var(--ink-3)", arr: target, dash: "5 5", r: 3.2 },
    { key: "actual", color: "var(--accent)", arr: actual, dash: "", r: 3.8 }
  ];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block", overflow: "visible" }}>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={padL} y1={y(t)} x2={W - padR} y2={y(t)} stroke="var(--line-2)" strokeWidth="1" />
          <text x={padL - 9} y={y(t) + 3.5} textAnchor="end" fontSize="10" fill="var(--ink-3)" fontFamily="var(--font-mono)">{t}</text>
        </g>
      ))}
      {rows.map((d, i) => (
        <text key={i} x={x(i)} y={H - 9} textAnchor="middle" fontSize="10"
          fill={i === nowMonth ? "var(--accent-deep)" : "var(--ink-3)"}
          fontWeight={i === nowMonth ? 700 : 400}>{pick(d).label}</text>
      ))}
      {nowMonth != null && nowMonth >= 0 && (
        <line x1={x(nowMonth)} y1={padT} x2={x(nowMonth)} y2={H - padB}
          stroke="var(--ink-3)" strokeWidth="1" strokeDasharray="2 3" strokeOpacity="0.4" />
      )}
      <text transform={`rotate(-90 12 ${padT + innerH / 2})`} x={12} y={padT + innerH / 2}
        textAnchor="middle" fontSize="10.5" fill="var(--ink-3)" fontWeight="600">{yLabel}</text>
      {SERIES.map((s) => (
        <g key={s.key}>
          <polyline points={path(s.arr)} fill="none" stroke={s.color} strokeWidth="2.2"
            strokeLinejoin="round" strokeLinecap="round" strokeDasharray={s.dash}
            strokeOpacity={s.key === "target" ? 0.85 : 1} />
          {s.arr.map((v, i) => (
            <circle key={i} cx={x(i)} cy={y(v)} r={s.r} fill="var(--surface)" stroke={s.color} strokeWidth="2" />
          ))}
        </g>
      ))}
    </svg>
  );
}

function ChartLegend({ items }) {
  return (
    <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
      {items.map((it) => (
        <span key={it.label} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: "12.5px", color: "var(--ink-2)", fontWeight: 600 }}>
          <span style={{ width: 22, height: 0, position: "relative", display: "inline-flex", alignItems: "center" }}>
            <span style={{ width: 22, borderTop: `2px ${it.dashed ? "dashed" : "solid"} ${it.color}`, opacity: it.dashed ? 0.85 : 1 }} />
            <span style={{ position: "absolute", left: 7, width: 8, height: 8, borderRadius: 99, background: "var(--surface)", border: `2px solid ${it.color}` }} />
          </span>
          {it.label}
        </span>
      ))}
    </div>
  );
}

export function Analitik({ st }) {
  const [predictions, setPredictions] = useState(null);
  const [targetVsAchieved, setTargetVsAchieved] = useState(null);
  const [murajaahPlan, setMurajaahPlan] = useState([]);
  const [revisedJuz, setRevisedJuz] = useState({});

  useEffect(() => {
    async function loadData() {
      const pred = await AnalyticsService.predictKhatam(st.id);
      const tgt = await AnalyticsService.getTargetVsAchieved(st.id);
      const plan = await AnalyticsService.getMurajaahPlan(st.id);
      
      setPredictions(pred);
      setTargetVsAchieved(tgt);
      setMurajaahPlan(plan);
    }
    loadData();
  }, [st.id]);

  const markRevised = async (juzNum) => {
    // Record in local state
    setRevisedJuz((prev) => ({ ...prev, [juzNum]: true }));
    
    // Save a simulated murajaah session record
    await TasmikRepository.saveRecord({
      studentId: st.id,
      kategori: "Murajaah AM",
      gred: "Mumtaz",
      from: (juzNum - 1) * 20 + 1,
      to: Math.min(604, juzNum * 20),
      juzuk: juzNum,
      ulasan: "Selesai murajaah juzuk kendiri dengan baik.",
      masalah: "—",
      cadangan: "Teruskan hafazan seterusnya.",
      guru: "Ustaz / Ustazah Pengawas"
    });

    // Reload decay plan
    const updatedPlan = await AnalyticsService.getMurajaahPlan(st.id);
    setMurajaahPlan(updatedPlan);
  };

  if (!predictions || !targetVsAchieved) {
    return <div className="empty" style={{ padding: "80px 20px" }}>Mengira statistik analitik pelajar...</div>;
  }

  // Visual averages
  const dueCount = murajaahPlan.filter((r) => (revisedJuz[r.juzuk] ? 100 : r.strength) < 70).length;
  const avgStrength = Math.round(
    murajaahPlan.reduce((s, r) => s + (revisedJuz[r.juzuk] ? 100 : r.strength), 0) / Math.max(murajaahPlan.length, 1)
  );

  // Generate Year Trend Series Data (Deterministic but dynamic)
  const yr = 2026;
  const ys = [];
  let cumActual = 0;
  let cumTarget = 0;
  const MONTHS_SHORT = ["Jan", "Feb", "Mac", "Apr", "Mei", "Jun", "Jul", "Ogo", "Sep", "Okt", "Nov", "Dis"];
  
  for (let m = 0; m < 12; m++) {
    const act = Math.max(5, Math.round((predictions.pace * 0.7) + ((m + st.name.charCodeAt(0)) % 6) * 2));
    cumActual += act;
    cumTarget += st.target || 15;
    ys.push({
      label: MONTHS_SHORT[m],
      target: st.target || 15,
      actual: act,
      cumTarget,
      cumActual
    });
  }

  const cumDiff = cumActual - cumTarget;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      
      {/* 1. Khatam Forecast & Target Achievements Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 22, alignItems: "stretch" }}>
        
        {/* Khatam Card */}
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
              <div style={{ fontSize: 25, fontWeight: 800, letterSpacing: "-0.02em", color: "var(--accent-deep)" }}>
                {predictions.khatamDate}
              </div>
              <div style={{ fontSize: 12, color: "var(--ink-3)" }}>± 2 bulan · unjuran</div>
            </div>
          </div>
          <ProjectionChart st={st} analytics={predictions} />
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 18 }}>
            <div style={{ background: "var(--surface-2)", border: "1px solid var(--line)", borderRadius: 12, padding: "12px 14px" }}>
              <div style={{ fontSize: 11.5, color: "var(--ink-3)", fontWeight: 600, marginBottom: 5 }}>Kadar hafazan</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontSize: 22, fontWeight: 800 }} className="mono">{predictions.pace}</span>
                <span style={{ fontSize: 11.5, color: "var(--ink-3)" }}>m.s./bulan</span>
              </div>
            </div>
            <div style={{ background: "var(--surface-2)", border: "1px solid var(--line)", borderRadius: 12, padding: "12px 14px" }}>
              <div style={{ fontSize: 11.5, color: "var(--ink-3)", fontWeight: 600, marginBottom: 5 }}>Baki muka surat</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontSize: 22, fontWeight: 800 }} className="mono">{604 - st.frontier}</span>
                <span style={{ fontSize: 11.5, color: "var(--ink-3)" }}>m.s.</span>
              </div>
            </div>
            <div style={{ background: "var(--surface-2)", border: "1px solid var(--line)", borderRadius: 12, padding: "12px 14px" }}>
              <div style={{ fontSize: 11.5, color: "var(--ink-3)", fontWeight: 600, marginBottom: 5 }}>Jangkaan baki</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontSize: 22, fontWeight: 800 }} className="mono">{Math.round(predictions.daysToKhatam / 30.4)}</span>
                <span style={{ fontSize: 11.5, color: "var(--ink-3)" }}>bulan lagi</span>
              </div>
            </div>
          </div>
        </div>

        {/* Target Achievements */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <Icon name="award" size={18} style={{ color: "var(--accent)" }} />
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800 }}>Sasaran vs Pencapaian</h3>
          </div>
          <p style={{ margin: "0 0 18px", fontSize: 13, color: "var(--ink-3)" }}>Sasaran pelajar: {st.target || 15} m.s. sebulan</p>
          
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 20, alignItems: "center" }}>
            <Ring pct={predictions.pace / (st.target || 15)} color={predictions.pace >= (st.target || 15) ? "var(--st-hafazan-ink)" : "var(--st-murajaah-ink)"}>
              <div>
                <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.03em" }}>
                  {Math.round((predictions.pace / (st.target || 15)) * 100)}%
                </div>
                <div style={{ fontSize: 11, color: "var(--ink-3)" }}>bulan ini</div>
              </div>
            </Ring>
            <div>
              <div style={{ display: "flex", gap: 14, marginBottom: 12 }}>
                <div><div className="mono" style={{ fontSize: 20, fontWeight: 800 }}>{predictions.pace}</div><div style={{ fontSize: 11, color: "var(--ink-3)" }}>Kadar semasa</div></div>
                <div><div className="mono" style={{ fontSize: 20, fontWeight: 800, color: "var(--ink-3)" }}>{st.target || 15}</div><div style={{ fontSize: 11, color: "var(--ink-3)" }}>Disasarkan</div></div>
              </div>
              
              {/* 6-month bars mock graph */}
              <div className="keepgrid" style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 6, alignItems: "end", height: 70, paddingTop: 4 }}>
                {targetVsAchieved.barChart.map((m, i) => {
                  const h = Math.min(100, (m.actual / (st.target || 15)) * 100);
                  const hit = m.actual >= (st.target || 15);
                  return (
                    <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <div style={{ height: 50, display: "flex", alignItems: "flex-end", width: "100%" }}>
                        <div style={{ width: "100%", height: `${Math.max(3, h * 0.5)}px`, borderRadius: 4, background: hit ? "var(--accent)" : "var(--line)" }} />
                      </div>
                      <span style={{ fontSize: 9.5, color: "var(--ink-3)" }}>{m.label}</span>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
          <hr className="divider" style={{ margin: "18px 0 14px" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div style={{ fontSize: 13, color: "var(--ink-2)" }}>Sasaran tahunan: <strong>Juz {targetVsAchieved.yearlyJuz.target}</strong></div>
            <span className="badge" style={{ background: "var(--accent-soft)", color: "var(--accent-deep)", borderColor: "transparent" }}>
              Kini Juz {targetVsAchieved.yearlyJuz.achieved} {targetVsAchieved.yearlyJuz.completed ? "🎉 On-Track" : "⚠️ Behind"}
            </span>
          </div>
        </div>

      </div>

      {/* 2. Yearly Progression Line Charts */}
      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4, flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="award" size={18} style={{ color: "var(--accent)" }} />
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800 }}>Tren Bacaan Tahunan {yr}</h3>
            </div>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--ink-3)" }}>Muka surat dibaca berbanding sasaran bulanan</p>
          </div>
          <span className="badge" style={{ background: cumDiff >= 0 ? "var(--st-hafazan-fill)" : "var(--st-syahadah-fill)", color: cumDiff >= 0 ? "var(--st-hafazan-ink)" : "var(--st-syahadah-ink)", borderColor: "transparent" }}>
            {cumDiff >= 0 ? "+" : ""}{cumDiff} m.s. berbanding sasaran setahun
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, marginTop: 18 }}>
          <div>
            <div style={{ marginBottom: 8 }}>
              <h4 style={{ margin: "0 0 7px", fontSize: "13.5px", fontWeight: 700, color: "var(--ink-2)" }}>Kumulatif Setahun</h4>
              <ChartLegend items={[
                { label: "Target Kumulatif", color: "var(--ink-3)", dashed: true },
                { label: "Pencapaian Sebenar", color: "var(--accent)" }
              ]} />
            </div>
            <LineChart rows={ys} pick={(d) => ({ label: d.label, target: d.cumTarget, actual: d.cumActual })}
              yLabel="Jumlah terkumpul (m.s.)" niceStep={100} nowMonth={4} />
          </div>
          <div>
            <div style={{ marginBottom: 8 }}>
              <h4 style={{ margin: "0 0 7px", fontSize: "13.5px", fontWeight: 700, color: "var(--ink-2)" }}>Mengikut Bulan</h4>
              <ChartLegend items={[
                { label: "Target Bulanan", color: "var(--ink-3)", dashed: true },
                { label: "Pencapaian Sebenar", color: "var(--accent)" }
              ]} />
            </div>
            <LineChart rows={ys} pick={(d) => ({ label: d.label, target: d.target, actual: d.actual })}
              yLabel="Bilangan m.s." niceStep={10} nowMonth={4} />
          </div>
        </div>
      </div>

      {/* 3. Murajaah Priority Planner */}
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
            <span className="badge" style={{ background: "var(--st-syahadah-fill)", color: "var(--st-syahadah-ink)", borderColor: "transparent" }}>
              {dueCount} juzuk perlu ulang
            </span>
            <span className="badge">Kekuatan Purata {avgStrength}%</span>
          </div>
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(232px, 1fr))", gap: 12 }}>
          {murajaahPlan.map((r) => {
            const currentStrength = revisedJuz[r.juzuk] ? 100 : r.strength;
            const band = strengthBand(currentStrength);
            return (
              <div key={r.juzuk} style={{ border: "1px solid var(--line)", borderRadius: 14, padding: 15, background: "var(--surface-2)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontWeight: 800, fontSize: 15 }}>Juzuk {r.juzuk}</span>
                  <span className="badge" style={{ background: `var(--st-${band.css}-fill)`, color: `var(--st-${band.css}-ink)`, borderColor: "transparent", fontSize: 11 }}>
                    {band.label}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: "var(--ink-3)", marginBottom: 12 }}>m.s. {r.pages}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 6 }}>
                  <div style={{ flex: 1 }}><Bar value={currentStrength} tone={`var(--st-${band.css}-ink)`} height={7} /></div>
                  <span className="mono" style={{ fontSize: 12, fontWeight: 700, width: 34, textAlign: "right" }}>{currentStrength}%</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                  <span style={{ fontSize: "11.5px", color: "var(--ink-3)" }}>
                    {revisedJuz[r.juzuk] ? "Dimurajaah hari ini" : r.lastRevised}
                  </span>
                  <button 
                    className="btn btn-sm" 
                    onClick={() => markRevised(r.juzuk)} 
                    disabled={!!revisedJuz[r.juzuk]} 
                    style={{ opacity: revisedJuz[r.juzuk] ? 0.5 : 1 }}
                  >
                    <Icon name="check" size={13} /> Ulang
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
export default Analitik;
