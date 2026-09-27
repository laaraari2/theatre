import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { isSupabaseConfigured, loginWithSupabase } from '../services/supabaseAuthService';
import { Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isSupabaseConfigured()) {
      const result = await loginWithSupabase(email, password);
      setLoading(false);
      if (result.success) {
        navigate(result.role === 'director' ? '/' : '/admin', { replace: true });
      } else {
        setError(result.error || 'بيانات الدخول غير صحيحة.');
        setShake(true);
        setTimeout(() => setShake(false), 600);
        setPassword('');
      }
      return;
    }

    const ok = await login(password);
    setLoading(false);

    if (ok) {
      navigate('/admin', { replace: true });
    } else {
      setError('كلمة المرور غير صحيحة. يُرجى المحاولة مجدداً.');
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setPassword('');
    }
  };

  return (
    <div className="login-bg">
      {/* Decorative blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      <div className={`login-card ${shake ? 'shake' : ''}`}>
        {/* Logo / Brand */}
        <div className="login-brand">
          <div className="login-icon-wrap overflow-hidden rounded-full">
            <img
              src="/laaraari.jpeg"
              alt="الأستاذ مصطفى لعرعري"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="login-title">مسرحي</h1>
          <p className="login-subtitle">{isSupabaseConfigured() ? 'دخول الأستاذ أو المدير' : 'لوحة تحكم الأستاذ'}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form">
          {isSupabaseConfigured() && (
            <div className="login-field">
              <label htmlFor="email" className="login-label">البريد الإلكتروني</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="login-input"
                required
              />
            </div>
          )}

          <div className="login-field">
            <label htmlFor="password" className="login-label">
              <Lock size={14} />
              كلمة المرور
            </label>
            <div className="login-input-wrap">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="أدخل كلمة المرور"
                className="login-input"
                autoFocus
                required
              />
              <button
                type="button"
                className="login-eye"
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? 'إخفاء' : 'إظهار'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="login-error" role="alert">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            className="login-btn"
            disabled={loading || !password}
          >
            {loading ? (
              <span className="login-spinner" />
            ) : (
              isSupabaseConfigured() ? 'دخول' : 'دخول إلى لوحة التحكم'
            )}
          </button>
        </form>

        {/* Hint */}
        {!isSupabaseConfigured() && (
          <p className="login-hint">
            كلمة المرور الافتراضية: <code>admin123</code>
          </p>
        )}
      </div>
    </div>
  );
}
