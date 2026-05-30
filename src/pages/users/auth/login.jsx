import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Sun, Moon, Zap, AlertCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import { ThemeContext } from '../../../context/ThemeContext';

export default function Login() {
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    setFieldErrors(fe => ({ ...fe, [name]: '' }));
    setError('');
  };

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = 'Email is required';
    if (!form.password) errs.password = 'Password is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }

    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/user/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email:    form.email,
          password: form.password,
          remember: form.remember,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      navigate('/dashboard');
    } catch (err) {
      if (err.message.toLowerCase().includes('verify')) {
        await Swal.fire({
          icon: 'warning',
          title: 'Email Not Verified',
          text: 'Please verify your email address before logging in.',
          background: isDarkMode ? '#1A1A20' : '#fff',
          color: isDarkMode ? '#F0EEE8' : '#111',
          confirmButtonColor: '#F5A623',
          confirmButtonText: 'Go to Verification',
        });
        navigate('/verify');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => { window.location.href = '/api/user/auth/google'; };
  const handleLinkedInLogin = () => { window.location.href = '/api/user/auth/linkedin'; };

  return (
    <div className={`rfx-auth-root ${isDarkMode ? 'dark' : 'light'}`}>
      {/* Background */}
      <div className="rfx-auth-bg">
        <div className="rfx-auth-bg-grid" />
        <div className="rfx-auth-bg-orb rfx-auth-bg-orb-1" />
        <div className="rfx-auth-bg-orb rfx-auth-bg-orb-2" />
        <div className="rfx-auth-bg-orb rfx-auth-bg-orb-3" />
        <div className="rfx-auth-bg-lines" />
      </div>

      {/* Theme Toggle */}
      <button className="rfx-theme-toggle" onClick={toggleDarkMode} aria-label="Toggle theme">
        {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <div className="rfx-auth-page">
        <div className="rfx-auth-card">
          {/* Brand */}
          <div className="rfx-auth-brand">
            <div className="rfx-auth-brand-logo"><Zap size={22} strokeWidth={2.5} /></div>
            <span className="rfx-auth-brand-name">REFORGE<span>X</span></span>
          </div>

          <h1 className="rfx-auth-heading">WELCOME<br /><span>BACK</span></h1>
          <p className="rfx-auth-subtext">
            Your comeback continues here. Sign in to your account.
          </p>

          {/* OAuth */}
          <div className="rfx-auth-oauth">
            <button className="rfx-auth-oauth-btn" onClick={handleGoogleLogin} type="button">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
            <button className="rfx-auth-oauth-btn" onClick={handleLinkedInLogin} type="button">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A66C2">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              Continue with LinkedIn
            </button>
          </div>

          <div className="rfx-auth-divider">
            <div className="rfx-auth-divider-line" />
            <span className="rfx-auth-divider-text">or sign in with email</span>
            <div className="rfx-auth-divider-line" />
          </div>

          {error && (
            <div className="rfx-auth-alert error">
              <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="rfx-auth-form-group">
              <label className="rfx-auth-label">Email Address</label>
              <div className="rfx-auth-input-wrap">
                <span className="rfx-auth-input-icon"><Mail size={15} /></span>
                <input
                  className={`rfx-auth-input${fieldErrors.email ? ' rfx-input-error' : ''}`}
                  type="email" name="email" placeholder="you@company.com"
                  value={form.email} onChange={handleChange} autoComplete="email"
                />
              </div>
              {fieldErrors.email && (
                <div className="rfx-auth-field-msg error"><AlertCircle size={11}/>{fieldErrors.email}</div>
              )}
            </div>

            {/* Password */}
            <div className="rfx-auth-form-group">
              <label className="rfx-auth-label">Password</label>
              <div className="rfx-auth-input-wrap">
                <span className="rfx-auth-input-icon"><Lock size={15} /></span>
                <input
                  className={`rfx-auth-input rfx-with-right-icon${fieldErrors.password ? ' rfx-input-error' : ''}`}
                  type={showPw ? 'text' : 'password'} name="password" placeholder="Your password"
                  value={form.password} onChange={handleChange} autoComplete="current-password"
                />
                <span className="rfx-auth-input-icon-right" onClick={() => setShowPw(v => !v)}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </span>
              </div>
              {fieldErrors.password && (
                <div className="rfx-auth-field-msg error"><AlertCircle size={11}/>{fieldErrors.password}</div>
              )}
            </div>

            {/* Remember + Forgot row */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 24 }}>
              <label style={{ display:'flex', alignItems:'center', gap:8, fontSize:13, color:'var(--rfx-text-secondary)', cursor:'pointer' }}>
                <input
                  type="checkbox" name="remember" checked={form.remember} onChange={handleChange}
                  style={{ accentColor:'var(--rfx-amber)', width:15, height:15 }}
                />
                Remember me
              </label>
              <Link to="/forgot-password" style={{ fontSize:13, color:'var(--rfx-text-secondary)', textDecoration:'none', transition:'color 0.25s' }}
                onMouseEnter={e => e.target.style.color='var(--rfx-amber)'}
                onMouseLeave={e => e.target.style.color='var(--rfx-text-secondary)'}
              >
                Forgot password?
              </Link>
            </div>

            <button className="rfx-auth-btn" type="submit" disabled={loading}>
              {loading ? <><span className="rfx-btn-spinner" /> Signing In…</> : 'SIGN IN'}
            </button>
          </form>

          <div className="rfx-auth-footer">
            New to ReforgeX?{' '}
            <Link to="/user/auth/signup">Create an account →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}