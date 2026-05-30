import { useState, useContext, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail, Phone, CheckCircle2, Sun, Moon, Zap,
  AlertCircle, ChevronRight, RefreshCw
} from 'lucide-react';
import Swal from 'sweetalert2';
import { ThemeContext } from '../../../context/ThemeContext';

const OTP_LENGTH = 6;

/* ─── OTP Input Component ─── */
function OtpInputs({ value, onChange, isSuccess }) {
  const refs = Array.from({ length: OTP_LENGTH }, () => useRef(null));

  const handleKey = (e, i) => {
    if (e.key === 'Backspace' && !value[i] && i > 0) refs[i - 1].current.focus();
  };
  const handleInput = (e, i) => {
    const ch = e.target.value.replace(/\D/g, '').slice(-1);
    const arr = value.split('');
    arr[i] = ch;
    onChange(arr.join(''));
    if (ch && i < OTP_LENGTH - 1) refs[i + 1].current.focus();
  };
  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    onChange(pasted.padEnd(OTP_LENGTH, ' ').slice(0, OTP_LENGTH).trimEnd());
    refs[Math.min(pasted.length, OTP_LENGTH - 1)].current?.focus();
  };

  return (
    <div className="rfx-otp-group">
      {Array.from({ length: OTP_LENGTH }).map((_, i) => (
        <input
          key={i} ref={refs[i]}
          className={`rfx-otp-input${value[i] && value[i].trim() ? ' filled' : ''}${isSuccess ? ' rfx-input-success' : ''}`}
          type="text" inputMode="numeric" maxLength={1}
          value={value[i]?.trim() || ''} autoComplete="one-time-code"
          onChange={e => handleInput(e, i)}
          onKeyDown={e => handleKey(e, i)}
          onPaste={handlePaste}
        />
      ))}
    </div>
  );
}

