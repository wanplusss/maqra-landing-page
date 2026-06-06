export function Mark({ size = 38 }) {
  const r = size * 0.29;
  return (
    <span style={{
      width: size, height: size, borderRadius: r,
      display: "inline-grid", placeItems: "center", flexShrink: 0,
      background: "linear-gradient(150deg, var(--accent), var(--accent-deep))",
      boxShadow: "0 3px 10px var(--accent-ring)",
      color: "#fff",
    }}>
      <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 6.2C10.4 4.8 8 4.3 4.5 4.7v13C8 17.3 10.4 17.8 12 19.2M12 6.2C13.6 4.8 16 4.3 19.5 4.7v13C16 17.3 13.6 17.8 12 19.2M12 6.2v13" />
      </svg>
    </span>
  );
}

export function Wordmark({ size = 21, light = false }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 11, textDecoration: "none" }}>
      <Mark />
      <span style={{
        fontSize: size, fontWeight: 800,
        color: light ? "var(--surface)" : "var(--ink)",
        letterSpacing: "-0.025em",
      }}>
        Maqra<span style={{ color: "var(--accent)" }}>'</span>
      </span>
    </div>
  );
}
