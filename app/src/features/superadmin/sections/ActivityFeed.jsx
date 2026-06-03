import { useMemo } from "react";

export function ActivityFeed({ schools, activityMap }) {
  const now = useMemo(() => Date.now(), []);

  const sorted = useMemo(() => [...schools]
    .map((s) => ({ ...s, lastActivity: activityMap[s.slug] ?? null }))
    .sort((a, b) => {
      if (!a.lastActivity && !b.lastActivity) return 0;
      if (!a.lastActivity) return 1;
      if (!b.lastActivity) return -1;
      return new Date(b.lastActivity) - new Date(a.lastActivity);
    })
    .slice(0, 8), [schools, activityMap]);

  const formatDate = (iso) => {
    if (!iso) return "Tiada rekod";
    const days = Math.floor((now - new Date(iso)) / 86400000);
    if (days === 0) return "Hari ini";
    if (days === 1) return "Semalam";
    return `${days} hari lalu`;
  };

  return (
    <div className="card" style={{ padding: 20 }}>
      <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 800 }}>Aktiviti Terkini</h3>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {sorted.map((s, i) => (
          <div
            key={s.slug}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "9px 0",
              borderBottom: i < sorted.length - 1 ? "1px solid var(--line)" : "none",
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: 13.5 }}>{s.name}</div>
              <div style={{ fontSize: 11.5, color: "var(--ink-3)" }}>{s.slug}</div>
            </div>
            <div style={{ fontSize: 12.5, color: s.lastActivity ? "var(--ink-2)" : "var(--ink-3)", fontWeight: s.lastActivity ? 600 : 400 }}>
              {formatDate(s.lastActivity)}
            </div>
          </div>
        ))}
        {sorted.length === 0 && (
          <p style={{ color: "var(--ink-3)", fontSize: 13, margin: 0 }}>Tiada data aktiviti.</p>
        )}
      </div>
    </div>
  );
}
