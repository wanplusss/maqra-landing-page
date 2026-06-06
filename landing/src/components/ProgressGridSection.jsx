import { useState, useRef } from 'react';

const JUZ_START = [
  1, 22, 42, 62, 82, 102, 121, 142, 162, 182,
  202, 222, 242, 262, 282, 302, 322, 342, 362, 382,
  402, 422, 442, 462, 482, 502, 522, 542, 562, 582,
];

const SURAH = [
  [1, "Al-Fatihah"], [2, "Al-Baqarah"], [50, "Ali 'Imran"], [77, "An-Nisa'"], [106, "Al-Ma'idah"],
  [128, "Al-An'am"], [151, "Al-A'raf"], [177, "Al-Anfal"], [187, "At-Taubah"], [208, "Yunus"],
  [221, "Hud"], [235, "Yusuf"], [249, "Ar-Ra'd"], [255, "Ibrahim"], [262, "Al-Hijr"],
  [267, "An-Nahl"], [282, "Al-Isra'"], [293, "Al-Kahfi"], [305, "Maryam"], [312, "Ta-Ha"],
  [322, "Al-Anbiya'"], [332, "Al-Hajj"], [342, "Al-Mu'minun"], [350, "An-Nur"], [359, "Al-Furqan"],
  [367, "Asy-Syu'ara'"], [377, "An-Naml"], [385, "Al-Qasas"], [396, "Al-'Ankabut"], [404, "Ar-Rum"],
  [411, "Luqman"], [415, "As-Sajdah"], [418, "Al-Ahzab"], [428, "Saba'"], [434, "Fatir"],
  [440, "Ya-Sin"], [446, "As-Saffat"], [453, "Sad"], [458, "Az-Zumar"], [467, "Ghafir"],
  [477, "Fussilat"], [483, "Asy-Syura"], [489, "Az-Zukhruf"], [496, "Ad-Dukhan"], [499, "Al-Jathiyah"],
  [502, "Al-Ahqaf"], [507, "Muhammad"], [511, "Al-Fath"], [515, "Al-Hujurat"], [518, "Qaf"],
  [520, "Az-Zariyat"], [523, "At-Tur"], [526, "An-Najm"], [528, "Al-Qamar"], [531, "Ar-Rahman"],
  [534, "Al-Waqi'ah"], [537, "Al-Hadid"], [542, "Al-Mujadalah"], [545, "Al-Hasyr"], [549, "Al-Mumtahanah"],
  [551, "As-Saff"], [553, "Al-Jumu'ah"], [554, "Al-Munafiqun"], [556, "At-Taghabun"], [558, "At-Talaq"],
  [560, "At-Tahrim"], [562, "Al-Mulk"], [564, "Al-Qalam"], [566, "Al-Haqqah"], [568, "Al-Ma'arij"],
  [570, "Nuh"], [572, "Al-Jinn"], [574, "Al-Muzzammil"], [575, "Al-Muddaththir"], [577, "Al-Qiyamah"],
  [578, "Al-Insan"], [580, "Al-Mursalat"], [582, "An-Naba'"], [583, "An-Nazi'at"], [585, "'Abasa"],
  [586, "At-Takwir"], [587, "Al-Infitar"], [587, "Al-Mutaffifin"], [589, "Al-Insyiqaq"], [590, "Al-Buruj"],
  [591, "At-Tariq"], [591, "Al-A'la"], [592, "Al-Ghasyiyah"], [593, "Al-Fajr"], [594, "Al-Balad"],
  [595, "Asy-Syams"], [595, "Al-Lail"], [596, "Ad-Duha"], [596, "Asy-Syarh"], [597, "At-Tin"],
  [597, "Al-'Alaq"], [598, "Al-Qadr"], [598, "Al-Bayyinah"], [599, "Az-Zalzalah"], [599, "Al-'Adiyat"],
  [600, "Al-Qari'ah"], [600, "At-Takathur"], [601, "Al-'Asr"], [601, "Al-Humazah"], [601, "Al-Fil"],
  [602, "Quraisy"], [602, "Al-Ma'un"], [602, "Al-Kauthar"], [603, "Al-Kafirun"], [603, "An-Nasr"],
  [603, "Al-Masad"], [604, "Al-Ikhlas"], [604, "Al-Falaq"], [604, "An-Nas"],
];

