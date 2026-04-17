/* ID-START: GUI_TSX_003 */
import { motion } from 'motion/react';

export const SearchPage = () => {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-4 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <h1 className="text-xl font-black uppercase tracking-widest text-green-500 mb-2">Search Core</h1>
        <p className="text-[10px] uppercase opacity-40">System ready / Maintenance Mode</p>
        <button 
          onClick={() => window.location.hash = '/hub'}
          className="mt-8 px-6 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] uppercase hover:bg-white/10"
        >
          ← Back to Hub
        </button>
      </motion.div>
    </div>
  );
};
/* ID-END: GUI_TSX_003 */
