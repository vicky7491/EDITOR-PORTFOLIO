import { lazy, Suspense, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import Navbar         from '@/components/common/Navbar';
import Footer         from '@/components/common/Footer';
import CustomCursor   from '@/components/common/CustomCursor';
import ScrollProgress from '@/components/common/ScrollProgress';
import LoadingScreen  from '@/components/common/LoadingScreen';
import { pageTransition } from '@/utils/motion';

const Home          = lazy(() => import('@/pages/Home'));
const About         = lazy(() => import('@/pages/About'));
const Portfolio     = lazy(() => import('@/pages/Portfolio'));
const ProjectDetail = lazy(() => import('@/pages/ProjectDetail'));
const Services      = lazy(() => import('@/pages/Services'));
const Testimonials  = lazy(() => import('@/pages/Testimonials'));
const Contact       = lazy(() => import('@/pages/Contact'));

const PageFallback = () => (
  <div className="min-h-screen bg-night-900 flex items-center justify-center">
    <div className="w-8 h-8 rounded-full border-2 border-violet-500
                    border-t-transparent animate-spin"/>
  </div>
);

const App = () => {
  const [loaded,   setLoaded]   = useState(true);
  const location = useLocation();

  if (!loaded) {
    return <LoadingScreen onComplete={() => setLoaded(true)}/>;
  }

  return (
    <>
      <CustomCursor/>
      <ScrollProgress/>
      <Navbar/>

      <Suspense fallback={<PageFallback/>}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageTransition}
          >
            <Routes location={location}>
              <Route path="/"              element={<Home/>}/>
              <Route path="/about"         element={<About/>}/>
              <Route path="/portfolio"     element={<Portfolio/>}/>
              <Route path="/portfolio/:slug" element={<ProjectDetail/>}/>
              <Route path="/services"      element={<Services/>}/>
              <Route path="/testimonials"  element={<Testimonials/>}/>
              <Route path="/contact"       element={<Contact/>}/>
            </Routes>
          </motion.div>
        </AnimatePresence>
      </Suspense>

      <Footer/>
    </>
  );
};

export default App;