import { useState, useEffect } from "react";
import { Sidebar, Icon, StatCard, GredBadge } from "../../components/Shared.jsx";
import { Legend, PageGrid } from "./GridView.jsx";
import { ProgressGrid } from "./SubPages/ProgressGrid.jsx";
import { HistoryLog } from "./SubPages/HistoryLog.jsx";
import { ProfilAnak } from "./SubPages/ProfilAnak.jsx";
import { Analitik } from "./SubPages/Analitik.jsx";
import { AnalyticsService } from "../analytics/service/AnalyticsService.js";
import { SchoolRepository } from "../school/repository/SchoolRepository.js";
import { StudentRepository } from "../student/repository/StudentRepository.js";
import { TasmikRepository } from "../tasmik/repository/TasmikRepository.js";
import { MaqraGridService } from "../maqra/service/MaqraGridService.js";
import { SijilService } from "../sijil/SijilService.js";
import { SlipPrestasiService } from "./SlipPrestasiService.js";
import { PlanGate } from "../auth/PlanGate.jsx";

// Right rail small widgets
function KhatamMini({ st, onOpen }) {
  const [pred, setPred] = useState(null);
  
  useEffect(() => {
    async function load() {
      const data = await AnalyticsService.predictKhatam(st.id);
      setPred(data);
    }
    load();
  }, [st.id]);

  if (!pred) return null;

  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <Icon name="sparkle" size={16} style={{ color: "var(--accent)" }} />
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>Ramalan Khatam</h3>
      </div>
      <div style={{ fontSize: 27, fontWeight: 800, letterSpacing: "-0.02em", color: "var(--accent-deep)", lineHeight: 1.1 }}>
        {pred.khatamDate ? pred.khatamDate.split(" ")[1] + " " + pred.khatamDate.split(" ")[2] : "—"}
      </div>
      <div style={{ fontSize: "12.5px", color: "var(--ink-3)", marginTop: 4 }}>
        pada kadar {pred.pace} m.s./bulan · {Math.round(pred.daysToKhatam / 30.4)} bulan lagi
      </div>
      <div style={{ marginTop: 14 }}>
        <Bar value={st.progress || (st.frontier / 604) * 100} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 7, fontSize: "11.5px", color: "var(--ink-3)" }} className="mono">
        <span>{st.frontier} m.s.</span><span>604 m.s.</span>
      </div>
      <button className="btn btn-sm" style={{ width: "100%", justifyContent: "center", marginTop: 14 }} onClick={onOpen}>
        Lihat analitik penuh <Icon name="arrowR" size={14} />
      </button>
    </div>
  );
}

