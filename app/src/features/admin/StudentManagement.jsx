import { useState } from "react";
import { StudentRepository } from "../student/repository/StudentRepository.js";
import { Icon, Avatar } from "../../components/Shared.jsx";
import { BulkImportModal } from "../student/import/BulkImportModal.jsx";

export function StudentManagement({ students = [], onRefresh }) {
  const [q, setQ] = useState("");
  const [modal, setModal] = useState(null); // 'add' | 'edit' | 'delete'
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [importOpen, setImportOpen] = useState(false);
  
  // Form fields
  const [name, setName] = useState("");
  const [kelas, setKelas] = useState("Tahun 4");
  const [umur, setUmur] = useState(10);
  const [parent, setParent] = useState("");
  const [sex, setSex] = useState("m");
  const [beginner, setBeginner] = useState(false);
  const [target, setTarget] = useState(15);

  const filtered = students.filter((s) =>
    (s.name + s.id).toLowerCase().includes(q.toLowerCase())
  );

  const openAdd = () => {
    setName("");
    setKelas("Tahun 4");
    setUmur(10);
    setParent("");
    setSex("m");
    setBeginner(false);
    setTarget(15);
    setModal("add");
  };

  const openEdit = (st) => {
    setSelectedStudent(st);
    setName(st.name);
    setKelas(st.kelas);
    setUmur(st.umur);
    setParent(st.parent);
    setSex(st.sex);
    setBeginner(st.beginner);
    setTarget(st.target || 15);
    setModal("edit");
  };

  const openDelete = (st) => {
    setSelectedStudent(st);
    setModal("delete");
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!name.trim()) return;

    if (modal === "add") {
      const studentId = "STU" + Math.floor(10000 + Math.random() * 90000);
      await StudentRepository.create({
        id: studentId,
        name,
        kelas,
        umur: parseInt(umur),
        parent,
        sex,
        beginner,
        target: parseInt(target),
        frontier: 1,
        statusMap: {}
      });
    } else if (modal === "edit" && selectedStudent) {
      await StudentRepository.update(selectedStudent.id, {
        name,
        kelas,
        umur: parseInt(umur),
        parent,
        sex,
        beginner,
        target: parseInt(target)
      });
    }

    setModal(null);
    onRefresh();
  };

  const handleDelete = async () => {
    if (selectedStudent) {
      await StudentRepository.delete(selectedStudent.id);
      setModal(null);
      onRefresh();
    }
  };

  return (
    <div>
      <div className="pagehead">
        <div>
          <h1>Pengurusan Pelajar</h1>
          <p>Daftar, edit profil, dan padam rekod pelajar maahad</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-secondary" style={{ border: "1px solid var(--line)" }} onClick={() => setImportOpen(true)}>
            <Icon name="sparkle" size={14} /> Bulk Import
          </button>
          <button className="btn btn-primary" onClick={openAdd}>
            <Icon name="plus" size={15} /> Tambah Pelajar
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: 18, marginBottom: 16, display: "flex", gap: 14, alignItems: "center" }}>
        <div className="search" style={{ flex: 1, maxWidth: 380 }}>
          <span className="ic"><Icon name="search" size={17} /></span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari nama atau ID pelajar..." />
        </div>
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        <div className="scroll" style={{ overflowX: "auto" }}>
          <table className="tbl" style={{ minWidth: 900 }}>
            <thead>
              <tr>
                <th>Pelajar</th>
                <th>Kelas</th>
                <th>Umur</th>
                <th>No. Penjaga</th>
                <th>Sasaran</th>
                <th>Muka Terkini</th>
                <th style={{ width: 100, textAlign: "right" }}>Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((st) => (
                <tr key={st.id}>
                  <td style={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 10 }}>
                    <Avatar name={st.name} sex={st.sex} size={34} />
                    <div>
                      <div style={{ color: "var(--ink)" }}>{st.name}</div>
                      <span className="mono" style={{ fontSize: 11, color: "var(--ink-3)", background: "var(--surface-2)", padding: "1px 5px", borderRadius: 4 }}>{st.id}</span>
                    </div>
                  </td>
                  <td>{st.kelas}</td>
                  <td>{st.umur} Tahun</td>
                  <td className="mono">{st.parent}</td>
                  <td className="mono" style={{ fontWeight: 700 }}>{st.target || 15} m.s.</td>
                  <td className="mono" style={{ color: "var(--accent)" }}>m.s. {st.frontier}</td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: 4 }}>
                      <button className="iconbtn" onClick={() => openEdit(st)} title="Edit"><Icon name="edit" size={15} /></button>
                      <button className="iconbtn" onClick={() => openDelete(st)} title="Padam"><Icon name="trash" size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Forms & Dialog Modals */}
      {(modal === "add" || modal === "edit") && (
        <div className="overlay" onClick={() => setModal(null)}>
          <div className="modal" style={{ maxWidth: 460 }} onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSave}>
              <div className="modal-head">
                <h3>{modal === "add" ? "Daftar Pelajar Baharu" : "Kemaskini Pelajar"}</h3>
                <button type="button" className="iconbtn" onClick={() => setModal(null)}>✕</button>
              </div>
              <div className="modal-body scroll" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div className="field">
                  <label>Nama Penuh</label>
                  <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div className="field">
                    <label>Kelas</label>
                    <select className="select" value={kelas} onChange={(e) => setKelas(e.target.value)}>
                      {["Tahun 2", "Tahun 3", "Tahun 4", "Tahun 5", "Tahun 6"].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <label>Umur (Tahun)</label>
                    <input className="input" type="number" value={umur} onChange={(e) => setUmur(e.target.value)} min={5} max={18} required />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div className="field">
                    <label>Jantina</label>
                    <select className="select" value={sex} onChange={(e) => setSex(e.target.value)}>
                      <option value="m">Lelaki</option>
                      <option value="f">Perempuan</option>
                    </select>
                  </div>
                  <div className="field">
                    <label>Sasaran Bulanan (m.s.)</label>
                    <input className="input" type="number" value={target} onChange={(e) => setTarget(e.target.value)} min={1} required />
                  </div>
                </div>
                <div className="field">
                  <label>No. Telefon Penjaga (Ibu Bapa)</label>
                  <input className="input" value={parent} onChange={(e) => setParent(e.target.value)} placeholder="cth. 012-345 6789" required />
                </div>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, fontWeight: 650, marginTop: 4 }}>
                  <input type="checkbox" checked={beginner} onChange={(e) => setBeginner(e.target.checked)} style={{ width: 16, height: 16, accentColor: "var(--accent)" }} />
                  Pelajar Baharu (Guna Iqra' / Tilawah)
                </label>
              </div>
              <div className="modal-foot">
                <button type="button" className="btn btn-ghost" onClick={() => setModal(null)}>Batal</button>
                <button type="submit" className="btn btn-primary">
                  <Icon name="save" size={15} /> Simpan Rekod
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {modal === "delete" && selectedStudent && (
        <div className="overlay" onClick={() => setModal(null)}>
          <div className="modal" style={{ maxWidth: 380 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>Padam Rekod Pelajar</h3>
              <button className="iconbtn" onClick={() => setModal(null)}>✕</button>
            </div>
            <div className="modal-body" style={{ textAlign: "center", padding: "20px 22px" }}>
              <Icon name="trash" size={32} style={{ color: "var(--gr-sederhana)", marginBottom: 12 }} />
              <p style={{ margin: 0, fontSize: 14, fontWeight: 650 }}>Adakah anda pasti untuk memadam pelajar ini?</p>
              <h4 style={{ margin: "6px 0 0", color: "var(--ink)", fontSize: 16 }}>{selectedStudent.name}</h4>
              <p style={{ margin: "6px 0 0", fontSize: 12, color: "var(--ink-3)", lineHeight: 1.5 }}>
                Tindakan ini akan memadam data progres serta semua log tasmik secara kekal dan tidak boleh diundur.
              </p>
            </div>
            <div className="modal-foot">
              <button className="btn btn-ghost" onClick={() => setModal(null)}>Batal</button>
              <button className="btn btn-danger" onClick={handleDelete}>
                Ya, Padam Rekod
              </button>
            </div>
          </div>
        </div>
      )}

      <BulkImportModal 
        isOpen={importOpen} 
        onClose={() => setImportOpen(false)} 
        onRefresh={onRefresh} 
      />
    </div>
  );
}
export default StudentManagement;
