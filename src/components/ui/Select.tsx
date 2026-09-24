import React from 'react';

interface SelectOption { value: string; label: string; }

interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
}

export default function Select({ label, value, onChange, options, placeholder, required }: SelectProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-text mb-1">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        required={required}
        className="w-full rounded-lg border border-border p-3 text-text bg-white focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-colors"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
