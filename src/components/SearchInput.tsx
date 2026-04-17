/* ID-START: SEA_UI_001 */
import React from 'react';
import { Search } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (val: string) => void;
  onSearch: () => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, onSearch }) => {
  const handleKeyEntry = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') onSearch();
  };

  return (
    <div className="w-full relative flex items-center mb-6">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyEntry}
        placeholder="Vyhledat média (YT, FB, IG...)"
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-lg font-medium text-white placeholder:text-white/20 focus:outline-none focus:border-green-500/50 transition-all"
      />
      <button 
        onClick={onSearch}
        className="absolute right-3 p-2 bg-green-500 rounded-lg text-black hover:bg-green-400 transition-colors"
      >
        <Search size={24} />
      </button>
    </div>
  );
};
/* ID-END: SEA_UI_001 */
