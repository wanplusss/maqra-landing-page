import { useState, useEffect, useCallback } from "react";
import { SuperAdminService } from "./superAdminService.js";
import { Icon } from "../../components/Shared.jsx";
import { SekolahDashboard } from "../admin/SekolahDashboard.jsx";
import { RegisterSchoolModal } from "./modals/RegisterSchoolModal.jsx";
import { EditSchoolModal } from "./modals/EditSchoolModal.jsx";
import { PlatformMetrics } from "./sections/PlatformMetrics.jsx";
import { TenantTable } from "./sections/TenantTable.jsx";
import { ActivityFeed } from "./sections/ActivityFeed.jsx";
import { HealthAlerts } from "./sections/HealthAlerts.jsx";
import { GrowthChart } from "./sections/GrowthChart.jsx";

export function SuperAdminDashboard() {
  const [schools, setSchools] = useState([]);
  const [activityMap, setActivityMap] = useState({});
  const [growthData, setGrowthData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [list, activity, growth] = await Promise.all([
        SuperAdminService.getPlatformDashboardData(),
        SuperAdminService.getActivityData().catch(() => ({})),
        SuperAdminService.getGrowthData().catch(() => []),
      ]);
      setSchools(list);
      setActivityMap(activity);
      setGrowthData(growth);
    } catch (e) {
      console.error("[SuperAdminDashboard] loadAll failed:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const handlePlanChange = async (slug, plan) => {
    setSchools((prev) => prev.map((s) => s.slug === slug ? { ...s, plan } : s));
    await SuperAdminService.updateSchool(slug, { plan });
  };

  const handleStatusChange = async (slug, status) => {
    setSchools((prev) => prev.map((s) => s.slug === slug ? { ...s, status } : s));
    await SuperAdminService.updateSchool(slug, { status });
  };

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
          <h2>Pemantauan: {selectedSchool.name}</h2>
          <p style={{ margin: "4px 0 0", color: "var(--ink-3)", fontSize: 13.5 }}>
            Pelan: {selectedSchool.plan}
          </p>
        </div>
        <SekolahDashboard onOpenStudent={(sid) => {
          alert(`Membuka profil pelajar ${sid} — guna mod Guru/Ibu Bapa untuk interaksi penuh`);
        }} />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      {registerOpen && (
        <RegisterSchoolModal
          onClose={() => setRegisterOpen(false)}
          onSaved={() => { setRegisterOpen(false); loadAll(); }}
        />
      )}
      {editTarget && (
        <EditSchoolModal
          school={editTarget}
          onClose={() => setEditTarget(null)}
          onSaved={() => { setEditTarget(null); loadAll(); }}
        />
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900 }}>Platform Owner Cockpit</h2>
          <p style={{ margin: "4px 0 0", color: "var(--ink-3)", fontSize: 13.5 }}>Maqra&apos; SaaS — Papan Pemuka Pemilik</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setRegisterOpen(true)}>
          <Icon name="plus" size={14} /> Daftar Sekolah Baharu
        </button>
      </div>

      <PlatformMetrics schools={schools} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <ActivityFeed schools={schools} activityMap={activityMap} />
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <HealthAlerts schools={schools} activityMap={activityMap} />
          <GrowthChart growthData={growthData} />
        </div>
      </div>

      <TenantTable
        schools={schools}
        onMonitor={setSelectedSchool}
        onEdit={setEditTarget}
        onPlanChange={handlePlanChange}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}

export default SuperAdminDashboard;
