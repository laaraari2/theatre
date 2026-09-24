import React from 'react';

interface MultiSelectOption { value: string; label: string; icon?: string; }

interface MultiSelectProps {
  label: string;
  options: MultiSelectOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}

export default function MultiSelect({ label, options, selectedValues, onChange }: MultiSelectProps) {
  const toggle = (val: string) => {
    onChange(
      selectedValues.includes(val)
        ? selectedValues.filter(v => v !== val)
        : [...selectedValues, val]
    );
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-text mb-2">{label}</label>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {options.map(o => {
          const selected = selectedValues.includes(o.value);
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => toggle(o.value)}
              className={`rounded-lg border px-3 py-2 text-sm text-start transition-colors ${
                selected
                  ? 'bg-primary/10 border-primary text-primary font-medium'
                  : 'bg-white border-border text-text-muted hover:border-gray-300'
              }`}
            >
              {o.icon && <span className="me-1">{o.icon}</span>}
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
