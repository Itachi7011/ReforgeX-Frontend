import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Sun,
  Moon,
  ChevronDown,
  Menu,
  X,
  Bell,
  Zap,
  Shield,
  LogIn,
  UserPlus,
  Briefcase,
  Users,
  TrendingDown,
  Building2,
  HelpCircle,
  LayoutDashboard,
  Bookmark,
  MessageSquare,
  User,
  Settings,
  Star,
  MapPin,
  BarChart2,
  Target,
  FileText,
  Lock,
  Upload,
  Eye,
  Edit3,
  Award,
  FlaskConical,
  CheckCircle,
  AlertTriangle,
  Globe,
  Layers,
  ChevronRight,
  CreditCard,
  LogOut,
} from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";

// SweetAlert2 — dynamically imported to avoid SSR issues
const showAdminAlert = async () => {
  const Swal = (await import("sweetalert2")).default;
  Swal.fire({
    title: "🔒 Restricted Area",
    html: `<p style="font-family:'Syne',sans-serif;font-size:15px;color:#94a3b8;line-height:1.7">
      This section is reserved for <strong style="color:#f59e0b">authorized personnel only</strong>.<br/>
      Unauthorized access attempts are logged and monitored.<br/><br/>
      <span style="font-size:12px;color:#64748b">If you are an admin, please use your secure credentials.</span>
    </p>`,
    icon: "warning",
    background: "#0f172a",
    color: "#e2e8f0",
    confirmButtonColor: "#f59e0b",
    confirmButtonText: "Understood",
    iconColor: "#f59e0b",
    customClass: {
      popup: "rfx-swal-popup",
      title: "rfx-swal-title",
    },
  });
};

// ─────────────────────────────────────────
// Dropdown item helper
// ─────────────────────────────────────────
const DropItem = ({ icon: Icon, label, to, onClick }) => (
  <Link to={to || "#"} className="rfx-navbar-drop-item" onClick={onClick}>
    {Icon && <Icon size={14} className="rfx-navbar-drop-icon" />}
    <span>{label}</span>
    <ChevronRight size={12} className="rfx-navbar-drop-arrow" />
  </Link>
);

const DropGroup = ({ label, children }) => (
  <div className="rfx-navbar-drop-group">
    <span className="rfx-navbar-drop-group-label">{label}</span>
    {children}
  </div>
);

// ─────────────────────────────────────────
// Mega dropdown wrapper
// ─────────────────────────────────────────
const MegaDropdown = ({ trigger, children, align = "left" }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleEnter = () => {
    clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 120); // prevents hover-gap flicker
  };

  return (
    <div
      className={`rfx-navbar-mega ${open ? "rfx-navbar-mega--open" : ""}`}
      ref={ref}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        className="rfx-navbar-nav-btn"
        onClick={() => setOpen((p) => !p)}
        aria-expanded={open}
      >
        {trigger}
        <ChevronDown
          size={13}
          className={`rfx-navbar-chevron ${open ? "rfx-navbar-chevron--up" : ""}`}
        />
      </button>

      <div
        className={`rfx-navbar-mega-panel ${
          align === "right" ? "rfx-navbar-mega-panel--right" : ""
        }`}
      >
        <div className="rfx-navbar-mega-inner">{children}</div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────
// Auth Dropdown
// ─────────────────────────────────────────
const AuthDropdown = ({ isDarkMode }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div
      className={`rfx-navbar-auth-drop ${open ? "rfx-navbar-auth-drop--open" : ""}`}
      ref={ref}
    >
      <button
        className="rfx-navbar-btn rfx-navbar-btn--ghost"
        onClick={() => setOpen((p) => !p)}
      >
        <LogIn size={15} />
        <span>Login</span>
        <ChevronDown
          size={12}
          className={`rfx-navbar-chevron ${open ? "rfx-navbar-chevron--up" : ""}`}
        />
      </button>
      <div className="rfx-navbar-auth-panel">
        <div className="rfx-navbar-auth-panel-header">
          <span>Access Your Account</span>
        </div>
        <Link
          to="/user/auth/login"
          className="rfx-navbar-auth-item rfx-navbar-auth-item--candidate"
        >
          <div className="rfx-navbar-auth-item-icon">
            <User size={16} />
          </div>
          <div>
            <strong>Employee Login</strong>
            <span>Job seekers &amp; candidates</span>
          </div>
        </Link>
        <Link
          to="/employer/auth/login"
          className="rfx-navbar-auth-item rfx-navbar-auth-item--employer"
        >
          <div className="rfx-navbar-auth-item-icon">
            <Briefcase size={16} />
          </div>
          <div>
            <strong>Employer Login</strong>
            <span>Companies &amp; recruiters</span>
          </div>
        </Link>
        <div className="rfx-navbar-auth-divider" />
        <button
          className="rfx-navbar-auth-item rfx-navbar-auth-item--admin"
          onClick={() => {
            setOpen(false);
            showAdminAlert();
          }}
        >
          <div className="rfx-navbar-auth-item-icon">
            <Shield size={16} />
          </div>
          <div>
            <strong>Admin Login</strong>
            <span>Restricted access</span>
          </div>
          <Lock size={12} className="rfx-navbar-auth-lock" />
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────
// Signup Dropdown
// ─────────────────────────────────────────
const SignupDropdown = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div
      className={`rfx-navbar-signup-drop ${open ? "rfx-navbar-signup-drop--open" : ""}`}
      ref={ref}
    >
      <button
        className="rfx-navbar-btn rfx-navbar-btn--primary"
        onClick={() => setOpen((p) => !p)}
      >
        <UserPlus size={15} />
        <span>Sign Up</span>
        <ChevronDown
          size={12}
          className={`rfx-navbar-chevron ${open ? "rfx-navbar-chevron--up" : ""}`}
        />
      </button>
      <div className="rfx-navbar-signup-panel">
        <div className="rfx-navbar-auth-panel-header">
          <span>Create Account</span>
        </div>
        <Link
          to="/user/auth/signup"
          className="rfx-navbar-auth-item rfx-navbar-auth-item--candidate"
        >
          <div className="rfx-navbar-auth-item-icon">
            <User size={16} />
          </div>
          <div>
            <strong>Employee Sign Up</strong>
            <span>Find verified opportunities</span>
          </div>
        </Link>
        <Link
          to="/employer/auth/signup"
          className="rfx-navbar-auth-item rfx-navbar-auth-item--employer"
        >
          <div className="rfx-navbar-auth-item-icon">
            <Building2 size={16} />
          </div>
          <div>
            <strong>Employer Sign Up</strong>
            <span>Hire verified talent</span>
          </div>
        </Link>
        <div className="rfx-navbar-auth-divider" />
        <button
          className="rfx-navbar-auth-item rfx-navbar-auth-item--admin"
          onClick={() => {
            setOpen(false);
            showAdminAlert();
          }}
        >
          <div className="rfx-navbar-auth-item-icon">
            <Shield size={16} />
          </div>
          <div>
            <strong>Admin Sign Up</strong>
            <span>Restricted access</span>
          </div>
          <Lock size={12} className="rfx-navbar-auth-lock" />
        </button>
      </div>
    </div>
  );
};


