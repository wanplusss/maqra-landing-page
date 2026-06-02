import { useState, useEffect } from "react";
import { SuperAdminService } from "./superAdminService.js";
import { Icon, StatCard } from "../../components/Shared.jsx";
import { SekolahDashboard } from "../admin/SekolahDashboard.jsx";

export function SuperAdminDashboard() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSchool, setSelectedSchool] = useState(null);

  useEffect(() => {
    async function load() {
      const list = await SuperAdminService.getPlatformDashboardData();
      setSchools(list);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return <div className="empty">Memuatkan dashboard pemilik platform...</div>;
  }

  if (selectedSchool) {
    return (
      <div>
        <button className="btn btn-ghost btn-sm" onClick={() => setSelectedSchool(null)} style={{ marginBottom: 16 }}>
          ← Balik ke Dashboard Pemilik
        </button>
        <div style={{ padding: "0 0 14px" }}>
          <h2>Pemantauan Sekolah: {selectedSchool.name}</h2>
          <p style={{ margin: "4px 0 0", color: "var(--ink-3)", fontSize: 13.5 }}>
            Menyemak portal pentadbir bagi maahad {selectedSchool.name} (Pelan: {selectedSchool.plan})
          </p>
        </div>
        <SekolahDashboard onOpenStudent={(sid) => {
          alert(`Membuka profil pelajar ${sid} (Gunakan mod Guru/Ibu Bapa untuk interaksi penuh)`);
        }} />
      </div>
    );
  }

  // Calculate platform totals
  const totalTenantSchools = schools.length;
  const totalPlatformStudents = schools.reduce((a, s) => a + s.students, 0);
  const totalPlatformTeachers = schools.reduce((a, s) => a + s.teachers, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      
      {/* Platform size cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        <StatCard icon="school" label="Jumlah Tenant Sekolah" value={totalTenantSchools} sub="Institusi berdaftar" />
        <StatCard icon="users" label="Jumlah Pelajar Platform" value={totalPlatformStudents} sub="Pelajar aktif" tone="murajaah" />
        <StatCard icon="cap" label="Jumlah Guru Platform" value={totalPlatformTeachers} sub="Guru berdaftar" tone="bacaan" />
      </div>

      {/* Tenant Table Grid */}
      <div className="card" style={{ padding: 22 }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 17, fontWeight: 800 }}>Daftar Institusi Pelanggan Maqra'</h3>
        
        <div className="scroll" style={{ overflowX: "auto" }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>Nama Institusi</th>
                <th>Lokasi</th>
                <th style={{ textAlign: "center" }}>Pelajar</th>
                <th style={{ textAlign: "center" }}>Guru</th>
                <th style={{ textAlign: "center" }}>Progres Purata</th>
                <th>Pakej Pelan</th>
                <th>Status</th>
                <th style={{ width: 120, textAlign: "right" }}>Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {schools.map((sch) => {
                const planColor = sch.plan === "Premium" ? "var(--accent)" : "var(--ink-3)";
                const statusColor = sch.status === "aktif" ? "var(--st-hafazan-ink)" : "var(--st-syahadah-ink)";
                const statusBg = sch.status === "aktif" ? "var(--st-hafazan-fill)" : "var(--st-syahadah-fill)";

                return (
                  <tr key={sch.slug}>
                    <td style={{ fontWeight: 700 }}>{sch.name}</td>
                    <td>{sch.city}</td>
                    <td className="mono" style={{ textAlign: "center" }}>{sch.students}</td>
                    <td className="mono" style={{ textAlign: "center" }}>{sch.teachers}</td>
                    <td className="mono" style={{ textAlign: "center", fontWeight: 700 }}>{sch.avgProg}%</td>
                    <td>
                      <span className="badge" style={{ color: planColor, borderColor: planColor }}>
                        {sch.plan}
                      </span>
                    </td>
                    <td>
                      <span className="badge" style={{ background: statusBg, color: statusColor, borderColor: "transparent" }}>
                        {sch.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button className="btn btn-sm" onClick={() => setSelectedSchool(sch)}>
                        Pantau Portal <Icon name="arrowR" size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
export default SuperAdminDashboard;