function getJuzukFromPage(page) {
  let j = 1;
  for (let i = 0; i < 30; i++) if (page >= JUZ_START[i]) j = i + 1;
  return j;
}

function getSurahFromPage(page) {
  let name = "Al-Fatihah";
  for (let i = 0; i < SURAH.length; i++) if (page >= SURAH[i][0]) name = SURAH[i][1];
  return name;
}

const STATUS = [
  { key: "syahadah", label: "Syahadah",   css: "syahadah" },
  { key: "hafazan",  label: "Hafazan",    css: "hafazan" },
  { key: "murajaah", label: "Murajaah",   css: "murajaah" },
  { key: "talaqqi",  label: "Talaqqi",    css: "talaqqi" },
  { key: "belum",    label: "Belum Mula", css: "belum" },
];

const STATUS_MAP = Object.fromEntries(STATUS.map((s) => [s.key, s]));

const DEMO_STATUS_MAP = (() => {
  const m = {};
  for (let p = 1; p <= 604; p++) {
    if (p <= 200)      m[p] = "syahadah";
    else if (p <= 280) m[p] = "hafazan";
    else if (p <= 320) m[p] = "talaqqi";
    else if (p <= 370) m[p] = "murajaah";
    else               m[p] = "belum";
  }
  return m;
})();

const DEMO_TALLY = (() => {
  const t = {};
  for (const s of STATUS) t[s.key] = 0;
  for (const v of Object.values(DEMO_STATUS_MAP)) if (t[v] !== undefined) t[v]++;
  return t;
})();

// Grid geometry
const COLS   = 25;
const CELL   = 24;
const GAP    = 3;
const STRIDE = CELL + GAP;
const ROWS   = Math.ceil(604 / COLS);
const VW     = COLS * STRIDE - GAP;
const VH     = ROWS * STRIDE - GAP;

function getPos(page) {
  const i = page - 1;
  return { x: (i % COLS) * STRIDE, y: Math.floor(i / COLS) * STRIDE };
}

function GridTooltip({ data }) {
  if (!data) return null;
  const { clientX, clientY, page, status } = data;
  const st = STATUS_MAP[status] || STATUS_MAP["belum"];
  const fromTop = clientY < 250;
  return (
    <div style={{
      position: "fixed",
      left: Math.min(Math.max(clientX, 130), window.innerWidth - 130),
      top: fromTop ? clientY + 16 : clientY - 16,
      transform: `translate(-50%, ${fromTop ? "0" : "-100%"})`,
      zIndex: 70,
      pointerEvents: "none",
    }}>
      <div style={{
        background: "var(--ink)", color: "var(--bg)", borderRadius: 12,
        padding: "11px 14px", width: 220,
        boxShadow: "0 16px 40px -12px hsl(var(--shadow-color) / 0.5)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
          <span style={{ fontWeight: 800, fontSize: 15 }}>Muka Surat {page}</span>
          <span style={{ fontSize: 11, opacity: 0.65, fontFamily: "var(--font-mono)" }}>
            Juz {getJuzukFromPage(page)}
          </span>
        </div>
        <div style={{ fontSize: "12.5px", opacity: 0.8, marginBottom: 9 }}>
          Surah {getSurahFromPage(page)}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ width: 9, height: 9, borderRadius: 3, background: `var(--st-${st.css}-ink)` }} />
          <span style={{ fontSize: "12.5px", fontWeight: 700 }}>{st.label}</span>
        </div>
      </div>
    </div>
  );
}

