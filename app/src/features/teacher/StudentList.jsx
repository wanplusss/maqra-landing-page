import { useState } from "react";
import { Avatar, StatCard, Icon, StatusChip } from "../../components/Shared.jsx";

export function StudentRow({ st, onOpen }) {
  // Dominant frontier status
  const s = st.statusMap[st.frontier] || "belum";
  const statusDisplay = s === "belum" ? "bacaan" : s;

  return (
    <button 
      onClick={onOpen} 
      style={{
        display: "flex", alignItems: "center", gap: 16, width: "100%", textAlign: "left", flexWrap: "wrap",
        background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 14, padding: "14px 18px",
        transition: "border-color .14s, background .14s, transform .06s",
        outline: "none"
      }}
      onMouseOver={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.background = "var(--surface-2)"; }}
      onMouseOut={(e) => { e.currentTarget.style.borderColor = "var(--line)"; e.currentTarget.style.background = "var(--surface)"; }}
    >
      <Avatar name={st.name} sex={st.sex} size={46} />
      <div style={{ width: 220, flex: "none" }}>
        <div style={{ fontWeight: 700, fontSize: "14.5px", color: "var(--ink)" }}>{st.name}</div>
        <div style={{ display: "flex", gap: 8, marginTop: 3, alignItems: "center" }}>
          <span className="mono" style={{ fontSize: "11.5px", color: "var(--ink-3)" }}>{st.id}</span>
          <span style={{ fontSize: "11.5px", color: "var(--ink-3)" }}>· {st.kelas}</span>
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: "12.5px" }}>
          <span style={{ color: "var(--ink-2)", fontWeight: 600 }}>Sasaran: {st.target} m.s.</span>
          <span className="mono" style={{ color: "var(--ink-3)" }}>{st.progress}%</span>
        </div>
        <div style={{ height: 6, background: "var(--line-2)", borderRadius: 99, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${st.progress}%`, background: "var(--accent)", borderRadius: 99 }} />
        </div>
      </div>
      <div style={{ width: 100, flex: "none", display: "flex", justifyContent: "flex-end" }}>
        <StatusChip s={statusDisplay} />
      </div>
      <Icon name="chevR" size={18} style={{ color: "var(--ink-3)" }} />
    </button>
  );
}

export function StudentList({ students = [], onOpenStudent, schoolName }) {
  const [q, setQ] = useState("");

  const filtered = students.filter(
    (s) => s.name.toLowerCase().includes(q.toLowerCase()) || s.id.toLowerCase().includes(q.toLowerCase())
  );

  const avgProgress = students.length > 0
    ? Math.round((students.reduce((a, s) => a + s.progress, 0) / students.length) * 10) / 10
    : 0;

  const activeTasmikToday = students.reduce((a, s) => a + (s.history?.filter((h) => {
    // Check if added today
    const recDate = new Date(h.date);
    const today = new Date(2026, 4, 30);
    return recDate.toDateString() === today.toDateString();
  }).length || 0), 0);

  return (
    <div>
      <div className="pagehead">
        <div>
          <h1>Senarai Pelajar</h1>
          <p>{schoolName} · {students.length} pelajar aktif dibimbing</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 22 }}>
        <StatCard icon="users" label="Jumlah Pelajar" value={students.length} sub="aktif dibimbing" />
        <StatCard icon="award" label="Purata Progres" value={avgProgress + "%"} sub="merentas pelajar" tone="murajaah" />
        <StatCard icon="check" label="Tasmik Hari Ini" value={activeTasmikToday} sub="rekod disimpan hari ini" tone="hafazan" />
      </div>

      <div className="search" style={{ marginBottom: 16, maxWidth: 420 }}>
        <span className="ic"><Icon name="search" size={17} /></span>
        <input 
          value={q} 
          onChange={(e) => setQ(e.target.value)} 
          placeholder="Cari nama atau ID pelajar..." 
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map((s) => (
          <StudentRow 
            key={s.id} 
            st={s} 
            onOpen={() => onOpenStudent(s.id)} 
          />
        ))}
        {filtered.length === 0 && (
          <div className="empty">
            <Icon name="search" size={28} />
            <div>Tiada pelajar sepadan ditemui.</div>
          </div>
        )}
      </div>
    </div>
  );
}
export default StudentList;
