import { useState } from "react";
import { hasFeature, PLANS } from "../superadmin/planConfig.js";
import { Icon } from "../../components/Shared.jsx";

// Admin audience: shows pricing + upgrade CTA
function UpgradeModal({ feature, onClose }) {
  const requiredPlan = Object.keys(PLANS).find(
    (p) => PLANS[p].features?.[feature]
  ) ?? "Premium";

  const plan = PLANS[requiredPlan];

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <h3>Ciri Premium</h3>
            <p style={{ fontSize: 12.5, color: "var(--ink-3)" }}>
              Perlukan pelan {requiredPlan} atau lebih tinggi
            </p>
          </div>
          <button className="iconbtn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{
            background: "var(--accent-soft)",
            border: "1px solid color-mix(in oklch, var(--accent) 30%, transparent)",
            borderRadius: 10,
            padding: "14px 16px",
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
          }}>
            <Icon name="lock" size={18} style={{ color: "var(--accent-deep)", flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: "var(--accent-deep)" }}>
                Pelan {requiredPlan} — RM {plan?.yearlyRM}/tahun
              </div>
              <div style={{ fontSize: 13, color: "var(--ink-2)", marginTop: 4, lineHeight: 1.5 }}>
                RM {plan?.mrrRM}/bulan ·{" "}
                {requiredPlan === "Premium"
                  ? "Pelajar tanpa had"
                  : `Sehingga ${plan?.studentLimit} pelajar`}
              </div>
            </div>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: "var(--ink-3)", lineHeight: 1.6 }}>
            Hubungi kami untuk menaik taraf pelan anda. Proses naik taraf biasanya selesai dalam 1 hari bekerja.
          </p>
        </div>

        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={onClose}>Batal</button>
          <a
            href="mailto:support@maqra.app"
            className="btn btn-primary"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}
          >
            <Icon name="mail" size={15} /> Hubungi Kami
          </a>
        </div>
      </div>
    </div>
  );
}

// Parent audience: no pricing, no upgrade CTA — just inform
function UnavailableNote({ onClose }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 380 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <h3>Ciri Tidak Tersedia</h3>
          </div>
          <button className="iconbtn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <p style={{ margin: 0, fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.7 }}>
            Ciri ini tidak diaktifkan untuk maahad anak anda pada masa ini.
            Sila hubungi pentadbir maahad untuk maklumat lanjut.
          </p>
        </div>
        <div className="modal-foot">
          <button className="btn btn-primary" onClick={onClose}>Faham</button>
        </div>
      </div>
    </div>
  );
}

/**
 * Wraps children. If plan does not include feature, shows a lock overlay.
 *
 * @param {{
 *   feature: string,
 *   plan: string,
 *   audience: 'admin' | 'parent',
 *   children: React.ReactNode
 * }} props
 *
 * audience="admin" (default) — shows pricing + upgrade modal
 * audience="parent"          — shows simple "not available" note, no pricing
 */
export function PlanGate({ feature, plan, audience = "admin", children }) {
  const [modalOpen, setModalOpen] = useState(false);

  if (hasFeature(plan, feature)) {
    return children;
  }

  const overlayLabel = audience === "parent" ? "Tidak tersedia" : "Naik Taraf";

  return (
    <>
      <div
        onClick={() => setModalOpen(true)}
        style={{ position: "relative", cursor: "pointer", display: "inline-block" }}
        title={audience === "parent" ? "Ciri tidak tersedia untuk maahad anda" : "Naik taraf untuk menggunakan ciri ini"}
      >
        <div style={{ opacity: 0.4, pointerEvents: "none", userSelect: "none" }}>
          {children}
        </div>
        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          background: "color-mix(in oklch, var(--surface) 60%, transparent)",
          borderRadius: 8,
          fontSize: 12.5,
          fontWeight: 700,
          color: "var(--ink-2)",
          border: "1px dashed var(--line-2)",
        }}>
          <Icon name="lock" size={13} /> {overlayLabel}
        </div>
      </div>

      {modalOpen && audience === "admin" && (
        <UpgradeModal feature={feature} onClose={() => setModalOpen(false)} />
      )}
      {modalOpen && audience === "parent" && (
        <UnavailableNote onClose={() => setModalOpen(false)} />
      )}
    </>
  );
}
