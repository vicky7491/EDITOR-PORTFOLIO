import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';

import Navbar         from '@/components/common/Navbar';
import Footer         from '@/components/common/Footer';
import CustomCursor   from '@/components/common/CustomCursor';
import ScrollProgress from '@/components/common/ScrollProgress';
import LoadingScreen  from '@/components/common/LoadingScreen';
import useMediaQuery  from '@/hooks/useMediaQuery';

const Home          = lazy(() => import('@/pages/Home'));
const About         = lazy(() => import('@/pages/About'));
const Portfolio     = lazy(() => import('@/pages/Portfolio'));
const ProjectDetail = lazy(() => import('@/pages/ProjectDetail'));
const Services      = lazy(() => import('@/pages/Services'));
const Testimonials  = lazy(() => import('@/pages/Testimonials'));
const Contact       = lazy(() => import('@/pages/Contact'));

const PageFallback = () => (
  <div className="min-h-screen bg-night-900 flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-8 h-8 rounded-full border-2 border-violet-500
                      border-t-transparent animate-spin"/>
      <p className="text-xs text-slate-600 tracking-widest uppercase">Loading</p>
    </div>
  </div>
);

// Page transition variants
const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1, y: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0, y: -8,
    transition: { duration: 0.25, ease: 'easeIn' },
  },
};

const App = () => {
  const [loaded,     setLoaded]  = useState(true);
  const location  = useLocation();
  const isMobile  = useMediaQuery('(max-width: 768px)');

  if (!loaded) {
    return <LoadingScreen onComplete={() => setLoaded(true)}/>;
  }

  return (
    <>
      {/* Custom cursor — desktop only */}
      {!isMobile && <CustomCursor/>}

      {/* Scroll progress bar */}
      <ScrollProgress/>

      {/* Navigation */}
      <Navbar/>

      {/* Page routes with transitions */}
      <Suspense fallback={<PageFallback/>}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Routes location={location}>
              <Route path="/"               element={<Home/>}/>
              <Route path="/about"          element={<About/>}/>
              <Route path="/portfolio"      element={<Portfolio/>}/>
              <Route path="/portfolio/:slug" element={<ProjectDetail/>}/>
              <Route path="/services"       element={<Services/>}/>
              <Route path="/testimonials"   element={<Testimonials/>}/>
              <Route path="/contact"        element={<Contact/>}/>
            </Routes>
          </motion.div>
        </AnimatePresence>
      </Suspense>

      {/* Footer */}
      <Footer/>

      {/* Vercel Web Analytics */}
      <Analytics/>
    </>
  );
};

export default App;