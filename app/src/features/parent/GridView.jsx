import React, { useState } from "react";
import { STATUS, STATUS_MAP } from "../maqra/domain/statusColors.js";
import { getJuzukFromPage, getSurahFromPage, JUZ_START } from "../maqra/domain/pageMapping.js";

export function Legend({ compact = false }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: compact ? "6px 14px" : "8px 18px", alignItems: "center" }}>
      {STATUS.map((s) => (
        <span key={s.key} style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: "12.5px", fontWeight: 600, color: "var(--ink-2)" }}>
          <span style={{ width: 11, height: 11, borderRadius: 4, background: `var(--st-${s.css}-fill)`, boxShadow: `inset 0 0 0 1.5px var(--st-${s.css}-ink)` }} />
          {s.label}
        </span>
      ))}
    </div>
  );
}

export function GridTooltip({ data }) {
  if (!data) return null;
  const { rect, page, status } = data;
  const st = STATUS_MAP[status] || STATUS_MAP["belum"];
  const top = rect.top < 200;
  
  const style = {
    position: "fixed",
    left: Math.min(Math.max(rect.left + rect.width / 2, 130), window.innerWidth - 130),
    top: top ? rect.bottom + 10 : rect.top - 10,
    transform: `translate(-50%, ${top ? "0" : "-100%"})`,
    zIndex: 70,
    pointerEvents: "none"
  };

  return (
    <div style={style} className="animate-up">
      <div style={{
        background: "var(--ink)", color: "var(--bg)", borderRadius: 12, padding: "11px 14px",
        width: 220, boxShadow: "0 16px 40px -12px hsl(var(--shadow-color) / 0.5)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
          <span style={{ fontWeight: 800, fontSize: 15 }}>Muka Surat {page}</span>
          <span className="mono" style={{ fontSize: 11, opacity: 0.65 }}>Juz {getJuzukFromPage(page)}</span>
        </div>
        <div style={{ fontSize: "12.5px", opacity: 0.8, marginBottom: 9 }}>Surah {getSurahFromPage(page)}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ width: 9, height: 9, borderRadius: 3, background: `var(--st-${st.css}-ink)` }} />
          <span style={{ fontSize: "12.5px", fontWeight: 700 }}>{st.label}</span>
        </div>
      </div>
    </div>
  );
}

export function PageGrid({ statusMap = {}, columns = 20, onCellClick, selected = null, juzMarkers = true }) {
  const [hover, setHover] = useState(null);

  const enter = (e, page) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHover({ rect, page, status: statusMap[page] || "belum" });
  };

  return (
    <div style={{ position: "relative" }} onMouseLeave={() => setHover(null)}>
      <div className="pagegrid" style={{ display: "grid", gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gap: 5 }}>
        {Array.from({ length: 604 }, (_, i) => {
          const page = i + 1;
          const s = statusMap[page] || "belum";
          const css = STATUS_MAP[s]?.css || "belum";
          const isJuz = juzMarkers && JUZ_START.includes(page);
          const sel = selected === page;

          return (
            <button
              key={page}
              onMouseEnter={(e) => enter(e, page)}
              onClick={onCellClick ? () => onCellClick(page) : undefined}
              style={{
                aspectRatio: "1 / 1", border: "none", borderRadius: 6,
                background: `var(--st-${css}-fill)`, color: `var(--st-${css}-ink)`,
                fontFamily: "var(--font-mono)", fontSize: columns > 24 ? "9px" : columns > 18 ? "10px" : "11px",
                fontWeight: 600, display: "grid", placeItems: "center",
                cursor: onCellClick ? "pointer" : "default", position: "relative",
                outline: sel ? "2.5px solid var(--accent)" : isJuz ? `1.5px solid var(--st-${css}-ink)` : "none",
                outlineOffset: sel ? "1.5px" : "-1.5px",
                transition: "transform .1s, box-shadow .1s, outline-color .1s",
                zIndex: sel ? 2 : "auto",
                padding: 0
              }}
              onMouseOver={(e) => {
                if (onCellClick) {
                  e.currentTarget.style.transform = "scale(1.18)";
                  e.currentTarget.style.boxShadow = "0 4px 12px -2px hsl(var(--shadow-color) / 0.3)";
                  e.currentTarget.style.zIndex = 3;
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "";
                e.currentTarget.style.zIndex = sel ? 2 : "";
              }}
            >
              {page}
            </button>
          );
        })}
      </div>
      <GridTooltip data={hover} />
    </div>
  );
}

export function MiniGrid({ statusMap = {}, columns = 38 }) {
  return (
    <div className="minigrid" style={{ display: "grid", gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 1.5 }}>
      {Array.from({ length: 604 }, (_, i) => {
        const page = i + 1;
        const s = statusMap[page] || "belum";
        const css = STATUS_MAP[s]?.css || "belum";
        return (
          <span
            key={i}
            style={{
              aspectRatio: "1/1",
              borderRadius: 1.5,
              background: `var(--st-${css}-ink)`,
              opacity: s === "belum" ? 0.18 : 0.85
            }}
          />
        );
      })}
    </div>
  );
}
