import { useState } from "react";
import { TeacherRepository } from "../teacher/repository/TeacherRepository.js";
import { Icon, Avatar } from "../../components/Shared.jsx";

export function TeacherManagement({ teachers = [], onRefresh }) {
  const [modal, setModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [kelas, setKelas] = useState("Tahun 4 & 5");
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const addTeacher = async (e) => {
    if (e) e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    try {
      await TeacherRepository.create({
        name,
        email,
        kelas
      });
      setModal(false);
      setName("");
      setEmail("");
      setKelas("Tahun 4 & 5");
      onRefresh();
    } catch (e) {
      alert("Gagal mendaftar guru: " + e.message);
    }
  };

  const confirmDelete = (teacher) => {
    setSelectedTeacher(teacher);
  };

  const deleteTeacher = async () => {
    if (selectedTeacher) {
      await TeacherRepository.delete(selectedTeacher.id);
      setSelectedTeacher(null);
      onRefresh();
    }
  };

  return (
    <div>
      <div className="pagehead">
        <div>
          <h1>Pengurusan Guru</h1>
          <p>Daftar akaun guru pengajar dan kawal akses sistem</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal(true)}>
          <Icon name="plus" size={15} /> Tambah Guru Pengajar
        </button>
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>Guru Penguji</th>
              <th>Alamat E-mel</th>
              <th>Kelas Bimbingan</th>
              <th style={{ width: 100, textAlign: "right" }}>Tindakan</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((t) => (
              <tr key={t.id}>
                <td style={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 10 }}>
                  <Avatar name={t.name} sex="m" size={32} />
                  <span>{t.name}</span>
                </td>
                <td className="mono">{t.email}</td>
                <td>{t.kelas}</td>
                <td style={{ textAlign: "right" }}>
                  <button className="iconbtn" onClick={() => confirmDelete(t)} title="Padam Guru">
                    <Icon name="trash" size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Teacher Modal */}
      {modal && (
        <div className="overlay" onClick={() => setModal(false)}>
          <div className="modal" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
            <form onSubmit={addTeacher}>
              <div className="modal-head">
                <h3>Tambah Guru Pengajar Baharu</h3>
                <button type="button" className="iconbtn" onClick={() => setModal(false)}>✕</button>
              </div>
              <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div className="field">
                  <label>Nama Penuh</label>
                  <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="field">
                  <label>Alamat E-mel (Untuk Log Masuk)</label>
                  <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="field">
                  <label>Kelas Kendalian</label>
                  <input className="input" value={kelas} onChange={(e) => setKelas(e.target.value)} required />
                </div>
                <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 4 }}>
                  * Kata laluan lalai akaun guru baru didaftarkan adalah: <strong>password123</strong>
                </div>
              </div>
              <div className="modal-foot">
                <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>Batal</button>
                <button type="submit" className="btn btn-primary">Daftar Guru</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {selectedTeacher && (
        <div className="overlay" onClick={() => setSelectedTeacher(null)}>
          <div className="modal" style={{ maxWidth: 380 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>Padam Akaun Guru</h3>
              <button className="iconbtn" onClick={() => setSelectedTeacher(null)}>✕</button>
            </div>
            <div className="modal-body" style={{ textAlign: "center", padding: "20px 22px" }}>
              <Icon name="trash" size={32} style={{ color: "var(--gr-sederhana)", marginBottom: 12 }} />
              <p style={{ margin: 0, fontSize: 14, fontWeight: 650 }}>Adakah anda pasti untuk memadam akaun guru?</p>
              <h4 style={{ margin: "6px 0 0", color: "var(--ink)", fontSize: 16 }}>{selectedTeacher.name}</h4>
              <p style={{ margin: "6px 0 0", fontSize: 12, color: "var(--ink-3)", lineHeight: 1.5 }}>
                Akses guru ini ke dalam sistem Maqra' akan disekat serta merta.
              </p>
            </div>
            <div className="modal-foot">
              <button className="btn btn-ghost" onClick={() => setSelectedTeacher(null)}>Batal</button>
              <button className="btn btn-danger" onClick={deleteTeacher}>Padam Akaun</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default TeacherManagement;
