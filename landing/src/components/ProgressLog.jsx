const MOCK_ROWS = [
  { id: 1, date: "2024-06-05", from: 312, to: 318, juzuk: 26, kategori: "Hafazan", gred: "Mumtaz",        ulasan: "Lancar, sebutan tajwid baik",    masalah: "",                     guru: "Ust. Hafiz" },
  { id: 2, date: "2024-06-04", from: 305, to: 311, juzuk: 26, kategori: "Murajaah", gred: "Jayyid Jiddan", ulasan: "Perlu kuatkan waqaf",           masalah: "Waqaf & Ibtida'",      guru: "Ust. Hafiz" },
  { id: 3, date: "2024-06-03", from: 298, to: 304, juzuk: 25, kategori: "Hafazan", gred: "Mumtaz",        ulasan: "Sangat lancar",                  masalah: "",                     guru: "Ust. Hafiz" },
  { id: 4, date: "2024-06-01", from: 290, to: 297, juzuk: 25, kategori: "Talaqqi", gred: "Jayyid",        ulasan: "Pelajari makhraj dengan betul",  masalah: "Makhraj huruf",        guru: "Ust. Hafiz" },
  { id: 5, date: "2024-05-30", from: 283, to: 289, juzuk: 24, kategori: "Murajaah", gred: "Jayyid Jiddan", ulasan: "Konsisten",                     masalah: "",                     guru: "Ust. Hafiz" },
  { id: 6, date: "2024-05-28", from: 276, to: 282, juzuk: 24, kategori: "Hafazan", gred: "Mumtaz",        ulasan: "Tiada kesilapan",                masalah: "",                     guru: "Ust. Hafiz" },
];

const GRED_STYLE = {
  "Mumtaz":        { color: "oklch(0.52 0.13 300)", bg: "color-mix(in oklch, oklch(0.52 0.13 300) 12%, white)" },
  "Jayyid Jiddan": { color: "oklch(0.52 0.12 235)", bg: "color-mix(in oklch, oklch(0.52 0.12 235) 12%, white)" },
  "Jayyid":        { color: "oklch(0.50 0.11 152)", bg: "color-mix(in oklch, oklch(0.50 0.11 152) 12%, white)" },
  "Sederhana":     { color: "oklch(0.58 0.12 62)",  bg: "color-mix(in oklch, oklch(0.58 0.12 62)  12%, white)" },
  "Maqbul":        { color: "oklch(0.55 0.010 150)", bg: "color-mix(in oklch, oklch(0.55 0.010 150) 12%, white)" },
};

function GredBadge({ g }) {
  const s = GRED_STYLE[g] || GRED_STYLE["Maqbul"];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 999,
      background: s.bg, color: s.color, whiteSpace: "nowrap",
    }}>{g}</span>
  );
}

function KatBadge({ k }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      fontSize: 11.5, fontWeight: 700, padding: "3px 10px", borderRadius: 999,
      background: "var(--surface-2)", color: "var(--ink-2)",
      border: "1px solid var(--line)", whiteSpace: "nowrap",
    }}>{k}</span>
  );
}

export function ProgressLog() {
  return (
    <section className="proglog-section">
      <div className="container">
        <p className="section-label">Rekod tasmik</p>
        <h2 className="section-title">Log progres penuh — dalam genggaman</h2>
        <p className="section-sub">
          Setiap sesi tasmik direkodkan — tarikh, muka surat, juzuk, gred, dan ulasan guru.
          Ibu bapa boleh semak bila-bila masa.
        </p>

        <div className="card proglog-card">
          <div className="proglog-head">
            <span style={{ fontSize: 15, fontWeight: 800 }}>Log Progres Penuh</span>
            <div className="proglog-tabs">
              <button className="ptab ptab-on">Tarikh</button>
              <button className="ptab">Muka Surat</button>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="ptbl">
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
                {MOCK_ROWS.map((h) => {
                  const dateStr = new Date(h.date).toLocaleDateString("ms-MY", {
                    day: "numeric", month: "numeric", year: "numeric",
                  });
                  return (
                    <tr key={h.id}>
                      <td className="pmono" style={{ whiteSpace: "nowrap" }}>{dateStr}</td>
                      <td className="pmono" style={{ whiteSpace: "nowrap", fontWeight: 600 }}>{h.from}–{h.to}</td>
                      <td className="pmono">{h.juzuk}</td>
                      <td><KatBadge k={h.kategori} /></td>
                      <td><GredBadge g={h.gred} /></td>
                      <td style={{ color: "var(--ink-2)", fontSize: 13 }}>{h.ulasan}</td>
                      <td style={{ color: "var(--ink-3)", fontSize: 13 }}>{h.masalah || "—"}</td>
                      <td style={{ whiteSpace: "nowrap", fontSize: 13 }}>{h.guru}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
