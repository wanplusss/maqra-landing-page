import { useState, useEffect } from "react";
import { DashboardService } from "./DashboardService.js";
import { PengumumanService } from "../pengumuman/service/PengumumanService.js";
import { Icon, StatCard } from "../../components/Shared.jsx";

export function SekolahDashboard({ onOpenStudent }) {
  const [stats, setStats] = useState(null);
  const [anns, setAnns] = useState([]);
  const [annTitle, setAnnTitle] = useState("");
  const [annBody, setAnnBody] = useState("");
  const [annTag, setAnnTag] = useState("Peperiksaan");
  const [posting, setPosting] = useState(false);

  const loadData = async () => {
    const data = await DashboardService.getSchoolDashboardData();
    const activeAnns = await PengumumanService.getActiveAnnouncements();
    
    setStats(data);
    setAnns(activeAnns);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, []);

  const addAnnouncement = async (e) => {
    if (e) e.preventDefault();
    if (!annTitle.trim() || !annBody.trim()) return;

    setPosting(true);
    try {
      await PengumumanService.createAnnouncement(annTitle, annBody, annTag);
      setAnnTitle("");
      setAnnBody("");
      loadData();
    } catch (e) {
      alert("Gagal menyiarkan pengumuman: " + e.message);
    } finally {
      setPosting(false);
    }
  };

  const deleteAnnouncement = async (id) => {
    if (confirm("Adakah anda pasti untuk memadam pengumuman ini?")) {
      await PengumumanService.deleteAnnouncement(id);
      loadData();
    }
  };

  if (!stats) {
    return <div className="empty">Memuatkan data rumusan dashboard maahad...</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      
      {/* 1. Overall stats cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        <StatCard icon="users" label="Jumlah Pelajar" value={stats.totalStudents} sub="Aktif berdaftar" />
        <StatCard icon="award" label="Purata Progres Sekolah" value={stats.averageProgress + "%"} sub="Khatam purata" tone="murajaah" />
        <StatCard icon="cap" label="Guru Bimbingan" value={stats.totalTeachers} sub="Tenaga Pengajar" tone="bacaan" />
        <StatCard icon="trendUp" label="Throughput Bulan Ini" value={stats.monthlyThroughput} sub="Halaman ditambah" tone="hafazan" />
      </div>

      {/* 2. Middle Row: Behind Students & Announcements Posting */}
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 22, alignItems: "start" }}>
        
        {/* Support Triage Table */}
        <div className="card" style={{ padding: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <Icon name="info" size={17} style={{ color: "var(--gr-sederhana)" }} />
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>Triage Sokongan Akademik</h3>
          </div>
          <p style={{ margin: "0 0 16px", fontSize: 12.5, color: "var(--ink-3)", lineHeight: 1.5 }}>
            Pelajar di bawah bimbingan yang ketinggalan daripada sasaran bulanan mereka (kelajuan semasa kurang dari sasaran).
          </p>

          <div className="scroll" style={{ overflowX: "auto" }}>
            {stats.behindStudentsList.length === 0 ? (
              <div className="empty" style={{ padding: "30px 10px" }}>Tiada pelajar ketinggalan sasaran! Semua on-track. 🎉</div>
            ) : (
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Pelajar</th>
                    <th>Kelas</th>
                    <th>Kelajuan</th>
                    <th>Sasaran</th>
                    <th style={{ width: 80, textAlign: "right" }}>Tindakan</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.behindStudentsList.map((row) => (
                    <tr key={row.studentId}>
                      <td style={{ fontWeight: 700 }}>
                        <button 
                          onClick={() => onOpenStudent(row.studentId)}
                          style={{ border: "none", background: "none", padding: 0, fontWeight: 700, color: "var(--ink)" }}
                        >
                          {row.name}
                        </button>
                      </td>
                      <td>{row.kelas}</td>
                      <td className="mono" style={{ color: "var(--gr-sederhana)", fontWeight: 800 }}>{row.pace} m.s.</td>
                      <td className="mono">{row.target} m.s.</td>
                      <td style={{ textAlign: "right" }}>
                        <button className="btn btn-sm" onClick={() => onOpenStudent(row.studentId)}>
                          Progres
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Announcements manager */}
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          
          {/* Post announcement form */}
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 800 }}>Siarkan Pengumuman Baharu</h3>
            <form onSubmit={addAnnouncement} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div className="field">
                <label>Tajuk</label>
                <input className="input" value={annTitle} onChange={(e) => setAnnTitle(e.target.value)} placeholder="cth. Penilaian Tasmik Pertengahan" required />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
                <div className="field">
                  <label>Kategori / Tag</label>
                  <select className="select" value={annTag} onChange={(e) => setAnnTag(e.target.value)}>
                    <option value="Peperiksaan">Peperiksaan</option>
                    <option value="Majlis">Majlis</option>
                    <option value="Cuti">Cuti</option>
                    <option value="Makluman">Makluman</option>
                  </select>
                </div>
              </div>
              <div className="field">
                <label>Kandungan Pengumuman</label>
                <textarea className="textarea" value={annBody} onChange={(e) => setAnnBody(e.target.value)} style={{ minHeight: 70 }} placeholder="Masukkan mesej kepada ibu bapa..." required />
              </div>
              <button type="submit" className="btn btn-primary" style={{ justifyContent: "center" }} disabled={posting}>
                {posting ? "Menyiar..." : "Siarkan Pengumuman"}
              </button>
            </form>
          </div>

          {/* Active announcements list */}
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 800 }}>Senarai Pengumuman Aktif</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {anns.map((an) => (
                <div key={an.id} style={{ borderBottom: "1px solid var(--line-2)", paddingBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span className="badge badge-ok">{an.tag}</span>
                    <button className="iconbtn" style={{ width: 22, height: 22 }} onClick={() => deleteAnnouncement(an.id)}>✕</button>
                  </div>
                  <h4 style={{ margin: "0 0 4px", fontSize: 13.5, fontWeight: 700 }}>{an.title}</h4>
                  <p style={{ margin: 0, fontSize: 12.5, color: "var(--ink-3)", lineHeight: 1.5 }}>{an.body}</p>
                </div>
              ))}
              {anns.length === 0 && <div className="empty">Tiada pengumuman aktif.</div>}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
export default SekolahDashboard;
