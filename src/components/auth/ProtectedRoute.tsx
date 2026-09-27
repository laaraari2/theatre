import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../../services/authService';
import { getCurrentRole, isSupabaseConfigured } from '../../services/supabaseAuthService';

/**
 * يحمي لوحة الأستاذ. عند تفعيل Supabase يجب أن يكون الحساب admin.
 * تبقى الجلسة المحلية القديمة صالحة فقط في وضع التوافق قبل إعداد Supabase.
 */
export default function ProtectedRoute() {
  const [state, setState] = useState<'loading' | 'allowed' | 'denied'>(
    isSupabaseConfigured() ? 'loading' : (isAuthenticated() ? 'allowed' : 'denied'),
  );

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    let active = true;
    getCurrentRole().then(role => {
      if (active) setState(role === 'admin' ? 'allowed' : 'denied');
    }).catch(() => {
      if (active) setState('denied');
    });

    return () => {
      active = false;
    };
  }, []);

  if (state === 'loading') {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center text-text-muted">
        جاري التحقق من صلاحية الأستاذ...
      </div>
    );
  }

  if (state === 'denied') {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