/* ─── Countdown Resend ─── */
function ResendCountdown({ onResend, disabled }) {
  const [secs, setSecs] = useState(60);
  useEffect(() => {
    if (secs <= 0) return;
    const t = setTimeout(() => setSecs(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secs]);

  const handle = () => { setSecs(60); onResend(); };

  return (
    <div className="rfx-auth-resend-row">
      {secs > 0 ? (
        <>Resend in <span className="rfx-auth-timer">0:{String(secs).padStart(2,'0')}</span></>
      ) : (
        <button className="rfx-auth-btn-text" onClick={handle} type="button" disabled={disabled}>
          <RefreshCw size={12} style={{ marginRight: 4 }} />Resend Code
        </button>
      )}
    </div>
  );
}

/* ─── Email Verification Panel ─── */
function EmailVerifyPanel({ isDarkMode }) {
  const navigate = useNavigate();
  // sub-step: 'pending' | 'otp' | 'done'
  const [subStep, setSubStep] = useState('pending');
  const [otp, setOtp]         = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError]     = useState('');
  const [verified, setVerified] = useState(false);

  // Pull email from localStorage/context in real app
  const [email] = useState(() => localStorage.getItem('rfx_pending_email') || 'your.email@domain.com');

  const handleSendCode = async () => {
    setSending(true); setError('');
    try {
      const res = await fetch('/api/user/auth/send-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send code');
      setSubStep('otp');
    } catch (err) { setError(err.message); }
    finally { setSending(false); }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.replace(/\s/g,'').length < OTP_LENGTH) { setError('Enter all 6 digits.'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/user/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otp.replace(/\s/g,'') }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Invalid code');
      setVerified(true);
      setTimeout(() => setSubStep('done'), 500);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleResend = async () => {
    setError('');
    try {
      await fetch('/api/user/auth/send-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
    } catch (_) {}
  };

  return (
    <div className="rfx-auth-panel">
      {subStep === 'pending' && (
        <>
          <div className="rfx-verify-status pending" style={{ marginBottom: 20 }}>
            <Mail size={12} /> Unverified
          </div>
          <p className="rfx-auth-subtext">
            Verify your email address to unlock full access to ReforgeX.
          </p>
          <span className="rfx-auth-masked">{email}</span>
          {error && (
            <div className="rfx-auth-alert error" style={{ marginBottom: 16 }}>
              <AlertCircle size={14} style={{ flexShrink: 0 }} />{error}
            </div>
          )}
          <button className="rfx-auth-btn" type="button" onClick={handleSendCode} disabled={sending}>
            {sending ? <><span className="rfx-btn-spinner" /> Sending…</> : <>SEND VERIFICATION CODE <ChevronRight size={16} /></>}
          </button>
          <p className="rfx-auth-field-msg hint" style={{ marginTop: 12, justifyContent:'center' }}>
            A 6-digit code will be sent to the above email.
          </p>
        </>
      )}

      {subStep === 'otp' && (
        <>
          <div className="rfx-verify-status pending" style={{ marginBottom: 16 }}>
            <Mail size={12} /> Code Sent
          </div>
          <p className="rfx-auth-subtext">
            Enter the 6-digit code sent to:
          </p>
          <span className="rfx-auth-masked">{email}</span>

          <p className="rfx-auth-desc" style={{ marginTop: 14 }}>
            Code expires in 10 minutes. Check your spam folder if you don't see it.
          </p>

          {error && (
            <div className="rfx-auth-alert error" style={{ marginBottom: 4 }}>
              <AlertCircle size={14} style={{ flexShrink: 0 }} />{error}
            </div>
          )}

          <form onSubmit={handleVerify} noValidate>
            <OtpInputs value={otp} onChange={v => { setOtp(v); setError(''); }} isSuccess={verified} />
            <ResendCountdown onResend={handleResend} disabled={loading} />
            <button className="rfx-auth-btn" type="submit" disabled={loading || verified}
              style={{ marginTop: 20 }}>
              {loading ? <><span className="rfx-btn-spinner" /> Verifying…</>
                : verified ? <><CheckCircle2 size={16} /> Verified!</>
                : 'VERIFY EMAIL'}
            </button>
          </form>

          <button className="rfx-auth-btn-ghost" type="button" style={{ marginTop: 10 }}
            onClick={() => { setSubStep('pending'); setOtp(''); setError(''); }}>
            ← Change Email
          </button>
        </>
      )}

      {subStep === 'done' && (
        <div style={{ textAlign: 'center' }}>
          <div className="rfx-verify-success-icon" style={{ marginTop: 8 }}>
            <CheckCircle2 size={30} />
          </div>
          <div className="rfx-verify-status verified" style={{ margin: '0 auto 14px', display:'inline-flex' }}>
            <CheckCircle2 size={12} /> Verified
          </div>
          <h2 style={{ fontFamily: 'var(--rfx-font-display)', fontSize: 24, letterSpacing: 1, color: 'var(--rfx-text-primary)', marginBottom: 10 }}>
            EMAIL <span style={{ color: 'var(--rfx-success)' }}>CONFIRMED</span>
          </h2>
          <p style={{ fontSize: 13, color: 'var(--rfx-text-secondary)', lineHeight: 1.6, marginBottom: 24 }}>
            Your email address has been successfully verified.
          </p>
          <p style={{ fontSize: 12, color: 'var(--rfx-text-muted)' }}>
            You can now verify your phone number in the other tab, or go to your dashboard.
          </p>
        </div>
      )}
    </div>
  );
}

/* ─── Phone Verification Panel ─── */
function PhoneVerifyPanel({ isDarkMode }) {
  const navigate = useNavigate();
  const [subStep, setSubStep] = useState('input'); // 'input' | 'otp' | 'done'
  const [phone, setPhone]     = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [otp, setOtp]         = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError]     = useState('');
  const [verified, setVerified] = useState(false);
  const [phoneErr, setPhoneErr] = useState('');

  const COUNTRY_CODES = [
    { code: '+1', label: '+1 🇺🇸' }, { code: '+44', label: '+44 🇬🇧' },
    { code: '+91', label: '+91 🇮🇳' }, { code: '+61', label: '+61 🇦🇺' },
    { code: '+49', label: '+49 🇩🇪' }, { code: '+33', label: '+33 🇫🇷' },
    { code: '+81', label: '+81 🇯🇵' }, { code: '+86', label: '+86 🇨🇳' },
    { code: '+971', label: '+971 🇦🇪' }, { code: '+65', label: '+65 🇸🇬' },
  ];

  const maskedPhone = phone.length > 4
    ? countryCode + ' ' + phone.slice(0, -4).replace(/\d/g, '*') + phone.slice(-4)
    : countryCode + ' ' + phone;

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!phone.trim() || phone.replace(/\D/g,'').length < 7) {
      setPhoneErr('Please enter a valid phone number.'); return;
    }
    setSending(true); setError('');
    try {
      const res = await fetch('/api/user/auth/send-phone-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: countryCode + phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send code');
      setSubStep('otp');
    } catch (err) { setError(err.message); }
    finally { setSending(false); }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.replace(/\s/g,'').length < OTP_LENGTH) { setError('Enter all 6 digits.'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/user/auth/verify-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: countryCode + phone, otp: otp.replace(/\s/g,'') }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Invalid code');
      setVerified(true);
      setTimeout(() => setSubStep('done'), 500);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleResend = async () => {
    setError('');
    try {
      await fetch('/api/user/auth/send-phone-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: countryCode + phone }),
      });
    } catch (_) {}
  };

  return (
    <div className="rfx-auth-panel">
      {subStep === 'input' && (
        <>
          <div className="rfx-verify-status pending" style={{ marginBottom: 20 }}>
            <Phone size={12} /> Unverified
          </div>
          <p className="rfx-auth-subtext">
            Add your phone number for added security and SMS alerts.
          </p>
          {error && (
            <div className="rfx-auth-alert error" style={{ marginBottom: 16 }}>
              <AlertCircle size={14} style={{ flexShrink: 0 }} />{error}
            </div>
          )}
          <form onSubmit={handleSendCode} noValidate>
            <div className="rfx-auth-form-group">
              <label className="rfx-auth-label">Phone Number</label>
              <div className="rfx-phone-wrap">
                <select
                  className="rfx-country-code-select"
                  value={countryCode}
                  onChange={e => setCountryCode(e.target.value)}
                >
                  {COUNTRY_CODES.map(c => (
                    <option key={c.code} value={c.code}>{c.label}</option>
                  ))}
                </select>
                <div className="rfx-auth-input-wrap" style={{ flex: 1 }}>
                  <span className="rfx-auth-input-icon"><Phone size={15} /></span>
                  <input
                    className={`rfx-auth-input${phoneErr ? ' rfx-input-error' : ''}`}
                    type="tel" placeholder="9876543210"
                    value={phone}
                    onChange={e => { setPhone(e.target.value.replace(/\D/g,'')); setPhoneErr(''); setError(''); }}
                    autoComplete="tel"
                  />
                </div>
              </div>
              {phoneErr && (
                <div className="rfx-auth-field-msg error"><AlertCircle size={11}/>{phoneErr}</div>
              )}
            </div>
            <button className="rfx-auth-btn" type="submit" disabled={sending}>
              {sending ? <><span className="rfx-btn-spinner" /> Sending…</> : <>SEND OTP <ChevronRight size={16} /></>}
            </button>
          </form>
          <p className="rfx-auth-field-msg hint" style={{ marginTop: 12, justifyContent:'center' }}>
            Standard SMS rates may apply.
          </p>
        </>
      )}

      {subStep === 'otp' && (
        <>
          <div className="rfx-verify-status pending" style={{ marginBottom: 16 }}>
            <Phone size={12} /> OTP Sent
          </div>
          <p className="rfx-auth-subtext">
            Enter the 6-digit code sent via SMS to:
          </p>
          <span className="rfx-auth-masked">{maskedPhone}</span>

          <p className="rfx-auth-desc" style={{ marginTop: 14 }}>
            The code is valid for 10 minutes. Didn't get it? Check your number and resend.
          </p>

          {error && (
            <div className="rfx-auth-alert error" style={{ marginBottom: 4 }}>
              <AlertCircle size={14} style={{ flexShrink: 0 }} />{error}
            </div>
          )}

          <form onSubmit={handleVerify} noValidate>
            <OtpInputs value={otp} onChange={v => { setOtp(v); setError(''); }} isSuccess={verified} />
            <ResendCountdown onResend={handleResend} disabled={loading} />
            <button className="rfx-auth-btn" type="submit" disabled={loading || verified}
              style={{ marginTop: 20 }}>
              {loading ? <><span className="rfx-btn-spinner" /> Verifying…</>
                : verified ? <><CheckCircle2 size={16} /> Verified!</>
                : 'VERIFY PHONE'}
            </button>
          </form>

          <button className="rfx-auth-btn-ghost" type="button" style={{ marginTop: 10 }}
            onClick={() => { setSubStep('input'); setOtp(''); setError(''); }}>
            ← Change Number
          </button>
        </>
      )}

      {subStep === 'done' && (
        <div style={{ textAlign: 'center' }}>
          <div className="rfx-verify-success-icon" style={{ marginTop: 8 }}>
            <CheckCircle2 size={30} />
          </div>
          <div className="rfx-verify-status verified" style={{ margin: '0 auto 14px', display:'inline-flex' }}>
            <CheckCircle2 size={12} /> Verified
          </div>
          <h2 style={{ fontFamily: 'var(--rfx-font-display)', fontSize: 24, letterSpacing: 1, color: 'var(--rfx-text-primary)', marginBottom: 10 }}>
            PHONE <span style={{ color: 'var(--rfx-success)' }}>CONFIRMED</span>
          </h2>
          <p style={{ fontSize: 13, color: 'var(--rfx-text-secondary)', lineHeight: 1.6, marginBottom: 24 }}>
            Your phone number has been successfully verified.
          </p>
          <p style={{ fontSize: 12, color: 'var(--rfx-text-muted)' }}>
            You can verify your email in the other tab if you haven't already.
          </p>
        </div>
      )}
    </div>
  );
}

