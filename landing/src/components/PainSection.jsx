const PAINS = [
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2 2 7l10 5 10-5-10-5ZM2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
    ),
    title: 'Rekod manual hilang atau rosak',
    desc: 'Buku rekod fizikal mudah hilang, terkoyak, atau basah. Data bertahun-tahun boleh lesap sekelip mata.',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 3a2 2 0 0 1-.5 2L8.1 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2-.5c1 .3 2 .6 3 .7a2 2 0 0 1 1.7 2Z"/>
      </svg>
    ),
    title: 'Ibu bapa asyik hubungi guru',
    desc: 'Guru terpaksa jawab soalan yang sama berulang kali — mengganggu waktu mengajar dan menambah beban kerja.',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M3 9h18M9 21V9"/>
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
