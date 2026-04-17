/* ID-START: GUI_COMP_002 */
import React, { ReactNode } from 'react';
import { motion } from 'motion/react';

interface HubCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  status?: string;
  onClick?: () => void;
}

export const HubCard: React.FC<HubCardProps> = ({ icon, title, description, status, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, border: '1px solid rgba(34, 197, 94, 0.4)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex items-center gap-6 cursor-pointer shadow-2xl transition-all"
    >
      <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center text-green-500 shadow-inner">
        {icon}
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-white font-bold text-sm uppercase tracking-wider">{title}</h3>
          {status && (
            <span className="text-[9px] px-2 py-0.5 bg-green-500/10 text-green-500 rounded-full font-black uppercase tracking-tighter">
              {status}
            </span>
          )}
        </div>
        <p className="text-white/40 text-[11px] leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
};
/* ID-END: GUI_COMP_002 */
