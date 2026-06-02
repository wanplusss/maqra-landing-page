import { useState, useMemo } from "react";
import { GredBadge } from "../../../components/Shared.jsx";

export function HistoryLog({ historyList = [] }) {
  const [sort, setSort] = useState("date");

  const rows = useMemo(() => {
    const list = [...historyList];
    if (sort === "date") {
      return list.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else {
      return list.sort((a, b) => b.to - a.to);
    }
  }, [sort, historyList]);

  return (
    <div className="card" style={{ overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--line)" }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>Log Progres Penuh</h3>
        <div className="persona" style={{ background: "var(--surface-2)" }}>
          <button className={sort === "date" ? "on" : ""} onClick={() => setSort("date")}>Tarikh</button>
          <button className={sort === "page" ? "on" : ""} onClick={() => setSort("page")}>Muka Surat</button>
        </div>
      </div>
      <div className="scroll" style={{ overflowX: "auto" }}>
        {rows.length === 0 ? (
          <div className="empty" style={{ padding: "40px 20px" }}>Tiada rekod tasmik ditemui.</div>
        ) : (
          <table className="tbl" style={{ minWidth: 880 }}>
            <thead>
              <tr>
                <th>Tarikh</th>
                <th>Muka Surat</th>
                <th>Juzuk</th>
                <th>Kategori</th>
                <th>Gred</th>
                <th>Ulasan</th>
                <th>Masalah</th>
                <th>Guru</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((h) => {
                const dateStr = new Date(h.date).toLocaleDateString("ms-MY", {
                  day: "numeric",
                  month: "numeric",
                  year: "numeric"
                });
                return (
                  <tr key={h.id}>
                    <td className="mono" style={{ whiteSpace: "nowrap" }}>{dateStr}</td>
                    <td className="mono" style={{ whiteSpace: "nowrap", fontWeight: 600 }}>{h.from}–{h.to}</td>
                    <td className="mono">{h.juzuk}</td>
                    <td><span className="badge" style={{ fontSize: "11.5px" }}>{h.kategori}</span></td>
                    <td><GredBadge g={h.gred} /></td>
                    <td style={{ color: "var(--ink-2)" }}>{h.ulasan}</td>
                    <td style={{ color: "var(--ink-3)" }}>{h.masalah || "—"}</td>
                    <td style={{ whiteSpace: "nowrap" }}>{h.guru}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
export default HistoryLog;
