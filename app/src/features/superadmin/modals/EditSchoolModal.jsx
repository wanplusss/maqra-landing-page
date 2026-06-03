import { useState } from "react";
import { SuperAdminService } from "../superAdminService.js";
import { Icon } from "../../../components/Shared.jsx";
import { PLAN_OPTIONS, STATUS_OPTIONS } from "../planConfig.js";

export function EditSchoolModal({ school, onClose, onSaved }) {
  const [name, setName] = useState(school.name);
  const [city, setCity] = useState(school.city || "");
  const [plan, setPlan] = useState(school.plan || "Percubaan");
  const [status, setStatus] = useState(school.status || "aktif");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErr("");
    try {
      await SuperAdminService.updateSchool(school.slug, {
        name: name.trim(),
        city: city.trim(),
        plan,
        status,
      });
      onSaved();
    } catch (e) {
      setErr(e.message || "Gagal mengemaskini sekolah.");
      setSaving(false);
    }
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 440 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <h3>Edit Institusi</h3>
            <p style={{ fontSize: 12.5, color: "var(--ink-3)" }}>{school.slug}</p>
          </div>
          <button className="iconbtn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="field">
              <label>Nama Institusi *</label>
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="field">
              <label>Bandar / Negeri</label>
              <input className="input" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Kajang, Selangor" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="field">
                <label>Pakej Pelan</label>
                <select className="input" value={plan} onChange={(e) => setPlan(e.target.value)}>
                  {PLAN_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Status</label>
                <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {err && (
              <div style={{ color: "var(--gr-sederhana)", background: "color-mix(in oklch, var(--gr-sederhana) 10%, var(--surface))", padding: 12, borderRadius: 8, fontSize: 12.5 }}>
                {err}
              </div>
            )}
          </div>

          <div className="modal-foot">
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={saving}>Batal</button>
            <button type="submit" className="btn btn-primary" disabled={saving || !name.trim()}>
              <Icon name="check" size={15} /> {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
