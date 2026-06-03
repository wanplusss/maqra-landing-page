import { useState } from "react";
import { Avatar, StatusDot, Bar, Icon } from "../../../components/Shared.jsx";
import { STATUS } from "../../maqra/domain/statusColors.js";
import { SlipPrestasiService } from "../SlipPrestasiService.js";
import { SijilService } from "../../sijil/SijilService.js";

function Row({ k, v }) {
  return (
    <div style={{ display: "flex", gap: 12, fontSize: 13, padding: "4px 0" }}>
      <span style={{ color: "var(--ink-3)", width: 100, flex: "none" }}>{k}</span>
      <span style={{ fontWeight: 650, color: "var(--ink)" }}>{v}</span>
    </div>
  );
}

export function ProfilAnak({ st, school }) {
  const [printing, setPrinting] = useState(false);
  const [downloadingCert, setDownloadingCert] = useState(false);

  const printReport = async () => {
    try {
      setPrinting(true);
      await SlipPrestasiService.generatePdf(st.id);
    } catch (e) {
      alert("Gagal menjana PDF: " + e.message);
    } finally {
      setPrinting(false);
    }
  };

  const downloadCertificate = async () => {
    try {
      setDownloadingCert(true);
      const milestone = st.juzuk === 30 ? "Khatam Al-Quran 30 Juzuk" : `Hafazan Lengkap Juzuk ${st.juzuk || 1}`;
      await SijilService.issueCertificate(st.id, milestone);
    } catch (e) {
      alert("Gagal memuat turun sijil: " + e.message);
    } finally {
      setDownloadingCert(false);
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 22, alignItems: "start" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        
        {/* Child Profile Info Card */}
        <div className="card" style={{ padding: 22, display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
          <Avatar name={st.name} sex={st.sex} size={68} ring />
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", rowGap: 8 }}>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em" }}>{st.name}</h2>
              <span className="badge badge-ok"><span className="dot" style={{ background: "var(--accent)" }} /> Aktif</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
              <span style={{ fontSize: 13, color: "var(--ink-3)" }}>ID Pelajar</span>
              <span className="mono" style={{ background: "var(--surface-2)", border: "1px solid var(--line)", padding: "3px 9px", borderRadius: 7, fontSize: 12.5, fontWeight: 700 }}>{st.id}</span>
            </div>
          </div>
        </div>

        {/* Status Distribution Bars */}
        <div className="card" style={{ padding: 22 }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 800 }}>Taburan Status Hafazan</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            {STATUS.map((s) => {
              const val = (st.tally && st.tally[s.key]) || 0;
              return (
                <div key={s.key} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ width: 140, flex: "none", display: "flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 600 }}>
                    <StatusDot s={s.key} />{s.label}
                  </span>
                  <div style={{ flex: 1 }}>
                    <Bar value={(val / 604) * 100} tone={`var(--st-${s.css}-ink)`} />
                  </div>
                  <span className="mono" style={{ width: 40, textAlign: "right", fontSize: "12.5px", color: "var(--ink-2)" }}>{val}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Right Column */}
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        
        {/* Printable Report Actions */}
        <div className="card" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>Dokumen dan Laporan</h3>
          <button className="btn btn-primary" onClick={printReport} disabled={printing} style={{ justifyContent: "center" }}>
            <Icon name="print" size={16} /> 
            {printing ? "Menjana Slip..." : "Cetak Slip Prestasi (PDF)"}
          </button>
          
          <button className="btn" onClick={downloadCertificate} disabled={downloadingCert} style={{ justifyContent: "center" }}>
            <Icon name="award" size={16} />
            {downloadingCert ? "Mengunduh..." : "Muat Turun Sijil Pencapaian"}
          </button>
        </div>

        {/* Student metadata Details */}
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 800 }}>Maklumat Pendaftaran</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <Row k="Nama Penuh" v={st.name} />
            <Row k="No. ID Pelajar" v={st.id} />
            <Row k="Kelas / Darjah" v={st.kelas} />
            <Row k="Umur Pelajar" v={`${st.umur} Tahun`} />
            <Row k="No. Penjaga" v={st.parent} />
            <Row k="Tarikh Enrol" v={st.enroll} />
            <Row k="Sasaran Bulanan" v={st.target ? `${st.target} m.s. / bulan` : "—"} />
            <Row k="Institusi" v={school.name} />
          </div>
        </div>

      </div>
    </div>
  );
}
export default ProfilAnak;
