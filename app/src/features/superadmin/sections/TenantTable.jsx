import { Icon } from "../../../components/Shared.jsx";
import { PLANS } from "../planConfig.js";

const PLAN_COLORS = {
  Premium: "var(--accent)",
  Asas: "var(--st-murajaah-ink)",
  Percubaan: "var(--ink-3)",
};

const STATUS_STYLE = {
  aktif: { bg: "var(--st-hafazan-fill)", color: "var(--st-hafazan-ink)" },
  percubaan: { bg: "var(--st-talaqqi-fill)", color: "var(--st-talaqqi-ink)" },
  "tidak aktif": { bg: "var(--st-syahadah-fill)", color: "var(--st-syahadah-ink)" },
};

export function TenantTable({ schools, onMonitor, onEdit, onPlanChange, onStatusChange }) {
  return (
    <div className="card" style={{ padding: 22 }}>
      <h3 style={{ margin: "0 0 16px", fontSize: 17, fontWeight: 800 }}>Daftar Institusi Pelanggan</h3>

      <div className="scroll" style={{ overflowX: "auto" }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>Institusi</th>
              <th>Lokasi</th>
              <th style={{ textAlign: "center" }}>Pelajar</th>
              <th style={{ textAlign: "center" }}>Guru</th>
              <th style={{ textAlign: "center" }}>Progres</th>
              <th>Pelan</th>
              <th>Status</th>
              <th style={{ textAlign: "right", width: 140 }}>Tindakan</th>
            </tr>
          </thead>
          <tbody>
            {schools.map((sch) => {
              const planColor = PLAN_COLORS[sch.plan] ?? "var(--ink-3)";
              const statusStyle = STATUS_STYLE[sch.status] ?? STATUS_STYLE["tidak aktif"];

              return (
                <tr key={sch.slug}>
                  <td>
                    <div style={{ fontWeight: 700 }}>{sch.name}</div>
                    <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 2 }}>{sch.slug}</div>
                  </td>
                  <td>{sch.city || "—"}</td>
                  <td className="mono" style={{ textAlign: "center" }}>{sch.students ?? "—"}</td>
                  <td className="mono" style={{ textAlign: "center" }}>{sch.teachers ?? "—"}</td>
                  <td className="mono" style={{ textAlign: "center", fontWeight: 700 }}>
                    {sch.avgProg != null ? `${sch.avgProg}%` : "—"}
                  </td>
                  <td>
                    <select
                      className="input"
                      style={{ fontSize: 12, padding: "3px 6px", color: planColor, fontWeight: 700, minWidth: 100 }}
                      value={sch.plan || "Percubaan"}
                      onChange={(e) => onPlanChange(sch.slug, e.target.value)}
                    >
                      {Object.keys(PLANS).map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select
                      className="input"
                      style={{
                        fontSize: 12,
                        padding: "3px 6px",
                        background: statusStyle.bg,
                        color: statusStyle.color,
                        fontWeight: 700,
                        border: "none",
                        minWidth: 100,
                      }}
                      value={sch.status || "aktif"}
                      onChange={(e) => onStatusChange(sch.slug, e.target.value)}
                    >
                      <option value="aktif">Aktif</option>
                      <option value="percubaan">Percubaan</option>
                      <option value="tidak aktif">Tidak Aktif</option>
                    </select>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                      <button className="btn btn-sm btn-ghost" onClick={() => onEdit(sch)} title="Edit">
                        <Icon name="edit" size={13} />
                      </button>
                      <button className="btn btn-sm" onClick={() => onMonitor(sch)}>
                        Pantau <Icon name="arrowR" size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
