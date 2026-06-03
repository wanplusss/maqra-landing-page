import { StatCard } from "../../../components/Shared.jsx";
import { PLANS, calcMRR } from "../planConfig.js";

export function PlatformMetrics({ schools }) {
  const totalStudents = schools.reduce((a, s) => a + (s.students || 0), 0);
  const totalTeachers = schools.reduce((a, s) => a + (s.teachers || 0), 0);
  const mrr = calcMRR(schools);

  const byPlan = Object.keys(PLANS).reduce((acc, key) => {
    acc[key] = schools.filter((s) => s.plan === key).length;
    return acc;
  }, {});

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
      <StatCard
        icon="trendUp"
        label="Anggaran MRR"
        value={`RM ${mrr}`}
        sub="Pendapatan bulanan"
        tone="hafazan"
      />
      <StatCard
        icon="school"
        label="Jumlah Tenant"
        value={schools.length}
        sub={`${byPlan.Premium ?? 0} Premium · ${byPlan.Asas ?? 0} Asas · ${byPlan.Percubaan ?? 0} Percubaan`}
      />
      <StatCard
        icon="users"
        label="Jumlah Pelajar"
        value={totalStudents}
        sub="Platform keseluruhan"
        tone="murajaah"
      />
      <StatCard
        icon="cap"
        label="Jumlah Guru"
        value={totalTeachers}
        sub="Platform keseluruhan"
        tone="bacaan"
      />
    </div>
  );
}
