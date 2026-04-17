/* ID-START: SYN_CORE_V2_INIT */
import React from 'react';
import { generateGSyncPacket, copyToClipboard } from '../SyncController';

export const GsyncButton: React.FC<{ state: any }> = ({ state }) => {
  const handleSync = () => {
    const packet = generateGSyncPacket(state);
    copyToClipboard(packet);
  };

  return (
    <button
      onClick={handleSync}
      className="w-full py-4 bg-green-600 text-white font-bold uppercase tracking-widest rounded-lg hover:bg-green-500 transition-all border-b-4 border-green-800 active:border-b-0 active:translate-y-1"
    >
      MANUÁLNÍ G-SYNC ULTRA V2
    </button>
  );
};
/* ID-END: SYN_CORE_V2_INIT */
