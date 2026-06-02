import { useState, useEffect } from "react";
import { SchoolRepository } from "../repository/SchoolRepository.js";
import { TeacherRepository } from "../../teacher/repository/TeacherRepository.js";
import { PengumumanService } from "../../pengumuman/service/PengumumanService.js";
import { Wordmark, Icon, FauxQR, DuitNowQR } from "../../../components/Shared.jsx";

export function SchoolLanding({ onEnterLookup }) {
  const [school, setSchool] = useState(null);
  const [anns, setAnns] = useState([]);
  const [sid, setSid] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await SchoolRepository.getProfile();
      const [activeAnns, teachers] = await Promise.all([
        PengumumanService.getActiveAnnouncements(data.slug),
        TeacherRepository.listAll(data.slug),
      ]);
      setSchool({ ...data, teachers: teachers.length });
      setAnns(activeAnns);
    }
    load();
  }, []);

  const handleLookup = async (e) => {
    if (e) e.preventDefault();
    if (!sid.trim()) {
      setErr("Sila masukkan No. ID Pelajar.");
      return;
    }

    setLoading(true);
    setErr("");

    try {
      // Direct pass student record to parent dash
      const found = await onEnterLookup(sid.trim().toUpperCase());
      if (!found) {
        setErr("ID Pelajar tidak dijumpai. Cuba ID contoh: STU00123");
      }
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (!school) {
    return <div className="empty">Memuatkan halaman utama Maahad Tahfiz...</div>;
  }

  return (
    <div className="scroll" style={{ maxWidth: 1080, margin: "0 auto", padding: "44px 28px 70px" }}>
      
      {/* Brand header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
        <Wordmark />
        <span className="badge"><Icon name="pin" size={13} /> {school.address.split(",").slice(-2).join(",").trim()}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.35fr 1fr", gap: 28, alignItems: "start" }}>
        
        {/* Main Content Column */}
        <div className="animate-up">
          <span className="badge badge-ok" style={{ marginBottom: 16 }}>
            <Icon name="cap" size={13} /> Program Hafazan 30 Juzuk & Talaqqi
          </span>
          <h1 style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.08, margin: "0 0 16px", color: "var(--ink)" }}>
            {school.name}
          </h1>
          <p style={{ fontSize: 16, color: "var(--ink-2)", lineHeight: 1.65, maxWidth: 540, margin: "0 0 24px" }}>
            {school.description}
          </p>
          
          <div style={{ display: "flex", gap: 26, marginBottom: 30, flexWrap: "wrap" }}>
            {[
              ["Tahun ditubuhkan", school.founded || 2016],
              ["Pelajar berdaftar", `${school.enrolled || 6} orang`],
              ["Tenaga pengajar", `${school.teachers || "—"} orang Ustaz/ah`]
            ].map(([k, v]) => (
              <div key={k}>
                <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", whiteSpace: "nowrap" }}>{v}</div>
                <div style={{ fontSize: "12.5px", color: "var(--ink-3)", marginTop: 2 }}>{k}</div>
              </div>
            ))}
          </div>

          {/* Student Progress Lookup Card */}
          <div className="card" style={{ padding: 22 }}>
            <h3 style={{ margin: "0 0 4px", fontSize: 17, fontWeight: 800 }}>Semak Progres Anak</h3>
            <p style={{ margin: "0 0 16px", color: "var(--ink-3)", fontSize: "13.5px" }}>
              Masukkan ID Pelajar anak anda untuk melihat laporan perkembangan hafazan & semakan bacaan terkini.
            </p>
            <form onSubmit={handleLookup} style={{ display: "flex", gap: 10 }}>
              <div className="search" style={{ flex: 1 }}>
                <span className="ic"><Icon name="user" size={17} /></span>
                <input 
                  value={sid} 
                  onChange={(e) => { setSid(e.target.value); setErr(""); }} 
                  placeholder="cth. STU00123" 
                  disabled={loading}
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Menyemak..." : "Semak Progres"} <Icon name="arrowR" size={16} />
              </button>
            </form>
            {err && (
              <div style={{ color: "var(--gr-sederhana)", fontSize: "12.5px", marginTop: 10, fontWeight: 600 }}>
                {err}
              </div>
            )}
            <div style={{ marginTop: 14, fontSize: 12, color: "var(--ink-3)" }}>
              Contoh ID Pelajar:{" "}
              <button 
                className="mono" 
                onClick={() => setSid("STU00123")} 
                style={{ 
                  border: "none", 
                  background: "var(--surface-2)", 
                  padding: "2px 7px", 
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

        {/* Right Wakaf Sumbangan Box */}
        <div className="card animate-up" style={{ padding: 24, position: "sticky", top: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 4 }}>
            <Icon name="award" size={18} style={{ color: "var(--accent)" }} />
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>Dana Wakaf & Kebajikan</h3>
          </div>
          <p style={{ margin: "0 0 18px", fontSize: 13, color: "var(--ink-3)", lineHeight: 1.55 }}>
            Salurkan sumbangan wakaf pembangunan maahad secara pantas melalui imbasan kod QR bank.
          </p>
          <div style={{ display: "grid", placeItems: "center", padding: 16, background: "var(--surface-2)", borderRadius: 14, border: "1px solid var(--line)" }}>
            <DuitNowQR payload={school.qrCode} size={150} fallbackSeed={4} />
          </div>
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 9 }}>
            {[
              ["Nama Bank", school.bankName || "Maybank Islamic"],
              ["No. Akaun", school.bankAccount || "5621 0098 4412"],
              ["Penerima", school.name || "Maahad Tahfiz Al-Furqan"]
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span style={{ color: "var(--ink-3)" }}>{k}</span>
                <span className={k === "No. Akaun" ? "mono" : ""} style={{ fontWeight: 700 }}>{v}</span>
              </div>
            ))}
          </div>
          <button 
            className="btn" 
            style={{ width: "100%", justifyContent: "center", marginTop: 18 }}
            onClick={() => {
              const acct = (school.bankAccount || "562100984412").replace(/\s/g, "");
              navigator.clipboard.writeText(acct);
              alert(`Nombor akaun bank ${school.bankName || "Maybank"} telah disalin!`);
            }}
          >
            <Icon name="copy" size={15} /> Salin Nombor Akaun
          </button>
        </div>

      </div>

      {/* School Announcements section */}
      {anns.length > 0 && (
        <div style={{ marginTop: 44 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 16 }}>
            <Icon name="megaphone" size={18} style={{ color: "var(--accent)" }} />
            <h2 style={{ margin: 0, fontSize: 19, fontWeight: 800, letterSpacing: "-0.01em" }}>Pengumuman Terkini</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
            {anns.map((an) => (
              <div key={an.id} className="card" style={{ padding: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 9 }}>
                  <span className="badge badge-ok">{an.category}</span>
                  <span className="mono" style={{ fontSize: "11.5px", color: "var(--ink-3)" }}>{an.date}</span>
                </div>
                <h3 style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 800, lineHeight: 1.3 }}>{an.title}</h3>
                <p style={{ margin: 0, fontSize: 13, color: "var(--ink-3)", lineHeight: 1.55 }}>{an.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Public Footer */}
      <hr className="divider" style={{ margin: "40px 0 20px" }} />
      <div style={{ display: "flex", gap: 18, color: "var(--ink-3)", fontSize: 13, flexWrap: "wrap", justifyContent: "center" }}>
        <span style={{ display: "inline-flex", gap: 7, alignItems: "center" }}><Icon name="pin" size={15} /> {school.address}</span>
        <span style={{ display: "inline-flex", gap: 7, alignItems: "center" }}><Icon name="phone" size={15} /> {school.phone}</span>
        <span style={{ display: "inline-flex", gap: 7, alignItems: "center" }}><Icon name="mail" size={15} /> {school.email}</span>
      </div>
    </div>
  );
}
export default SchoolLanding;
