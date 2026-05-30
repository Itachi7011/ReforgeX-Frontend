import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Globe,
  Users,
  Cpu,
  ShoppingBag,
  HeartPulse,
  Landmark,
  Sun,
  Moon,
  AlertCircle,
  CheckCircle2,
  Briefcase,
} from "lucide-react";
import Swal from "sweetalert2";
import { ThemeContext } from "../../context/ThemeContext";
import "../../styles/employersAuth.css";

const INDUSTRIES = [
  { value: "tech", label: "Technology", icon: <Cpu size={16} /> },
  { value: "finance", label: "Finance", icon: <Landmark size={16} /> },
  { value: "health", label: "Healthcare", icon: <HeartPulse size={16} /> },
  { value: "retail", label: "Retail", icon: <ShoppingBag size={16} /> },
  { value: "other", label: "Other", icon: <Globe size={16} /> },
];

const SIZES = [
  { value: "1-10", label: "1–10" },
  { value: "11-50", label: "11–50" },
  { value: "51-200", label: "51–200" },
  { value: "201-500", label: "201–500" },
  { value: "500+", label: "500+" },
  { value: "enterprise", label: "Enterprise" },
];

const pwStrength = (pw) => {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
};
const STR_CLS = ["", "weak", "fair", "good", "strong"];
const STR_LABEL = ["", "Weak", "Fair", "Good", "Strong"];

