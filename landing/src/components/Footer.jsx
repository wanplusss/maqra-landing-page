import { Wordmark } from './Wordmark.jsx';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <Wordmark light />
        <p>© {year} Maqra&apos;. Hak cipta terpelihara.</p>
      </div>
    </footer>
  );
}
