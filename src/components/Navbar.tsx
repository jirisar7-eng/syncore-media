/* ID-START: GUI_NAVBAR_001 */
import React from 'react';
import { motion } from 'motion/react';
import { Home, Rocket, Search, Settings, ShieldCheck } from 'lucide-react';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const NavItem = ({ icon, label, active, onClick }: NavItemProps) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-all flex-1 py-1 ${active ? 'text-green-500 scale-110' : 'text-white/40 hover:text-white'}`}
  >
    <div className={`p-2 rounded-xl transition-all ${active ? 'bg-green-500/10' : 'bg-transparent'}`}>
      {React.cloneElement(icon as React.ReactElement, { size: 20 })}
    </div>
    <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

export const Navbar = () => {
  const currentHash = window.location.hash || '#/';
  
  const navigate = (hash: string) => {
    window.location.hash = hash;
  };

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-50">
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-black/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-2 flex items-center justify-around shadow-2xl shadow-black"
      >
        <NavItem 
          icon={<Home />} 
          label="Domů" 
          active={currentHash === '#/' || currentHash === '#/hub'} 
          onClick={() => navigate('/hub')} 
        />
        <NavItem 
          icon={<Rocket />} 
          label="Nasazení" 
          active={currentHash === '#/deploy'} 
          onClick={() => navigate('/deploy')} 
        />
        <NavItem 
          icon={<Search />} 
          label="Hledat" 
          active={currentHash === '#/search'} 
          onClick={() => navigate('/search')} 
        />
        <NavItem 
          icon={<Settings />} 
          label="Systém" 
          active={currentHash === '#/system'} 
          onClick={() => navigate('/system')} 
        />
      </motion.div>
    </nav>
  );
};
/* ID-END: GUI_NAVBAR_001 */
