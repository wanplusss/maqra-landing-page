import { useState } from "react";
import { TeacherRepository } from "../teacher/repository/TeacherRepository.js";
import { Icon, Avatar } from "../../components/Shared.jsx";

export function TeacherManagement({ teachers = [], schoolSlug, onRefresh }) {
  const [modal, setModal] = useState(null); // 'add' | 'edit' | 'delete'
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [kelas, setKelas] = useState("Tahun 4 & 5");
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const openEdit = (t) => {
    setSelectedTeacher(t);
    setName(t.name);
    setEmail(t.email);
    setKelas(t.kelas || "");
    setModal("edit");
  };

  const openAdd = () => {
    setSelectedTeacher(null);
    setName(""); setEmail(""); setKelas("Tahun 4 & 5");
    setModal("add");
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    try {
      if (modal === "add") {
        await TeacherRepository.create({ name, email, kelas, school_slug: schoolSlug });
      } else if (modal === "edit" && selectedTeacher) {
        await TeacherRepository.update(selectedTeacher.id, { name, email, kelas });
      }
      setModal(null);
      setName(""); setEmail(""); setKelas("Tahun 4 & 5");
      onRefresh();
    } catch (e) {
      alert("Gagal: " + e.message);
    }
  };

  const confirmDelete = (teacher) => {
    setSelectedTeacher(teacher);
    setModal("delete");
  };

  const deleteTeacher = async () => {
    if (selectedTeacher) {
      await TeacherRepository.delete(selectedTeacher.id);
      setSelectedTeacher(null);
      setModal(null);
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
        <button className="btn btn-primary" onClick={openAdd}>
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
                  <div style={{ display: "inline-flex", gap: 4 }}>
                    <button className="iconbtn" onClick={() => openEdit(t)} title="Edit Guru"><Icon name="edit" size={15} /></button>
                    <button className="iconbtn" onClick={() => confirmDelete(t)} title="Padam Guru"><Icon name="trash" size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Teacher Modal */}
      {(modal === "add" || modal === "edit") && (
        <div className="overlay" onClick={() => setModal(null)}>
          <div className="modal" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSubmit}>
              <div className="modal-head">
                <h3>{modal === "add" ? "Tambah Guru Pengajar Baharu" : "Edit Maklumat Guru"}</h3>
                <button type="button" className="iconbtn" onClick={() => setModal(null)}>✕</button>
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
                <button type="button" className="btn btn-ghost" onClick={() => setModal(null)}>Batal</button>
                <button type="submit" className="btn btn-primary">{modal === "add" ? "Daftar Guru" : "Simpan"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {modal === "delete" && selectedTeacher && (
        <div className="overlay" onClick={() => setModal(null)}>
          <div className="modal" style={{ maxWidth: 380 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>Padam Akaun Guru</h3>
              <button className="iconbtn" onClick={() => setModal(null)}>✕</button>
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
              <button className="btn btn-ghost" onClick={() => setModal(null)}>Batal</button>
              <button className="btn btn-danger" onClick={deleteTeacher}>Padam Akaun</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default TeacherManagement;
