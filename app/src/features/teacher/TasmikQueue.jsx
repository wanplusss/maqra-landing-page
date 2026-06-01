import React, { useState, useEffect } from "react";
import { TasmikQueueService } from "./TasmikQueueService.js";
import { Icon } from "../../components/Shared.jsx";

export function TasmikQueue({ onOpenStudent }) {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const list = await TasmikQueueService.getTasmikQueue();
        setQueue(list);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <div className="empty">Memuatkan barisan giliran tasmik harian...</div>;
  }

  return (
    <div>
      <div className="pagehead">
        <div>
          <h1>Barisan Giliran Tasmik Harian</h1>
          <p>Pelajar yang memerlukan bimbingan & murajaah segera berdasarkan kadar susutan ingatan</p>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {queue.map((item) => {
          const score = item.priorityScore;
          // Priority tags: low score = high urgency!
          const priority = score < 42 ? "Tinggi" : score < 70 ? "Sederhana" : "Rendah";
          const priorityColor = score < 42 ? "var(--st-syahadah-ink)" : score < 70 ? "var(--st-murajaah-ink)" : "var(--st-hafazan-ink)";
          const priorityBg = score < 42 ? "var(--st-syahadah-fill)" : score < 70 ? "var(--st-murajaah-fill)" : "var(--st-hafazan-fill)";

          const lastDate = item.lastTasmikDate !== "Tiada Rekod" 
            ? new Date(item.lastTasmikDate).toLocaleDateString("ms-MY", { day: "numeric", month: "short", year: "numeric" })
            : "Tiada Rekod";

          return (
            <div 
              key={item.studentId}
              className="card"
              style={{
                display: "flex", alignItems: "center", justifyBetween: "space-between", gap: 16, padding: "16px 20px",
                flexWrap: "wrap"
              }}
            >
              <div style={{ width: 240, flex: "none" }}>
                <h3 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 800 }}>{item.name}</h3>
                <span className="badge">{item.kelas}</span>
              </div>

              <div style={{ flex: 1, minWidth: 160 }}>
                <div style={{ fontSize: 13, color: "var(--ink-3)", marginBottom: 4 }}>Tumpuan Murajaah Terkini:</div>
                <div style={{ fontWeight: 700, fontSize: 14.5 }}>
                  Juzuk {item.juzukNumber} <span style={{ fontSize: 12, fontWeight: 550, color: "var(--ink-2)" }}>(m.s. {item.page})</span>
                </div>
              </div>

              <div style={{ width: 140, flex: "none" }}>
                <div style={{ fontSize: 12, color: "var(--ink-3)", marginBottom: 4 }}>Tahap Ingatan Juz:</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span className="mono" style={{ fontWeight: 800, fontSize: 15, color: priorityColor }}>{score}%</span>
                  <span className="badge" style={{ background: priorityBg, color: priorityColor, borderColor: "transparent", fontSize: 10 }}>
                    {priority}
                  </span>
                </div>
              </div>

              <div style={{ width: 150, flex: "none" }}>
                <div style={{ fontSize: 12, color: "var(--ink-3)", marginBottom: 4 }}>Tasmik Akhir:</div>
                <div style={{ fontWeight: 650, fontSize: 13 }}>{lastDate}</div>
              </div>

              <button className="btn btn-primary btn-sm" onClick={() => onOpenStudent(item.studentId)}>
                Bimbing Tasmik <Icon name="arrowR" size={13} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default TasmikQueue;
