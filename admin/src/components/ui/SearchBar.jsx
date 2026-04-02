import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

const SearchBar = ({ onSearch, placeholder = 'Search...', className = '' }) => {
  const [query, setQuery] = useState('');
  const debounced = useDebounce(query, 400);

  useEffect(() => {
    onSearch(debounced);
  }, [debounced, onSearch]);

  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
           className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500">
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.35-4.35" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="admin-input pl-9 pr-4 h-10 w-full"
      />
      {query && (
        <button
          onClick={() => setQuery('')}
          className="absolute right-3 top-1/2 -translate-y-1/2
                     text-slate-500 hover:text-slate-300 transition-colors"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default SearchBar;