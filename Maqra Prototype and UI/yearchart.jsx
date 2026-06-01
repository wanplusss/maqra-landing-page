/* ===========================================================================
   Maqra — yearly trend charts: cumulative & monthly (target vs actual)
   =========================================================================== */

/* 12-month calendar-year series (Jan–Dis), seeded per student around real pace.
   Monthly target = maahad standard (TARGET_PPM). */
function getYearSeries(st, year) {
  const a = getAnalytics(st);
  const tgt = targetOf(st);
  const seed = (parseInt(st.id.replace(/\D/g, "")) || 1) * 17 + 5;
  const r = rngA(seed);
  const base = clamp(a.ppm, 8, 28);            // anchor around the student's pace
  const nowMonth = TODAY.getFullYear() === year ? TODAY.getMonth() : 11;

  const monthly = [];
  let cum = 0, cumTarget = 0;
  for (let m = 0; m < 12; m++) {
    let val = Math.round(base * (0.62 + r() * 0.95));
    val = clamp(val, 6, 42);
    cum += val;
    cumTarget += tgt;
    monthly.push({
      label: MONTHS_SHORT[m],
      month: m,
      actual: val,
      target: tgt,
      cumActual: cum,
      cumTarget,
      future: m > nowMonth,
    });
  }
  return { monthly, nowMonth, year };
}

/* ---------- generic two-line chart ---------- */
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
    { key: "actual", color: "var(--accent)", arr: actual, dash: "", r: 3.8 },
  ];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block", overflow: "visible" }}>
      {/* y grid + labels */}
      {ticks.map((t) => (
        <g key={t}>
          <line x1={padL} y1={y(t)} x2={W - padR} y2={y(t)} stroke="var(--line-2)" strokeWidth="1" />
          <text x={padL - 9} y={y(t) + 3.5} textAnchor="end" fontSize="10" fill="var(--ink-3)" fontFamily="var(--font-mono)">{t}</text>
        </g>
      ))}
      {/* x labels */}
      {rows.map((d, i) => (
        <text key={i} x={x(i)} y={H - 9} textAnchor="middle" fontSize="10"
          fill={i === nowMonth ? "var(--accent-deep)" : "var(--ink-3)"}
          fontWeight={i === nowMonth ? 700 : 400}>{pick(d).label}</text>
      ))}
      {/* "Kini" guide */}
      {nowMonth != null && nowMonth >= 0 && (
        <line x1={x(nowMonth)} y1={padT} x2={x(nowMonth)} y2={H - padB}
          stroke="var(--ink-3)" strokeWidth="1" strokeDasharray="2 3" strokeOpacity="0.4" />
      )}
      {/* axis label */}
      <text transform={`rotate(-90 12 ${padT + innerH / 2})`} x={12} y={padT + innerH / 2}
        textAnchor="middle" fontSize="10.5" fill="var(--ink-3)" fontWeight="600">{yLabel}</text>
      {/* lines + markers */}
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
        <span key={it.label} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "var(--ink-2)", fontWeight: 600 }}>
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

/* ---------- yearly trend card (two charts) ---------- */
function YearTrendCard({ st }) {
  const yr = TODAY.getFullYear();
  const ys = useMemo(() => getYearSeries(st, yr), [st, yr]);
  const last = ys.monthly[ys.monthly.length - 1];
  const cumDiff = last.cumActual - last.cumTarget;

  return (
    <div className="card" style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="award" size={18} style={{ color: "var(--accent)" }} />
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800 }}>Tren Bacaan Tahunan {yr}</h3>
          </div>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--ink-3)" }}>Muka surat dibaca berbanding sasaran pelajar ({targetOf(st)} m.s./bulan)</p>
        </div>
        <span className="badge" style={{ background: cumDiff >= 0 ? "var(--st-hafazan-fill)" : "var(--st-syahadah-fill)", color: cumDiff >= 0 ? "var(--st-hafazan-ink)" : "var(--st-syahadah-ink)", borderColor: "transparent" }}>
          {cumDiff >= 0 ? "+" : ""}{cumDiff} m.s. berbanding sasaran
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, marginTop: 18 }}>
        {/* cumulative */}
        <div style={{ minWidth: 0 }}>
          <div style={{ marginBottom: 8 }}>
            <h4 style={{ margin: "0 0 7px", fontSize: 13.5, fontWeight: 700, color: "var(--ink-2)" }}>Kumulatif Setahun</h4>
            <ChartLegend items={[
              { label: "Target Kumulatif", color: "var(--ink-3)", dashed: true },
              { label: "Pencapaian Sebenar", color: "var(--accent)" },
            ]} />
          </div>
          <LineChart rows={ys.monthly} pick={(d) => ({ label: d.label, target: d.cumTarget, actual: d.cumActual })}
            yLabel="Jumlah terkumpul (m.s.)" niceStep={50} nowMonth={ys.nowMonth} />
        </div>

        {/* monthly */}
        <div style={{ minWidth: 0 }}>
          <div style={{ marginBottom: 8 }}>
            <h4 style={{ margin: "0 0 7px", fontSize: 13.5, fontWeight: 700, color: "var(--ink-2)" }}>Mengikut Bulan</h4>
            <ChartLegend items={[
              { label: "Target Bulanan", color: "var(--ink-3)", dashed: true },
              { label: "Pencapaian Sebenar", color: "var(--accent)" },
            ]} />
          </div>
          <LineChart rows={ys.monthly} pick={(d) => ({ label: d.label, target: d.target, actual: d.actual })}
            yLabel="Bilangan m.s." niceStep={10} nowMonth={ys.nowMonth} />
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { getYearSeries, LineChart, ChartLegend, YearTrendCard });
