const CHURN_DAYS = 30;

export function HealthAlerts({ schools, activityMap }) {
  const cutoff = Date.now() - CHURN_DAYS * 86400000;

  const atRisk = schools.filter((s) => {
    const last = activityMap[s.slug];
    if (!last) return true;
    return new Date(last).getTime() < cutoff;
  });

  if (atRisk.length === 0) {
    return (
      <div className="card" style={{ padding: 20 }}>
        <h3 style={{ margin: "0 0 10px", fontSize: 15, fontWeight: 800 }}>Risiko Churn</h3>
        <p style={{ color: "var(--st-hafazan-ink)", fontSize: 13, margin: 0 }}>
          ✓ Semua tenant aktif dalam 30 hari lepas.
        </p>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: 20, border: "1px solid color-mix(in oklch, var(--gr-sederhana) 30%, transparent)" }}>
      <h3 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 800 }}>
        Risiko Churn
        <span style={{ marginLeft: 8, fontSize: 12, fontWeight: 700, background: "var(--st-syahadah-fill)", color: "var(--st-syahadah-ink)", padding: "2px 8px", borderRadius: 99 }}>
          {atRisk.length} sekolah
        </span>
      </h3>
      <p style={{ margin: "0 0 12px", fontSize: 12, color: "var(--ink-3)" }}>Tiada aktiviti tasmik dalam 30 hari</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {atRisk.map((s) => {
          const last = activityMap[s.slug];
          const days = last ? Math.floor((Date.now() - new Date(last)) / 86400000) : null;
          return (
            <div key={s.slug} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
              <span style={{ fontWeight: 600 }}>{s.name}</span>
              <span style={{ color: "var(--gr-sederhana)" }}>
                {days != null ? `${days} hari tiada aktiviti` : "Belum pernah aktif"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
