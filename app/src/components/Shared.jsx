import React, { useState, useMemo, useEffect } from "react";
import { STATUS_MAP } from "../features/maqra/domain/statusColors.js";
import { GRED_MAP } from "../features/maqra/domain/statusColors.js";

/* ---- responsive hook ---- */
export function useIsMobile(bp = 760) {
  const [m, setM] = useState(typeof window !== "undefined" && window.innerWidth <= bp);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${bp}px)`);
    const on = () => setM(mq.matches);
    on();
    mq.addEventListener ? mq.addEventListener("change", on) : mq.addListener(on);
    return () => { mq.removeEventListener ? mq.removeEventListener("change", on) : mq.removeListener(on); };
  }, [bp]);
  return m;
}

/* ---- icon set (simple stroke icons) ---- */
export const ICONS = {
  home: "M3 11.5 12 4l9 7.5M5 10v10h5v-6h4v6h5V10",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4.5 20a7.5 7.5 0 0 1 15 0",
  users: "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM2.5 20a6.5 6.5 0 0 1 13 0M17 4.2a3.5 3.5 0 0 1 0 6.6M19 14.2a6.5 6.5 0 0 1 3 5.8",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7v5l3.5 2",
  logout: "M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l-5-5 5-5M5 12h11",
  book: "M12 6.5C10.5 5 8 4.5 4 4.8v13C8 17.5 10.5 18 12 19.3M12 6.5C13.5 5 16 4.5 20 4.8v13C16 17.5 13.5 18 12 19.3M12 6.5v12.8",
  school: "M12 3 3 8l9 5 9-5-9-5ZM6 11v5c0 1.1 2.7 3 6 3s6-1.9 6-3v-5M21 8v6",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM21 21l-4.5-4.5",
  plus: "M12 5v14M5 12h14",
  edit: "M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3ZM14 7l3 3",
  trash: "M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13M10 11v6M14 11v6",
  x: "M6 6l12 12M18 6 6 18",
  info: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 11v5M12 7.5h.01",
  refresh: "M3.5 12a8.5 8.5 0 0 1 14.5-6l2 2M20.5 12A8.5 8.5 0 0 1 6 18l-2-2M19.5 4v4h-4M4.5 20v-4h4",
  chevR: "M9 6l6 6-6 6",
  qr: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z",
  mail: "M3 6h18v12H3zM3 7l9 6 9-6",
  pin: "M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11ZM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  check: "M5 12.5 10 17l9-10",
  save: "M5 4h11l3 3v13H5zM8 4v5h7M8 20v-6h8v6",
  eye: "M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  cal: "M4 6h16v15H4zM4 10h16M8 3v4M16 3v4",
  award: "M12 14a6 6 0 1 0 0-12 6 6 0 0 0 0 12ZM8.5 13l-1.5 8 5-3 5 3-1.5-8",
  arrowR: "M5 12h14M13 6l6 6-6 6",
  lock: "M6 10V8a6 6 0 0 1 12 0v2M5 10h14v10H5zM12 14v3",
  shield: "M12 3 5 6v5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3ZM9 12l2 2 4-4",
  settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM19.4 13.5a7.8 7.8 0 0 0 0-3l1.8-1.4-2-3.4-2.1.9a7.8 7.8 0 0 0-2.6-1.5L14 2h-4l-.5 2.6a7.8 7.8 0 0 0-2.6 1.5l-2.1-.9-2 3.4L4.6 10a7.8 7.8 0 0 0 0 3l-1.8 1.4 2 3.4 2.1-.9a7.8 7.8 0 0 0 2.6 1.5L10 22h4l.5-2.6a7.8 7.8 0 0 0 2.6-1.5l2.1.9 2-3.4-1.8-1.4Z",
  cap: "M12 4 2 9l10 5 10-5-10-5ZM6 11.5V16c0 1.4 2.7 3 6 3s6-1.6 6-3v-4.5M21 9v5",
  list: "M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01",
  filter: "M3 5h18l-7 8v6l-4-2v-4L3 5Z",
  sparkle: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3ZM19 16l.7 2 2 .7-2 .7L19 22l-.7-2-2-.7 2-.7.7-2Z",
  copy: "M9 9h10v10H9zM5 15H4V5h10v1",
  external: "M14 4h6v6M20 4l-8 8M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5",
  print: "M6 9V3h12v6M6 18H4a1 1 0 0 1-1-1v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5a1 1 0 0 1-1 1h-2M6 13h12v8H6z",
  megaphone: "M4 10v4h3l6 4V6L7 10H4ZM17 9a3.5 3.5 0 0 1 0 6",
  trophy: "M8 4h8v4a4 4 0 0 1-8 0V4ZM8 6H5v1a3 3 0 0 0 3 3M16 6h3v1a3 3 0 0 0-3 3M9.5 14h5M9 20h6M12 14v6",
  flame: "M12 3c3 4 5 6.2 5 9.2a5 5 0 0 1-10 0c0-1.2.6-2.3 1.6-3.4C10 11 11 9 12 3Z",
  trendUp: "M4 17l5-5 3 3 8-8M15 7h5v5",
  star: "M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.6l1-5.8-4.3-4.1 5.9-.9L12 3.5Z",
  globe: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3.5 9.5h17M3.5 14.5h17M12 3c2.4 2.4 3.5 5.6 3.5 9s-1.1 6.6-3.5 9c-2.4-2.4-3.5-5.6-3.5-9s1.1-6.6 3.5-9Z"
};

export function Icon({ name, size = 18, stroke = 1.8, fill = "none", style }) {
  const d = ICONS[name];
  if (!d) return null;
  return (
    <svg className="ic" width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
         style={style} aria-hidden="true">
      <path d={d} fill={fill === "current" ? "currentColor" : "none"} />
    </svg>
  );
}

/* ---- logo mark ---- */
export function Mark({ size = 38 }) {
  const r = size * 0.29;
  return (
    <span className="mark" style={{ width: size, height: size, borderRadius: r, display: "inline-grid", placeItems: "center" }}>
      <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 6.2C10.4 4.8 8 4.3 4.5 4.7v13C8 17.3 10.4 17.8 12 19.2M12 6.2C13.6 4.8 16 4.3 19.5 4.7v13C16 17.3 13.6 17.8 12 19.2M12 6.2v13" />
      </svg>
    </span>
  );
}

export function Wordmark({ size = 21 }) {
  return (
    <div className="brand" style={{ display: "flex", alignItems: "center", gap: 11 }}>
      <Mark />
      <span className="name" style={{ fontSize: size, fontWeight: 800, color: "var(--ink)" }}>Maqra<span>'</span></span>
    </div>
  );
}

/* ---- avatar ---- */
export function Avatar({ name = "Pelajar", sex = "m", size = 58, ring = false }) {
  const initials = name
    .split(" ")
    .filter((w) => !["Bin", "Binti", "bin", "binti"].includes(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  const hue = sex === "f" ? 330 : 200;
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flex: "none",
      display: "grid", placeItems: "center", fontWeight: 800, color: "#fff",
      fontSize: size * 0.36, letterSpacing: "-0.02em",
      background: `linear-gradient(150deg, oklch(0.62 0.10 ${hue}), oklch(0.50 0.11 ${hue}))`,
      boxShadow: ring ? `0 0 0 3px var(--surface), 0 0 0 5px oklch(0.62 0.10 ${hue} / .4)` : "none"
    }}>
      {initials.toUpperCase()}
    </div>
  );
}

/* ---- status helpers ---- */
export function StatusDot({ s, size = 9 }) {
  const css = STATUS_MAP[s]?.css || "belum";
  return <span className="dot" style={{ width: size, height: size, borderRadius: "50%", display: "inline-block", background: `var(--st-${css}-ink)` }} />;
}

export function StatusChip({ s }) {
  const st = STATUS_MAP[s] || STATUS_MAP["belum"];
  return (
    <span className="chip" style={{ background: `var(--st-${st.css}-fill)`, borderColor: "transparent", color: `var(--st-${st.css}-ink)` }}>
      <span className="dot" style={{ background: `var(--st-${st.css}-ink)` }} />{st.label}
    </span>
  );
}

export function GredBadge({ g }) {
  const cssMap = {
    "Mumtaz": "mumtaz",
    "Jayyid Jiddan": "jayyidj",
    "Jayyid": "jayyid",
    "Sederhana": "sederhana",
    "Maqbul": "maqbul"
  };
  const css = cssMap[g] || "maqbul";
  return (
    <span className="badge" style={{ color: `var(--gr-${css})`, background: `color-mix(in oklch, var(--gr-${css}) 12%, var(--surface))`, borderColor: "transparent" }}>
      {g}
    </span>
  );
}

/* ---- stat card ---- */
export function StatCard({ icon, label, value, sub, tone = "accent" }) {
  const bg = tone === "accent" ? "var(--accent-soft)" : `var(--st-${tone}-fill)`;
  const fg = tone === "accent" ? "var(--accent-deep)" : `var(--st-${tone}-ink)`;
  return (
    <div className="card" style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--ink-3)" }}>{label}</span>
        <span style={{ width: 34, height: 34, borderRadius: 10, background: bg, color: fg, display: "grid", placeItems: "center" }}>
          <Icon name={icon} size={18} />
        </span>
      </div>
      <div>
        <div style={{ fontSize: 27, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1 }}>{value}</div>
        {sub && <div style={{ fontSize: "12.5px", color: "var(--ink-3)", marginTop: 5 }}>{sub}</div>}
      </div>
    </div>
  );
}

/* ---- sidebar ---- */
export function Sidebar({ roleIcon, roleTitle, roleSub, items, active, onNav, onLogout, footerNote }) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  if (isMobile) {
    const activeLabel = (items.find((i) => i.key === active) || {}).label || roleTitle;
    return (
      <div className="msidebar">
        <div className="mtopbar">
          <Wordmark size={18} />
          <button className="mburger" onClick={() => setOpen((o) => !o)} aria-label="Menu">
            <Icon name={open ? "x" : "list"} size={20} />
            <span style={{ fontSize: 13, fontWeight: 700, marginLeft: 6 }}>{activeLabel}</span>
          </button>
        </div>
        {open && (
          <>
            <div className="mscrim" onClick={() => setOpen(false)} />
            <div className="mdrawer">
              <div className="role-card" style={{ marginBottom: 14 }}>
                <span className="ic"><Icon name={roleIcon} size={20} /></span>
                <div><div className="t">{roleTitle}</div><div className="s">{roleSub}</div></div>
              </div>
              <nav className="nav">
                {items.map((it, idx) => it.section ? (
                  <div className="lbl" key={"s" + idx}>{it.section}</div>
                ) : (
                  <button key={it.key} className={active === it.key ? "on" : ""} onClick={() => { onNav(it.key); setOpen(false); }}>
                    <span className="ic"><Icon name={it.icon} size={19} /></span>{it.label}
                  </button>
                ))}
                <button onClick={() => { onLogout(); setOpen(false); }} style={{ marginTop: 6 }}>
                  <span className="ic"><Icon name="logout" size={19} /></span>Log Keluar
                </button>
              </nav>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <aside className="sidebar">
      <Wordmark />
      <div className="role-card">
        <span className="ic"><Icon name={roleIcon} size={20} /></span>
        <div>
          <div className="t">{roleTitle}</div>
          <div className="s">{roleSub}</div>
        </div>
      </div>
      <nav className="nav" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {items.map((it, idx) =>
          it.section ? (
            <div className="lbl" key={"s" + idx}>{it.section}</div>
          ) : (
            <button key={it.key} className={active === it.key ? "on" : ""} onClick={() => onNav(it.key)}>
              <span className="ic"><Icon name={it.icon} size={19} /></span>{it.label}
            </button>
          )
        )}
        <div style={{ flex: 1 }} />
        {footerNote && <div style={{ fontSize: "11.5px", color: "var(--ink-3)", padding: "10px 12px", lineHeight: 1.5 }}>{footerNote}</div>}
        <button onClick={onLogout} style={{ borderTop: "1px solid var(--line)", borderRadius: 0, marginTop: 10 }}>
          <span className="ic"><Icon name="logout" size={19} /></span>Log Keluar
        </button>
      </nav>
    </aside>
  );
}

/* ---- progress bar ---- */
export function Bar({ value, tone = "var(--accent)", height = 8 }) {
  return (
    <div style={{ height, background: "var(--line-2)", borderRadius: 99, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${value}%`, background: tone, borderRadius: 99, transition: "width .5s cubic-bezier(.2,.8,.2,1)" }} />
    </div>
  );
}

