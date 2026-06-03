import { useState } from "react";
import { authService } from "../auth/authService.js";
import { Wordmark, Icon } from "../../components/Shared.jsx";

function isAccessBlock(msg) {
  return msg && (msg.includes("digantung") || msg.includes("tamat") || msg.includes("naik taraf"));
}

export function TeacherLogin({ role = "teacher", slug = "al-furqan", defaultEmail = "aisyah@alfurqan.edu.my", onLoginSuccess }) {
  const [email, setEmail] = useState(defaultEmail);

  const getDefaultPassword = (r) => {
    if (r === "admin") return "admin123";
    if (r === "superadmin") return "owner123";
    return "password123";
  };

  const [pw, setPw] = useState(getDefaultPassword(role));
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [showPw, setShowPw] = useState(false);

  const submit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setErr("");

    try {
      const session = await authService.login(email, pw);
      onLoginSuccess(session);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  const roleMeta = {
    teacher: { title: "Log Masuk Guru", icon: "cap", desc: "Portal guru pengajar tahfiz" },
    admin: { title: "Log Masuk Admin", icon: "shield", desc: "Pentadbiran institusi maahad" },
    superadmin: { title: "Log Masuk Pemilik", icon: "globe", desc: "Panel kawalan platform Maqra'" }
  };

  const meta = roleMeta[role] || roleMeta.teacher;

  return (
    <div style={{ minHeight: "80vh", display: "grid", placeItems: "center", padding: 28 }}>
      <div style={{ width: "100%", maxWidth: 400 }} className="animate-up">
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 22 }}>
          <Wordmark size={24} />
        </div>

        {isAccessBlock(err) ? (
          <div className="card" style={{ padding: 28, textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🔒</div>
            <h3 style={{ margin: "0 0 8px", fontSize: 17, fontWeight: 800 }}>Akses Disekat</h3>
            <p style={{ margin: "0 0 20px", fontSize: 13.5, color: "var(--ink-3)", lineHeight: 1.6 }}>{err}</p>
            <a
              href="mailto:support@maqra.app"
              className="btn btn-primary"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}
            >
              <Icon name="mail" size={15} /> Hubungi Kami
            </a>
            <button
              className="btn btn-ghost"
              style={{ display: "block", margin: "12px auto 0" }}
              onClick={() => setErr("")}
            >
              ← Cuba Log Masuk Semula
            </button>
          </div>
        ) : (
          <div className="card" style={{ padding: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <span style={{ width: 36, height: 36, borderRadius: 10, background: "var(--accent-soft)", color: "var(--accent-deep)", display: "grid", placeItems: "center" }}>
                <Icon name={meta.icon} size={19} />
              </span>
              <div>
                <h2 style={{ margin: 0, fontSize: 19, fontWeight: 800 }}>{meta.title}</h2>
                <p style={{ margin: 0, fontSize: 12.5, color: "var(--ink-3)" }} className="mono">
                  {role === "superadmin" ? "maqra.app/platform" : `school/${slug}/${role}`}
                </p>
              </div>
            </div>
            <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 18 }}>
              <div className="field">
                <label>Alamat E-mel</label>
                <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} required />
              </div>
              <div className="field">
                <label>Kata Laluan</label>
                <div style={{ position: "relative" }}>
                  <input className="input" type={showPw ? "text" : "password"} value={pw} onChange={(e) => setPw(e.target.value)} disabled={loading} required style={{ width: "100%", paddingRight: 36 }} />
                  <button type="button" onClick={() => setShowPw(v => !v)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--ink-3)", padding: 0, lineHeight: 1 }}>
                    <Icon name={showPw ? "eye-off" : "eye"} size={16} />
                  </button>
                </div>
              </div>
              {err && (
                <div style={{ color: "var(--gr-sederhana)", fontSize: "12.5px", fontWeight: 600, textAlign: "center" }}>
                  {err}
                </div>
              )}
              <button type="submit" className="btn btn-primary" style={{ justifyContent: "center", marginTop: 4 }} disabled={loading}>
                {loading ? "Memuatkan..." : <>{meta.title} <Icon name="arrowR" size={16} /></>}
              </button>
            </form>
            <div style={{ marginTop: 16, fontSize: "11.5px", color: "var(--ink-3)", display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
              <Icon name="lock" size={13} /> Dilindungi RLS · akses terbatas
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default TeacherLogin;
