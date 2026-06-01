import React, { useState, useEffect } from "react";
import { SchoolRepository } from "../school/repository/SchoolRepository.js";
import { Icon, FauxQR } from "../../components/Shared.jsx";

export function SchoolEditor() {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState(null);

  // Form states
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [founded, setFounded] = useState(2016);
  const [bankName, setBankName] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [donationTarget, setDonationTarget] = useState(10000);
  const [donationRaised, setDonationRaised] = useState(0);

  useEffect(() => {
    async function load() {
      const data = await SchoolRepository.getProfile();
      setProfile(data);
      setName(data.name || "");
      setAddress(data.address || "");
      setDescription(data.description || "");
      setPhone(data.phone || "");
      setEmail(data.email || "");
      setFounded(data.founded || 2016);
      setBankName(data.bankName || "");
      setBankAccount(data.bankAccount || "");
      setDonationTarget(data.donationTarget || 10000);
      setDonationRaised(data.donationRaised || 0);
    }
    load();
  }, []);

  const save = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setSaved(false);

    try {
      await SchoolRepository.updateProfile("al-furqan", {
        name,
        address,
        description,
        phone,
        email,
        founded: parseInt(founded),
        bankName,
        bankAccount,
        donationTarget: parseFloat(donationTarget),
        donationRaised: parseFloat(donationRaised)
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      alert("Gagal mengemaskini profil: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return <div className="empty">Memuatkan profil sekolah...</div>;
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 24, alignItems: "start" }}>
      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 17, fontWeight: 800 }}>Profil & Maklumat Sekolah</h3>
        <form onSubmit={save} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="field">
            <label>Nama Maahad / Sekolah</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="field">
            <label>Deskripsi & Biografi Sekolah</label>
            <textarea className="textarea" value={description} onChange={(e) => setDescription(e.target.value)} style={{ minHeight: 90 }} required />
          </div>

          <div className="field">
            <label>Alamat Fizikal</label>
            <input className="input" value={address} onChange={(e) => setAddress(e.target.value)} required />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="field">
              <label>No. Telefon</label>
              <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>
            <div className="field">
              <label>Alamat E-mel</label>
              <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="field">
              <label>Tahun Ditubuhkan</label>
              <input className="input" type="number" value={founded} onChange={(e) => setFounded(e.target.value)} required />
            </div>
            <div className="field">
              <label>Nama Bank Sumbangan</label>
              <input className="input" value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="cth. Maybank Islamic" />
            </div>
          </div>

          <div className="field">
            <label>Nombor Akaun Bank</label>
            <input className="input" value={bankAccount} onChange={(e) => setBankAccount(e.target.value)} placeholder="cth. 5621 1102 3345" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="field">
              <label>Sasaran Wakaf (RM)</label>
              <input className="input" type="number" value={donationTarget} onChange={(e) => setDonationTarget(e.target.value)} />
            </div>
            <div className="field">
              <label>Dana Terkumpul (RM)</label>
              <input className="input" type="number" value={donationRaised} onChange={(e) => setDonationRaised(e.target.value)} />
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 8 }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Icon name="save" size={15} /> {loading ? "Menyimpan..." : "Simpan Profil"}
            </button>
            {saved && (
              <span style={{ color: "var(--accent-deep)", fontWeight: 700, fontSize: 13 }} className="animate-up">
                ✓ Profil berjaya disimpan & dikemaskini
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Wakaf Bank Sumbangan sidebar mock */}
      <div className="card" style={{ padding: 22, position: "sticky", top: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <Icon name="award" size={18} style={{ color: "var(--accent)" }} />
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>Peta Wakaf & Sumbangan QR</h3>
        </div>
        <p style={{ margin: "0 0 16px", fontSize: 12.5, color: "var(--ink-3)", lineHeight: 1.55 }}>
          Paparan awam kod QR sumbangan maahad untuk rujukan ibu bapa dan masyarakat setempat.
        </p>
        <div style={{ display: "grid", placeItems: "center", padding: 16, background: "var(--surface-2)", borderRadius: 14, border: "1px solid var(--line)" }}>
          <FauxQR size={140} seed={7} />
        </div>
        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            ["Nama Penerima", name || "Maahad Tahfiz Al-Furqan"],
            ["Bank Sumbangan", bankName || "Maybank Islamic"],
            ["No. Akaun Bank", bankAccount || "5621 0098 4412"],
            ["Sasaran Wakaf", `RM ${donationTarget}`],
            ["Dana Terkumpul", `RM ${donationRaised}`]
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5 }}>
              <span style={{ color: "var(--ink-3)" }}>{k}</span>
              <span style={{ fontWeight: 700 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default SchoolEditor;