/* ─── Main Page ─── */
export default function Verification() {
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('email');

  const handleSkip = async () => {
    const result = await Swal.fire({
      icon: 'question',
      title: 'Skip Verification?',
      text: 'Some features will be restricted until you verify. You can verify later from your profile.',
      background: isDarkMode ? '#1A1A20' : '#fff',
      color: isDarkMode ? '#F0EEE8' : '#111',
      confirmButtonColor: '#F5A623',
      cancelButtonColor: '#555',
      showCancelButton: true,
      confirmButtonText: 'Skip for now',
      cancelButtonText: 'Stay & Verify',
    });
    if (result.isConfirmed) navigate('/dashboard');
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

      <button className="rfx-theme-toggle" onClick={toggleDarkMode} aria-label="Toggle theme">
        {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <div className="rfx-auth-page">
        <div className="rfx-auth-card rfx-auth-card--wide">
          {/* Brand */}
          <div className="rfx-auth-brand">
            <div className="rfx-auth-brand-logo"><Zap size={22} strokeWidth={2.5} /></div>
            <span className="rfx-auth-brand-name">REFORGE<span>X</span></span>
          </div>

          <h1 className="rfx-auth-heading">VERIFY YOUR<br /><span>IDENTITY</span></h1>
          <p className="rfx-auth-subtext">
            Secure your account. Both verifications are independent — complete one or both.
          </p>

          {/* Tabs */}
          <div className="rfx-verify-tabs">
            <button
              className={`rfx-verify-tab${activeTab === 'email' ? ' active' : ''}`}
              onClick={() => setActiveTab('email')}
              type="button"
            >
              <Mail size={15} />
              Email Address
            </button>
            <button
              className={`rfx-verify-tab${activeTab === 'phone' ? ' active' : ''}`}
              onClick={() => setActiveTab('phone')}
              type="button"
            >
              <Phone size={15} />
              Phone Number
            </button>
          </div>

          {/* Tab Panels */}
          {activeTab === 'email' && (
            <EmailVerifyPanel key="email" isDarkMode={isDarkMode} />
          )}
          {activeTab === 'phone' && (
            <PhoneVerifyPanel key="phone" isDarkMode={isDarkMode} />
          )}

          <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
            <button className="rfx-auth-btn" type="button" onClick={() => navigate('/dashboard')}>
              GO TO DASHBOARD →
            </button>
            <button
              type="button"
              style={{ background:'none', border:'none', color:'var(--rfx-text-muted)', fontSize:13, cursor:'pointer', padding:4 }}
              onClick={handleSkip}
            >
              Skip verification for now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}