import { useState } from "react";
import { STATUS } from "../maqra/domain/statusColors.js";
import { getSurahFromPage, getJuzukFromPage } from "../maqra/domain/pageMapping.js";
import { Icon } from "../../components/Shared.jsx";

const KATEGORI = ["Nazirah", "Saba'", "Sabqi", "Manzil", "Talaqqi", "Murajaah AM", "Syahadah", "Iqra'", "Tilawah"];
const GRED = ["Mumtaz", "Jayyid Jiddan", "Jayyid", "Sederhana", "Maqbul"];

export function UpdateModal({ student, page, onSave, onClose }) {
  const currentStatus = student.statusMap[page] || "belum";
  const [status, setStatus] = useState(currentStatus === "belum" ? "bacaan" : currentStatus);
  const [log, setLog] = useState(true);
  const [kategori, setKategori] = useState("Talaqqi");
  const [gred, setGred] = useState("Jayyid");
  const [ulasan, setUlasan] = useState("");
  const [masalah, setMasalah] = useState("");
  const [cadangan, setCadangan] = useState("");

  const submit = () => {
    onSave({
      status,
      log,
      kategori,
      gred,
      ulasan: ulasan || "Bacaan memuaskan.",
      masalah: masalah || "—",
      cadangan: cadangan || "Teruskan hafazan seterusnya."
    });
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="modal-head">
          <div>
            <h3>Kemas Kini Halaman {page}</h3>
            <p>{student.name.split(" ").slice(0, 2).join(" ")} · Surah {getSurahFromPage(page)} · Juz {getJuzukFromPage(page)}</p>
          </div>
          <button className="iconbtn" onClick={onClose}><Icon name="x" size={18} /></button>
        </div>

        {/* Form Body */}
        <div className="modal-body scroll" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          
          {/* Status selector */}
          <div>
            <label style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--ink-2)", display: "block", marginBottom: 10 }}>
              Status Hafazan Halaman
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
              {STATUS.map((s) => {
                const on = status === s.key;
                return (
                  <button 
                    key={s.key} 
                    onClick={() => setStatus(s.key)} 
                    style={{
                      display: "flex", alignItems: "center", gap: 9, padding: "10px 12px", borderRadius: 10,
                      border: `1.5px solid ${on ? `var(--st-${s.css}-ink)` : "var(--line)"}`,
                      background: on ? `var(--st-${s.css}-fill)` : "var(--surface)",
                      color: on ? `var(--st-${s.css}-ink)` : "var(--ink-2)", fontWeight: 650, fontSize: 13, textAlign: "left",
                    }}
                  >
                    <span className="dot" style={{ width: 10, height: 10, borderRadius: 3, background: `var(--st-${s.css}-ink)`, flex: "none" }} />
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Toggle Log creation */}
          <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: "13.5px", fontWeight: 650, marginTop: 10 }}>
            <input 
              type="checkbox" 
              checked={log} 
              onChange={(e) => setLog(e.target.checked)} 
              style={{ width: 17, height: 17, accentColor: "var(--accent)" }} 
            />
            Simpan di Log Aktiviti Tasmik
          </label>

          {/* Log Details section */}
          {log && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14, borderLeft: "2.5px solid var(--accent-soft)", marginLeft: 4, paddingLeft: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="field">
                  <label>Kategori Bacaan</label>
                  <select className="select" value={kategori} onChange={(e) => setKategori(e.target.value)}>
                    {KATEGORI.map((k) => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>Gred Penilaian</label>
                  <select className="select" value={gred} onChange={(e) => setGred(e.target.value)}>
                    {GRED.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </div>
              
              <div className="field">
                <label>Ulasan Guru</label>
                <textarea 
                  className="textarea" 
                  value={ulasan} 
                  onChange={(e) => setUlasan(e.target.value)} 
                  placeholder="Masukkan ulasan (cth. Sebutan makhraj sangat baik)" 
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="field">
                  <label>Masalah Dikesan</label>
                  <input className="input" value={masalah} onChange={(e) => setMasalah(e.target.value)} placeholder="(cth. Mim mati, dengung)" />
                </div>
                <div className="field">
                  <label>Cadangan Latihan</label>
                  <input className="input" value={cadangan} onChange={(e) => setCadangan(e.target.value)} placeholder="(cth. Ulang 3 kali halaman ini)" />
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={onClose}>Batal</button>
          <button className="btn btn-primary" onClick={submit}>
            <Icon name="save" size={15} /> Simpan Kemas Kini
          </button>
        </div>

      </div>
    </div>
  );
}
export default UpdateModal;
