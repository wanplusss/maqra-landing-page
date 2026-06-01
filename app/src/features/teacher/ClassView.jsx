import React, { useState, useEffect } from "react";
import { ClassViewService } from "./ClassViewService.js";
import { Icon } from "../../components/Shared.jsx";

export function ClassView({ onOpenStudent }) {
  const [className, setClassName] = useState("Tahun 4");
  const [cohortData, setCohortData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("progress");

  useEffect(() => {
    async function load() {
      setLoading(true);
      const list = await ClassViewService.getClassCohortHeatmap(className);
      setCohortData(list);
      setLoading(false);
    }
    load();
  }, [className]);

  const sortedList = [...cohortData].sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortBy === "pace") {
      return b.pace - a.pace;
    } else {
      return b.totalMemorized - a.totalMemorized; // default progress
    }
  });

  return (
    <div>
      <div className="pagehead">
        <div>
          <h1>Peta Kemajuan Kohort Kelas</h1>
          <p>Prestasi kumulatif pelajar merentas 30 Juzuk Al-Quran</p>
        </div>
        <div>
          <select 
            className="select" 
            value={className} 
            onChange={(e) => setClassName(e.target.value)}
            style={{ width: 140, fontWeight: 700 }}
          >
            <option value="Tahun 2">Tahun 2</option>
            <option value="Tahun 3">Tahun 3</option>
            <option value="Tahun 4">Tahun 4</option>
            <option value="Tahun 5">Tahun 5</option>
            <option value="Tahun 6">Tahun 6</option>
          </select>
        </div>
      </div>

      <div className="card" style={{ padding: 22, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>Peta Haba Hafazan 30 Juzuk</h3>
            <span className="badge">Kelas: {className}</span>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 12.5, color: "var(--ink-3)", fontWeight: 650 }}>Susun Mengikut:</span>
            <div className="persona" style={{ background: "var(--surface-2)", border: "1px solid var(--line)" }}>
              <button className={sortBy === "progress" ? "on" : ""} onClick={() => setSortBy("progress")}>Progres</button>
              <button className={sortBy === "name" ? "on" : ""} onClick={() => setSortBy("name")}>Nama</button>
              <button className={sortBy === "pace" ? "on" : ""} onClick={() => setSortBy("pace")}>Kelajuan</button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="empty">Memuatkan data peta haba kohort...</div>
        ) : sortedList.length === 0 ? (
          <div className="empty">Tiada pelajar berdaftar dalam kelas ini.</div>
        ) : (
          <div className="scroll" style={{ overflowX: "auto" }}>
            <table className="tbl" style={{ minWidth: 980, borderCollapse: "separate", borderSpacing: "0 4px" }}>
              <thead>
                <tr>
                  <th style={{ width: 180, background: "var(--surface)", borderBottom: "1.5px solid var(--line)" }}>Nama Pelajar</th>
                  <th style={{ width: 90, textAlign: "center", borderBottom: "1.5px solid var(--line)" }}>Hafaz (m.s.)</th>
                  <th style={{ width: 80, textAlign: "center", borderBottom: "1.5px solid var(--line)" }}>Sasaran / Bln</th>
                  <th style={{ borderBottom: "1.5px solid var(--line)", textAlign: "center" }}>30 Petak Juzuk Al-Quran (Juz 1 - Juz 30)</th>
                </tr>
              </thead>
              <tbody>
                {sortedList.map((row) => (
                  <tr key={row.studentId}>
                    <td style={{ fontWeight: 700, whiteSpace: "nowrap" }}>
                      <button 
                        onClick={() => onOpenStudent(row.studentId)}
                        style={{ border: "none", background: "none", padding: 0, textLeft: "left", fontWeight: 700, color: "var(--ink)" }}
                        onMouseOver={(e) => e.target.style.color = "var(--accent)"}
                        onMouseOut={(e) => e.target.style.color = "var(--ink)"}
                      >
                        {row.name.split(" ").slice(0, 3).join(" ")}
                      </button>
                      <div style={{ fontSize: 10, color: "var(--ink-3)", fontWeight: 550, marginTop: 2 }}>ID: {row.studentId}</div>
                    </td>
                    <td className="mono" style={{ textAlign: "center", fontWeight: 800 }}>{row.totalMemorized}</td>
                    <td className="mono" style={{ textAlign: "center", color: row.status === "behind" ? "var(--gr-sederhana)" : "var(--accent)" }}>
                      {row.pace} / {row.target}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 3.5, justifyContent: "center" }}>
                        {row.juzukCompletions.map((pct, idx) => {
                          // pine emerald shades based on completion percent
                          let cellBg = "var(--line-2)";
                          let cellBorder = "transparent";
                          let opacity = 0.2;
                          
                          if (pct === 100) {
                            cellBg = "var(--st-hafazan-ink)";
                            opacity = 0.95;
                          } else if (pct > 75) {
                            cellBg = "var(--st-hafazan-ink)";
                            opacity = 0.75;
                          } else if (pct > 40) {
                            cellBg = "var(--st-murajaah-ink)";
                            opacity = 0.6;
                          } else if (pct > 0) {
                            cellBg = "var(--st-bacaan-ink)";
                            opacity = 0.45;
                          }

                          return (
                            <div 
                              key={idx}
                              style={{
                                width: 18,
                                height: 18,
                                borderRadius: 3,
                                background: cellBg,
                                opacity,
                                display: "grid",
                                placeItems: "center",
                                fontSize: 8.5,
                                color: pct > 40 ? "#fff" : "var(--ink)",
                                fontWeight: 800,
                                transition: "transform .12s, opacity .12s",
                                cursor: "pointer"
                              }}
                              title={`Juzuk ${idx + 1}: ${pct}% selesai`}
                              onClick={() => onOpenStudent(row.studentId)}
                              onMouseOver={(e) => { e.target.style.transform = "scale(1.25)"; e.target.style.opacity = 1; }}
                              onMouseOut={(e) => { e.target.style.transform = ""; e.target.style.opacity = opacity; }}
                            >
                              {idx + 1}
                            </div>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Legend */}
      <div className="card" style={{ padding: 14, display: "flex", gap: 18, flexWrap: "wrap", justifyContent: "center" }}>
        {[
          { label: "Selesai Penuh (100%)", color: "var(--st-hafazan-ink)", opacity: 0.95 },
          { label: "Majoriti (>75%)", color: "var(--st-hafazan-ink)", opacity: 0.75 },
          { label: "Separuh Selesai (>40%)", color: "var(--st-murajaah-ink)", opacity: 0.6 },
          { label: "Mula Hafaz (>0%)", color: "var(--st-bacaan-ink)", opacity: 0.45 },
          { label: "Belum Mula", color: "var(--line-2)", opacity: 0.2 }
        ].map((leg) => (
          <span key={leg.label} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600 }}>
            <span style={{ width: 12, height: 12, borderRadius: 2.5, background: leg.color, opacity: leg.opacity }} />
            {leg.label}
          </span>
        ))}
      </div>
    </div>
  );
}
export default ClassView;
