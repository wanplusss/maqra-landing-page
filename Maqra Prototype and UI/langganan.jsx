/* ===========================================================================
   Maqra — Langganan (subscription / pricing page, under Admin)
   =========================================================================== */

const TIERS = [
  {
    key: "Percubaan", rank: 0, tagline: "Cuba dulu, tanpa komitmen",
    monthly: null, yearly: null, priceLabel: "Percuma", priceSub: "30 hari",
    cta: "Mula Percubaan",
    features: ["Grid 604 muka surat", "Sehingga 15 pelajar", "1 akaun guru", "Analitik asas"],
  },
  {
    key: "Asas", rank: 1, tagline: "Untuk maahad kecil",
    monthly: 49, yearly: 490, yearlyList: 588, save: 98,
    cta: "Pilih Asas",
    features: ["Sehingga 60 pelajar", "3 akaun guru", "Laman awam + semakan ibu bapa", "Pengumuman sekolah", "Analitik asas"],
  },
  {
    key: "Premium", rank: 2, tagline: "Pilihan utama maahad", popular: true,
    monthly: 149, yearly: 1490, yearlyList: 1788, save: 298,
    cta: "Naik Taraf ke Premium",
    features: ["Pelajar tanpa had", "Analitik penuh — ramalan khatam, murajaah, tren tahunan", "Tasmik Hari Ini + Kohort", "Sasaran peribadi pelajar", "Slip Prestasi & Sijil (PDF)", "QR sumbangan + notifikasi WhatsApp"],
  },
  {
    key: "Institusi", rank: 3, tagline: "Rangkaian & cawangan",
    monthly: 399, yearly: 3990, yearlyList: 4788, save: 798, plus: true,
    cta: "Hubungi Jualan",
    features: ["Semua ciri Premium", "Dashboard pemilik merentas cawangan", "Domain tersendiri", "Eksport data (CSV) + API", "Sokongan keutamaan + onboarding"],
  },
];

const fmtRM = (n) => "RM" + n.toLocaleString("en-MY");

