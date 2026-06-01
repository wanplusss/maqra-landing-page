/* ===========================================================================
   Maqra — root app: browser chrome, persona routing, tweaks
   =========================================================================== */

const DENSITY = { padat: 28, sederhana: 20, lapang: 15 };const ACCENTS = {
  "#2f7d57": "oklch(0.52 0.090 158)",  // pine emerald
  "#0f7d72": "oklch(0.52 0.085 188)",  // teal
  "#3f5bd6": "oklch(0.52 0.130 268)",  // indigo
  "#7a4fd0": "oklch(0.53 0.140 300)",  // plum
};
const FONTS = {
  "Plus Jakarta Sans": '"Plus Jakarta Sans", system-ui, sans-serif',
  "Hanken Grotesk": '"Hanken Grotesk", system-ui, sans-serif',
  "Be Vietnam Pro": '"Be Vietnam Pro", system-ui, sans-serif',
};

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#2f7d57",
  "density": "sederhana",
  "dark": false,
  "font": "Plus Jakarta Sans"
}/*EDITMODE-END*/;

function Chrome({ persona, setPersona, path }) {  const personas = [
    { key: "parent", label: "Ibu Bapa", icon: "users" },
    { key: "teacher", label: "Guru", icon: "cap" },
    { key: "admin", label: "Admin", icon: "shield" },
    { key: "owner", label: "Pemilik", icon: "globe" },
  ];
  const isOwner = persona === "owner";
  return (
    <div className="chrome">
      <div className="chrome-dots"><i /><i /><i /></div>
      <div className="urlbar">
        <span className="lock"><Icon name="lock" size={13} /></span>
        <span className="url">
          {isOwner ? (
            <><span className="dim">maqra.app</span><span className="hot">/platform</span><span className="dim">{path}</span></>
          ) : (
            <><span className="dim">maqra.app/school/</span><span className="hot">{MAQRA.school.slug}</span><span className="dim">{path}</span></>
          )}
        </span>
      </div>
      <div className="persona">
        {personas.map((p) => (
          <button key={p.key} className={persona === p.key ? "on" : ""} onClick={() => setPersona(p.key)}>
            <Icon name={p.icon} size={15} />{p.label}
          </button>
        ))}
      </div>
    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(p) { super(p); this.state = { err: null }; }
  static getDerivedStateFromError(err) { return { err }; }
  componentDidUpdate(pp) { if (pp.flowKey !== this.props.flowKey && this.state.err) this.setState({ err: null }); }
  render() {
    if (this.state.err) return (
      <div style={{ display: "grid", placeItems: "center", minHeight: "60vh", padding: 30 }}>
        <div className="card" style={{ padding: 28, maxWidth: 440, textAlign: "center" }}>
          <Icon name="info" size={28} style={{ color: "var(--st-syahadah-ink)" }} />
          <h3 style={{ margin: "10px 0 6px", fontSize: 17, fontWeight: 800 }}>Ralat memaparkan halaman</h3>
          <p style={{ margin: "0 0 16px", fontSize: 13, color: "var(--ink-3)" }}>{String(this.state.err && this.state.err.message || this.state.err)}</p>
          <button className="btn btn-primary" style={{ margin: "0 auto" }} onClick={() => this.setState({ err: null })}>Cuba semula</button>
        </div>
      </div>
    );
    return this.props.children;
  }
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [persona, setPersona] = React.useState("parent");
  const [path, setPath] = React.useState("");
  const isMobile = useIsMobile();

  // apply tweaks to document
  React.useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--accent", ACCENTS[t.accent] || ACCENTS["#2f7d57"]);
    root.style.setProperty("--font-ui", FONTS[t.font] || FONTS["Plus Jakarta Sans"]);
    root.setAttribute("data-theme", t.dark ? "dark" : "light");
  }, [t.accent, t.font, t.dark]);

  const columns = isMobile ? 13 : (DENSITY[t.density] || 20);

  return (
    <div className="app">
      <Chrome persona={persona} setPersona={(p) => { setPersona(p); setPath(""); }} path={path} />
      <div className="viewport scroll">
        <ErrorBoundary flowKey={persona}>
          {persona === "parent" && <ParentFlow key="p" columns={columns} setPath={setPath} />}
          {persona === "teacher" && <TeacherFlow key="t" columns={columns} setPath={setPath} />}
          {persona === "admin" && <AdminFlow key="a" setPath={setPath} />}
          {persona === "owner" && <SuperAdminFlow key="o" setPath={setPath} />}
        </ErrorBoundary>
      </div>

      <TweaksPanel>
        <TweakSection label="Jenama & Warna" />
        <TweakColor label="Warna aksen" value={t.accent}
          options={Object.keys(ACCENTS)} onChange={(v) => setTweak("accent", v)} />
        <TweakToggle label="Mod gelap" value={t.dark} onChange={(v) => setTweak("dark", v)} />
        <TweakSection label="Tipografi" />
        <TweakSelect label="Fon antara muka" value={t.font}
          options={Object.keys(FONTS)} onChange={(v) => setTweak("font", v)} />
        <TweakSection label="Grid 604 Muka Surat" />
        <TweakRadio label="Kepadatan" value={t.density}
          options={["padat", "sederhana", "lapang"]} onChange={(v) => setTweak("density", v)} />
        <div style={{ fontSize: 11.5, color: "var(--ink-3)", padding: "2px 2px 0", lineHeight: 1.5 }}>
          {columns} petak setiap baris
        </div>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
