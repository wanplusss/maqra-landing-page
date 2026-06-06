const C = "oklch(0.62 0.14 55)";   // amber ink
const F = "oklch(0.92 0.07 80)";   // amber fill (light)
const S = "none";

const PAINS = [
  {
    icon: (
      /* Stack of papers — top one flying off with torn edge */
      <svg width="44" height="44" viewBox="0 0 44 44" fill={S} xmlns="http://www.w3.org/2000/svg">
        {/* Bottom sheet */}
        <rect x="6" y="26" width="28" height="14" rx="2.5" fill={F} stroke={C} strokeWidth="1.8"/>
        <line x1="10" y1="31" x2="30" y2="31" stroke={C} strokeWidth="1.4" strokeLinecap="round" opacity=".5"/>
        <line x1="10" y1="35" x2="24" y2="35" stroke={C} strokeWidth="1.4" strokeLinecap="round" opacity=".5"/>
        {/* Middle sheet */}
        <rect x="8" y="17" width="28" height="14" rx="2.5" fill={F} stroke={C} strokeWidth="1.8"/>
        <line x1="12" y1="22" x2="32" y2="22" stroke={C} strokeWidth="1.4" strokeLinecap="round" opacity=".5"/>
        <line x1="12" y1="26" x2="24" y2="26" stroke={C} strokeWidth="1.4" strokeLinecap="round" opacity=".5"/>
        {/* Top sheet — tilted, flying off */}
        <g transform="translate(22 14) rotate(-18) translate(-22 -14)">
          <rect x="10" y="5" width="24" height="14" rx="2.5" fill="oklch(0.98 0.02 80)" stroke={C} strokeWidth="1.8"/>
          {/* Torn bottom edge on flying sheet */}
          <path d="M10 17 L12.5 19 L15 17 L17.5 19.5 L20 17 L22.5 19 L25 17 L27.5 19 L30 17 L32 18 L34 17" stroke={C} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill={S}/>
          <line x1="14" y1="10" x2="30" y2="10" stroke={C} strokeWidth="1.3" strokeLinecap="round" opacity=".5"/>
          <line x1="14" y1="13.5" x2="26" y2="13.5" stroke={C} strokeWidth="1.3" strokeLinecap="round" opacity=".5"/>
        </g>
        {/* Motion lines */}
        <line x1="37" y1="6" x2="40" y2="4" stroke={C} strokeWidth="1.5" strokeLinecap="round" opacity=".5"/>
        <line x1="38" y1="9" x2="42" y2="9" stroke={C} strokeWidth="1.5" strokeLinecap="round" opacity=".4"/>
        <line x1="37" y1="12" x2="40" y2="14" stroke={C} strokeWidth="1.5" strokeLinecap="round" opacity=".3"/>
      </svg>
    ),
    title: 'Rekod manual hilang atau rosak',
    desc: 'Buku rekod fizikal mudah hilang, terkoyak, atau basah. Data bertahun-tahun boleh lesap sekelip mata.',
  },
  {
    icon: (
      /* Phone handset with 3 radiating call arcs */
      <svg width="44" height="44" viewBox="0 0 44 44" fill={S} xmlns="http://www.w3.org/2000/svg">
        {/* Phone body */}
        <path d="M8 6.5C8 5.1 9.1 4 10.5 4h5.3c.6 0 1 .4 1.1 1l1.3 5.8c.1.5-.1 1-.5 1.3l-2.6 2c1.6 3.4 4.3 6.1 7.8 7.8l2-2.6c.3-.4.8-.6 1.3-.5L32.1 20c.6.1 1 .5 1 1.1v5.4C33.1 27.9 32 29 30.6 29A26 26 0 0 1 5 7.3c0-.3 0-.5.1-.8H8Z"
          fill={F} stroke={C} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        {/* Call arcs — three ripples */}
        <path d="M27 6a11 11 0 0 1 8 8" stroke={C} strokeWidth="1.7" strokeLinecap="round" opacity=".8"/>
        <path d="M27 11a6 6 0 0 1 3 3" stroke={C} strokeWidth="1.7" strokeLinecap="round" opacity=".6"/>
        {/* Notification dots — incoming calls */}
        <circle cx="34" cy="10" r="3.5" fill="oklch(0.55 0.20 22)" opacity=".9"/>
        <text x="34" y="13.5" textAnchor="middle" fontSize="5" fontWeight="800" fill="white" fontFamily="system-ui">3</text>
        <circle cx="38" cy="22" r="2.5" fill={C} opacity=".3"/>
        <circle cx="36" cy="30" r="1.8" fill={C} opacity=".2"/>
      </svg>
    ),
    title: 'Ibu bapa asyik hubungi guru',
    desc: 'Guru terpaksa jawab soalan yang sama berulang kali — mengganggu waktu mengajar dan menambah beban kerja.',
  },
  {
    icon: (
      /* 2×3 mini dashboard grid — some cells blurred/empty with question mark */
      <svg width="44" height="44" viewBox="0 0 44 44" fill={S} xmlns="http://www.w3.org/2000/svg">
        {/* Outer card */}
        <rect x="4" y="4" width="36" height="36" rx="4" fill={F} stroke={C} strokeWidth="1.8"/>
        {/* Header bar */}
        <rect x="4" y="4" width="36" height="8" rx="4" fill={C} opacity=".18"/>
        <rect x="8" y="7" width="14" height="2" rx="1" fill={C} opacity=".5"/>
        {/* 6 data cells (2 col × 3 row) */}
        {/* Row 1 — filled cells */}
        <rect x="8"  y="16" width="12" height="7" rx="2" fill={C} opacity=".25"/>
        <rect x="24" y="16" width="12" height="7" rx="2" fill={C} opacity=".25"/>
        {/* Row 2 — one empty */}
        <rect x="8"  y="26" width="12" height="7" rx="2" fill={C} opacity=".10"/>
        <rect x="24" y="26" width="12" height="7" rx="2" fill={C} opacity=".25"/>
        {/* Row 3 bar-chart placeholder */}
        <rect x="8"  y="18" width="4" height="5" rx="1" fill={C} opacity=".5"/>
        <rect x="13" y="20" width="4" height="3" rx="1" fill={C} opacity=".5"/>
        <rect x="18" y="19" width="2" height="4" rx="1" fill={C} opacity=".5"/>
        {/* Question mark over empty cell */}
        <text x="14" y="32.5" textAnchor="middle" fontSize="8" fontWeight="800"
          fill={C} fontFamily="system-ui" opacity=".7">?</text>
        {/* Scattered dots hinting "no data" */}
        <circle cx="28" cy="29" r="1.2" fill={C} opacity=".3"/>
        <circle cx="31" cy="31" r="1.2" fill={C} opacity=".3"/>
        <circle cx="33" cy="28" r="1.2" fill={C} opacity=".3"/>
      </svg>
    ),
    title: 'Tiada gambaran prestasi keseluruhan',
    desc: 'Pentadbir tidak dapat tahu di mana kedudukan setiap pelajar atau kelas tanpa kumpul data secara manual.',
  },
];

export function PainSection() {
  return (
    <section className="pain-section">
      <div className="container">
        <p className="section-label">Masalah yang anda hadapi</p>
        <h2 className="section-title">Cabaran harian maahad tahfiz</h2>
        <p className="section-sub">Ramai pentadbir maahad menghadapi masalah yang sama. Anda tidak berseorangan.</p>
        <div className="grid-3">
          {PAINS.map((p) => (
            <div key={p.title} className="card pain-card">
              <div className="pain-icon">{p.icon}</div>
              <h3 style={{ color: 'var(--text)' }}>{p.title}</h3>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