// ─────────────────────────────────────────
// Mobile Accordion for nested menus
// ─────────────────────────────────────────
const MobileAccordion = ({ icon, label, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rfx-navbar-mobile-accordion">
      <button
        className="rfx-navbar-mobile-accordion-btn"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        {icon && <span className="rfx-navbar-mobile-accordion-icon">{icon}</span>}
        <span>{label}</span>
        <ChevronDown
          size={14}
          className={`rfx-navbar-mobile-chevron ${open ? "rfx-navbar-mobile-chevron--open" : ""}`}
        />
      </button>
      <div className={`rfx-navbar-mobile-sublinks ${open ? "rfx-navbar-mobile-sublinks--open" : ""}`}>
        {children}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────
// PUBLIC NAVBAR
// ─────────────────────────────────────────
const PublicNavbar = ({
  isDarkMode,
  toggleTheme,
  mobileOpen,
  setMobileOpen,
}) => (
  <>
    <nav className={`rfx-navbar-public-nav ${isDarkMode ? "dark" : "light"}`}>
      {/* Left: Logo */}
      <Link to="/" className="rfx-navbar-logo-wrap">
        <div className="rfx-navbar-logo-icon">
          <Zap size={20} />
        </div>
        <span className="rfx-navbar-logo-text">
          Reforge<span className="rfx-navbar-logo-x">X</span>
        </span>
      </Link>

      {/* Center nav links */}
      <div className="rfx-navbar-center">
        <Link to="/" className="rfx-navbar-nav-btn">
          Home
        </Link>

        <MegaDropdown trigger="Explore Talent">
          <DropGroup label="Find Verified Engineers">
            <DropItem
              icon={Users}
              label="Browse Verified Engineers"
              to="/talent/browse"
            />
            <DropItem
              icon={Search}
              label="Search by Skills"
              to="/talent/skills"
            />
            <DropItem icon={Target} label="Search by Role" to="/talent/role" />
            <DropItem
              icon={Star}
              label="Top Rated Profiles"
              to="/talent/top-rated"
            />
          </DropGroup>
        </MegaDropdown>

        <MegaDropdown trigger="Explore Jobs">
          <DropGroup label="Discover Opportunities">
            <DropItem icon={Zap} label="Latest Jobs" to="/jobs/latest" />
            <DropItem icon={Globe} label="Remote Jobs" to="/jobs/remote" />
            <DropItem
              icon={Shield}
              label="High Trust Jobs"
              to="/jobs/high-trust"
            />
            <DropItem icon={Layers} label="Jobs by Skill" to="/jobs/by-skill" />
          </DropGroup>
        </MegaDropdown>

        <MegaDropdown trigger="Layoff Tracker">
          <DropGroup label="Stay Informed">
            <DropItem
              icon={TrendingDown}
              label="Recent Layoffs"
              to="/layoffs/recent"
            />
            <DropItem
              icon={Building2}
              label="Affected Companies"
              to="/layoffs/companies"
            />
            <DropItem
              icon={BarChart2}
              label="Layoff Insights"
              to="/layoffs/insights"
            />
          </DropGroup>
        </MegaDropdown>

        <MegaDropdown trigger="Companies">
          <DropGroup label="Company Directory">
            <DropItem
              icon={Zap}
              label="Startup Directory"
              to="/companies/startups"
            />
            <DropItem
              icon={Building2}
              label="Tech Companies"
              to="/companies/tech"
            />
            <DropItem
              icon={Briefcase}
              label="Hiring Companies"
              to="/companies/hiring"
            />
          </DropGroup>
        </MegaDropdown>

        <MegaDropdown trigger="How It Works">
          <DropGroup label="Learn More">
            <DropItem
              icon={User}
              label="For Candidates"
              to="/how-it-works/candidates"
            />
            <DropItem
              icon={Briefcase}
              label="For Employers"
              to="/how-it-works/employers"
            />
            <DropItem
              icon={CheckCircle}
              label="Verification System"
              to="/how-it-works/verification"
            />
            <DropItem
              icon={Award}
              label="Trust Score System"
              to="/how-it-works/trust-score"
            />
          </DropGroup>
        </MegaDropdown>
      </div>

      {/* Right actions */}
      <div className="rfx-navbar-right">
        <button
          className="rfx-navbar-theme-btn"
          onClick={toggleTheme}
          aria-label={
            isDarkMode ? "Switch to light mode" : "Switch to dark mode"
          }
        >
          {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <AuthDropdown isDarkMode={isDarkMode} />
        <SignupDropdown />

        <Link
          to="/employer/post-job"
          className="rfx-navbar-btn rfx-navbar-btn--amber rfx-navbar-btn--hidden-sm"
        >
          <Briefcase size={14} />
          <span>Post Jobs</span>
        </Link>

        <button
          className="rfx-navbar-mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </nav>

    {/* Mobile Menu */}
    <div
      className={`rfx-navbar-mobile-menu ${mobileOpen ? "rfx-navbar-mobile-menu--open" : ""} ${isDarkMode ? "dark" : "light"}`}
    >
      <MobilePublicLinks setMobileOpen={setMobileOpen} />
    </div>
    <div
      className={`rfx-navbar-overlay ${mobileOpen ? "rfx-navbar-overlay--visible" : ""} ${isDarkMode ? "dark" : "light"}`}
      onClick={() => setMobileOpen(false)}
      aria-hidden="true"
    />
  </>
);

const MobilePublicLinks = ({ setMobileOpen }) => {
  const close = () => setMobileOpen(false);

  const sections = [
    {
      icon: <Users size={16} />,
      label: "Explore Talent",
      links: [
        { icon: <Users size={14} />, label: "Browse Verified Engineers", to: "/talent/browse" },
        { icon: <Search size={14} />, label: "Search by Skills", to: "/talent/skills" },
        { icon: <Target size={14} />, label: "Search by Role", to: "/talent/role" },
        { icon: <Star size={14} />, label: "Top Rated Profiles", to: "/talent/top-rated" },
      ],
    },
    {
      icon: <Briefcase size={16} />,
      label: "Explore Jobs",
      links: [
        { icon: <Zap size={14} />, label: "Latest Jobs", to: "/jobs/latest" },
        { icon: <Globe size={14} />, label: "Remote Jobs", to: "/jobs/remote" },
        { icon: <Shield size={14} />, label: "High Trust Jobs", to: "/jobs/high-trust" },
        { icon: <Layers size={14} />, label: "Jobs by Skill", to: "/jobs/by-skill" },
      ],
    },
    {
      icon: <TrendingDown size={16} />,
      label: "Layoff Tracker",
      links: [
        { icon: <TrendingDown size={14} />, label: "Recent Layoffs", to: "/layoffs/recent" },
        { icon: <Building2 size={14} />, label: "Affected Companies", to: "/layoffs/companies" },
        { icon: <BarChart2 size={14} />, label: "Layoff Insights", to: "/layoffs/insights" },
      ],
    },
    {
      icon: <Building2 size={16} />,
      label: "Companies",
      links: [
        { icon: <Zap size={14} />, label: "Startup Directory", to: "/companies/startups" },
        { icon: <Building2 size={14} />, label: "Tech Companies", to: "/companies/tech" },
        { icon: <Briefcase size={14} />, label: "Hiring Companies", to: "/companies/hiring" },
      ],
    },
    {
      icon: <HelpCircle size={16} />,
      label: "How It Works",
      links: [
        { icon: <User size={14} />, label: "For Candidates", to: "/how-it-works/candidates" },
        { icon: <Briefcase size={14} />, label: "For Employers", to: "/how-it-works/employers" },
        { icon: <CheckCircle size={14} />, label: "Verification System", to: "/how-it-works/verification" },
        { icon: <Award size={14} />, label: "Trust Score System", to: "/how-it-works/trust-score" },
      ],
    },
  ];

  return (
    <div className="rfx-navbar-mobile-links">
      <Link to="/" className="rfx-navbar-mobile-link" onClick={close}>
        <Zap size={16} />
        <span>Home</span>
      </Link>

      {sections.map((section, idx) => (
        <MobileAccordion key={idx} icon={section.icon} label={section.label}>
          {section.links.map((link, i) => (
            <Link key={i} to={link.to} className="rfx-navbar-mobile-sublink" onClick={close}>
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </MobileAccordion>
      ))}

      <div className="rfx-navbar-mobile-divider" />
      <Link to="/user/auth/login" className="rfx-navbar-mobile-link rfx-navbar-mobile-link--auth" onClick={close}>
        <LogIn size={14} /> Employee Login
      </Link>
      <Link to="/employer/auth/login" className="rfx-navbar-mobile-link rfx-navbar-mobile-link--auth" onClick={close}>
        <LogIn size={14} /> Employer Login
      </Link>
      <Link to="/user/auth/signup" className="rfx-navbar-mobile-link rfx-navbar-mobile-link--signup" onClick={close}>
        <UserPlus size={14} /> Employee Sign Up
      </Link>
      <Link to="/employer/auth/signup" className="rfx-navbar-mobile-link rfx-navbar-mobile-link--signup" onClick={close}>
        <UserPlus size={14} /> Employer Sign Up
      </Link>
      <button className="rfx-navbar-mobile-link rfx-navbar-mobile-link--admin" onClick={() => { close(); showAdminAlert(); }}>
        <Shield size={14} /> Admin Access
      </button>
    </div>
  );
};

// ─────────────────────────────────────────
// CANDIDATE NAVBAR
// ─────────────────────────────────────────
const CandidateNavbar = ({
  isDarkMode,
  toggleTheme,
  mobileOpen,
  setMobileOpen,
}) => (
  <>
    <nav
      className={`rfx-navbar-candidate-nav ${isDarkMode ? "dark" : "light"}`}
    >
      <Link to="/dashboard/employee" className="rfx-navbar-logo-wrap">
        <div className="rfx-navbar-logo-icon rfx-navbar-logo-icon--candidate">
          <Zap size={20} />
        </div>
        <span className="rfx-navbar-logo-text">
          Reforge<span className="rfx-navbar-logo-x">X</span>
        </span>
      </Link>

      <div className="rfx-navbar-center">
        <MegaDropdown trigger="Dashboard">
          <DropGroup label="My Overview">
            <DropItem
              icon={LayoutDashboard}
              label="Overview"
              to="/dashboard/employee"
            />
            <DropItem
              icon={Zap}
              label="Profile Strength"
              to="/dashboard/employee/profile-strength"
            />
            <DropItem
              icon={Award}
              label="Trust Score"
              to="/dashboard/employee/trust-score"
            />
            <DropItem
              icon={CheckCircle}
              label="Verification Status"
              to="/dashboard/employee/verification"
            />
            <DropItem
              icon={BarChart2}
              label="Activity Summary"
              to="/dashboard/employee/activity"
            />
          </DropGroup>
        </MegaDropdown>

        <MegaDropdown trigger="Jobs">
          <DropGroup label="Job Management">
            <DropItem
              icon={Star}
              label="Recommended Jobs"
              to="/jobs/recommended"
            />
            <DropItem icon={FileText} label="Applied Jobs" to="/jobs/applied" />
            <DropItem icon={Bookmark} label="Saved Jobs" to="/jobs/saved" />
            <DropItem
              icon={Target}
              label="Match Score Jobs"
              to="/jobs/match-score"
            />
            <DropItem icon={Globe} label="Remote Jobs" to="/jobs/remote" />
          </DropGroup>
        </MegaDropdown>

        <MegaDropdown trigger="Talent Feed">
          <DropGroup label="Discover Talent">
            <DropItem
              icon={Award}
              label="Top Engineers"
              to="/feed/top-engineers"
            />
            <DropItem
              icon={CheckCircle}
              label="Verified Talent"
              to="/feed/verified"
            />
            <DropItem
              icon={TrendingDown}
              label="Trending Profiles"
              to="/feed/trending"
            />
            <DropItem
              icon={Layers}
              label="Skill-based Feed"
              to="/feed/skill-based"
            />
          </DropGroup>
        </MegaDropdown>

        <MegaDropdown trigger="Layoff Tracker">
          <DropGroup label="Market Intelligence">
            <DropItem
              icon={Building2}
              label="Company Layoffs"
              to="/layoffs/companies"
            />
            <DropItem
              icon={BarChart2}
              label="Industry Trends"
              to="/layoffs/trends"
            />
            <DropItem
              icon={MapPin}
              label="Affected Companies Near Me"
              to="/layoffs/nearby"
            />
            <DropItem
              icon={Zap}
              label="Recovery Opportunities"
              to="/layoffs/recovery"
            />
          </DropGroup>
        </MegaDropdown>

        <MegaDropdown trigger="Messages">
          <DropGroup label="Communications">
            <DropItem
              icon={MessageSquare}
              label="Recruiter Chats"
              to="/messages/recruiter"
            />
            <DropItem
              icon={Briefcase}
              label="Interview Requests"
              to="/messages/interviews"
            />
            <DropItem
              icon={Bell}
              label="System Notifications"
              to="/messages/notifications"
            />
          </DropGroup>
        </MegaDropdown>

        <MegaDropdown trigger="Profile" align="right">
          <DropGroup label="My Profile">
            <DropItem icon={Eye} label="View Profile" to="/profile/view" />
            <DropItem icon={Edit3} label="Edit Profile" to="/profile/edit" />
            <DropItem
              icon={Upload}
              label="Upload Resume"
              to="/profile/resume"
            />
            <DropItem
              icon={CheckCircle}
              label="Verification Center"
              to="/profile/verification"
            />
            <DropItem
              icon={Lock}
              label="Privacy Settings"
              to="/profile/privacy"
            />
            <DropItem
              icon={Settings}
              label="Account Settings"
              to="/profile/settings"
            />
          </DropGroup>
        </MegaDropdown>
      </div>

      <div className="rfx-navbar-right">
        <button
          className="rfx-navbar-theme-btn"
          onClick={toggleTheme}
          aria-label={
            isDarkMode ? "Switch to light mode" : "Switch to dark mode"
          }
        >
          {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <Link
          to="/dashboard/employee/trust-score"
          className="rfx-navbar-trust-badge rfx-navbar-trust-badge--candidate"
        >
          <Award size={13} />
          <span>Trust Score</span>
          <span className="rfx-navbar-trust-val">92</span>
        </Link>

        <Link
          to="/notifications"
          className="rfx-navbar-icon-btn"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="rfx-navbar-notif-dot" />
        </Link>

        <Link
          to="/jobs/quick-apply"
          className="rfx-navbar-btn rfx-navbar-btn--primary rfx-navbar-btn--hidden-sm"
        >
          <Zap size={14} />
          <span>Quick Apply</span>
        </Link>

        <button
          className="rfx-navbar-mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </nav>

    <div
      className={`rfx-navbar-mobile-menu ${mobileOpen ? "rfx-navbar-mobile-menu--open" : ""} ${isDarkMode ? "dark" : "light"}`}
    >
      <MobileCandidateLinks setMobileOpen={setMobileOpen} />
    </div>
    <div
      className={`rfx-navbar-overlay ${mobileOpen ? "rfx-navbar-overlay--visible" : ""} ${isDarkMode ? "dark" : "light"}`}
      onClick={() => setMobileOpen(false)}
      aria-hidden="true"
    />
  </>
);

const MobileCandidateLinks = ({ setMobileOpen }) => {
  const close = () => setMobileOpen(false);

  const sections = [
    {
      icon: <LayoutDashboard size={16} />,
      label: "Dashboard",
      links: [
        { icon: <LayoutDashboard size={14} />, label: "Overview", to: "/dashboard/employee" },
        { icon: <Zap size={14} />, label: "Profile Strength", to: "/dashboard/employee/profile-strength" },
        { icon: <Award size={14} />, label: "Trust Score", to: "/dashboard/employee/trust-score" },
        { icon: <CheckCircle size={14} />, label: "Verification Status", to: "/dashboard/employee/verification" },
        { icon: <BarChart2 size={14} />, label: "Activity Summary", to: "/dashboard/employee/activity" },
      ],
    },
    {
      icon: <Briefcase size={16} />,
      label: "Jobs",
      links: [
        { icon: <Star size={14} />, label: "Recommended Jobs", to: "/jobs/recommended" },
        { icon: <FileText size={14} />, label: "Applied Jobs", to: "/jobs/applied" },
        { icon: <Bookmark size={14} />, label: "Saved Jobs", to: "/jobs/saved" },
        { icon: <Target size={14} />, label: "Match Score Jobs", to: "/jobs/match-score" },
        { icon: <Globe size={14} />, label: "Remote Jobs", to: "/jobs/remote" },
      ],
    },
    {
      icon: <Users size={16} />,
      label: "Talent Feed",
      links: [
        { icon: <Award size={14} />, label: "Top Engineers", to: "/feed/top-engineers" },
        { icon: <CheckCircle size={14} />, label: "Verified Talent", to: "/feed/verified" },
        { icon: <TrendingDown size={14} />, label: "Trending Profiles", to: "/feed/trending" },
        { icon: <Layers size={14} />, label: "Skill-based Feed", to: "/feed/skill-based" },
      ],
    },
    {
      icon: <TrendingDown size={16} />,
      label: "Layoff Tracker",
      links: [
        { icon: <Building2 size={14} />, label: "Company Layoffs", to: "/layoffs/companies" },
        { icon: <BarChart2 size={14} />, label: "Industry Trends", to: "/layoffs/trends" },
        { icon: <MapPin size={14} />, label: "Affected Companies Near Me", to: "/layoffs/nearby" },
        { icon: <Zap size={14} />, label: "Recovery Opportunities", to: "/layoffs/recovery" },
      ],
    },
    {
      icon: <MessageSquare size={16} />,
      label: "Messages",
      links: [
        { icon: <MessageSquare size={14} />, label: "Recruiter Chats", to: "/messages/recruiter" },
        { icon: <Briefcase size={14} />, label: "Interview Requests", to: "/messages/interviews" },
        { icon: <Bell size={14} />, label: "System Notifications", to: "/messages/notifications" },
      ],
    },
    {
      icon: <User size={16} />,
      label: "Profile",
      links: [
        { icon: <Eye size={14} />, label: "View Profile", to: "/profile/view" },
        { icon: <Edit3 size={14} />, label: "Edit Profile", to: "/profile/edit" },
        { icon: <Upload size={14} />, label: "Upload Resume", to: "/profile/resume" },
        { icon: <CheckCircle size={14} />, label: "Verification Center", to: "/profile/verification" },
        { icon: <Lock size={14} />, label: "Privacy Settings", to: "/profile/privacy" },
        { icon: <Settings size={14} />, label: "Account Settings", to: "/profile/settings" },
      ],
    },
  ];

  return (
    <div className="rfx-navbar-mobile-links">
      {sections.map((section, idx) => (
        <MobileAccordion key={idx} icon={section.icon} label={section.label}>
          {section.links.map((link, i) => (
            <Link key={i} to={link.to} className="rfx-navbar-mobile-sublink" onClick={close}>
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </MobileAccordion>
      ))}
      <div className="rfx-navbar-mobile-divider" />
      <Link to="/jobs/quick-apply" className="rfx-navbar-mobile-link rfx-navbar-mobile-link--cta" onClick={close}>
        <Zap size={14} /> Quick Apply
      </Link>
    </div>
  );
};
// ─────────────────────────────────────────
// EMPLOYER NAVBAR
// ─────────────────────────────────────────
const EmployerNavbar = ({
  isDarkMode,
  toggleTheme,
  mobileOpen,
  setMobileOpen,
}) => (
  <>
    <nav className={`rfx-navbar-employer-nav ${isDarkMode ? "dark" : "light"}`}>
      <Link to="/dashboard/employer" className="rfx-navbar-logo-wrap">
        <div className="rfx-navbar-logo-icon rfx-navbar-logo-icon--employer">
          <Zap size={20} />
        </div>
        <span className="rfx-navbar-logo-text">
          Reforge<span className="rfx-navbar-logo-x">X</span>
        </span>
      </Link>

      <div className="rfx-navbar-center">
        <MegaDropdown trigger="Dashboard">
          <DropGroup label="Company Overview">
            <DropItem
              icon={LayoutDashboard}
              label="Hiring Overview"
              to="/dashboard/employer"
            />
            <DropItem
              icon={BarChart2}
              label="Job Performance"
              to="/dashboard/employer/job-performance"
            />
            <DropItem
              icon={Users}
              label="Candidate Pipeline"
              to="/dashboard/employer/pipeline"
            />
            <DropItem
              icon={FlaskConical}
              label="Application Analytics"
              to="/dashboard/employer/analytics"
            />
            <DropItem
              icon={Shield}
              label="Trust Metrics"
              to="/dashboard/employer/trust-metrics"
            />
          </DropGroup>
        </MegaDropdown>

        <MegaDropdown trigger="Candidates">
          <DropGroup label="Talent Pool">
            <DropItem
              icon={CheckCircle}
              label="Verified Candidates"
              to="/candidates/verified"
            />
            <DropItem
              icon={Star}
              label="Recommended Candidates"
              to="/candidates/recommended"
            />
            <DropItem
              icon={Bookmark}
              label="Saved Candidates"
              to="/candidates/saved"
            />
            <DropItem
              icon={Target}
              label="Shortlisted"
              to="/candidates/shortlisted"
            />
            <DropItem
              icon={Award}
              label="High Trust Engineers"
              to="/candidates/high-trust"
            />
          </DropGroup>
        </MegaDropdown>

        <MegaDropdown trigger="Jobs">
          <DropGroup label="Job Management">
            <DropItem icon={FileText} label="Post Job" to="/jobs/post" />
            <DropItem
              icon={CheckCircle}
              label="Active Jobs"
              to="/jobs/active"
            />
            <DropItem icon={Edit3} label="Draft Jobs" to="/jobs/drafts" />
            <DropItem icon={X} label="Closed Jobs" to="/jobs/closed" />
            <DropItem
              icon={BarChart2}
              label="Job Analytics"
              to="/jobs/analytics"
            />
          </DropGroup>
        </MegaDropdown>

        <MegaDropdown trigger="Talent Search">
          <DropGroup label="Advanced Search">
            <DropItem
              icon={Search}
              label="Search Engineers"
              to="/search/engineers"
            />
            <DropItem
              icon={Layers}
              label="Search by Skill Graph"
              to="/search/skill-graph"
            />
            <DropItem
              icon={Award}
              label="Search by Trust Score"
              to="/search/trust-score"
            />
            <DropItem
              icon={TrendingDown}
              label="Search by Layoff Status"
              to="/search/layoff-status"
            />
            <DropItem
              icon={Zap}
              label="AI Matching (Beta)"
              to="/search/ai-matching"
            />
          </DropGroup>
        </MegaDropdown>

        <MegaDropdown trigger="Layoff Insights">
          <DropGroup label="Market Intelligence">
            <DropItem
              icon={BarChart2}
              label="Industry Layoff Trends"
              to="/insights/trends"
            />
            <DropItem
              icon={AlertTriangle}
              label="Company Risk Signals"
              to="/insights/risk-signals"
            />
            <DropItem
              icon={Users}
              label="Available Talent Pools"
              to="/insights/talent-pools"
            />
            <DropItem
              icon={Zap}
              label="Fast Hiring Pools"
              to="/insights/fast-hiring"
            />
          </DropGroup>
        </MegaDropdown>

        <MegaDropdown trigger="Messages" align="right">
          <DropGroup label="Communications">
            <DropItem
              icon={MessageSquare}
              label="Candidate Conversations"
              to="/messages/candidates"
            />
            <DropItem
              icon={Briefcase}
              label="Interview Scheduling"
              to="/messages/interviews"
            />
            <DropItem icon={Users} label="Team Messages" to="/messages/team" />
            <DropItem icon={Bell} label="System Alerts" to="/messages/alerts" />
          </DropGroup>
        </MegaDropdown>
      </div>

      <div className="rfx-navbar-right">
        <button
          className="rfx-navbar-theme-btn"
          onClick={toggleTheme}
          aria-label={
            isDarkMode ? "Switch to light mode" : "Switch to dark mode"
          }
        >
          {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <div className="rfx-navbar-trust-badge rfx-navbar-trust-badge--employer">
          <Shield size={13} />
          <span>Employer Badge</span>
        </div>

        <Link
          to="/notifications"
          className="rfx-navbar-icon-btn"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="rfx-navbar-notif-dot" />
        </Link>

        <Link
          to="/jobs/post"
          className="rfx-navbar-btn rfx-navbar-btn--amber rfx-navbar-btn--hidden-sm"
        >
          <Briefcase size={14} />
          <span>Post Job</span>
        </Link>

        <MegaDropdown trigger={<Settings size={17} />} align="right">
          <DropGroup label="Account">
            <DropItem
              icon={CreditCard}
              label="Billing / Subscription"
              to="/employer/billing"
            />
            <DropItem
              icon={Building2}
              label="Company Profile"
              to="/employer/profile"
            />
            <DropItem
              icon={Settings}
              label="Account Settings"
              to="/employer/settings"
            />
            <DropItem icon={LogOut} label="Logout" to="/logout" />
          </DropGroup>
        </MegaDropdown>

        <button
          className="rfx-navbar-mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </nav>

    <div
      className={`rfx-navbar-mobile-menu ${mobileOpen ? "rfx-navbar-mobile-menu--open" : ""} ${isDarkMode ? "dark" : "light"}`}
    >
      <MobileEmployerLinks setMobileOpen={setMobileOpen} />
    </div>
    <div
      className={`rfx-navbar-overlay ${mobileOpen ? "rfx-navbar-overlay--visible" : ""} ${isDarkMode ? "dark" : "light"}`}
      onClick={() => setMobileOpen(false)}
      aria-hidden="true"
    />
  </>
);

const MobileEmployerLinks = ({ setMobileOpen }) => {
  const close = () => setMobileOpen(false);

  const sections = [
    {
      icon: <LayoutDashboard size={16} />,
      label: "Dashboard",
      links: [
        { icon: <LayoutDashboard size={14} />, label: "Hiring Overview", to: "/dashboard/employer" },
        { icon: <BarChart2 size={14} />, label: "Job Performance", to: "/dashboard/employer/job-performance" },
        { icon: <Users size={14} />, label: "Candidate Pipeline", to: "/dashboard/employer/pipeline" },
        { icon: <FlaskConical size={14} />, label: "Application Analytics", to: "/dashboard/employer/analytics" },
        { icon: <Shield size={14} />, label: "Trust Metrics", to: "/dashboard/employer/trust-metrics" },
      ],
    },
    {
      icon: <Users size={16} />,
      label: "Candidates",
      links: [
        { icon: <CheckCircle size={14} />, label: "Verified Candidates", to: "/candidates/verified" },
        { icon: <Star size={14} />, label: "Recommended Candidates", to: "/candidates/recommended" },
        { icon: <Bookmark size={14} />, label: "Saved Candidates", to: "/candidates/saved" },
        { icon: <Target size={14} />, label: "Shortlisted", to: "/candidates/shortlisted" },
        { icon: <Award size={14} />, label: "High Trust Engineers", to: "/candidates/high-trust" },
      ],
    },
    {
      icon: <Briefcase size={16} />,
      label: "Jobs",
      links: [
        { icon: <FileText size={14} />, label: "Post Job", to: "/jobs/post" },
        { icon: <CheckCircle size={14} />, label: "Active Jobs", to: "/jobs/active" },
        { icon: <Edit3 size={14} />, label: "Draft Jobs", to: "/jobs/drafts" },
        { icon: <X size={14} />, label: "Closed Jobs", to: "/jobs/closed" },
        { icon: <BarChart2 size={14} />, label: "Job Analytics", to: "/jobs/analytics" },
      ],
    },
    {
      icon: <Search size={16} />,
      label: "Talent Search",
      links: [
        { icon: <Search size={14} />, label: "Search Engineers", to: "/search/engineers" },
        { icon: <Layers size={14} />, label: "Search by Skill Graph", to: "/search/skill-graph" },
        { icon: <Award size={14} />, label: "Search by Trust Score", to: "/search/trust-score" },
        { icon: <TrendingDown size={14} />, label: "Search by Layoff Status", to: "/search/layoff-status" },
        { icon: <Zap size={14} />, label: "AI Matching (Beta)", to: "/search/ai-matching" },
      ],
    },
    {
      icon: <BarChart2 size={16} />,
      label: "Layoff Insights",
      links: [
        { icon: <BarChart2 size={14} />, label: "Industry Layoff Trends", to: "/insights/trends" },
        { icon: <AlertTriangle size={14} />, label: "Company Risk Signals", to: "/insights/risk-signals" },
        { icon: <Users size={14} />, label: "Available Talent Pools", to: "/insights/talent-pools" },
        { icon: <Zap size={14} />, label: "Fast Hiring Pools", to: "/insights/fast-hiring" },
      ],
    },
    {
      icon: <MessageSquare size={16} />,
      label: "Messages",
      links: [
        { icon: <MessageSquare size={14} />, label: "Candidate Conversations", to: "/messages/candidates" },
        { icon: <Briefcase size={14} />, label: "Interview Scheduling", to: "/messages/interviews" },
        { icon: <Users size={14} />, label: "Team Messages", to: "/messages/team" },
        { icon: <Bell size={14} />, label: "System Alerts", to: "/messages/alerts" },
      ],
    },
  ];

  return (
    <div className="rfx-navbar-mobile-links">
      {sections.map((section, idx) => (
        <MobileAccordion key={idx} icon={section.icon} label={section.label}>
          {section.links.map((link, i) => (
            <Link key={i} to={link.to} className="rfx-navbar-mobile-sublink" onClick={close}>
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </MobileAccordion>
      ))}
      <div className="rfx-navbar-mobile-divider" />
      <Link to="/jobs/post" className="rfx-navbar-mobile-link rfx-navbar-mobile-link--cta" onClick={close}>
        <Briefcase size={14} /> Post Job
      </Link>
      <Link to="/employer/billing" className="rfx-navbar-mobile-link" onClick={close}>
        <CreditCard size={14} /> Billing
      </Link>
    </div>
  );
};

// ─────────────────────────────────────────
// MAIN NAVBAR COMPONENT
// ─────────────────────────────────────────
const Navbar = ({ userType = "public" }) => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const props = { isDarkMode, toggleTheme, mobileOpen, setMobileOpen };

  if (userType === "candidate") return <CandidateNavbar {...props} />;
  if (userType === "employer") return <EmployerNavbar {...props} />;
  return <PublicNavbar {...props} />;
};

export default Navbar;
