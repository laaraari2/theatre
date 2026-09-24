import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
  subtitle?: string;
}

export default function StatCard({ title, value, icon, color = 'text-primary', subtitle }: StatCardProps) {
  return (
    <div className="bg-bg-card rounded-xl shadow-sm border border-border p-4 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color} bg-primary/10`}>
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold text-text">{value}</div>
        <div className="text-sm text-text-muted">{title}</div>
        {subtitle && <div className="text-xs text-text-muted mt-0.5">{subtitle}</div>}
      </div>
    </div>
  );
}