function SVGPageGrid({ statusMap, activeFilter }) {
  const svgRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);

  const handleMouseMove = (e) => {
    const svg = svgRef.current;
    if (!svg) return;
    const r = svg.getBoundingClientRect();
    const vx = ((e.clientX - r.left) / r.width) * VW;
    const vy = ((e.clientY - r.top) / r.height) * VH;
    const col = Math.floor(vx / STRIDE);
    const row = Math.floor(vy / STRIDE);
    const cx = vx - col * STRIDE;
    const cy = vy - row * STRIDE;
    if (cx < CELL && cy < CELL && col >= 0 && col < COLS && row >= 0 && row < ROWS) {
      const page = row * COLS + col + 1;
      if (page >= 1 && page <= 604) {
        setTooltip({ clientX: e.clientX, clientY: e.clientY, page, status: statusMap[page] || "belum" });
        return;
      }
    }
    setTooltip(null);
  };

  return (
    <div style={{ position: "relative" }}>
      <svg
        ref={svgRef}
        width="100%"
        viewBox={`0 0 ${VW} ${VH}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTooltip(null)}
        style={{ display: "block" }}
        aria-label="Grid hafazan 604 muka surat mushaf Madani"
      >
        {Array.from({ length: 604 }, (_, i) => {
          const page = i + 1;
          const s = statusMap[page] || "belum";
          const css = STATUS_MAP[s]?.css || "belum";
          const { x, y } = getPos(page);
          const isJuz = JUZ_START.includes(page);
          const dimmed = activeFilter && s !== activeFilter;

          return (
            <g key={page} className="grid-cell" opacity={dimmed ? 0.12 : 1}>
              <rect
                x={x} y={y} width={CELL} height={CELL} rx={4}
                fill={`var(--st-${css}-fill)`}
                stroke={isJuz ? `var(--st-${css}-ink)` : "none"}
                strokeWidth={isJuz ? 1.5 : 0}
              />
              <text
                x={x + CELL / 2} y={y + CELL / 2 + 3.5}
                textAnchor="middle"
                fontSize={8} fontWeight={600}
                fontFamily="var(--font-mono)"
                fill={`var(--st-${css}-ink)`}
                pointerEvents="none"
                style={{ userSelect: "none" }}
              >
                {page}
              </text>
            </g>
          );
        })}
      </svg>
      <GridTooltip data={tooltip} />
    </div>
  );
}

export function ProgressGridSection() {
  const [active, setActive] = useState(null);

  return (
    <section className="proglog-section">
      <div className="container">
        <p className="section-label">Peta hafazan</p>
        <h2 className="section-title">604 muka surat — satu pandangan</h2>
        <p className="section-sub">
          Setiap muka surat mushaf diwakili satu sel. Warna menunjukkan status — guru dan ibu bapa
          nampak progres sebenar sekilas mata.
        </p>

        <div className="card" style={{ padding: "28px 24px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
            {STATUS.map((s) => {
              const on = active === s.key;
              return (
                <button
                  key={s.key}
                  onClick={() => setActive(on ? null : s.key)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 7,
                    padding: "6px 14px", borderRadius: 999,
                    border: on ? "none" : "1.5px solid var(--line)",
                    background: on ? `var(--st-${s.css}-fill)` : "transparent",
                    color: on ? `var(--st-${s.css}-ink)` : "var(--ink-2)",
                    fontFamily: "inherit", fontWeight: 700, fontSize: 13,
                    cursor: "pointer",
                    outline: on ? `2px solid var(--st-${s.css}-ink)` : "none",
                    outlineOffset: -3,
                    transition: "all .15s",
                  }}
                >
                  <span style={{
                    width: 9, height: 9, borderRadius: 3, flexShrink: 0,
                    background: `var(--st-${s.css}-ink)`,
                    opacity: on ? 1 : 0.7,
                  }} />
                  {s.label}
                  <span style={{ opacity: 0.6, fontFamily: "var(--font-mono)", fontSize: 11 }}>
                    {DEMO_TALLY[s.key]}
                  </span>
                </button>
              );
            })}
          </div>

          <SVGPageGrid statusMap={DEMO_STATUS_MAP} activeFilter={active} />

          <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: "6px 18px" }}>
            {STATUS.map((s) => (
              <span key={s.key} style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                fontSize: 12, fontWeight: 600, color: "var(--ink-3)",
              }}>
                <span style={{
                  width: 10, height: 10, borderRadius: 3,
                  background: `var(--st-${s.css}-fill)`,
                  boxShadow: `inset 0 0 0 1.5px var(--st-${s.css}-ink)`,
                }} />
                {s.label}
              </span>
            ))}
          </div>
        </div>

        <p style={{ marginTop: 14, textAlign: "center", fontSize: 13, color: "var(--ink-3)" }}>
          * Data demo — pelajar rekaan, Juz 1–16 siap syahadah
        </p>
      </div>
    </section>
  );
}
