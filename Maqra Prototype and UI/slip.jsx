/* ===========================================================================
   Maqra — printable Slip Prestasi + Sijil certificate (light, self-contained)
   =========================================================================== */

const INK = "#1a2620", INK2 = "#46584f", INK3 = "#7c8a82", LINE = "#e3e9e4", PAPER = "#f7f9f7";
const GREEN = "#2f7d57", GOLD = "#9a7b2e";

function SlipPrestasi({ st, school, onClose }) {
  const a = getAnalytics(st);
  const ms = milestonesOf(st);
  const recent = st.history.slice(0, 5);
  const weak = [...a.murajaah].map((m) => ({ ...m, strength: strengthOf(m.days) })).sort((x, y) => x.strength - y.strength).slice(0, 3);
  const dist = MAQRA.STATUS.filter((s) => st.tally[s.key] > 0);

  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div className="sheet-wrap" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-toolbar print-noprint">
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>Slip Prestasi Tahfiz</span>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn" style={{ background: "var(--surface)" }} onClick={onClose}><Icon name="x" size={15} /> Tutup</button>
            <button className="btn btn-primary" onClick={() => window.print()}><Icon name="print" size={15} /> Cetak / Simpan PDF</button>
          </div>
        </div>

        <div className="print-sheet" style={{ padding: "34px 38px 30px", fontSize: 13 }}>
          {/* header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: `2px solid ${INK}`, paddingBottom: 16 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ width: 42, height: 42, borderRadius: 12, background: GREEN, display: "grid", placeItems: "center", color: "#fff" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 6.2C10.4 4.8 8 4.3 4.5 4.7v13C8 17.3 10.4 17.8 12 19.2M12 6.2C13.6 4.8 16 4.3 19.5 4.7v13C16 17.3 13.6 17.8 12 19.2M12 6.2v13" /></svg>
              </span>
              <div>
                <div style={{ fontWeight: 800, fontSize: 18, color: INK, letterSpacing: "-0.01em" }}>{school.name}</div>
                <div style={{ fontSize: 11.5, color: INK3 }}>{school.address}</div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", color: GREEN }}>SLIP PRESTASI TAHFIZ</div>
              <div style={{ fontSize: 11.5, color: INK3, marginTop: 3 }}>Setakat {MAQRA.fmtDate(TODAY)}</div>
            </div>
          </div>

          {/* student strip */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, padding: "16px 0", borderBottom: `1px solid ${LINE}`, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 19, fontWeight: 800, color: INK }}>{st.name}</div>
              <div style={{ fontSize: 12, color: INK2, marginTop: 3 }}>{st.id} · {st.kelas} · {st.umur} Tahun</div>
            </div>
            <div style={{ display: "flex", gap: 22 }}>
              {[["Juzuk Semasa", "Juz " + st.juzuk], ["Surah", st.surah], ["Daftar", st.enroll]].map(([k, v]) => (
                <div key={k} style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 10.5, color: INK3, fontWeight: 600 }}>{k}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: INK }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* progress + key figures */}
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 28, alignItems: "center", padding: "18px 0", borderBottom: `1px solid ${LINE}` }}>
            <SlipRing pct={st.progress / 100} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
              {[["Muka surat", st.frontier + " / 604"], ["Kadar hafazan", a.ready ? a.ppm.toFixed(1) + " /bln" : "—"], ["Juzuk lengkap", ms.count + " juz"], ["Ramalan khatam", a.ready ? monthYear(a.khatamDate) : "—"]].map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontSize: 10.5, color: INK3, fontWeight: 600, marginBottom: 4 }}>{k}</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: INK }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 604 mini grid */}
          <div style={{ padding: "16px 0", borderBottom: `1px solid ${LINE}` }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: INK, marginBottom: 10 }}>Peta 604 Muka Surat</div>
            <MiniGrid statusMap={st.status} columns={52} />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px 14px", marginTop: 12 }}>
              {dist.map((s) => (
                <span key={s.key} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, color: INK2 }}>
                  <span style={{ width: 9, height: 9, borderRadius: 3, background: `var(--st-${s.css}-ink)` }} />{s.label}
                  <span style={{ color: INK3, fontWeight: 700 }}>{st.tally[s.key]}</span>
                </span>
              ))}
            </div>
          </div>

          {/* two columns: recent tasmik + murajaah */}
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 24, padding: "16px 0", borderBottom: `1px solid ${LINE}` }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: INK, marginBottom: 10 }}>Rekod Tasmik Terkini</div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11.5 }}>
                <thead><tr style={{ color: INK3, textAlign: "left" }}>
                  <th style={{ padding: "4px 6px", fontWeight: 700 }}>Tarikh</th><th style={{ padding: "4px 6px", fontWeight: 700 }}>M.S.</th><th style={{ padding: "4px 6px", fontWeight: 700 }}>Kategori</th><th style={{ padding: "4px 6px", fontWeight: 700 }}>Gred</th>
                </tr></thead>
                <tbody>
                  {recent.map((h) => (
                    <tr key={h.id} style={{ borderTop: `1px solid ${LINE}`, color: INK2 }}>
                      <td style={{ padding: "5px 6px" }}>{MAQRA.fmtDate(h.date)}</td>
                      <td style={{ padding: "5px 6px", fontWeight: 700, color: INK }}>{h.from}–{h.to}</td>
                      <td style={{ padding: "5px 6px" }}>{h.kategori}</td>
                      <td style={{ padding: "5px 6px", fontWeight: 700 }}>{h.gred}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: INK, marginBottom: 10 }}>Murajaah Perlu Perhatian</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {weak.map((m) => (
                  <div key={m.juz} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11.5 }}>
                    <span style={{ color: INK2 }}>Juz {m.juz} · {m.surah}</span>
                    <span style={{ fontWeight: 800, color: m.strength < 42 ? "#b4452f" : m.strength < 70 ? GOLD : GREEN }}>{m.strength}%</span>
                  </div>
                ))}
                {weak.length === 0 && <div style={{ fontSize: 11.5, color: INK3 }}>Tiada data murajaah.</div>}
              </div>
            </div>
          </div>

          {/* signatures */}
          <div style={{ display: "flex", justifyContent: "space-between", gap: 40, marginTop: 28 }}>
            {["Tandatangan Guru", "Tandatangan Ibu Bapa"].map((s) => (
              <div key={s} style={{ flex: 1 }}>
                <div style={{ borderBottom: `1px solid ${INK2}`, height: 30 }} />
                <div style={{ fontSize: 11, color: INK3, marginTop: 6 }}>{s}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", fontSize: 10, color: INK3, marginTop: 22 }}>
            Dijana oleh Maqra' · maqra.app/school/{school.slug} · {MAQRA.fmtDate(TODAY)}
          </div>
        </div>
      </div>
    </div>
  );
}

function SlipRing({ pct }) {
  const size = 108, stroke = 12, r = (size - stroke) / 2, c = 2 * Math.PI * r, off = c * (1 - pct);
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={LINE} strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={GREEN} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center" }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 800, color: INK, letterSpacing: "-0.02em" }}>{Math.round(pct * 100)}%</div>
          <div style={{ fontSize: 10, color: INK3 }}>progres</div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Sijil certificate ---------- */
function SijilCertificate({ st, target, school, onClose }) {
  const isKhatam = target.type === "khatam";
  const title = isKhatam ? "Sijil Khatam Al-Quran" : `Sijil Hafazan Juzuk ${target.juz}`;
  const body = isKhatam
    ? "telah menyempurnakan hafazan keseluruhan 30 juzuk Al-Quran al-Karim dengan jayyid"
    : `telah menyempurnakan hafazan Juzuk ${target.juz} Al-Quran al-Karim dengan jayyid`;
  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div className="sheet-wrap" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-toolbar print-noprint">
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{title}</span>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn" style={{ background: "var(--surface)" }} onClick={onClose}><Icon name="x" size={15} /> Tutup</button>
            <button className="btn btn-primary" onClick={() => window.print()}><Icon name="print" size={15} /> Cetak / Simpan PDF</button>
          </div>
        </div>

        <div className="print-sheet" style={{ padding: 14 }}>
          <div style={{ border: `2px solid ${GOLD}`, borderRadius: 8, padding: "6px" }}>
            <div style={{ border: `1px solid ${GOLD}`, borderRadius: 5, padding: "44px 50px", textAlign: "center", background: PAPER }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
                <span style={{ width: 54, height: 54, borderRadius: 15, background: GREEN, display: "grid", placeItems: "center", color: "#fff" }}>
                  <Icon name={isKhatam ? "trophy" : "star"} size={28} />
                </span>
              </div>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.22em", color: GOLD }}>{school.name.toUpperCase()}</div>
              <div style={{ fontSize: 30, fontWeight: 800, color: INK, margin: "12px 0 4px", letterSpacing: "-0.01em" }}>{title}</div>
              <div style={{ width: 70, height: 3, background: GOLD, margin: "10px auto 22px", borderRadius: 9 }} />
              <div style={{ fontSize: 13, color: INK2 }}>Dengan ini diperakui bahawa</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: GREEN, margin: "10px 0", fontFamily: "var(--font-ui)" }}>{st.name}</div>
              <div style={{ fontSize: 13.5, color: INK2, maxWidth: 460, margin: "0 auto", lineHeight: 1.6 }}>{body}</div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 40, marginTop: 46, padding: "0 20px" }}>
                {[["Mudir / Pengetua", school.name.split(" ").slice(-1)[0]], ["Tarikh", MAQRA.fmtDate(TODAY)]].map(([k]) => (
                  <div key={k} style={{ flex: 1 }}>
                    <div style={{ borderBottom: `1px solid ${INK2}`, height: 26 }} />
                    <div style={{ fontSize: 11, color: INK3, marginTop: 6 }}>{k}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { SlipPrestasi, SijilCertificate });
