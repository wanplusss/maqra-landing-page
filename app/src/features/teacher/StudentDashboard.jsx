import { useState } from "react";
import { Avatar, StatCard, Icon, GredBadge } from "../../components/Shared.jsx";
import { PageGrid, Legend } from "../parent/GridView.jsx";
import { StudentTargetService } from "../student/target/StudentTargetService.js";
import { SijilService } from "../sijil/SijilService.js";

function ProfileCard({ st, school }) {
  return (
    <div className="card" style={{ padding: 22, display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
      <Avatar name={st.name} sex={st.sex} size={68} ring />
      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", rowGap: 8 }}>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em" }}>{st.name}</h2>
          <span className="badge badge-ok"><span className="dot" style={{ background: "var(--accent)" }} /> Bimbingan Aktif</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
          <span style={{ fontSize: 13, color: "var(--ink-3)" }}>ID Pelajar</span>
          <span className="mono" style={{ background: "var(--surface-2)", border: "1px solid var(--line)", padding: "3px 9px", borderRadius: 7, fontSize: 12.5, fontWeight: 700 }}>{st.id}</span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {[["user", "Umur", st.umur + " Tahun"], ["cap", "Kelas", st.kelas], ["school", "Sekolah", school.name]].map(([ic, k, v]) => (
          <div key={k} style={{ background: "var(--surface-2)", border: "1px solid var(--line)", borderRadius: 12, padding: "10px 14px", minWidth: 120 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--ink-3)", fontSize: 11.5, fontWeight: 600, marginBottom: 4 }}><Icon name={ic} size={14} />{k}</div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SasaranEditor({ value, onChange }) {
  const step = (d) => {
    const next = Math.max(1, Math.min(60, value + d));
    onChange(next);
  };

  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <Icon name="award" size={16} style={{ color: "var(--accent)" }} />
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>Sasaran Peribadi</h3>
      </div>
      <p style={{ margin: "0 0 14px", fontSize: 12, color: "var(--ink-3)" }}>Kadar sasaran muka surat / bulan</p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <button className="iconbtn" style={{ border: "1px solid var(--line)", width: 38, height: 38 }} onClick={() => step(-1)}>-</button>
        <div style={{ textAlign: "center" }}>
          <div className="mono" style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1 }}>{value}</div>
          <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 3 }}>m.s. / bulan</div>
        </div>
        <button className="iconbtn" style={{ border: "1px solid var(--line)", width: 38, height: 38 }} onClick={() => step(1)}>+</button>
      </div>
      <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
        {[8, 12, 15, 18, 20].map((p) => (
          <button 
            key={p} 
            className="chip" 
            onClick={() => onChange(p)} 
            style={{ 
              flex: 1, 
              justifyContent: "center", 
              borderColor: value === p ? "var(--accent)" : "var(--line)", 
              color: value === p ? "var(--accent-deep)" : "var(--ink-2)", 
              fontWeight: value === p ? 700 : 600 
            }}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}

function HistoryItem({ h }) {
  const dateStr = new Date(h.date).toLocaleDateString("ms-MY", { day: "numeric", month: "short" });
  return (
    <div style={{ position: "relative", paddingLeft: 16 }}>
      <span style={{ position: "absolute", left: 0, top: 5, bottom: 5, width: 3, borderRadius: 9, background: "var(--accent)", opacity: 0.5 }} />
      <div style={{ display: "flex", justifyBetween: "space-between", gap: 8, marginBottom: 5 }}>
        <span className="mono" style={{ fontSize: 12, color: "var(--ink-3)" }}>{dateStr}</span>
        <span className="badge" style={{ fontSize: 11 }}>{h.kategori}</span>
      </div>
      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>
        Muka surat {h.from}–{h.to} <span style={{ color: "var(--ink-3)", fontWeight: 500 }}>· Juz {h.juzuk}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <span style={{ fontSize: "12.5px", color: "var(--ink-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 160 }}>
          {h.ulasan}
        </span>
        <GredBadge g={h.gred} />
      </div>
    </div>
  );
}

export function StudentDashboard({ st, school, columns, onBack, onCellClick, onTargetChange, history = [] }) {
  const [target, setTarget] = useState(st.target || 15);
  const [downloadingCert, setDownloadingCert] = useState(false);

  const handleTargetSet = async (newVal) => {
    setTarget(newVal);
    await StudentTargetService.setTarget(st.id, newVal);
    onTargetChange(newVal);
  };

  const triggerSijil = async () => {
    try {
      setDownloadingCert(true);
      const milestone = st.juzuk === 30 ? "Khatam Al-Quran 30 Juzuk" : `Hafazan Lengkap Juzuk ${st.juzuk || 1}`;
      await SijilService.issueCertificate(st.id, milestone);
    } catch (e) {
      alert("Gagal menjana sijil: " + e.message);
    } finally {
      setDownloadingCert(false);
    }
  };

  return (
    <div>
      <button className="btn btn-ghost btn-sm" onClick={onBack} style={{ marginBottom: 16 }}>
        ← Kembalilah ke Senarai Murid
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 320px", gap: 22, alignItems: "start" }}>
        
        {/* Main Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 22, minWidth: 0 }}>
          <ProfileCard st={st} school={school} />

          {/* Stat summary row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            <StatCard icon="book" label="Juzuk Semasa" value={"Juz " + (st.juzuk || 1)} sub={"Surah " + st.surah} />
            <StatCard icon="check" label="Hafazan Terakhir" value={st.lastHafazan || 1} sub={st.lastHafazanSurah} tone="hafazan" />
            <StatCard icon="award" label="Progres Keseluruhan" value={(st.progress || 0) + "%"} sub={st.frontier + " / 604 m.s."} tone="murajaah" />
          </div>

          {/* Progressive 604 Cell Grid */}
          <div className="card" style={{ padding: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>Grid Progres Semakan</h3>
                <p style={{ margin: "3px 0 0", fontSize: "12.5px", color: "var(--ink-3)" }}>Klik mana-mana sel petak untuk tasmik atau tukar status.</p>
              </div>
              <span className="badge badge-ok"><Icon name="edit" size={13} /> Mod Guru Aktif</span>
            </div>
            <div style={{ marginBottom: 16 }}><Legend /></div>
            <PageGrid statusMap={st.statusMap} columns={columns} onCellClick={onCellClick} />
          </div>
        </div>

        {/* Right Sticky Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 22, position: "sticky", top: 0 }}>
          <SasaranEditor st={st} value={target} onChange={handleTargetSet} />
          
          {/* Certificate Card */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <Icon name="award" size={17} style={{ color: "var(--accent)" }} />
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>Mentauliah Sijil</h3>
            </div>
            <p style={{ margin: "0 0 14px", fontSize: "12.5px", color: "var(--ink-3)", lineHeight: 1.5 }}>
              Pelajar telah menguasai Juzuk {st.juzuk || 1}. Cetak sijil rasmi pencapaian tahfiz sekarang.
            </p>
            <button className="btn btn-sm btn-primary" onClick={triggerSijil} disabled={downloadingCert} style={{ width: "100%", justifyContent: "center" }}>
              <Icon name="award" size={14} /> {downloadingCert ? "Mengunduh..." : "Cetak Sijil Penghargaan"}
            </button>
          </div>

          {/* Recent logs */}
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 800 }}>Log Tasmik Pelajar</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {history.slice(0, 5).map((h) => <HistoryItem key={h.id} h={h} />)}
              {history.length === 0 && <div className="empty">Tiada rekod tasmik ditemui.</div>}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
export default StudentDashboard;
