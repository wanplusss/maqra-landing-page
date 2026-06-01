import React, { useState } from "react";
import { authService } from "../auth/authService.js";
import { Wordmark, Icon } from "../../components/Shared.jsx";

export function TeacherLogin({ role = "teacher", slug = "al-furqan", defaultEmail = "aisyah@alfurqan.edu.my", onLoginSuccess }) {
  const [email, setEmail] = useState(defaultEmail);
  const [pw, setPw] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

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
    teacher: { title: "Log Masuk Guru", icon: "cap", desc: "Akses guru pengajar kelas tahfiz" },
    admin: { title: "Log Masuk Admin", icon: "shield", desc: "Akses pentadbiran institusi maahad" },
    superadmin: { title: "Platform Owner", icon: "globe", desc: "Platform-wide SaaS analytics cockpit" }
  };

  const meta = roleMeta[role] || roleMeta.teacher;

  return (
    <div style={{ minHeight: "80vh", display: "grid", placeItems: "center", padding: 28 }}>
      <div style={{ width: "100%", maxWidth: 400 }} className="animate-up">
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 22 }}>
          <Wordmark size={24} />
        </div>
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
              <input className="input" type="password" value={pw} onChange={(e) => setPw(e.target.value)} disabled={loading} required />
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
            <Icon name="lock" size={13} /> Dilindungi RLS · akses disulitkan
          </div>
        </div>
      </div>
    </div>
  );
}
export default TeacherLogin;
