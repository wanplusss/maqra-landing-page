import { useState } from "react";
import { StudentRepository } from "../student/repository/StudentRepository.js";
import { Wordmark, Icon } from "../../components/Shared.jsx";

export function StudentLookup({ onEnter }) {
  const [sid, setSid] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    if (e) e.preventDefault();
    if (!sid.trim()) {
      setErr("Sila masukkan No. ID Pelajar.");
      return;
    }
    
    setLoading(true);
    setErr("");
    
    try {
      const found = await StudentRepository.getById(sid.trim().toUpperCase());
      if (!found) {
        setErr("ID Pelajar tidak dijumpai. Cuba STU00123.");
      } else {
        onEnter(found);
      }
    } catch (err) {
      setErr("Ralat menyemak ID: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "grid", placeItems: "center", minHeight: "80vh", padding: 20 }}>
      <div className="card animate-up" style={{ padding: 28, width: "100%", maxWidth: 440 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <Wordmark size={24} />
        </div>
        <h3 style={{ margin: "0 0 6px", fontSize: 17, fontWeight: 800, textAlign: "center" }}>Semak Progres Anak</h3>
        <p style={{ margin: "0 0 20px", color: "var(--ink-3)", fontSize: 13.5, textAlign: "center", lineHeight: 1.5 }}>
          Masukkan ID Pelajar anak anda untuk melihat perkembangan hafazan secara langsung.
        </p>
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="search">
            <span className="ic"><Icon name="user" size={17} /></span>
            <input 
              value={sid} 
              onChange={(e) => { setSid(e.target.value); setErr(""); }} 
              placeholder="cth. STU00123" 
              autoFocus 
              disabled={loading}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ justifyContent: "center" }} disabled={loading}>
            {loading ? "Menyemak..." : "Semak Sekarang"} <Icon name="arrowR" size={16} />
          </button>
        </form>
        {err && <div style={{ color: "var(--gr-sederhana)", fontSize: "12.5px", marginTop: 12, fontWeight: 650, textAlign: "center" }}>{err}</div>}
        
        <div style={{ marginTop: 18, fontSize: 12, color: "var(--ink-3)", textAlign: "center", borderTop: "1px solid var(--line)", paddingTop: 14 }}>
          ID Contoh untuk dicuba:{" "}
          <button 
            className="mono" 
            onClick={() => setSid("STU00123")} 
            style={{ 
              border: "none", 
              background: "var(--surface-2)", 
              padding: "3px 8px", 
              borderRadius: 6, 
              color: "var(--accent-deep)", 
              fontWeight: 700 
            }}
          >
            STU00123
          </button>
        </div>
      </div>
    </div>
  );
}
export default StudentLookup;
