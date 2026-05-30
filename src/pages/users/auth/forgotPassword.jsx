import { useState, useContext, useRef, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Mail, Lock, Eye, EyeOff, ArrowLeft, Sun, Moon,
  Zap, AlertCircle, CheckCircle2, KeyRound, ShieldCheck
} from 'lucide-react';
import Swal from 'sweetalert2';
import { ThemeContext } from '../../../context/ThemeContext';

/*
  Steps:
   1 — Enter email (request reset link / OTP)
   2 — Enter OTP sent to email
   3 — Set new password
   4 — Success screen
*/

const getStrength = (pw) => {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
};
const STRENGTH_MAP   = ['', 'weak', 'fair', 'good', 'strong'];
const STRENGTH_LABEL = ['', 'Weak', 'Fair', 'Good', 'Strong'];

const OTP_LENGTH = 6;

function OtpInputs({ value, onChange, isSuccess }) {
  const refs = Array.from({ length: OTP_LENGTH }, () => useRef(null));

  const handleKey = (e, i) => {
    if (e.key === 'Backspace') {
      if (!value[i] && i > 0) refs[i - 1].current.focus();
    }
  };
  const handleInput = (e, i) => {
    const ch = e.target.value.replace(/\D/g, '').slice(-1);
    const arr = value.split('');
    arr[i] = ch;
    const next = arr.join('');
    onChange(next);
    if (ch && i < OTP_LENGTH - 1) refs[i + 1].current.focus();
  };
  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    onChange(pasted.padEnd(OTP_LENGTH, ' ').slice(0, OTP_LENGTH).trimEnd());
    const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1);
    refs[focusIdx].current?.focus();
  };

  return (
    <div className="rfx-otp-group">
      {Array.from({ length: OTP_LENGTH }).map((_, i) => (
        <input
          key={i}
          ref={refs[i]}
          className={`rfx-otp-input${value[i] ? ' filled' : ''}${isSuccess ? ' rfx-input-success' : ''}`}
          type="text" inputMode="numeric" maxLength={1}
          value={value[i] || ''} autoComplete="one-time-code"
          onChange={e => handleInput(e, i)}
          onKeyDown={e => handleKey(e, i)}
          onPaste={handlePaste}
        />
      ))}
    </div>
  );
}

