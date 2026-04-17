/* ID-START: GUI_TSX_002 */
import { useState } from 'react';
import { motion } from 'motion/react';
import { loginAsAdmin, loginAsHost } from '../AuthStore';

export const LoginPage = () => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);

  const handleAdminLogin = () => {
    const res = loginAsAdmin(user, pass);
    if (res) window.location.hash = '/hub';
    else setError(true);
  };

  const handleHostLogin = () => {
    loginAsHost();
    window.location.hash = '/search';
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm bg-white/5 p-8 rounded-xl border border-white/10 backdrop-blur-xl"
      >
        <h2 className="text-xl font-bold uppercase tracking-widest mb-8 text-center">Identita</h2>
        
        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase opacity-40 font-bold ml-1">Uživatel</label>
            <input 
              type="text" 
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="bg-black border border-white/10 p-3 rounded text-sm focus:border-green-500 outline-none transition-colors"
              placeholder="Mallfurion"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase opacity-40 font-bold ml-1">Heslo</label>
            <input 
              type="password" 
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="bg-black border border-white/10 p-3 rounded text-sm focus:border-green-500 outline-none transition-colors"
              placeholder="••••"
            />
          </div>
        </div>

        {error && <p className="text-[10px] text-red-500 uppercase mt-4 text-center">Chybný přístup synchronizace</p>}

        <button 
          onClick={handleAdminLogin}
          className="w-full mt-8 bg-green-600 hover:bg-green-500 text-black font-black p-4 rounded text-xs uppercase tracking-widest transition-all"
        >
          AUTORIZOVAT ADMINA
        </button>

        <button 
          onClick={handleHostLogin}
          className="w-full mt-3 bg-white/5 hover:bg-white/10 text-white font-bold p-4 rounded text-[10px] uppercase tracking-widest transition-all border border-white/10"
        >
          VSTUP JAKO HOST
        </button>
      </motion.div>
    </div>
  );
};
/* ID-END: GUI_TSX_002 */
