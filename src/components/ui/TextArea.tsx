import React from 'react';

interface TextAreaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}

export default function TextArea({ label, value, onChange, placeholder, rows = 3, required }: TextAreaProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-text mb-1">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        required={required}
        className="w-full rounded-lg border border-border p-3 text-text bg-white resize-y focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-colors"
      />
    </div>
  );
}
