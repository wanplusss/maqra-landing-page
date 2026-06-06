const STEPS = [
  {
    num: '01',
    color: '#059669',
    title: 'Guru rekod tasmik',
    desc: 'Selepas sesi talaqqi atau murajaah, guru tandakan muka surat dalam sistem — ambil masa kurang 10 saat.',
  },
  {
    num: '02',
    color: '#3b82f6',
    title: 'Ibu bapa semak sendiri',
    desc: 'Ibu bapa log masuk dengan ID pelajar, lihat kemajuan anak secara real-time. Tiada perlu hubungi guru lagi.',
  },
  {
    num: '03',
    color: '#f59e0b',
    title: 'Pentadbir pantau keseluruhan',
    desc: 'Papan pemuka sekolah tunjukkan kemajuan semua pelajar, kelas, dan guru dalam satu skrin sahaja.',
  },
];

export function HowItWorks() {
  return (
    <section id="cara-kerja" className="how-section">
      <div className="container">
        <p className="section-label">Cara ia berfungsi</p>
        <h2 className="section-title">Tiga langkah mudah</h2>
        <p className="section-sub">
          Maqra direka untuk mudah digunakan. Guru baru pun boleh mula dalam masa 5 minit.
        </p>
        <div className="how-steps">
          {STEPS.map((s) => (
            <div key={s.num} className="how-step">
              <div className="step-num" style={{ color: s.color, borderColor: s.color }}>
                {s.num}
              </div>
              <div className="step-body">
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
