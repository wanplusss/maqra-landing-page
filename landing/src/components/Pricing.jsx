const TIERS = [
  {
    name: 'Kecil',
    range: '1–50 pelajar',
    rate: 'RM3',
    rateLabel: '/pelajar/bulan',
    example: '30 pelajar = RM1,080/thn',
    floor: null,
    note: 'Sesuai untuk maahad bermula.',
    highlight: false,
  },
  {
    name: 'Sederhana',
    range: '51–150 pelajar',
    rate: 'RM2.50',
    rateLabel: '/pelajar/bulan',
    example: '100 pelajar = RM3,000/thn',
    floor: 'Min RM1,800/thn',
    note: 'Paling popular untuk maahad aktif.',
    highlight: true,
  },
  {
    name: 'Besar',
    range: '151–300 pelajar',
    rate: 'RM2',
    rateLabel: '/pelajar/bulan',
    example: '200 pelajar = RM4,800/thn',
    floor: 'Min RM4,500/thn',
    note: 'Untuk maahad besar dengan banyak kelas.',
    highlight: false,
  },
];

const CheckIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M5 13 10 18 19 7"/>
  </svg>
);

export function Pricing() {
  return (
    <section id="harga" className="pricing-section">
      <div className="container">
        <p className="section-label">Harga</p>
        <h2 className="section-title">Harga mengikut saiz sekolah anda</h2>
        <p className="section-sub">
          Bayar mengikut bilangan pelajar aktif. Tiada caj tersembunyi.
        </p>
        <div className="pricing-grid">
          {TIERS.map((tier) => (
            <div key={tier.name} className={`card pricing-card${tier.highlight ? ' pricing-highlight' : ''}`}>
              {tier.highlight && <div className="pricing-badge">Paling Popular</div>}
              <div className="pricing-name">{tier.name}</div>
              <div className="pricing-range">{tier.range}</div>
              <div className="pricing-price">
                <span className="price-amount">{tier.rate}</span>
                <span className="price-period">{tier.rateLabel}</span>
              </div>
              <div className="pricing-example">
                <CheckIcon />
                {tier.example}
              </div>
              {tier.floor && (
                <div className="pricing-floor">{tier.floor}</div>
              )}
              <p className="pricing-note">{tier.note}</p>
              <a href="#demo" className={tier.highlight ? 'btn-primary' : 'btn-outline'} style={{ textAlign: 'center' }}>
                Minta Demo
              </a>
            </div>
          ))}
        </div>
        <p className="pricing-footnote">
          Harga dikira berdasarkan bilangan pelajar aktif. Hubungi kami untuk sebut harga khusus.
        </p>
      </div>
    </section>
  );
}
