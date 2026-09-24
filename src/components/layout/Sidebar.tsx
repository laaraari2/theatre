import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Clapperboard, Calendar, GraduationCap, ClipboardList, BookOpen, BarChart3, TreePalm, Settings } from 'lucide-react';

const navItems = [
  { to: '/', label: 'الرئيسية', icon: Home },
  { to: '/scripts', label: 'النصوص المسرحية', icon: Clapperboard },
  { to: '/schedule', label: 'جدول الحصص', icon: Calendar },
  { to: '/training', label: 'جدول التداريب', icon: GraduationCap },
  { to: '/training-log', label: 'سجل التداريب', icon: ClipboardList },
  { to: '/program', label: 'البرنامج السنوي', icon: BookOpen },
  { to: '/reports', label: 'التقارير', icon: BarChart3 },
  { to: '/holidays', label: 'العطل المدرسية', icon: TreePalm },
  { to: '/settings', label: 'الإعدادات', icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-bg-card border-s border-border h-screen sticky top-0 shrink-0">
      {/* Logo */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🎭</span>
          <div>
            <div className="text-xl font-bold text-primary">مسرحي</div>
            <div className="text-xs text-text-muted">دفتر أستاذ المسرح</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-3 text-sm transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary border-e-4 border-primary font-semibold'
                  : 'text-text-muted hover:bg-gray-50 hover:text-text'
              }`
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-2">
        <NavLink
          to="/site"
          className="flex items-center justify-center gap-2 text-xs bg-primary/10 text-primary px-3 py-2 rounded-lg hover:bg-primary/20 transition-colors font-medium"
        >
          🌐 <span>موقع الزوار</span>
        </NavLink>
        <div className="text-center text-xs text-text-muted">
          السنة الدراسية 2026/2027
        </div>
      </div>
    </aside>
  );
}
