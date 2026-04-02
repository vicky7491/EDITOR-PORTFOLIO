import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Portfolio from './pages/Portfolio';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

export default function App() {
  return <div className="min-h-screen bg-background text-white"><Navbar /><Routes><Route path="/" element={<Home />} /><Route path="/about" element={<About />} /><Route path="/portfolio" element={<Portfolio />} /><Route path="/services" element={<Services />} /><Route path="/contact" element={<Contact />} /></Routes><Footer /></div>;
}
