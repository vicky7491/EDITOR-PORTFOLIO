import { motion } from 'framer-motion';
import Sidebar from './Sidebar';

const MobileSidebar = ({ onClose }) => {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed left-0 top-0 bottom-0 w-64 z-50 lg:hidden"
      >
        <Sidebar onClose={onClose} />
      </motion.div>
    </>
  );
};

export default MobileSidebar;