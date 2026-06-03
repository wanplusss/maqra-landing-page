import { useState } from "react";
import { SchoolRepository } from "../../school/repository/SchoolRepository.js";
import { Icon } from "../../../components/Shared.jsx";
import { PLAN_OPTIONS, STATUS_OPTIONS } from "../planConfig.js";

export function RegisterSchoolModal({ onClose, onSaved }) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [plan, setPlan] = useState("Percubaan");
  const [status, setStatus] = useState("percubaan");
  const [slugManual, setSlugManual] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const autoSlug = (val) =>
    val.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  const handleNameChange = (val) => {
    setName(val);
    if (!slugManual) setSlug(autoSlug(val));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim() || !adminEmail.trim() || !adminPassword.trim()) return;
    setSaving(true);
    setErr("");
    try {
      await SchoolRepository.create({
        slug: slug.trim(),
        name: name.trim(),
        city: city.trim(),
        email: email.trim(),
        phone: phone.trim(),
        plan,
        status,
        since: new Date().toISOString().slice(0, 7),
        admin_email: adminEmail.trim().toLowerCase(),
        admin_password: adminPassword,
      });
      onSaved();
    } catch (e) {
      setErr(e.message || "Gagal mendaftar sekolah.");
      setSaving(false);
    }
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <h3>Daftar Institusi Baharu</h3>
            <p>Tambah tenant sekolah baharu ke platform Maqra&apos;</p>
          </div>
          <button className="iconbtn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body scroll" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="field">
              <label>Nama Institusi *</label>
              <input className="input" value={name} onChange={(e) => handleNameChange(e.target.value)} placeholder="Maahad Tahfiz Al-Furqan" required />
            </div>

            <div className="field">
              <label>Slug URL *</label>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 12.5, color: "var(--ink-3)", whiteSpace: "nowrap" }}>maqra.app/school/</span>
                <input
                  className="input"
                  value={slug}
                  onChange={(e) => { setSlug(autoSlug(e.target.value)); setSlugManual(true); }}
                  placeholder="al-furqan"
                  pattern="[a-z0-9-]+"
                  title="Huruf kecil, angka, dan tanda sempang sahaja"
                  required
                  style={{ flex: 1 }}
                />
              </div>
              <p style={{ margin: "4px 0 0", fontSize: 11.5, color: "var(--ink-3)" }}>Huruf kecil, angka, dan tanda sempang (-) sahaja. Tidak boleh ditukar selepas daftar.</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="field">
                <label>Bandar / Negeri</label>
                <input className="input" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Kajang, Selangor" />
              </div>
              <div className="field">
                <label>Email Admin</label>
                <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@sekolah.edu.my" />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <div className="field">
                <label>No. Telefon</label>
                <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="03-1234 5678" />
              </div>
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

            <div style={{ borderTop: "1px solid var(--line)", paddingTop: 14 }}>
              <p style={{ margin: "0 0 10px", fontSize: 12.5, fontWeight: 700, color: "var(--ink-2)" }}>Akaun Admin Sekolah</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="field">
                  <label>E-mel Login Admin *</label>
                  <input className="input" type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} placeholder="admin@sekolah.edu.my" required />
                </div>
                <div className="field">
                  <label>Kata Laluan *</label>
                  <input className="input" type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} placeholder="Min. 8 aksara" minLength={6} required />
                </div>
              </div>
            </div>

            {err && (
              <div style={{ color: "var(--gr-sederhana)", background: "color-mix(in oklch, var(--gr-sederhana) 10%, var(--surface))", padding: 12, borderRadius: 8, fontSize: 12.5, border: "1px solid color-mix(in oklch, var(--gr-sederhana) 20%, transparent)" }}>
                {err}
              </div>
            )}
          </div>

          <div className="modal-foot">
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={saving}>Batal</button>
            <button type="submit" className="btn btn-primary" disabled={saving || !name.trim() || !slug.trim() || !adminEmail.trim() || !adminPassword.trim()}>
              <Icon name="plus" size={15} /> {saving ? "Mendaftar..." : "Daftar Sekolah"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
