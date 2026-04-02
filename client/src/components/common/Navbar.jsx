import { Link } from 'react-router-dom';
export default function Navbar() {
  return <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur"><div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4"><Link to="/" className="text-xl font-bold">EditorX</Link><div className="flex gap-4 text-sm"><Link to="/about">About</Link><Link to="/portfolio">Portfolio</Link><Link to="/services">Services</Link><Link to="/contact">Contact</Link></div></div></nav>;
}
