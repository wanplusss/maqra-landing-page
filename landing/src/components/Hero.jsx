import { MushafGrid } from './MushafGrid.jsx';

export function Hero() {
  return (
    <section className="hero">
      <div className="container hero-inner">
        <div className="hero-text">
          <p className="section-label">Sistem Hafazan Digital</p>
          <h1>Guru anda masih guna buku rekod?</h1>
          <p className="hero-sub">
            Maqra digitalkan rekod hafazan pelajar — dari talaqqi hingga khatam —
            supaya guru fokus mengajar, bukan mencatat.
          </p>
          <div className="hero-actions">
            <a href="#demo" className="btn-primary">Minta Demo Percuma</a>
            <a href="#cara-kerja" className="btn-outline">Lihat cara kerja</a>
          </div>
        </div>
        <div className="hero-graphic">
          <MushafGrid />
        </div>
      </div>
    </section>
  );
}