export default function EmployerSignup() {
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    workEmail: "",
    companyName: "",
    companyWebsite: "",
    industry: "tech",
    companySize: "11-50",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const strength = pwStrength(form.password);

  const set = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    setFieldErrors((fe) => ({ ...fe, [name]: "" }));
    setError("");
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.workEmail))
      e.workEmail = "Valid work email required";
    if (!form.companyName.trim()) e.companyName = "Company name required";
    if (form.password.length < 8) e.password = "Min. 8 characters";
    if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match";
    if (!form.terms) e.terms = "You must accept the terms";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/employer/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          workEmail: form.workEmail,
          companyName: form.companyName,
          companyWebsite: form.companyWebsite,
          industry: form.industry,
          companySize: form.companySize,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");
      await Swal.fire({
        icon: "success",
        title: "Company Account Created!",
        text: "Please verify your work email to get started.",
        background: isDarkMode ? "#101828" : "#fff",
        color: isDarkMode ? "#E8F0FE" : "#0A1628",
        confirmButtonColor: "#00C9B1",
      });
      navigate("/employer/verify");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`emp-auth-root ${isDarkMode ? "dark" : "light"}`}>
      <div className="emp-auth-bg">
        <div className="emp-bg-dots" />
        <div className="emp-bg-orb emp-bg-orb-1" />
        <div className="emp-bg-orb emp-bg-orb-2" />
        <div className="emp-bg-corner" />
        <div className="emp-bg-corner-2" />
      </div>

      <button
        className="emp-theme-toggle"
        onClick={toggleDarkMode}
        aria-label="Toggle theme"
      >
        {isDarkMode ? <Sun size={17} /> : <Moon size={17} />}
      </button>

      <div className="emp-auth-page">
        <div className="emp-auth-card">
          <div className="emp-auth-brand">
            <div className="emp-auth-brand-logo">
              <Briefcase size={19} strokeWidth={2.5} />
            </div>
            <span className="emp-auth-brand-name">
              REFORGE<span>X</span>
            </span>
            <span className="emp-auth-brand-tag">Employer</span>
          </div>

          <h1 className="emp-auth-heading">
            POST YOUR
            <br />
            <span>FIRST ROLE</span>
          </h1>
          <p className="emp-auth-subtext">
            Find battle-tested professionals. No juniors. Just proven talent,
            ready to contribute from day one.
          </p>

          <div className="emp-auth-oauth">
            <button
              className="emp-auth-oauth-btn"
              type="button"
              onClick={() =>
                (window.location.href = "/api/employer/auth/google")
              }
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign up with Google Workspace
            </button>
            <button
              className="emp-auth-oauth-btn"
              type="button"
              onClick={() =>
                (window.location.href = "/api/employer/auth/linkedin")
              }
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="#0A66C2">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              Sign up with LinkedIn
            </button>
          </div>

          <div className="emp-auth-divider">
            <div className="emp-auth-divider-line" />
            <span className="emp-auth-divider-text">or register manually</span>
            <div className="emp-auth-divider-line" />
          </div>

          {error && (
            <div className="emp-auth-alert err">
              <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Name Row */}
            <div className="emp-auth-row">
              <div className="emp-auth-form-group">
                <label className="emp-auth-label">First Name</label>
                <div className="emp-auth-input-wrap">
                  <span className="emp-auth-input-icon">
                    <Users size={14} />
                  </span>
                  <input
                    className={`emp-auth-input${fieldErrors.firstName ? " emp-err" : ""}`}
                    type="text"
                    name="firstName"
                    placeholder="Jordan"
                    value={form.firstName}
                    onChange={set}
                    autoComplete="given-name"
                  />
                </div>
                {fieldErrors.firstName && (
                  <div className="emp-field-msg err">
                    <AlertCircle size={10} />
                    {fieldErrors.firstName}
                  </div>
                )}
              </div>
              <div className="emp-auth-form-group">
                <label className="emp-auth-label">Last Name</label>
                <div className="emp-auth-input-wrap">
                  <span className="emp-auth-input-icon">
                    <Users size={14} />
                  </span>
                  <input
                    className={`emp-auth-input${fieldErrors.lastName ? " emp-err" : ""}`}
                    type="text"
                    name="lastName"
                    placeholder="Blake"
                    value={form.lastName}
                    onChange={set}
                    autoComplete="family-name"
                  />
                </div>
                {fieldErrors.lastName && (
                  <div className="emp-field-msg err">
                    <AlertCircle size={10} />
                    {fieldErrors.lastName}
                  </div>
                )}
              </div>
            </div>

            {/* Work Email */}
            <div className="emp-auth-form-group">
              <label className="emp-auth-label">Work Email</label>
              <div className="emp-auth-input-wrap">
                <span className="emp-auth-input-icon">
                  <Mail size={14} />
                </span>
                <input
                  className={`emp-auth-input${fieldErrors.workEmail ? " emp-err" : ""}`}
                  type="email"
                  name="workEmail"
                  placeholder="you@yourcompany.com"
                  value={form.workEmail}
                  onChange={set}
                  autoComplete="email"
                />
              </div>
              {fieldErrors.workEmail && (
                <div className="emp-field-msg err">
                  <AlertCircle size={10} />
                  {fieldErrors.workEmail}
                </div>
              )}
            </div>

            {/* Company Row */}
            <div className="emp-auth-row">
              <div className="emp-auth-form-group">
                <label className="emp-auth-label">Company Name</label>
                <div className="emp-auth-input-wrap">
                  <span className="emp-auth-input-icon">
                    <Building2 size={14} />
                  </span>
                  <input
                    className={`emp-auth-input${fieldErrors.companyName ? " emp-err" : ""}`}
                    type="text"
                    name="companyName"
                    placeholder="Acme Corp"
                    value={form.companyName}
                    onChange={set}
                  />
                </div>
                {fieldErrors.companyName && (
                  <div className="emp-field-msg err">
                    <AlertCircle size={10} />
                    {fieldErrors.companyName}
                  </div>
                )}
              </div>
              <div className="emp-auth-form-group">
                <label className="emp-auth-label">
                  Website{" "}
                  <span
                    style={{ color: "var(--emp-text-muted)", fontWeight: 400 }}
                  >
                    (optional)
                  </span>
                </label>
                <div className="emp-auth-input-wrap">
                  <span className="emp-auth-input-icon">
                    <Globe size={14} />
                  </span>
                  <input
                    className="emp-auth-input"
                    type="url"
                    name="companyWebsite"
                    placeholder="https://..."
                    value={form.companyWebsite}
                    onChange={set}
                  />
                </div>
              </div>
            </div>

            {/* Industry */}
            <div className="emp-auth-form-group">
              <label className="emp-auth-label">Industry</label>
              <div
                className="emp-select-grid"
                style={{ gridTemplateColumns: "repeat(5,1fr)" }}
              >
                {INDUSTRIES.map((ind) => (
                  <div className="emp-select-option" key={ind.value}>
                    <input
                      type="radio"
                      id={`ind-${ind.value}`}
                      name="industry"
                      value={ind.value}
                      checked={form.industry === ind.value}
                      onChange={set}
                    />
                    <label
                      className="emp-select-tile"
                      htmlFor={`ind-${ind.value}`}
                    >
                      {ind.icon}
                      {ind.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Company Size */}
            <div className="emp-auth-form-group">
              <label className="emp-auth-label">Company Size</label>
              <div className="emp-select-grid">
                {SIZES.map((sz) => (
                  <div className="emp-select-option" key={sz.value}>
                    <input
                      type="radio"
                      id={`sz-${sz.value}`}
                      name="companySize"
                      value={sz.value}
                      checked={form.companySize === sz.value}
                      onChange={set}
                    />
                    <label
                      className="emp-select-tile"
                      htmlFor={`sz-${sz.value}`}
                    >
                      {sz.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Password */}
            <div className="emp-auth-form-group">
              <label className="emp-auth-label">Password</label>
              <div className="emp-auth-input-wrap">
                <span className="emp-auth-input-icon">
                  <Lock size={14} />
                </span>
                <input
                  className={`emp-auth-input emp-has-right${fieldErrors.password ? " emp-err" : ""}`}
                  type={showPw ? "text" : "password"}
                  name="password"
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={set}
                  autoComplete="new-password"
                />
                <span
                  className="emp-auth-input-icon-right"
                  onClick={() => setShowPw((v) => !v)}
                >
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </span>
              </div>
              {form.password && (
                <div className="emp-strength">
                  <div className="emp-strength-bars">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`emp-strength-bar${strength >= i ? ` ${STR_CLS[strength]}` : ""}`}
                      />
                    ))}
                  </div>
                  <span className="emp-strength-label">
                    Strength: {STR_LABEL[strength] || "—"}
                  </span>
                </div>
              )}
              {fieldErrors.password && (
                <div className="emp-field-msg err">
                  <AlertCircle size={10} />
                  {fieldErrors.password}
                </div>
              )}
            </div>

            {/* Confirm */}
            <div className="emp-auth-form-group">
              <label className="emp-auth-label">Confirm Password</label>
              <div className="emp-auth-input-wrap">
                <span className="emp-auth-input-icon">
                  <Lock size={14} />
                </span>
                <input
                  className={`emp-auth-input emp-has-right${
                    fieldErrors.confirmPassword
                      ? " emp-err"
                      : form.confirmPassword &&
                          form.password === form.confirmPassword
                        ? " emp-ok"
                        : ""
                  }`}
                  type={showCpw ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Repeat password"
                  value={form.confirmPassword}
                  onChange={set}
                  autoComplete="new-password"
                />
                <span
                  className="emp-auth-input-icon-right"
                  onClick={() => setShowCpw((v) => !v)}
                >
                  {showCpw ? <EyeOff size={14} /> : <Eye size={14} />}
                </span>
              </div>
              {fieldErrors.confirmPassword && (
                <div className="emp-field-msg err">
                  <AlertCircle size={10} />
                  {fieldErrors.confirmPassword}
                </div>
              )}
              {!fieldErrors.confirmPassword &&
                form.confirmPassword &&
                form.password === form.confirmPassword && (
                  <div className="emp-field-msg ok">
                    <CheckCircle2 size={10} />
                    Passwords match
                  </div>
                )}
            </div>

            {/* Terms */}
            <div className="emp-auth-checkbox-wrap">
              <input
                type="checkbox"
                id="emp-terms"
                name="terms"
                checked={form.terms}
                onChange={set}
              />
              <label htmlFor="emp-terms">
                I agree to the <Link to="/terms">Terms of Service</Link> and{" "}
                <Link to="/privacy">Privacy Policy</Link>, and confirm I am
                authorised to hire on behalf of my company.
              </label>
            </div>
            {fieldErrors.terms && (
              <div
                className="emp-field-msg err"
                style={{ marginTop: -14, marginBottom: 12 }}
              >
                <AlertCircle size={10} />
                {fieldErrors.terms}
              </div>
            )}

            <button className="emp-auth-btn" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="emp-spinner" />
                  Creating Account…
                </>
              ) : (
                "CREATE EMPLOYER ACCOUNT"
              )}
            </button>
          </form>

          <div className="emp-auth-footer">
            Already registered? <Link to="/employer/login">Sign in →</Link>
          </div>
          <div className="emp-auth-footer" style={{ marginTop: 8 }}>
            Looking for work? <Link to="/signup">Job seeker signup →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
