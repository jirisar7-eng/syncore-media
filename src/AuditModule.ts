/* ID-START: SYN_CORE_V2_INIT */
export const checkFileLimits = (content: string, path: string): boolean => {
  const lines = content.split('\n').length;
  if (lines > 100) {
    console.warn(`SOUBOR ${path} PŘESAHUJE LIMIT 100 ŘÁDKŮ (${lines}). VYŽADOVÁNA FRAGMENTACE.`);
    return false;
  }
  return true;
};

export const logCommand = (id: string, sid: string, desc: string) => {
  console.log(`[AUDIT] ID: ${id} | SID: ${sid} | DESC: ${desc}`);
};
/* ID-END: SYN_CORE_V2_INIT */