function Bar({ value }) {
  return (
    <div style={{ height: 6, background: "var(--line-2)", borderRadius: 99, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${value}%`, background: "var(--accent)", borderRadius: 99 }} />
    </div>
  );
}

function HistoryItem({ h }) {
  const dateStr = new Date(h.date).toLocaleDateString("ms-MY", { day: "numeric", month: "short" });
  return (
    <div style={{ position: "relative", paddingLeft: 16 }}>
      <span style={{ position: "absolute", left: 0, top: 5, bottom: 5, width: 3, borderRadius: 9, background: "var(--accent)", opacity: 0.5 }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 5 }}>
        <span className="mono" style={{ fontSize: 12, color: "var(--ink-3)" }}>{dateStr}</span>
        <span className="badge" style={{ fontSize: 11 }}>{h.kategori}</span>
      </div>
      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>
        Muka surat {h.from}–{h.to} <span style={{ color: "var(--ink-3)", fontWeight: 500 }}>· Juz {h.juzuk}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <span style={{ fontSize: "12.5px", color: "var(--ink-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 160 }}>
          {h.ulasan}
        </span>
        <GredBadge g={h.gred} />
      </div>
    </div>
  );
}

function SijilCard({ st, onOpen }) {
  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <Icon name="award" size={17} style={{ color: "var(--accent)" }} />
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>Sijil Pencapaian</h3>
      </div>
      <p style={{ margin: "0 0 14px", fontSize: "12.5px", color: "var(--ink-3)", lineHeight: 1.5 }}>
        Anak anda telah menamatkan hafazan sehingga Juzuk {st.juzuk}. Sijil pencapaian sedia untuk dicetak.
      </p>
      <button className="btn btn-sm btn-primary" onClick={onOpen} style={{ width: "100%", justifyContent: "center" }}>
        <Icon name="award" size={14} /> Cetak Sijil Penghargaan
      </button>
    </div>
  );
}

function RujukanCard() {
  return (
    <div className="card" style={{ padding: 20 }}>
      <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 800 }}>Skala Penilaian</h3>
      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 9 }}>Gred Maklum Balas</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 16 }}>
        {["Mumtaz", "Jayyid Jiddan", "Jayyid", "Sederhana", "Maqbul"].map((g) => <GredBadge key={g} g={g} />)}
      </div>
    </div>
  );
}

export function ParentDashboard({ studentId, onLogout, columns }) {
  const [tab, setTab] = useState("dash");
  const [st, setSt] = useState(null);
  const [school, setSchool] = useState(null);
  const [history, setHistory] = useState([]);
  const [cell, setCell] = useState(null);

  const loadData = async () => {
    const student = await StudentRepository.getById(studentId);
    const sch = await SchoolRepository.getProfile(student.school_slug);
    const hist = await TasmikRepository.getRecordsForStudent(studentId);
    
    // Calculate student details
    const grid = await MaqraGridService.getGridForStudent(studentId);
    
    const frontierIdx = grid.frontier > 0 ? grid.frontier - 1 : 0;
    setSt({
      ...student,
      statusMap: grid.statusMap,
      frontier: grid.frontier,
      progress: grid.progressPercent,
      tally: grid.tally,
      juzuk: grid.frontier > 0 ? Math.floor(grid.frontier / 20) + 1 : 1,
      surah: grid.pages[frontierIdx].surah,
      lastHafazan: grid.frontier > 0 ? grid.frontier : 1,
      lastHafazanSurah: grid.pages[frontierIdx].surah,
    });
    setSchool(sch);
    setHistory(hist);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [studentId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!st || !school) {
    return <div className="empty" style={{ padding: "80px 20px" }}>Memuatkan maklumat ibu bapa...</div>;
  }

  const nav = [
    { section: "Menu Utama" },
    { key: "dash", label: "Dashboard Utama", icon: "home" },
    { key: "analitik", label: "Analitik Hafazan", icon: "sparkle" },
    { key: "profil", label: "Profil Anak", icon: "user" },
    { key: "grid", label: "Progress Grid", icon: "grid" },
    { key: "log", label: "History Log", icon: "clock" },
  ];

  const triggerSijilDownload = async () => {
    const milestone = st.juzuk === 30 ? "Khatam Al-Quran 30 Juzuk" : `Hafazan Lengkap Juzuk ${st.juzuk || 1}`;
    await SijilService.issueCertificate(st.id, milestone);
  };

  return (
    <div className="shell">
      <Sidebar 
        roleIcon="users" 
        roleTitle="Ibu Bapa" 
        roleSub="Mod Lihat Sahaja" 
        items={nav}
        active={tab} 
        onNav={setTab} 
        onLogout={onLogout}
        footerNote={`Memantau: ${st.name.split(" ").slice(0, 2).join(" ")}`}
      />
      <main className="main">
        <div className="main-wide">
          <div className="pagehead">
            <div>
              <h1>{nav.find((n) => n.key === tab)?.label || "Menu"}</h1>
              <p>{school.name} · Pelajar: {st.name}</p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <PlanGate feature="laporanPDF" plan={school?.plan ?? "Percubaan"}>
                <button className="btn btn-primary" onClick={async () => {
                  await SlipPrestasiService.generatePdf(st.id);
                }}>
                  <Icon name="print" size={15} /> Cetak Slip Prestasi
                </button>
              </PlanGate>
            </div>
          </div>

          {/* Render Tab Contents */}
          {tab === "dash" && (
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 348px", gap: 22, alignItems: "start" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 22, minWidth: 0 }}>
                {/* Stats Row */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
                  <StatCard icon="book" label="Juzuk Semasa" value={"Juz " + st.juzuk} sub={"Surah " + st.surah} />
                  <StatCard icon="check" label="Hafazan Terakhir" value={st.lastHafazan} sub={st.lastHafazanSurah} tone="hafazan" />
                  <StatCard icon="eye" label="Bacaan Semasa" value={st.frontier} sub={st.surah} tone="bacaan" />
                  <StatCard icon="award" label="Jumlah Progres" value={st.progress + "%"} sub={st.frontier + " / 604 m.s."} tone="murajaah" />
                </div>

                {/* Progress Grid Card Preview */}
                <div className="card" style={{ padding: 22 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800 }}>Grid Progres Maqra'</h3>
                      <p style={{ margin: "3px 0 0", fontSize: "12.5px", color: "var(--ink-3)" }}>604 muka surat · klik petak sel untuk info terperinci</p>
                    </div>
                    <span className="badge"><Icon name="info" size={13} /> Petunjuk warna di bawah</span>
                  </div>
                  <div style={{ marginBottom: 16 }}><Legend /></div>
                  <PageGrid statusMap={st.statusMap} columns={columns} onCellClick={setCell} />
                  <hr className="divider" style={{ margin: "18px 0 14px" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12.5px", color: "var(--ink-3)" }}>
                    <span>Progres semasa: {st.frontier} / 604 halaman</span>
                    <span className="mono">{st.progress}%</span>
                  </div>
                </div>
              </div>

              {/* Right rail widgets */}
              <div style={{ display: "flex", flexDirection: "column", gap: 22, position: "sticky", top: 0 }}>
                <PlanGate feature="analitikPenuh" plan={school?.plan ?? "Percubaan"}>
                  <KhatamMini st={st} onOpen={() => setTab("analitik")} />
                </PlanGate>
                
                <div className="card" style={{ padding: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>Log Aktiviti Terkini</h3>
                    <span className="mono" style={{ fontSize: 12, color: "var(--ink-3)" }}>{history.length} rekod</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {history.slice(0, 4).map((h) => <HistoryItem key={h.id} h={h} />)}
                  </div>
                </div>

                <PlanGate feature="sijilPDF" plan={school?.plan ?? "Percubaan"}>
                  <SijilCard st={st} onOpen={triggerSijilDownload} />
                </PlanGate>
                <RujukanCard />
              </div>
            </div>
          )}

          {tab === "analitik" && <Analitik st={st} plan={school?.plan ?? "Percubaan"} />}
          
          {tab === "profil" && <ProfilAnak st={st} school={school} />}
          
          {tab === "grid" && <ProgressGrid st={st} columns={columns} onCell={setCell} />}
          
          {tab === "log" && <HistoryLog st={st} historyList={history} />}

        </div>
      </main>

      {/* Page cell Detail Popover */}
      {cell && (
        <CellDetail 
          st={st} 
          page={cell} 
          onClose={() => setCell(null)} 
          historyList={history}
        />
      )}
    </div>
  );
}

// Cell Detail Popup Read-Only
function CellDetail({ st, page, onClose, historyList }) {
  const s = st.statusMap[page] || "belum";
  const rec = historyList.find((h) => page >= h.from && page <= h.to);

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <h3>Muka Surat {page}</h3>
            <p>Halaman Quran Tahfiz</p>
          </div>
          <button className="iconbtn" onClick={onClose}><Icon name="x" size={18} /></button>
        </div>
        <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "space-between" }}>
            <span style={{ color: "var(--ink-3)", fontSize: 13 }}>Status Sematan</span>
            <span className="badge" style={{ fontWeight: 700 }}>{s.toUpperCase()}</span>
          </div>
          {rec ? (
            <div style={{ background: "var(--surface-2)", border: "1px solid var(--line)", borderRadius: 12, padding: 14, display: "flex", flexDirection: "column", gap: 9 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="mono" style={{ fontSize: 12, color: "var(--ink-3)" }}>
                  {new Date(rec.date).toLocaleDateString("ms-MY", { day: "numeric", month: "short", year: "numeric" })}
                </span>
                <GredBadge g={rec.gred} />
              </div>
              <Row k="Kategori" v={rec.kategori} />
              <Row k="Ulasan" v={rec.ulasan} />
              <Row k="Masalah" v={rec.masalah || "—"} />
              <Row k="Cadangan" v={rec.cadangan || "Teruskan usaha."} />
              <Row k="Asatizah" v={rec.guru} />
            </div>
          ) : (
            <div className="empty" style={{ padding: "26px 10px" }}>
              <Icon name="info" size={26} />
              <div style={{ marginTop: 6, fontSize: 13 }}>Belum ada rekod tasmik khusus untuk muka surat ini.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }) {
  return (
    <div style={{ display: "flex", gap: 12, fontSize: 13 }}>
      <span style={{ color: "var(--ink-3)", width: 78, flex: "none" }}>{k}</span>
      <span style={{ fontWeight: 600, color: "var(--ink)" }}>{v}</span>
    </div>
  );
}
