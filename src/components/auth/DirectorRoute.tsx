import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getCurrentRole } from '../../services/supabaseAuthService';

export default function DirectorRoute() {
  const [state, setState] = useState<'loading' | 'allowed' | 'denied'>('loading');

  useEffect(() => {
    let active = true;
    getCurrentRole().then(role => {
      if (active) setState(role === 'director' ? 'allowed' : 'denied');
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
        جاري التحقق من صلاحية المدير...
      </div>
    );
  }

  if (state === 'denied') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
