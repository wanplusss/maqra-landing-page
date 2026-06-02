import { useState } from "react";
import { BulkImportService } from "./BulkImportService.js";
import { Icon } from "../../../components/Shared.jsx";

export function BulkImportModal({ isOpen, onClose, onRefresh }) {
  const [fileType, setFileType] = useState("csv"); // 'csv' | 'json'
  const [rawText, setRawText] = useState("");
  const [loading, setLoading] = useState(false);
  const [successCount, setSuccessCount] = useState(null);
  const [err, setErr] = useState("");

  if (!isOpen) return null;

  const handleImport = async (e) => {
    if (e) e.preventDefault();
    if (!rawText.trim()) {
      setErr("Sila masukkan data CSV atau JSON.");
      return;
    }

    setLoading(true);
    setErr("");
    setSuccessCount(null);

    try {
      const count = await BulkImportService.importData(rawText, fileType);
      setSuccessCount(count);
      setRawText("");
      onRefresh();
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const extension = file.name.split(".").pop().toLowerCase();
    if (extension === "json" || extension === "csv") {
      setFileType(extension);
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setRawText(event.target.result);
      setErr("");
    };
    reader.onerror = () => {
      setErr("Gagal membaca fail yang dimuat naik.");
    };
    reader.readAsText(file);
  };

  const loadExample = () => {
    if (fileType === "csv") {
      setRawText(
        `name,kelas,umur,sex,parent,target,beginner\n"Ahmad Farhan Bin Roslan","Tahun 4",10,"m","012-998 2211",15,false\n"Siti Aminah Binti Kamal","Tahun 5",11,"f","019-334 5567",18,false`
      );
    } else {
      setRawText(
        JSON.stringify(
          [
            {
              name: "Ahmad Farhan Bin Roslan",
              kelas: "Tahun 4",
              umur: 10,
              sex: "m",
              parent: "012-998 2211",
              target: 15,
              beginner: false
            },
            {
              name: "Siti Aminah Binti Kamal",
              kelas: "Tahun 5",
              umur: 11,
              sex: "f",
              parent: "019-334 5567",
              target: 18,
              beginner: false
            }
          ],
          null,
          2
        )
      );
    }
    setErr("");
    setSuccessCount(null);
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 580 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <h3>Bulk Import Roster Pelajar</h3>
            <p>Daftar ramai pelajar sekaligus melalui fail CSV/JSON atau tampalan teks</p>
          </div>
          <button className="iconbtn" onClick={onClose}>✕</button>
        </div>
        
        <div className="modal-body scroll" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {successCount !== null ? (
            <div style={{ textAlign: "center", padding: "24px 10px", background: "var(--accent-soft)", borderRadius: 14, color: "var(--accent-deep)" }} className="animate-up">
              <span style={{ display: "grid", placeItems: "center", width: 44, height: 44, borderRadius: "50%", background: "var(--accent)", color: "#fff", margin: "0 auto 12px" }}>
                <Icon name="check" size={24} />
              </span>
              <h3 style={{ margin: 0, fontWeight: 800 }}>Import Berjaya!</h3>
              <p style={{ margin: "6px 0 16px", fontSize: 13.5, color: "var(--ink-2)" }}>
                Sebanyak <strong>{successCount}</strong> rekod pelajar baharu telah berjaya diimport ke dalam sistem.
              </p>
              <button type="button" className="btn btn-primary" style={{ margin: "0 auto" }} onClick={() => setSuccessCount(null)}>
                Import Lebih Banyak
              </button>
            </div>
          ) : (
            <form onSubmit={handleImport} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              
              {/* Toggles & File selection row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: 12.5, color: "var(--ink-3)", fontWeight: 650 }}>Format Fail:</span>
                  <div className="persona" style={{ background: "var(--surface-2)", border: "1px solid var(--line)" }}>
                    <button type="button" className={fileType === "csv" ? "on" : ""} onClick={() => { setFileType("csv"); setRawText(""); }}>CSV</button>
                    <button type="button" className={fileType === "json" ? "on" : ""} onClick={() => { setFileType("json"); setRawText(""); }}>JSON</button>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={loadExample}>
                    <Icon name="sparkle" size={13} /> Muat Contoh
                  </button>
                  <label className="btn btn-sm" style={{ cursor: "pointer", border: "1px solid var(--line)" }}>
                    <Icon name="plus" size={13} /> Pilih Fail...
                    <input type="file" accept=".csv,.json" onChange={handleFileUpload} style={{ display: "none" }} />
                  </label>
                </div>
              </div>

              {/* Textarea for pasted code */}
              <div className="field">
                <label>Salin & Tampal Teks atau muat naik fail (.csv, .json)</label>
                <textarea 
                  className="textarea mono" 
                  value={rawText} 
                  onChange={(e) => setRawText(e.target.value)} 
                  placeholder={fileType === "csv" ? "name,kelas,umur,sex,parent,target,beginner\n\"Ahmad Danish\",\"Tahun 4\",10,\"m\",\"012-345 6789\",15,false" : '[\n  {\n    "name": "Ahmad Danish",\n    "kelas": "Tahun 4",\n    "umur": 10,\n    "sex": "m",\n    "parent": "012-345 6789",\n    "target": 15,\n    "beginner": false\n  }\n]'}
                  style={{ minHeight: 180, fontSize: 12, lineHeight: 1.5, fontFamily: "var(--font-mono)" }}
                  disabled={loading}
                />
              </div>

              {err && (
                <div style={{ color: "var(--gr-sederhana)", background: "color-mix(in oklch, var(--gr-sederhana) 10%, var(--surface))", padding: 12, borderRadius: 8, fontSize: 12.5, whiteSpace: "pre-wrap", maxHeight: 150, overflowY: "auto", border: "1px solid color-mix(in oklch, var(--gr-sederhana) 20%, transparent)", fontWeight: 600 }}>
                  {err}
                </div>
              )}

              <div className="modal-foot" style={{ padding: "8px 0 0", borderTop: "none" }}>
                <button type="button" className="btn btn-ghost" onClick={onClose} disabled={loading}>Batal</button>
                <button type="submit" className="btn btn-primary" disabled={loading || !rawText.trim()}>
                  <Icon name="save" size={15} /> {loading ? "Mengimport..." : "Mula Bulk Import"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
