import { useState, useEffect } from "react";
import { SchoolRepository } from "../school/repository/SchoolRepository.js";
import { Icon, FauxQR, DuitNowQR } from "../../components/Shared.jsx";
import { decodeQRFile } from "../school/duitnowQR.js";

function DuitNowUploader({ currentPayload, onSaved }) {
  const [scanning, setScanning] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setScanning(true);
    setErr("");
    setSuccess(false);
    const result = await decodeQRFile(file);
    setScanning(false);
    if (!result.payload) {
      setErr(result.error);
      return;
    }
    // Save even if DuitNow signature unconfirmed — show warning but don't block
    await onSaved(result.payload);
    if (result.error) setErr(result.error); // non-fatal warning
    else setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
    // Reset input so same file can be re-uploaded
    e.target.value = "";
  };

  const handleRemove = async () => {
    if (!window.confirm("Padam kod QR DuitNow yang disimpan?")) return;
    await onSaved("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <label
          className="btn btn-sm"
          style={{ cursor: scanning ? "not-allowed" : "pointer", opacity: scanning ? 0.6 : 1, border: "1px solid var(--line)" }}
        >
          <Icon name="plus" size={13} />
          {scanning ? "Mengimbas..." : currentPayload ? "Ganti QR" : "Muat Naik QR DuitNow"}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            onChange={handleFile}
            disabled={scanning}
            style={{ display: "none" }}
          />
        </label>
        {currentPayload && (
          <button className="btn btn-ghost btn-sm" onClick={handleRemove} style={{ color: "var(--gr-sederhana)" }}>
            <Icon name="trash" size={13} /> Padam
          </button>
        )}
      </div>
      {err && (
        <p style={{ margin: 0, fontSize: 12, color: "var(--gr-sederhana)", fontWeight: 600 }}>{err}</p>
      )}
      {success && (
        <p style={{ margin: 0, fontSize: 12, color: "var(--accent-deep)", fontWeight: 700 }} className="animate-up">
          ✓ QR DuitNow berjaya disimpan
        </p>
      )}
      <p style={{ margin: 0, fontSize: 11.5, color: "var(--ink-3)", lineHeight: 1.5 }}>
        Muat naik imej QR DuitNow anda (PNG/JPG). Sistem akan mengesahkan format DuitNow, kemudian menjana semula kod QR mengikut gaya platform.
      </p>
    </div>
  );
}

export function SchoolEditor() {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState(null);

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState("Percubaan");
  const [status, setStatus] = useState("percubaan");
  const [adminPassword, setAdminPassword] = useState("");
  const [founded, setFounded] = useState(2016);
  const [bankName, setBankName] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [donationTarget, setDonationTarget] = useState(10000);
  const [donationRaised, setDonationRaised] = useState(0);
  const [qrPayload, setQrPayload] = useState("");

  useEffect(() => {
    async function load() {
      const data = await SchoolRepository.getProfile();
      setProfile(data);
      setName(data.name || "");
      setCity(data.city || "");
      setAddress(data.address || "");
      setDescription(data.description || "");
      setPhone(data.phone || "");
      setEmail(data.email || "");
      setFounded(data.founded || 2016);
      setPlan(data.plan || "Percubaan");
      setStatus(data.status || "percubaan");
      setBankName(data.bankName || "");
      setBankAccount(data.bankAccount || "");
      setDonationTarget(data.donationTarget || 10000);
      setDonationRaised(data.donationRaised || 0);
      setQrPayload(data.qrCode || "");
    }
    load();
  }, []);

  const save = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setSaved(false);
    try {
      const updates = {
        name,
        city,
        address,
        description,
        phone,
        email,
        founded: parseInt(founded),
        plan,
        status,
        bankName,
        bankAccount,
        donationTarget: parseFloat(donationTarget),
        donationRaised: parseFloat(donationRaised),
        qrCode: qrPayload,
      };
      if (adminPassword.trim()) updates.admin_password = adminPassword.trim();
      await SchoolRepository.updateProfile(profile.slug || "al-furqan", updates);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      alert("Gagal mengemaskini profil: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const saveQR = async (payload) => {
    setQrPayload(payload);
    if (profile) {
      await SchoolRepository.updateProfile(profile.slug || "al-furqan", { qrCode: payload });
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
              <label>Bandar / Negeri</label>
              <input className="input" value={city} onChange={(e) => setCity(e.target.value)} placeholder="cth. Kajang, Selangor" />
            </div>
            <div className="field">
              <label>Tahun Ditubuhkan</label>
              <input className="input" type="number" value={founded} onChange={(e) => setFounded(e.target.value)} required />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <div className="field">
              <label>Pakej Pelan</label>
              <select className="input" value={plan} onChange={(e) => setPlan(e.target.value)}>
                {["Percubaan","Asas","Premium"].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Status</label>
              <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
                {["aktif","percubaan","tidak aktif"].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Nama Bank Sumbangan</label>
              <input className="input" value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="cth. Maybank Islamic" />
            </div>
          </div>

          <div className="field">
            <label>Tukar Kata Laluan Admin</label>
            <input className="input" type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} placeholder="Kosongkan jika tidak ingin tukar" />
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

      {/* QR + Wakaf sidebar */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

        {/* QR Upload card */}
        <div className="card" style={{ padding: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Icon name="qr" size={18} style={{ color: "var(--accent)" }} />
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>Kod QR DuitNow</h3>
            {qrPayload && (
              <span className="badge" style={{ background: "var(--st-hafazan-fill)", color: "var(--st-hafazan-ink)", borderColor: "transparent", marginLeft: "auto" }}>
                DuitNow ✓
              </span>
            )}
          </div>

          <div style={{ display: "grid", placeItems: "center", padding: 16, background: "var(--surface-2)", borderRadius: 14, border: "1px solid var(--line)", marginBottom: 14 }}>
            <DuitNowQR payload={qrPayload} size={140} fallbackSeed={7} />
          </div>

          <DuitNowUploader currentPayload={qrPayload} onSaved={saveQR} />
        </div>

        {/* Wakaf info card */}
        <div className="card" style={{ padding: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Icon name="award" size={18} style={{ color: "var(--accent)" }} />
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>Peta Wakaf & Sumbangan</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              ["Nama Penerima", name || "Maahad Tahfiz Al-Furqan"],
              ["Bank Sumbangan", bankName || "Maybank Islamic"],
              ["No. Akaun Bank", bankAccount || "5621 0098 4412"],
              ["Sasaran Wakaf", `RM ${donationTarget}`],
              ["Dana Terkumpul", `RM ${donationRaised}`],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5 }}>
                <span style={{ color: "var(--ink-3)" }}>{k}</span>
                <span style={{ fontWeight: 700 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default SchoolEditor;