function CountdownResend({ onResend }) {
  const [secs, setSecs] = useState(60);
  useEffect(() => {
    if (secs <= 0) return;
    const t = setTimeout(() => setSecs(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secs]);

  const handleResend = async () => {
    setSecs(60);
    await onResend();
  };

  return (
    <div className="rfx-auth-resend-row">
      {secs > 0 ? (
        <>Resend code in <span className="rfx-auth-timer">0:{String(secs).padStart(2,'0')}</span></>
      ) : (
        <button className="rfx-auth-btn-text" onClick={handleResend} type="button">
          Resend Code
        </button>
      )}
    </div>
  );
}

export default function ForgotResetPassword() {
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // If URL has ?token= we can skip to step 3 (link-based flow)
  const tokenFromUrl = searchParams.get('token');

  const [step, setStep] = useState(tokenFromUrl ? 3 : 1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [resetToken, setResetToken] = useState(tokenFromUrl || '');
  const [pw, setPw] = useState({ password: '', confirm: '' });
  const [showPw, setShowPw]   = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [otpVerified, setOtpVerified] = useState(false);

  const strength = getStrength(pw.password);

  // ── Step 1: Request OTP ──
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.'); return;
    }
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/user/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Could not send reset code');
      setStep(2);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleResendOtp = async () => {
    setError('');
    try {
      await fetch('/api/user/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
    } catch (_) {}
  };

  // ── Step 2: Verify OTP ──
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.replace(/\s/g,'').length < OTP_LENGTH) {
      setError('Please enter the full 6-digit code.'); return;
    }
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/user/auth/verify-reset-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otp.replace(/\s/g,'') }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Invalid code');
      setOtpVerified(true);
      setResetToken(data.resetToken || '');
      setTimeout(() => setStep(3), 600);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  // ── Step 3: Reset Password ──
  const handleResetPw = async (e) => {
    e.preventDefault();
    if (pw.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (pw.password !== pw.confirm) { setError('Passwords do not match.'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/user/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resetToken, password: pw.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Reset failed');
      setStep(4);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const stepTitles = ['', 'FORGOT\nPASSWORD', 'CHECK YOUR\nEMAIL', 'SET NEW\nPASSWORD', 'ALL\nDONE'];
  const currentTitle = stepTitles[step].split('\n');

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

      <button className="rfx-theme-toggle" onClick={toggleDarkMode} aria-label="Toggle theme">
        {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <div className="rfx-auth-page">
        <div className="rfx-auth-card rfx-auth-panel" key={step}>
          {/* Brand */}
          <div className="rfx-auth-brand">
            <div className="rfx-auth-brand-logo"><Zap size={22} strokeWidth={2.5} /></div>
            <span className="rfx-auth-brand-name">REFORGE<span>X</span></span>
          </div>

          {/* Step progress */}
          {step < 4 && (
            <div className="rfx-auth-steps">
              {[1,2,3].map(s => (
                <div key={s}
                  className={`rfx-auth-step${step > s ? ' done' : step === s ? ' active' : ''}`}
                />
              ))}
            </div>
          )}

          {/* Back button (steps 2 & 3) */}
          {(step === 2 || step === 3) && !tokenFromUrl && (
            <div className="rfx-auth-step-header">
              <button className="rfx-auth-back-btn" type="button" onClick={() => { setStep(s => s - 1); setError(''); setOtp(''); }}>
                <ArrowLeft size={16} />
              </button>
            </div>
          )}

          {/* Title */}
          {step < 4 && (
            <>
              <h1 className="rfx-auth-heading">
                {currentTitle[0]}<br /><span>{currentTitle[1]}</span>
              </h1>
            </>
          )}

          {error && (
            <div className="rfx-auth-alert error" style={{ marginTop: 16 }}>
              <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
              {error}
            </div>
          )}

          {/* ── Step 1 ── */}
          {step === 1 && (
            <>
              <p className="rfx-auth-subtext">
                Enter the email linked to your account. We'll send a one-time code.
              </p>
              <form onSubmit={handleRequestOtp} noValidate>
                <div className="rfx-auth-form-group">
                  <label className="rfx-auth-label">Email Address</label>
                  <div className="rfx-auth-input-wrap">
                    <span className="rfx-auth-input-icon"><Mail size={15} /></span>
                    <input
                      className="rfx-auth-input"
                      type="email" placeholder="you@company.com"
                      value={email} onChange={e => { setEmail(e.target.value); setError(''); }}
                      autoComplete="email"
                    />
                  </div>
                </div>
                <button className="rfx-auth-btn" type="submit" disabled={loading}>
                  {loading ? <><span className="rfx-btn-spinner" /> Sending…</> : 'SEND RESET CODE'}
                </button>
              </form>
            </>
          )}

          {/* ── Step 2 ── */}
          {step === 2 && (
            <>
              <p className="rfx-auth-subtext">
                We sent a 6-digit code to
              </p>
              <span className="rfx-auth-masked">{email}</span>
              <p className="rfx-auth-desc">
                Check your inbox (and spam folder). The code expires in 10 minutes.
              </p>
              <form onSubmit={handleVerifyOtp} noValidate>
                <OtpInputs value={otp} onChange={setOtp} isSuccess={otpVerified} />
                <CountdownResend onResend={handleResendOtp} />
                <button className="rfx-auth-btn" type="submit" disabled={loading || otpVerified}
                  style={{ marginTop: 20 }}>
                  {loading ? <><span className="rfx-btn-spinner" /> Verifying…</>
                    : otpVerified ? <><CheckCircle2 size={17} /> Verified!</>
                    : 'VERIFY CODE'}
                </button>
              </form>
            </>
          )}

          {/* ── Step 3 ── */}
          {step === 3 && (
            <>
              <p className="rfx-auth-subtext">
                Create a strong new password for your account.
              </p>
              <form onSubmit={handleResetPw} noValidate>
                <div className="rfx-auth-form-group">
                  <label className="rfx-auth-label">New Password</label>
                  <div className="rfx-auth-input-wrap">
                    <span className="rfx-auth-input-icon"><Lock size={15} /></span>
                    <input
                      className="rfx-auth-input rfx-with-right-icon"
                      type={showPw ? 'text' : 'password'} placeholder="Min. 8 characters"
                      value={pw.password}
                      onChange={e => { setPw(p => ({ ...p, password: e.target.value })); setError(''); }}
                      autoComplete="new-password"
                    />
                    <span className="rfx-auth-input-icon-right" onClick={() => setShowPw(v => !v)}>
                      {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </span>
                  </div>
                  {pw.password && (
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
                </div>

                <div className="rfx-auth-form-group">
                  <label className="rfx-auth-label">Confirm New Password</label>
                  <div className="rfx-auth-input-wrap">
                    <span className="rfx-auth-input-icon"><Lock size={15} /></span>
                    <input
                      className={`rfx-auth-input rfx-with-right-icon${
                        pw.confirm && pw.password === pw.confirm ? ' rfx-input-success' : ''
                      }`}
                      type={showCpw ? 'text' : 'password'} placeholder="Repeat new password"
                      value={pw.confirm}
                      onChange={e => { setPw(p => ({ ...p, confirm: e.target.value })); setError(''); }}
                      autoComplete="new-password"
                    />
                    <span className="rfx-auth-input-icon-right" onClick={() => setShowCpw(v => !v)}>
                      {showCpw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </span>
                  </div>
                  {pw.confirm && pw.password === pw.confirm && (
                    <div className="rfx-auth-field-msg success"><CheckCircle2 size={11}/>Passwords match</div>
                  )}
                </div>

                <button className="rfx-auth-btn" type="submit" disabled={loading}>
                  {loading ? <><span className="rfx-btn-spinner" /> Updating…</> : 'RESET PASSWORD'}
                </button>
              </form>
            </>
          )}

          {/* ── Step 4 — Success ── */}
          {step === 4 && (
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <div className="rfx-verify-success-icon">
                <ShieldCheck size={30} />
              </div>
              <h1 className="rfx-auth-heading">PASSWORD<br /><span>RESET!</span></h1>
              <p className="rfx-auth-subtext" style={{ marginTop: 12 }}>
                Your password has been successfully updated. You can now sign in with your new credentials.
              </p>
              <button className="rfx-auth-btn" style={{ marginTop: 8 }}
                onClick={() => navigate('/login')} type="button">
                GO TO SIGN IN
              </button>
            </div>
          )}

          {step < 4 && (
            <div className="rfx-auth-footer" style={{ marginTop: 24 }}>
              <Link to="/login">← Back to Sign In</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}