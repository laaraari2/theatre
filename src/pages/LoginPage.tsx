import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { Lock, Eye, EyeOff, Theater } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

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
          <div className="login-icon-wrap">
            <Theater size={32} strokeWidth={1.5} />
          </div>
          <h1 className="login-title">مسرحي</h1>
          <p className="login-subtitle">لوحة تحكم الأستاذ</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form">
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
              'دخول إلى لوحة التحكم'
            )}
          </button>
        </form>

        {/* Hint */}
        <p className="login-hint">
          كلمة المرور الافتراضية: <code>admin123</code>
        </p>
      </div>
    </div>
  );
}
