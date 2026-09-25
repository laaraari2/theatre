import { db } from '../db/database';

const SESSION_KEY = 'masrahi_auth_session';
const DEFAULT_PASSWORD = 'admin123';

// ======= SHA-256 hashing =======
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ======= Initialize admin password if not set =======
export async function initAdminAuth(): Promise<void> {
  const existing = await db.adminAuth.toCollection().first();
  if (!existing) {
    const hash = await hashPassword(DEFAULT_PASSWORD);
    await db.adminAuth.add({
      passwordHash: hash,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
}

// ======= Login =======
export async function login(password: string): Promise<boolean> {
  const auth = await db.adminAuth.toCollection().first();
  if (!auth) return false;

  const hash = await hashPassword(password);
  if (hash !== auth.passwordHash) return false;

  // Store session in sessionStorage
  sessionStorage.setItem(SESSION_KEY, 'true');
  return true;
}

// ======= Logout =======
export function logout(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

// ======= Check session =======
export function isAuthenticated(): boolean {
  return sessionStorage.getItem(SESSION_KEY) === 'true';
}

// ======= Change password =======
export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  const auth = await db.adminAuth.toCollection().first();
  if (!auth || !auth.id) return { success: false, error: 'لم يتم العثور على بيانات المصادقة' };

  const currentHash = await hashPassword(currentPassword);
  if (currentHash !== auth.passwordHash) {
    return { success: false, error: 'كلمة المرور الحالية غير صحيحة' };
  }

  if (newPassword.length < 6) {
    return { success: false, error: 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل' };
  }

  const newHash = await hashPassword(newPassword);
  await db.adminAuth.update(auth.id, {
    passwordHash: newHash,
    updatedAt: new Date().toISOString(),
  });

  return { success: true };
}
