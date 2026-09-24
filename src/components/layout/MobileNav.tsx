import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Calendar, GraduationCap, Clapperboard, MoreHorizontal, ClipboardList, BookOpen, BarChart3, TreePalm, Settings, X } from 'lucide-react';

const mainItems = [
  { to: '/admin', label: 'الرئيسية', icon: Home },
  { to: '/admin/schedule', label: 'الحصص', icon: Calendar },
  { to: '/admin/training', label: 'التداريب', icon: GraduationCap },
  { to: '/admin/scripts', label: 'النصوص', icon: Clapperboard },
];

const moreItems = [
  { to: '/admin/training-log', label: 'سجل التداريب', icon: ClipboardList },
  { to: '/admin/program', label: 'البرنامج السنوي', icon: BookOpen },
  { to: '/admin/reports', label: 'التقارير', icon: BarChart3 },
  { to: '/admin/holidays', label: 'العطل المدرسية', icon: TreePalm },
  { to: '/admin/settings', label: 'الإعدادات', icon: Settings },
];

export default function MobileNav() {
  const [showMore, setShowMore] = useState(false);

  return (
    <>
      {/* More menu overlay */}
      {showMore && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setShowMore(false)}>
          <div className="fixed inset-0 bg-black/30" />
          <div className="fixed bottom-16 start-2 end-2 bg-white rounded-2xl shadow-xl z-50 p-3">
            <div className="flex items-center justify-between mb-2 px-2">
              <span className="font-semibold text-text">المزيد</span>
              <button onClick={() => setShowMore(false)}><X size={18} className="text-text-muted" /></button>
            </div>
            {moreItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setShowMore(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm ${
                    isActive ? 'bg-primary/10 text-primary font-semibold' : 'text-text-muted'
                  }`
                }
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      )}

      {/* Bottom nav bar */}
      <nav className="fixed bottom-0 start-0 end-0 bg-white border-t border-border z-40 md:hidden no-print">
        <div className="flex items-center justify-around py-2">
          {mainItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-3 py-1 text-xs ${
                  isActive ? 'text-primary' : 'text-text-muted'
                }`
              }
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
          <button
            onClick={() => setShowMore(true)}
            className="flex flex-col items-center gap-0.5 px-3 py-1 text-xs text-text-muted"
          >
            <MoreHorizontal size={20} />
            <span>المزيد</span>
          </button>
        </div>
      </nav>
    </>
  );
}
