// Accent tokens (matches landing.css --accent palette)
const AC = "oklch(0.40 0.090 158)";   // deep green ink
const AF = "oklch(0.88 0.055 152)";   // light green fill

// Status fill colours (mini mushaf grid)
const SYA = "oklch(0.85 0.080 18)";   // syahadah — coral
const HAF = "oklch(0.84 0.070 152)";  // hafazan  — green
const TAL = "oklch(0.84 0.075 300)";  // talaqqi  — purple
const MUR = "oklch(0.87 0.090 62)";   // murajaah — amber
const BEL = "oklch(0.90 0.008 150)";  // belum    — grey

const S = "none";
const LC = { strokeLinecap: "round", strokeLinejoin: "round" };

const FEATURES = [
  {
    icon: (
      /* Mini mushaf grid — 6 cols × 4 rows of coloured cells */
      <svg width="28" height="28" viewBox="0 0 28 28" fill={S} xmlns="http://www.w3.org/2000/svg">
        {/* Frame */}
        <rect x="0.9" y="0.9" width="26.2" height="26.2" rx="3" stroke={AC} strokeWidth="1.4" fill={AF} opacity=".4"/>
        {/* Grid — STRIDE=4, CELL=3, start (1.5, 5) */}
        {/* Row 0: all syahadah */}
        {[0,1,2,3,4,5].map(c => <rect key={c} x={1.5+c*4} y={5}   width={3} height={3} rx={1} fill={SYA}/>)}
        {/* Row 1: hafazan × 3, talaqqi × 3 */}
        {[0,1,2].map(c   => <rect key={c} x={1.5+c*4} y={10}  width={3} height={3} rx={1} fill={HAF}/>)}
        {[3,4,5].map(c   => <rect key={c} x={1.5+c*4} y={10}  width={3} height={3} rx={1} fill={TAL}/>)}
        {/* Row 2: murajaah × 2, belum × 4 */}
        {[0,1].map(c     => <rect key={c} x={1.5+c*4} y={15}  width={3} height={3} rx={1} fill={MUR}/>)}
        {[2,3,4,5].map(c => <rect key={c} x={1.5+c*4} y={15}  width={3} height={3} rx={1} fill={BEL}/>)}
        {/* Row 3: all belum */}
        {[0,1,2,3,4,5].map(c => <rect key={c} x={1.5+c*4} y={20}  width={3} height={3} rx={1} fill={BEL}/>)}
      </svg>
    ),
    title: 'Grid 604 Muka Surat',
    desc: 'Visualisasi penuh mushaf Madani. Setiap muka surat berwarna mengikut status hafazan — belum, talaqqi, hafazan, murajaah, syahadah.',
  },
  {
    icon: (
      /* Mobile phone with mini family icon + progress bar inside screen */
      <svg width="28" height="28" viewBox="0 0 28 28" fill={S} xmlns="http://www.w3.org/2000/svg">
        {/* Phone body */}
        <rect x="7" y="2" width="14" height="24" rx="3" fill={AF} stroke={AC} strokeWidth="1.5"/>
        {/* Screen */}
        <rect x="8.5" y="5" width="11" height="16" rx="1.5" fill="white" opacity=".9"/>
        {/* Parent + child silhouette inside screen */}
        <circle cx="12" cy="9.5" r="2"   fill={AC} opacity=".7"/>
        <circle cx="17" cy="10"  r="1.4" fill={AC} opacity=".5"/>
        <path d="M9 14.5 Q12 12.5 15 14.5" stroke={AC} strokeWidth="1.2" {...LC}/>
        <path d="M14.5 14.8 Q17 13.5 19 14.8" stroke={AC} strokeWidth="1.0" {...LC} opacity=".6"/>
        {/* Progress bar */}
        <rect x="9.5" y="17" width="9" height="1.8" rx=".9" fill={BEL}/>
        <rect x="9.5" y="17" width="5.5" height="1.8" rx=".9" fill={HAF}/>
        {/* Home bar */}
        <rect x="11.5" y="23" width="5" height="1.2" rx=".6" fill={AC} opacity=".35"/>
      </svg>
    ),
    title: 'Papan Pemuka Ibu Bapa',
    desc: 'Ibu bapa akses kemajuan anak hanya dengan ID pelajar. Tiada aplikasi perlu dipasang, tiada akaun perlu didaftar.',
  },
  {
    icon: (
      /* Certificate scroll with star seal */
      <svg width="28" height="28" viewBox="0 0 28 28" fill={S} xmlns="http://www.w3.org/2000/svg">
        {/* Scroll body */}
        <rect x="3" y="5" width="22" height="18" rx="2" fill={AF} stroke={AC} strokeWidth="1.5"/>
        {/* Header band */}
        <rect x="3" y="5" width="22" height="5" rx="2" fill={AC} opacity=".25"/>
        {/* Decorative text lines */}
        <line x1="7" y1="14" x2="21" y2="14" stroke={AC} strokeWidth="1.2" strokeLinecap="round" opacity=".5"/>
        <line x1="7" y1="17" x2="17" y2="17" stroke={AC} strokeWidth="1.2" strokeLinecap="round" opacity=".4"/>
        {/* Scroll curls top */}
        <path d="M3 7 Q1 7 1 9 Q1 11 3 11" stroke={AC} strokeWidth="1.4" {...LC}/>
        <path d="M25 7 Q27 7 27 9 Q27 11 25 11" stroke={AC} strokeWidth="1.4" {...LC}/>
        {/* Star seal bottom-right */}
        <polygon
          points="22,19.5 22.7,21.5 24.8,21.5 23.2,22.7 23.8,24.7 22,23.5 20.2,24.7 20.8,22.7 19.2,21.5 21.3,21.5"
          fill={AC} opacity=".75"
        />
      </svg>
    ),
    title: 'Sijil Khatam Automatik',
    desc: 'Apabila pelajar khatam hafazan, jana sijil PDF profesional terus dari sistem dengan satu klik.',
  },
  {
    icon: (
      /* Bar chart with upward trend line + dotted prediction */
      <svg width="28" height="28" viewBox="0 0 28 28" fill={S} xmlns="http://www.w3.org/2000/svg">
        {/* Axes */}
        <line x1="4" y1="22" x2="26" y2="22" stroke={AC} strokeWidth="1.3" strokeLinecap="round" opacity=".4"/>
        <line x1="4" y1="22" x2="4"  y2="5"  stroke={AC} strokeWidth="1.3" strokeLinecap="round" opacity=".4"/>
        {/* Bars */}
        <rect x="6"  y="17" width="4" height="5" rx="1" fill={HAF} opacity=".7"/>
        <rect x="12" y="13" width="4" height="9" rx="1" fill={HAF} opacity=".85"/>
        <rect x="18" y="9"  width="4" height="13" rx="1" fill={AC} opacity=".7"/>
        {/* Trend line through bar tops */}
        <polyline points="8,17 14,13 20,9" stroke={AC} strokeWidth="1.6" {...LC}/>
        {/* Dotted prediction extension */}
        <line x1="20" y1="9" x2="26" y2="5.5" stroke={AC} strokeWidth="1.4"
          strokeLinecap="round" strokeDasharray="1.8 2"/>
        {/* Target dot */}
        <circle cx="26" cy="5.5" r="2" fill={AC} opacity=".7"/>
      </svg>
    ),
    title: 'Laporan & Analitik',
    desc: 'Jejak sasaran hafazan, lihat prestasi kelas, dan dapat ramalan bila pelajar akan khatam berdasarkan kadar semasa.',
  },
];

export function Features() {
  return (
    <section className="features-section">
      <div className="container">
        <p className="section-label">Ciri-ciri utama</p>
        <h2 className="section-title">Semua yang maahad anda perlukan</h2>
        <p className="section-sub">
          Direka khas untuk aliran kerja maahad tahfiz — bukan alat am yang diubah suai.
        </p>
        <div className="grid-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="card feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3 style={{ color: 'var(--text)' }}>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
