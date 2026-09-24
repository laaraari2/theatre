import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = 'بحث...' }: SearchBarProps) {
  return (
    <div className="relative">
      <Search size={18} className="absolute top-1/2 -translate-y-1/2 start-3 text-text-muted" />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border ps-10 pe-4 py-2.5 text-text bg-white focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-colors"
      />
    </div>
  );
}
