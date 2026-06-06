const FEATURES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
      </svg>
    ),
    title: 'Grid 604 Muka Surat',
    desc: 'Visualisasi penuh mushaf Madani. Setiap muka surat berwarna mengikut status hafazan — belum, talaqqi, hafazan, murajaah, syahadah.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: 'Papan Pemuka Ibu Bapa',
    desc: 'Ibu bapa akses kemajuan anak hanya dengan ID pelajar. Tiada aplikasi perlu dipasang, tiada akaun perlu didaftar.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="6"/>
        <path d="M8.5 13 7 22l5-3 5 3-1.5-9"/>
      </svg>
    ),
    title: 'Sijil Khatam Automatik',
    desc: 'Apabila pelajar khatam hafazan, jana sijil PDF profesional terus dari sistem dengan satu klik.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6"  y1="20" x2="6"  y2="14"/>
        <path d="M2 20h20"/>
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
