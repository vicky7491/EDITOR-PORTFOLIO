import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import Sidebar       from './Sidebar';
import TopBar        from './TopBar';
import MobileSidebar from './MobileSidebar';

const AdminLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-surface-950 overflow-hidden">

      {/* Desktop sidebar — always visible ≥ lg */}
      <div className="hidden lg:flex lg:w-64 lg:shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar — overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <MobileSidebar onClose={() => setMobileSidebarOpen(false)} />
        )}
      </AnimatePresence>

      {/* Main content area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* Top bar */}
        <TopBar onMenuClick={() => setMobileSidebarOpen(true)} />

        {/* Page content with scroll */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="p-6 max-w-7xl mx-auto"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;