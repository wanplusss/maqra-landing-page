const DEMO_LINK = 'mailto:hello@maqra.my?subject=Permintaan%20Demo%20Maqra';

export function CtaBanner() {
  return (
    <section id="demo" className="cta-section">
      <div className="container cta-inner">
        <div className="cta-text">
          <h2>Sedia transformasi maahad anda?</h2>
          <p>
            Hubungi kami untuk demo percuma. Kami tunjukkan cara Maqra boleh membantu
            sekolah anda dalam 30 minit.
          </p>
        </div>
        <a href={DEMO_LINK} className="btn-primary cta-btn">
          Minta Demo Sekarang →
        </a>
      </div>
    </section>
  );
}