function LanggananPage({ plan, setPlan, showToast }) {
  const [cycle, setCycle] = useState("tahunan"); // bulanan | tahunan
  const current = TIERS.find((t) => t.key === plan) || TIERS[2];

  const choose = (t) => {
    if (t.key === "Institusi") { showToast("Permintaan sebut harga dihantar kepada jualan", "ok"); return; }
    if (t.key === plan) return;
    setPlan(t.key);
    showToast(`Pelan ditukar ke ${t.key}`, "ok");
  };

  return (
    <>
      <div className="pagehead">
        <div><h1>Langganan</h1><p>{MAQRA.school.name} · urus pelan & bil</p></div>
        <span className="badge badge-ok"><Icon name="check" size={13} /> Pelan semasa: {plan}</span>
      </div>

      {/* current plan banner */}
      <div className="card" style={{ padding: 20, marginBottom: 22, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ width: 46, height: 46, borderRadius: 13, background: "var(--accent-soft)", color: "var(--accent-deep)", display: "grid", placeItems: "center", flex: "none" }}>
            <Icon name={current.rank >= 3 ? "globe" : current.rank >= 2 ? "trophy" : "school"} size={22} />
          </span>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800 }}>Pelan {plan}</div>
            <div style={{ fontSize: 12.5, color: "var(--ink-3)" }}>
              {MAQRA.students.length} pelajar · {MAQRA.school.teachers.length} guru · pembaharuan seterusnya 01/01/2027
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12.5, color: "var(--ink-3)" }}><Icon name="info" size={14} /> Penagihan tahunan</span>
        </div>
      </div>

      {/* cycle toggle */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <div className="persona" style={{ background: "var(--surface-2)" }}>
          <button className={cycle === "bulanan" ? "on" : ""} onClick={() => setCycle("bulanan")}>Bulanan</button>
          <button className={cycle === "tahunan" ? "on" : ""} onClick={() => setCycle("tahunan")}>Tahunan</button>
        </div>
        <span className="badge" style={{ background: "var(--st-hafazan-fill)", color: "var(--st-hafazan-ink)", borderColor: "transparent" }}>
          <Icon name="sparkle" size={13} /> Jimat 2 bulan dengan bayaran tahunan
        </span>
      </div>

      {/* tier cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, alignItems: "stretch" }}>
        {TIERS.map((t) => {
          const isCurrent = t.key === plan;
          const recommend = t.popular;
          return (
            <div key={t.key} className="card" style={{
              padding: 22, display: "flex", flexDirection: "column",
              border: recommend ? "1.5px solid var(--accent)" : "1px solid var(--line)",
              boxShadow: recommend ? "0 14px 40px -16px var(--accent-ring)" : undefined, position: "relative",
            }}>
              {recommend && <span className="badge badge-ok" style={{ position: "absolute", top: -11, left: 22 }}><Icon name="star" size={12} /> Popular</span>}
              {isCurrent && <span className="badge" style={{ position: "absolute", top: -11, right: 22, background: "var(--ink)", color: "var(--bg)", borderColor: "transparent" }}>Pelan Semasa</span>}

              <div style={{ fontSize: 16, fontWeight: 800 }}>{t.key}</div>
              <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 3, minHeight: 34 }}>{t.tagline}</div>

              {/* price */}
              <div style={{ margin: "10px 0 4px", minHeight: 64 }}>
                {t.monthly == null ? (
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                    <span style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.02em" }}>Percuma</span>
                  </div>
                ) : cycle === "tahunan" ? (
                  <>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
                      <span className="mono" style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.03em" }}>{fmtRM(t.yearly)}{t.plus ? "+" : ""}</span>
                      <span style={{ fontSize: 13, color: "var(--ink-3)" }}>/ tahun</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                      <span className="mono" style={{ fontSize: 12.5, color: "var(--ink-3)", textDecoration: "line-through" }}>{fmtRM(t.yearlyList)}</span>
                      <span className="badge" style={{ fontSize: 11, background: "var(--st-hafazan-fill)", color: "var(--st-hafazan-ink)", borderColor: "transparent" }}>jimat {fmtRM(t.save)}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
                      <span className="mono" style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.03em" }}>{fmtRM(t.monthly)}{t.plus ? "+" : ""}</span>
                      <span style={{ fontSize: 13, color: "var(--ink-3)" }}>/ bulan</span>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 4 }}>dibilkan setiap bulan</div>
                  </>
                )}
              </div>

              <button
                className={"btn " + (isCurrent ? "btn-ghost" : recommend ? "btn-primary" : "")}
                onClick={() => choose(t)} disabled={isCurrent}
                style={{ justifyContent: "center", marginTop: 6, opacity: isCurrent ? 0.7 : 1 }}>
                {isCurrent ? "Pelan Semasa" : t.rank < current.rank ? "Turun ke " + t.key : t.cta}
              </button>

              <hr className="divider" style={{ margin: "18px 0 14px" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {t.features.map((f, i) => (
                  <div key={i} style={{ display: "flex", gap: 9, fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.4 }}>
                    <span style={{ color: "var(--accent)", flex: "none", marginTop: 1 }}><Icon name="check" size={15} /></span>{f}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* footer notes */}
      <div style={{ marginTop: 22, display: "flex", gap: 18, flexWrap: "wrap", color: "var(--ink-3)", fontSize: 12.5 }}>
        <span style={{ display: "inline-flex", gap: 7, alignItems: "center" }}><Icon name="check" size={14} style={{ color: "var(--accent)" }} /> Batal bila-bila masa</span>
        <span style={{ display: "inline-flex", gap: 7, alignItems: "center" }}><Icon name="check" size={14} style={{ color: "var(--accent)" }} /> Naik/turun taraf serta-merta</span>
        <span style={{ display: "inline-flex", gap: 7, alignItems: "center" }}><Icon name="check" size={14} style={{ color: "var(--accent)" }} /> Harga belum termasuk SST</span>
        <span style={{ display: "inline-flex", gap: 7, alignItems: "center" }}><Icon name="info" size={14} /> Add-on: pek SMS, storan dokumen</span>
      </div>
    </>
  );
}

Object.assign(window, { LanggananPage, TIERS });
