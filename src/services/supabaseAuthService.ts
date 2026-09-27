const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/$/, '');
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const STORAGE_KEY = 'masrahi_supabase_session';

export type AppRole = 'admin' | 'director' | 'visitor';

export interface SupabaseSession {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
  user: {
    id: string;
    email?: string;
  };
}

export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_KEY);
}

function getStoredSession(): SupabaseSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SupabaseSession) : null;
  } catch {
    return null;
  }
}

function saveSession(session: SupabaseSession): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearSupabaseSession(): void {
  localStorage.removeItem(STORAGE_KEY);
}

async function authRequest(path: string, body?: Record<string, unknown>): Promise<any> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase غير مهيأ بعد. أضف VITE_SUPABASE_URL و VITE_SUPABASE_PUBLISHABLE_KEY.');
  }

  const response = await fetch(`${SUPABASE_URL}/auth/v1/${path}`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.msg || payload?.message || payload?.error_description || 'تعذر تسجيل الدخول');
  }
  return payload;
}

async function refreshSession(session: SupabaseSession): Promise<SupabaseSession | null> {
  try {
    const payload = await authRequest('token?grant_type=refresh_token', {
      refresh_token: session.refresh_token,
    });

    const next: SupabaseSession = {
      access_token: payload.access_token,
      refresh_token: payload.refresh_token || session.refresh_token,
      expires_at: payload.expires_at,
      user: payload.user || session.user,
    };
    saveSession(next);
    return next;
  } catch {
    clearSupabaseSession();
    return null;
  }
}

export async function getSupabaseSession(): Promise<SupabaseSession | null> {
  if (!isSupabaseConfigured()) return null;

  const session = getStoredSession();
  if (!session) return null;

  const expiresAt = session.expires_at ? session.expires_at * 1000 : 0;
  const shouldRefresh = expiresAt > 0 && Date.now() >= expiresAt - 60_000;

  return shouldRefresh ? refreshSession(session) : session;
}

export async function loginWithSupabase(
  email: string,
  password: string,
): Promise<{ success: boolean; role?: AppRole; error?: string }> {
  try {
    const payload = await authRequest('token?grant_type=password', { email, password });
    if (!payload?.access_token || !payload?.user?.id) {
      return { success: false, error: 'لم يتم إنشاء جلسة صالحة.' };
    }

    const session: SupabaseSession = {
      access_token: payload.access_token,
      refresh_token: payload.refresh_token,
      expires_at: payload.expires_at,
      user: { id: payload.user.id, email: payload.user.email },
    };
    saveSession(session);

    const role = await getCurrentRole();
    if (role !== 'director' && role !== 'admin') {
      clearSupabaseSession();
      return { success: false, error: 'هذا الحساب لا يملك صلاحية الدخول.' };
    }

    return { success: true, role };
  } catch (error) {
    clearSupabaseSession();
    return {
      success: false,
      error: error instanceof Error ? error.message : 'بيانات الدخول غير صحيحة.',
    };
  }
}

export async function getCurrentRole(): Promise<AppRole> {
  const session = await getSupabaseSession();
  if (!session || !isSupabaseConfigured()) return 'visitor';

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/profiles?id=eq.${encodeURIComponent(session.user.id)}&select=role,full_name`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${session.access_token}`,
      },
    },
  );

  if (!response.ok) return 'visitor';

  const rows = await response.json().catch(() => []);
  const role = rows?.[0]?.role;
  return role === 'admin' || role === 'director' ? role : 'visitor';
}

export async function getCurrentProfile(): Promise<{ id: string; role: AppRole; fullName: string } | null> {
  const session = await getSupabaseSession();
  if (!session || !isSupabaseConfigured()) return null;

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/profiles?id=eq.${encodeURIComponent(session.user.id)}&select=id,role,full_name`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${session.access_token}`,
      },
    },
  );

  if (!response.ok) return null;

  const rows = await response.json().catch(() => []);
  const row = rows?.[0];
  if (!row || !['admin', 'director'].includes(row.role)) return null;

  return {
    id: row.id,
    role: row.role as AppRole,
    fullName: row.full_name || '',
  };
}

export async function logoutSupabase(): Promise<void> {
  const session = getStoredSession();
  if (session && isSupabaseConfigured()) {
    try {
      await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${session.access_token}`,
        },
      });
    } catch {
      // Continue clearing the local session even if the remote logout fails.
    }
  }
  clearSupabaseSession();
}

export async function supabaseRestRequest<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const session = await getSupabaseSession();
  if (!session || !isSupabaseConfigured()) {
    throw new Error('لا توجد جلسة Supabase صالحة.');
  }

  const isReadRequest = !options.method || options.method.toUpperCase() === 'GET';
  const requestPath = isReadRequest
    ? `${path}${path.includes('?') ? '&' : '?'}_ts=${Date.now()}`
    : path;

  const response = await fetch(`${SUPABASE_URL}/rest/v1/${requestPath}`, {
    ...options,
    cache: isReadRequest ? 'no-store' : options.cache,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.message || payload?.details || 'تعذر الوصول إلى قاعدة البيانات.');
  }
  return payload as T;
}
