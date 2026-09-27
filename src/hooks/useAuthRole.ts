import { useEffect, useState } from 'react';
import { isAuthenticated } from '../services/authService';
import { getCurrentRole, type AppRole } from '../services/supabaseAuthService';

export function useAuthRole(): { role: AppRole; loading: boolean } {
  const [role, setRole] = useState<AppRole>('visitor');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const supabaseRole = await getCurrentRole();
        if (!active) return;

        if (supabaseRole !== 'visitor') {
          setRole(supabaseRole);
        } else if (isAuthenticated()) {
          // Backwards-compatible local teacher/admin session.
          setRole('admin');
        } else {
          setRole('visitor');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, []);

  return { role, loading };
}
