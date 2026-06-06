export function Navbar() {
  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <span className="wordmark">
          <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="6" fill="#059669"/>
            <text x="5" y="21" fontSize="18" fill="white" fontFamily="serif">م</text>
          </svg>
          Maqra
        </span>
        <a href="#demo" className="btn-primary">Minta Demo</a>
      </div>
    </nav>
  );
}
