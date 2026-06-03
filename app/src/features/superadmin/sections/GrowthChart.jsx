const MONTH_SHORT = ["Jan","Feb","Mac","Apr","Mei","Jun","Jul","Ogo","Sep","Okt","Nov","Dis"];

export function GrowthChart({ growthData }) {
  if (!growthData || growthData.length === 0) {
    return (
      <div className="card" style={{ padding: 20 }}>
        <h3 style={{ margin: "0 0 10px", fontSize: 15, fontWeight: 800 }}>Pertumbuhan Pelajar</h3>
        <p style={{ color: "var(--ink-3)", fontSize: 13, margin: 0 }}>Tiada data.</p>
      </div>
    );
  }

  const max = Math.max(...growthData.map((d) => d.count), 1);

  const formatMonth = (iso) => {
    const [, m] = iso.split("-");
    return MONTH_SHORT[parseInt(m, 10) - 1] ?? iso;
  };

  return (
    <div className="card" style={{ padding: 20 }}>
      <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 800 }}>Pertumbuhan Pelajar (6 bulan)</h3>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 100 }}>
        {growthData.map((d) => (
          <div key={d.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)" }}>{d.count}</span>
            <div
              style={{
                width: "100%",
                height: `${Math.round((d.count / max) * 72)}px`,
                background: "var(--accent)",
                borderRadius: "4px 4px 0 0",
                opacity: 0.85,
                minHeight: 4,
              }}
            />
            <span style={{ fontSize: 11, color: "var(--ink-3)" }}>{formatMonth(d.month)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