/* ---- placeholder ---- */
export function Placeholder({ label, h = 160, style }) {
  return (
    <div style={{
      height: h, borderRadius: "var(--radius-sm)", display: "grid", placeItems: "center",
      background: "repeating-linear-gradient(135deg, var(--surface-2), var(--surface-2) 11px, var(--line-2) 11px, var(--line-2) 22px)",
      border: "1px solid var(--line)", color: "var(--ink-3)", fontFamily: "var(--font-mono)", fontSize: 12, ...style
    }}>{label}</div>
  );
}

/* ---- faux QR (deterministic squares) ---- */
export function FauxQR({ size = 132, seed = 7 }) {
  const cells = useMemo(() => {
    const n = 21;
    // Simple LCG random
    let s = seed * 99 + 1;
    const r = () => {
      s = (s * 1103515245 + 12345) & 0x7fffffff;
      return s / 0x7fffffff;
    };
    
    const grid = [];
    const finder = (x, y) => (x < 7 && y < 7) || (x > n - 8 && y < 7) || (x < 7 && y > n - 8);
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        if (finder(x, y)) {
          const lx = x > n - 8 ? x - (n - 7) : x;
          const ly = y > n - 8 ? y - (n - 7) : y;
          const on = lx === 0 || lx === 6 || ly === 0 || ly === 6 || (lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4);
          grid.push(on ? 1 : 0);
        } else {
          grid.push(r() > 0.55 ? 1 : 0);
        }
      }
    }
    return { n, grid };
  }, [seed]);

  const { n, grid } = cells;
  const c = size / n;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block", borderRadius: 8 }}>
      <rect width={size} height={size} fill="#fff" />
      {grid.map((v, i) => v ? <rect key={i} x={(i % n) * c} y={Math.floor(i / n) * c} width={c} height={c} fill="#16261d" /> : null)}
    </svg>
  );
}
