import { useState, useEffect, useCallback } from "react";
import {
  ChevronUp,
  ChevronDown,
  Briefcase,
  Shield,
  Users,
  FileText,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Twitter,
  Github,
  Youtube,
  ArrowUpRight,
  Zap,
  Lock,
  HeartHandshake,
  BookOpen,
  LifeBuoy,
  Newspaper,
  BadgeCheck,
  Building2,
  Code2,
  TrendingUp,
  MessageSquare,
  Globe,
  Bell,
  Star,
  Award,
} from "lucide-react";

const ReforgeXFooter = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  const currentYear = new Date().getFullYear();

  const platformLinks = [
    { label: "Find Jobs", href: "/jobs", icon: <Briefcase size={14} /> },
    { label: "Verified Profiles", href: "/profiles", icon: <BadgeCheck size={14} /> },
    { label: "Identity Verification", href: "/verify", icon: <Shield size={14} /> },
    { label: "Skill Assessment", href: "/skills", icon: <Code2 size={14} /> },
    { label: "Resume Builder", href: "/resume", icon: <FileText size={14} /> },
    { label: "Career Insights", href: "/insights", icon: <TrendingUp size={14} /> },
  ];

  const communityLinks = [
    { label: "Layoff Support Groups", href: "/community/support", icon: <HeartHandshake size={14} /> },
    { label: "Peer Network", href: "/community/network", icon: <Users size={14} /> },
    { label: "Success Stories", href: "/community/stories", icon: <Star size={14} /> },
    { label: "Mentorship Program", href: "/mentorship", icon: <Award size={14} /> },
    { label: "Discussion Forums", href: "/forums", icon: <MessageSquare size={14} /> },
    { label: "Events & Webinars", href: "/events", icon: <Bell size={14} /> },
  ];

  const companyLinks = [
    { label: "About ReforgeX", href: "/about", icon: <Zap size={14} /> },
    { label: "For Employers", href: "/employers", icon: <Building2 size={14} /> },
    { label: "Press & Media", href: "/press", icon: <Newspaper size={14} /> },
    { label: "Blog", href: "/blog", icon: <BookOpen size={14} /> },
    { label: "Careers at ReforgeX", href: "/careers", icon: <Briefcase size={14} /> },
    { label: "Partner With Us", href: "/partners", icon: <Globe size={14} /> },
  ];

  const supportLinks = [
    { label: "Help Center", href: "/help", icon: <LifeBuoy size={14} /> },
    { label: "Contact Support", href: "/contact", icon: <Mail size={14} /> },
    { label: "Privacy Policy", href: "/privacy", icon: <Lock size={14} /> },
    { label: "Terms of Service", href: "/terms", icon: <FileText size={14} /> },
    { label: "Cookie Policy", href: "/cookies", icon: <FileText size={14} /> },
    { label: "Trust & Safety", href: "/trust", icon: <Shield size={14} /> },
  ];

  const socialLinks = [
    { icon: <Linkedin size={18} />, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: <Twitter size={18} />, href: "https://twitter.com", label: "Twitter / X" },
    { icon: <Github size={18} />, href: "https://github.com", label: "GitHub" },
    { icon: <Youtube size={18} />, href: "https://youtube.com", label: "YouTube" },
  ];

  const stats = [
    { value: "48K+", label: "Verified Profiles" },
    { value: "12K+", label: "Jobs Matched" },
    { value: "3.2K+", label: "Employers" },
    { value: "94%", label: "Rehire Rate" },
  ];

  return (
    <>
      {/* Scroll to Top Button */}
      <button
        className={`rfx-scroll-top-btn ${showScrollTop ? "rfx-scroll-top-btn--visible" : ""}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
        title="Back to top"
      >
        <ChevronUp size={22} />
        <span className="rfx-scroll-top-label">TOP</span>
      </button>

      <footer className="rfx-footer">
        {/* Toggle Bar */}
        <div className="rfx-footer__toggle-bar">
          <div className="rfx-footer__toggle-bar-inner">
            <div className="rfx-footer__toggle-left">
              <span className="rfx-footer__toggle-pulse"></span>
              <span className="rfx-footer__toggle-text">
                {isExpanded ? "Full Footer Active" : "Footer Collapsed"}
              </span>
            </div>
            <button
              className="rfx-footer__toggle-btn"
              onClick={() => setIsExpanded((prev) => !prev)}
              aria-expanded={isExpanded}
              aria-label={isExpanded ? "Collapse footer" : "Expand footer"}
            >
              {isExpanded ? (
                <>
                  <ChevronDown size={16} />
                  <span>Collapse Footer</span>
                </>
              ) : (
                <>
                  <ChevronUp size={16} />
                  <span>Expand Footer</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Collapsible Body */}
        <div className={`rfx-footer__body ${isExpanded ? "rfx-footer__body--expanded" : "rfx-footer__body--collapsed"}`}>

          {/* Stats Strip */}
          <div className="rfx-footer__stats-strip">
            {stats.map((s, i) => (
              <div key={i} className="rfx-footer__stat">
                <span className="rfx-footer__stat-value">{s.value}</span>
                <span className="rfx-footer__stat-label">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Main Content */}
          <div className="rfx-footer__main">

            {/* Brand Column */}
            <div className="rfx-footer__brand-col">
              <a href="/" className="rfx-footer__logo" aria-label="ReforgeX Home">
                <div className="rfx-footer__logo-icon">
                  <Zap size={22} strokeWidth={2.5} />
                </div>
                <div className="rfx-footer__logo-text">
                  <span className="rfx-footer__logo-name">ReforgeX</span>
                  <span className="rfx-footer__logo-tagline">Reborn. Verified. Hired.</span>
                </div>
              </a>

              <p className="rfx-footer__brand-desc">
                ReforgeX is the only IT-focused career platform built exclusively
                for laid-off tech professionals — with deep identity verification,
                work history validation, and employer-trust signals baked in.
              </p>

              <div className="rfx-footer__trust-badges">
                <span className="rfx-footer__badge">
                  <Shield size={13} /> SOC 2 Certified
                </span>
                <span className="rfx-footer__badge">
                  <Lock size={13} /> End-to-End Verified
                </span>
                <span className="rfx-footer__badge">
                  <BadgeCheck size={13} /> GDPR Compliant
                </span>
              </div>

              {/* Social Links */}
              <div className="rfx-footer__socials">
                <p className="rfx-footer__socials-label">Follow Our Journey</p>
                <div className="rfx-footer__social-icons">
                  {socialLinks.map((s, i) => (
                    <a
                      key={i}
                      href={s.href}
                      className="rfx-footer__social-icon"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                    >
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Links Grid */}
            <div className="rfx-footer__links-grid">

              <div className="rfx-footer__link-col">
                <h3 className="rfx-footer__col-heading">
                  <Briefcase size={15} /> Platform
                </h3>
                <ul className="rfx-footer__link-list">
                  {platformLinks.map((link, i) => (
                    <li key={i}>
                      <a href={link.href} className="rfx-footer__link">
                        <span className="rfx-footer__link-icon">{link.icon}</span>
                        {link.label}
                        <ArrowUpRight size={11} className="rfx-footer__link-arrow" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rfx-footer__link-col">
                <h3 className="rfx-footer__col-heading">
                  <Users size={15} /> Community
                </h3>
                <ul className="rfx-footer__link-list">
                  {communityLinks.map((link, i) => (
                    <li key={i}>
                      <a href={link.href} className="rfx-footer__link">
                        <span className="rfx-footer__link-icon">{link.icon}</span>
                        {link.label}
                        <ArrowUpRight size={11} className="rfx-footer__link-arrow" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rfx-footer__link-col">
                <h3 className="rfx-footer__col-heading">
                  <Building2 size={15} /> Company
                </h3>
                <ul className="rfx-footer__link-list">
                  {companyLinks.map((link, i) => (
                    <li key={i}>
                      <a href={link.href} className="rfx-footer__link">
                        <span className="rfx-footer__link-icon">{link.icon}</span>
                        {link.label}
                        <ArrowUpRight size={11} className="rfx-footer__link-arrow" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rfx-footer__link-col">
                <h3 className="rfx-footer__col-heading">
                  <LifeBuoy size={15} /> Support
                </h3>
                <ul className="rfx-footer__link-list">
                  {supportLinks.map((link, i) => (
                    <li key={i}>
                      <a href={link.href} className="rfx-footer__link">
                        <span className="rfx-footer__link-icon">{link.icon}</span>
                        {link.label}
                        <ArrowUpRight size={11} className="rfx-footer__link-arrow" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>

          {/* Newsletter */}
          <div className="rfx-footer__newsletter-section">
            <div className="rfx-footer__newsletter-inner">
              <div className="rfx-footer__newsletter-copy">
                <h4 className="rfx-footer__newsletter-heading">
                  <Bell size={18} /> Stay Ahead of the Curve
                </h4>
                <p className="rfx-footer__newsletter-desc">
                  Get weekly layoff alerts, verified job drops, and career comeback guides
                  delivered straight to your inbox. No spam — just signal.
                </p>
              </div>
              <form
                className="rfx-footer__newsletter-form"
                onSubmit={handleSubscribe}
              >
                <div className="rfx-footer__newsletter-input-wrap">
                  <Mail size={16} className="rfx-footer__newsletter-mail-icon" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="rfx-footer__newsletter-input"
                    required
                    aria-label="Email for newsletter"
                  />
                </div>
                <button type="submit" className="rfx-footer__newsletter-btn">
                  {subscribed ? (
                    <><BadgeCheck size={16} /> Subscribed!</>
                  ) : (
                    <><Zap size={16} /> Subscribe</>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Row */}
          <div className="rfx-footer__contact-row">
            <a href="mailto:support@reforgex.io" className="rfx-footer__contact-item">
              <Mail size={15} /> support@reforgex.io
            </a>
            <a href="tel:+18005550199" className="rfx-footer__contact-item">
              <Phone size={15} /> +1 (800) 555-0199
            </a>
            <span className="rfx-footer__contact-item rfx-footer__contact-item--no-link">
              <MapPin size={15} /> San Francisco, CA · Remote-First
            </span>
          </div>

        </div>{/* end collapsible body */}

        {/* Bottom Bar — always visible */}
        <div className="rfx-footer__bottom-bar">
          <div className="rfx-footer__bottom-inner">
            <p className="rfx-footer__copyright">
              © {currentYear} ReforgeX, Inc. All rights reserved.
            </p>
            <div className="rfx-footer__bottom-links">
              <a href="/privacy" className="rfx-footer__bottom-link">Privacy</a>
              <span className="rfx-footer__bottom-sep">·</span>
              <a href="/terms" className="rfx-footer__bottom-link">Terms</a>
              <span className="rfx-footer__bottom-sep">·</span>
              <a href="/cookies" className="rfx-footer__bottom-link">Cookies</a>
              <span className="rfx-footer__bottom-sep">·</span>
              <a href="/sitemap" className="rfx-footer__bottom-link">Sitemap</a>
            </div>
            <p className="rfx-footer__made-with">
              Crafted with <span className="rfx-footer__heart">♥</span> for the IT community
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default ReforgeXFooter;