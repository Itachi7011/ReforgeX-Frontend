import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User, Mail, Lock, Eye, EyeOff, Briefcase, Code2,
  BarChart2, Pen, Sun, Moon, Zap, AlertCircle, CheckCircle2
} from 'lucide-react';
import Swal from 'sweetalert2';
import { ThemeContext } from '../../../context/ThemeContext';

const ROLES = [
  { value: 'engineer',  label: 'Engineer',  icon: <Code2 size={18} /> },
  { value: 'manager',   label: 'Manager',   icon: <Briefcase size={18} /> },
  { value: 'analyst',   label: 'Analyst',   icon: <BarChart2 size={18} /> },
  { value: 'creative',  label: 'Creative',  icon: <Pen size={18} /> },
];

const getStrength = (pw) => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
};
const STRENGTH_MAP = ['', 'weak', 'fair', 'good', 'strong'];
const STRENGTH_LABEL = ['', 'Weak', 'Fair', 'Good', 'Strong'];

export default function Signup() {
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
    role: 'engineer', terms: false,
  });
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const strength = getStrength(form.password);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    setFieldErrors(fe => ({ ...fe, [name]: '' }));
    setError('');
  };

  const validate = () => {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = 'First name is required';
    if (!form.lastName.trim()) errs.lastName = 'Last name is required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'A valid email is required';
    if (form.password.length < 8) errs.password = 'Min. 8 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (!form.terms) errs.terms = 'You must accept the terms';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }

    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/user/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName:  form.lastName,
          email:     form.email,
          password:  form.password,
          role:      form.role,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Signup failed');

      await Swal.fire({
        icon: 'success',
        title: 'Account Created!',
        text: 'Welcome to ReforgeX. Please verify your email.',
        background: isDarkMode ? '#1A1A20' : '#fff',
        color: isDarkMode ? '#F0EEE8' : '#111',
        confirmButtonColor: '#F5A623',
      });
      navigate('/verify');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = '/api/user/auth/google';
  };
  const handleLinkedInSignup = () => {
    window.location.href = '/api/user/auth/linkedin';
  };

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

          <div className="rfx-auth-badge"><Zap size={10} /> For the Relentless</div>
          <h1 className="rfx-auth-heading">START YOUR<br /><span>COMEBACK</span></h1>
          <p className="rfx-auth-subtext">
            Already skilled. Temporarily sidelined. Let's change that.
          </p>

          {/* OAuth */}
          <div className="rfx-auth-oauth">
            <button className="rfx-auth-oauth-btn" onClick={handleGoogleSignup} type="button">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
            <button className="rfx-auth-oauth-btn" onClick={handleLinkedInSignup} type="button">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A66C2">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              Continue with LinkedIn
            </button>
          </div>

          <div className="rfx-auth-divider">
            <div className="rfx-auth-divider-line" />
            <span className="rfx-auth-divider-text">or sign up with email</span>
            <div className="rfx-auth-divider-line" />
          </div>

          {error && (
            <div className="rfx-auth-alert error">
              <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Name Row */}
            <div className="rfx-auth-row">
              <div className="rfx-auth-form-group">
                <label className="rfx-auth-label">First Name</label>
                <div className="rfx-auth-input-wrap">
                  <span className="rfx-auth-input-icon"><User size={15} /></span>
                  <input
                    className={`rfx-auth-input${fieldErrors.firstName ? ' rfx-input-error' : ''}`}
                    type="text" name="firstName" placeholder="Alex"
                    value={form.firstName} onChange={handleChange} autoComplete="given-name"
                  />
                </div>
                {fieldErrors.firstName && (
                  <div className="rfx-auth-field-msg error"><AlertCircle size={11}/>{fieldErrors.firstName}</div>
                )}
              </div>
              <div className="rfx-auth-form-group">
                <label className="rfx-auth-label">Last Name</label>
                <div className="rfx-auth-input-wrap">
                  <span className="rfx-auth-input-icon"><User size={15} /></span>
                  <input
                    className={`rfx-auth-input${fieldErrors.lastName ? ' rfx-input-error' : ''}`}
                    type="text" name="lastName" placeholder="Rivera"
                    value={form.lastName} onChange={handleChange} autoComplete="family-name"
                  />
                </div>
                {fieldErrors.lastName && (
                  <div className="rfx-auth-field-msg error"><AlertCircle size={11}/>{fieldErrors.lastName}</div>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="rfx-auth-form-group">
              <label className="rfx-auth-label">Work Email</label>
              <div className="rfx-auth-input-wrap">
                <span className="rfx-auth-input-icon"><Mail size={15} /></span>
                <input
                  className={`rfx-auth-input${fieldErrors.email ? ' rfx-input-error' : ''}`}
                  type="email" name="email" placeholder="alex@company.com"
                  value={form.email} onChange={handleChange} autoComplete="email"
                />
              </div>
              {fieldErrors.email && (
                <div className="rfx-auth-field-msg error"><AlertCircle size={11}/>{fieldErrors.email}</div>
              )}
            </div>

            {/* Role */}
            <div className="rfx-auth-form-group">
              <label className="rfx-auth-label">Your Field</label>
              <div className="rfx-auth-role-grid">
                {ROLES.map(r => (
                  <div className="rfx-auth-role-option" key={r.value}>
                    <input type="radio" name="role" id={`role-${r.value}`}
                      value={r.value} checked={form.role === r.value}
                      onChange={handleChange}
                    />
                    <label className="rfx-auth-role-label" htmlFor={`role-${r.value}`}>
                      <span className="rfx-auth-role-icon">{r.icon}</span>
                      {r.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Password */}
            <div className="rfx-auth-form-group">
              <label className="rfx-auth-label">Password</label>
              <div className="rfx-auth-input-wrap">
                <span className="rfx-auth-input-icon"><Lock size={15} /></span>
                <input
                  className={`rfx-auth-input rfx-with-right-icon${fieldErrors.password ? ' rfx-input-error' : ''}`}
                  type={showPw ? 'text' : 'password'} name="password" placeholder="Min. 8 characters"
                  value={form.password} onChange={handleChange} autoComplete="new-password"
                />
                <span className="rfx-auth-input-icon-right" onClick={() => setShowPw(v => !v)}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </span>
              </div>
              {form.password && (
                <div className="rfx-auth-strength">
                  <div className="rfx-auth-strength-bars">
                    {[1,2,3,4].map(i => (
                      <div key={i}
                        className={`rfx-auth-strength-bar${strength >= i ? ` ${STRENGTH_MAP[strength]}` : ''}`}
                      />
                    ))}
                  </div>
                  <span className="rfx-auth-strength-label">
                    Strength: {STRENGTH_LABEL[strength] || '—'}
                  </span>
                </div>
              )}
              {fieldErrors.password && (
                <div className="rfx-auth-field-msg error"><AlertCircle size={11}/>{fieldErrors.password}</div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="rfx-auth-form-group">
              <label className="rfx-auth-label">Confirm Password</label>
              <div className="rfx-auth-input-wrap">
                <span className="rfx-auth-input-icon"><Lock size={15} /></span>
                <input
                  className={`rfx-auth-input rfx-with-right-icon${
                    fieldErrors.confirmPassword ? ' rfx-input-error'
                    : form.confirmPassword && form.password === form.confirmPassword ? ' rfx-input-success'
                    : ''
                  }`}
                  type={showCpw ? 'text' : 'password'} name="confirmPassword" placeholder="Repeat password"
                  value={form.confirmPassword} onChange={handleChange} autoComplete="new-password"
                />
                <span className="rfx-auth-input-icon-right" onClick={() => setShowCpw(v => !v)}>
                  {showCpw ? <EyeOff size={15} /> : <Eye size={15} />}
                </span>
              </div>
              {fieldErrors.confirmPassword && (
                <div className="rfx-auth-field-msg error"><AlertCircle size={11}/>{fieldErrors.confirmPassword}</div>
              )}
              {!fieldErrors.confirmPassword && form.confirmPassword && form.password === form.confirmPassword && (
                <div className="rfx-auth-field-msg success"><CheckCircle2 size={11}/>Passwords match</div>
              )}
            </div>

            {/* Terms */}
            <div className="rfx-auth-checkbox-wrap">
              <input type="checkbox" id="terms" name="terms"
                checked={form.terms} onChange={handleChange}
              />
              <label htmlFor="terms">
                I agree to ReforgeX's{' '}
                <Link to="/terms">Terms of Service</Link> and{' '}
                <Link to="/privacy">Privacy Policy</Link>
              </label>
            </div>
            {fieldErrors.terms && (
              <div className="rfx-auth-field-msg error" style={{ marginTop: -14, marginBottom: 12 }}>
                <AlertCircle size={11}/>{fieldErrors.terms}
              </div>
            )}

            <button className="rfx-auth-btn" type="submit" disabled={loading}>
              {loading ? <><span className="rfx-btn-spinner" /> Creating Account…</> : 'CREATE MY ACCOUNT'}
            </button>
          </form>

          <div className="rfx-auth-footer">
            Already have an account?{' '}
            <Link to="/user/auth/login">Sign in →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}