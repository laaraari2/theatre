import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Calendar, GraduationCap, Clapperboard, MoreHorizontal, ClipboardList, BookOpen, BarChart3, TreePalm, Settings, X, Eye, LogOut } from 'lucide-react';
import { logout } from '../../services/authService';

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
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

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

            {/* Divider */}
            <div className="border-t border-border my-1" />

            {/* Preview site */}
            <NavLink
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setShowMore(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-accent font-semibold bg-accent/5 hover:bg-accent/10 transition-colors"
            >
              <Eye size={20} />
              <span>معاينة الموقع</span>
              <span className="text-xs text-accent/50 mr-auto">(تبويب جديد)</span>
            </NavLink>

            {/* Logout */}
            <button
              onClick={() => { setShowMore(false); handleLogout(); }}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm text-red-600 font-medium hover:bg-red-50 transition-colors"
            >
              <LogOut size={20} />
              <span>تسجيل الخروج</span>
            </button>
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
