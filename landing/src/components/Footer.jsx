export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span className="wordmark">
          <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="6" fill="#059669"/>
            <text x="5" y="21" fontSize="18" fill="white" fontFamily="serif">م</text>
          </svg>
          Maqra
        </span>
        <p>© {year} Maqra. Hak cipta terpelihara.</p>
      </div>
    </footer>
  );
}
