import React, { useState, useMemo } from "react";
import { STATUS } from "../../maqra/domain/statusColors.js";
import { PageGrid, Legend } from "../GridView.jsx";
import { Icon } from "../../../components/Shared.jsx";

export function ProgressGrid({ st, columns, onCell }) {
  const [filter, setFilter] = useState(null);

  const filtered = useMemo(() => {
    if (!filter) return st.statusMap;
    const m = {};
    for (let p = 1; p <= 604; p++) {
      m[p] = st.statusMap[p] === filter ? st.statusMap[p] : "belum";
    }
    return m;
  }, [filter, st]);

  return (
    <div className="card" style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 18 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
          <button 
            className="chip" 
            onClick={() => setFilter(null)} 
            style={{ 
              borderColor: !filter ? "var(--accent)" : "var(--line)", 
              color: !filter ? "var(--accent-deep)" : "var(--ink-2)", 
              fontWeight: 700 
            }}
          >
            Semua
          </button>
          {STATUS.filter((s) => s.key !== "belum").map((s) => (
            <button 
              key={s.key} 
              className="chip" 
              onClick={() => setFilter(filter === s.key ? null : s.key)}
              style={{ borderColor: filter === s.key ? `var(--st-${s.css}-ink)` : "var(--line)" }}
            >
              <span className="dot" style={{ background: `var(--st-${s.css}-ink)` }} />
              {s.label}
              <span className="mono" style={{ opacity: 0.6, fontSize: 11, marginLeft: 5 }}>{(st.tally && st.tally[s.key]) || 0}</span>
            </button>
          ))}
        </div>
      </div>
      <PageGrid statusMap={filtered} columns={columns} onCellClick={onCell} />
    </div>
  );
}
