import { Wordmark } from './Wordmark.jsx';

export function Navbar() {
  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Wordmark />
        <a href="#demo" className="btn-primary">Minta Demo</a>
      </div>
    </nav>
  );
}
