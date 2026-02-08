"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const SECTIONS = [
  { id: "hero", num: "01", title: "Home" },
  { id: "about", num: "02", title: "About" },
  { id: "lifestyle", num: "03", title: "Lifestyle" },
  { id: "career", num: "04", title: "Career" },
  { id: "community", num: "05", title: "Community" },
  { id: "location", num: "06", title: "Location" },
  { id: "waitlist", num: "07", title: "Waitlist" },
];

const DARK_SECTIONS = new Set(["about", "community"]);

const COURSES = [
  {
    name: "Artificial Intelligence (AI) & Machine Learning (ML)",
    hint: "Neural networks, NLP, and automation — the backbone of modern tech.",
  },
  {
    name: "Data Science & Analytics",
    hint: "Interpret big data to drive business decisions and strategy.",
  },
  {
    name: "Cybersecurity & Ethical Hacking",
    hint: "Protect digital infrastructure from rising cyber threats.",
  },
  {
    name: "Full Stack Web Development",
    hint: "Front-end + back-end mastery (MERN, Next.js, etc.).",
  },
  {
    name: "Cloud Computing & DevOps",
    hint: "Cloud infrastructure, CI/CD pipelines, and automation tools.",
  },
  {
    name: "Digital Marketing & Growth Hacking",
    hint: "SEO, content marketing, social media ads, and growth loops.",
  },
  {
    name: "Prompt Engineering & Generative AI",
    hint: "High-growth skills for working with AI models and LLMs.",
  },
  {
    name: "UI/UX Design",
    hint: "User-centric interface and experience design principles.",
  },
  {
    name: "Software Development (Java/Python)",
    hint: "Core programming languages for building scalable applications.",
  },
  {
    name: "Other",
    hint: "Don't see your field? Tell us what you're into.",
  },
];

export default function Home() {
  const [active, setActive] = useState("hero");
  const [reelImages, setReelImages] = useState<string[]>([]);
  const [reelIdx, setReelIdx] = useState(0);
  const [reelAnimKey, setReelAnimKey] = useState(0);
  const [reelDir, setReelDir] = useState<"right" | "left">("right");
  const [reelHovered, setReelHovered] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [formName, setFormName] = useState("");
  const [formWhatsApp, setFormWhatsApp] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [careerQuery, setCareerQuery] = useState("");
  const [careerOpen, setCareerOpen] = useState(false);
  const [careerSelected, setCareerSelected] = useState("");
  const [careerOther, setCareerOther] = useState("");
  const [formCity, setFormCity] = useState("");
  const [formCitySuggestions, setFormCitySuggestions] = useState<string[]>([]);
  const [formCityOpen, setFormCityOpen] = useState(false);
  const [formLocation, setFormLocation] = useState("Any");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const pageRef = useRef<HTMLDivElement>(null);
  const ipadRef = useRef<HTMLDivElement>(null);
  const careerRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);
  const cityDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Live countdown to admission date (Mar 15 2026) ── */
  useEffect(() => {
    const target = new Date("2026-03-15T00:00:00").getTime();
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      setCountdown({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        secs: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, []);

  /* ── Click-outside to close dropdowns ── */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (careerRef.current && !careerRef.current.contains(e.target as Node)) {
        setCareerOpen(false);
      }
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) {
        setFormCityOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ── City autocomplete via Google Places ── */
  const handleCityChange = (val: string) => {
    setFormCity(val);
    setFormCityOpen(true);
    if (cityDebounce.current) clearTimeout(cityDebounce.current);
    if (val.trim().length < 2) { setFormCitySuggestions([]); return; }
    cityDebounce.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/places?q=${encodeURIComponent(val.trim())}`);
        const data = await res.json();
        if (Array.isArray(data)) setFormCitySuggestions(data);
      } catch { setFormCitySuggestions([]); }
    }, 300);
  };

  const filteredCourses = COURSES.filter((c) =>
    c.name.toLowerCase().includes(careerQuery.toLowerCase())
  );

  /* ── Waitlist form submission ── */
  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!formName.trim() || formName.trim().length < 2) errors.name = "Enter your full name";
    const digits = formWhatsApp.replace(/\D/g, "");
    if (digits.length !== 10) errors.whatsapp = "Enter a valid 10-digit number";
    if (!formEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formEmail.trim()))
      errors.email = "Enter a valid email address";

    if (!formCity.trim()) errors.city = "Enter your current city";

    const career = careerSelected === "Other" ? careerOther.trim() : careerSelected;
    if (!career) errors.career = "Select or enter a career interest";

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setFormSubmitting(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName.trim(),
          whatsapp: "+91 " + formWhatsApp.replace(/\D/g, ""),
          email: formEmail.trim(),
          city: formCity.trim(),
          career,
          preferredLocation: formLocation,
        }),
      });
      if (!res.ok) throw new Error("Submission failed");
      setFormSuccess(true);
      setFormName("");
      setFormWhatsApp("");
      setFormEmail("");
      setFormCity("");
      setCareerQuery("");
      setCareerSelected("");
      setCareerOther("");
      setFormLocation("Any");
    } catch {
      setFormErrors({ form: "Something went wrong. Please try again." });
    } finally {
      setFormSubmitting(false);
    }
  };

  /* ── Fetch reel images from public/reels/ ── */
  useEffect(() => {
    fetch("/api/reels")
      .then((r) => r.json())
      .then((imgs: string[]) => {
        if (imgs.length > 0) setReelImages(imgs);
      })
      .catch(() => {});
  }, []);

  const assignRef = useCallback(
    (id: string) => (el: HTMLElement | null) => {
      sectionRefs.current[id] = el;
    },
    []
  );

  const isDark = DARK_SECTIONS.has(active);

  /* ── Intersection Observer: track active section ── */
  useEffect(() => {
    const isMobile = window.innerWidth <= 900;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
            entry.target.classList.add("screen-active");
          } else {
            entry.target.classList.remove("screen-active");
          }
        });
      },
      { threshold: isMobile ? 0.2 : 0.5 }
    );

    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  /* ── Auto-play reel every 2s, pause on hover ── */
  useEffect(() => {
    if (reelImages.length < 2 || reelHovered) return;
    const iv = setInterval(() => {
      setReelDir("right");
      setReelIdx((i) => (i + 1) % reelImages.length);
      setReelAnimKey((k) => k + 1);
    }, 2000);
    return () => clearInterval(iv);
  }, [reelImages.length, reelHovered]);

  /* ── Manual scroll when hovering over iPad ── */
  useEffect(() => {
    const el = ipadRef.current;
    if (!el || reelImages.length < 2) return;

    let scrollLocked = false;
    let lockTimer: ReturnType<typeof setTimeout> | null = null;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (scrollLocked) return;
      if (Math.abs(e.deltaY) < 4) return;

      const dir = e.deltaY > 0 ? 1 : -1;
      setReelDir(dir > 0 ? "right" : "left");
      setReelIdx((i) => {
        const next = i + dir;
        if (next < 0) return reelImages.length - 1;
        if (next >= reelImages.length) return 0;
        return next;
      });
      setReelAnimKey((k) => k + 1);

      scrollLocked = true;
      lockTimer = setTimeout(() => { scrollLocked = false; }, 350);
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", handleWheel);
      if (lockTimer) clearTimeout(lockTimer);
    };
  }, [reelImages.length]);

  const scrollTo = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth" });
  };

  const goReel = (dir: 1 | -1) => {
    setReelDir(dir > 0 ? "right" : "left");
    setReelIdx((i) => {
      const next = i + dir;
      if (next < 0) return reelImages.length - 1;
      if (next >= reelImages.length) return 0;
      return next;
    });
    setReelAnimKey((k) => k + 1);
  };

  return (
    <div className="page" ref={pageRef}>
      {/* ── SIDE NAV ── */}
      <nav className={`side-nav${isDark ? " side-nav-light" : ""}`}>
        {SECTIONS.map((s, i) => {
          const activeIdx = SECTIONS.findIndex((x) => x.id === active);
          const dist = i - activeIdx;
          const isCurrent = s.id === active;
          return (
            <button
              key={s.id}
              className={`side-nav-item${isCurrent ? " current" : ""}`}
              style={{
                opacity: isCurrent ? 1 : Math.max(0.15, 1 - Math.abs(dist) * 0.25),
                transform: `scale(${isCurrent ? 1 : 0.85}) translateY(${dist * 2}px)`,
              }}
              onClick={() => scrollTo(s.id)}
              aria-label={`Go to ${s.title}`}
            >
              <span className="side-nav-title">{s.title}</span>
              <span className="side-nav-dash" />
            </button>
          );
        })}
      </nav>

      {/* ═══ HERO ═══ */}
      <header className="screen" id="hero" ref={assignRef("hero")}>
        <div className="screen-inner hero-layout">
          <div className="hero-left">
            {/* ── Top: main hero content ── */}
            <div className="hero-content">
              <div className="hero-social sa sa-d1">
                <a href="https://instagram.com/ng_cult" target="_blank" rel="noopener noreferrer">Instagram</a>
                <a href="https://twitter.com/ng_cult" target="_blank" rel="noopener noreferrer">Twitter</a>
                <a href="https://facebook.com/ngcult" target="_blank" rel="noopener noreferrer">Facebook</a>
              </div>
              <h1 className="sa sa-hero">NG <span style={{ color: "#ff6b2b" }}>Cult.</span></h1>
              <p className="lead sa sa-d2">
                Not Just a Hostel.<br />
                Grow Together, Not Alone.
              </p>
              <div className="hero-cta-row sa sa-d3">
                <a className="btn primary" href="#waitlist" onClick={(e) => { e.preventDefault(); scrollTo("waitlist"); }}>
                  Join Waitlist
                </a>
                <button className="btn ghost" onClick={() => scrollTo("about")} aria-label="See inside">
                  →
                </button>
              </div>
            </div>

            {/* ── Bottom: waitlist countdown + admission widget ── */}
            <div className="hero-bottom sa sa-d4">
              <div className="alert-badge">Early bird closes in</div>

              {/* Live countdown */}
              <div className="countdown-row">
                <div className="cd-unit">
                  <span className="cd-num">{String(countdown.days).padStart(2, "0")}</span>
                  <span className="cd-label">Days</span>
                </div>
                <span className="cd-sep">:</span>
                <div className="cd-unit">
                  <span className="cd-num">{String(countdown.hours).padStart(2, "0")}</span>
                  <span className="cd-label">Hours</span>
                </div>
                <span className="cd-sep">:</span>
                <div className="cd-unit">
                  <span className="cd-num">{String(countdown.mins).padStart(2, "0")}</span>
                  <span className="cd-label">Mins</span>
                </div>
                <span className="cd-sep">:</span>
                <div className="cd-unit">
                  <span className="cd-num">{String(countdown.secs).padStart(2, "0")}</span>
                  <span className="cd-label">Secs</span>
                </div>
              </div>

              {/* Admission widget */}
              <div className="admission-widget">
                <div className="aw-date-card">
                  <span className="aw-month">Mar</span>
                  <span className="aw-day">15</span>
                  <span className="aw-weekday">Saturday</span>
                  <span className="aw-badge">Early Bird</span>
                </div>
                <div className="aw-upcoming">
                  <span className="aw-label">Upcoming</span>
                  <div className="aw-event">
                    <span className="aw-dot" style={{ background: "#ff6b2b" }} />
                    <div>
                      <span className="aw-event-title">Admissions Open</span>
                      <span className="aw-event-time">March 15 — April 30</span>
                    </div>
                  </div>
                  <div className="aw-event">
                    <span className="aw-dot" style={{ background: "#7c5cfc" }} />
                    <div>
                      <span className="aw-event-title">Move-in Day</span>
                      <span className="aw-event-time">May 01, 2026</span>
                    </div>
                  </div>
                  <div className="aw-event">
                    <span className="aw-dot" style={{ background: "#22c97a" }} />
                    <div>
                      <span className="aw-event-title">Orientation Week</span>
                      <span className="aw-event-time">May 05 — May 10</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-right">
            {/* ── Hero image: students & podcasters ── */}
            <div className="hero-image-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/hero_img.png" alt="NG Cult students and podcasters" className="hero-image" draggable={false} />

              {/* ── Instagram post frame ── */}
              {reelImages.length > 0 && (
                <div
                  className="ig-post"
                  ref={ipadRef}
                  onMouseEnter={() => setReelHovered(true)}
                  onMouseLeave={() => setReelHovered(false)}
                >
                  {/* Header */}
                  <div className="ig-header">
                    <div className="ig-avatar" />
                    <div className="ig-user-info">
                      <span className="ig-username">ng_cult</span>
                      <span className="ig-location">Bangalore, India</span>
                    </div>
                    <svg className="ig-more" viewBox="0 0 24 24" fill="none" width="16" height="16">
                      <circle cx="5" cy="12" r="1.5" fill="#262626" />
                      <circle cx="12" cy="12" r="1.5" fill="#262626" />
                      <circle cx="19" cy="12" r="1.5" fill="#262626" />
                    </svg>
                  </div>

                  {/* Image */}
                  <div className="ig-image-wrap">
                    <div className={`reel-frame ${reelDir === "left" ? "reel-left" : ""}`} key={reelAnimKey}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`/reels/${reelImages[reelIdx]}`}
                        alt={`Reel ${reelIdx + 1}`}
                        className="reel-img"
                        draggable={false}
                      />
                    </div>

                    {/* Left / Right arrows */}
                    <button className="ig-arrow ig-arrow-left" onClick={() => goReel(-1)} aria-label="Previous">
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6" />
                      </svg>
                    </button>
                    <button className="ig-arrow ig-arrow-right" onClick={() => goReel(1)} aria-label="Next">
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 6 15 12 9 18" />
                      </svg>
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="ig-actions">
                    <div className="ig-actions-left">
                      {/* Heart */}
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#262626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                      {/* Comment */}
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#262626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                      {/* Send */}
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#262626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                    </div>
                    {/* Bookmark */}
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#262626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>

                  {/* Likes */}
                  <div className="ig-likes">
                    <span className="ig-likes-count">1,024 likes</span>
                  </div>

                  {/* Caption */}
                  <div className="ig-caption">
                    <span className="ig-caption-user">ng_cult</span>{" "}
                    {reelImages[reelIdx].replace(/\.[^.]+$/, "").replace(/[-_]/g, " ")}
                  </div>

                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ═══ ABOUT ═══ */}
      <section className="screen section-black" id="about" ref={assignRef("about")}>
        <div className="screen-inner screen-content">
          <div className="block headline sa">
            <h2>More Than a Hostel. <span style={{ color: "#ff6b2b" }}>A Community That Helps You Grow.</span></h2>
            <p>
              NG Cult is a hostel built for people who want more from where they stay.<br />
              <br />
              <strong>More exposure.</strong><br />
              <strong>More mindset shifts.</strong><br />
              <strong>More growth.</strong><br />
              <br />
            </p>
            <p>
              We bring together ambitious students, learners, creators, freelancers, and nomads under one roof — so you don&apos;t have to figure your journey alone.<br />
              <br />
            </p>
            <p>
              Comfortable living meets skill exposure, strong community energy, and real conversations about growth, income, mindset, and future opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ LIFESTYLE ═══ */}
      <section className="screen section-white" id="lifestyle" ref={assignRef("lifestyle")}>
        <div className="screen-inner screen-content">
          <div className="block headline sa">
            <h2>Lifestyle Experience</h2>
            <p>Growth happens faster together.</p>
          </div>
          <div className="collage">
            <div className="block tile wide sa sa-d1">
              <h3>Stylish Accommodation</h3>
              <p>Clean GenZ aesthetic rooms with cozy lighting.</p>
            </div>
            <div className="block tile tilt sa sa-d2">
              <h3>Study + Chill Balance</h3>
              <p>Focused work pods with relaxing social corners.</p>
            </div>
            <div className="block tile sa sa-d3">
              <h3>Healthy GenZ Food</h3>
              <p>Nutrition first meals plus a fun snack culture.</p>
            </div>
            <div className="block tile wide sa sa-d4">
              <h3>Community Life</h3>
              <p>Standups, game nights, movie nights, deep talks.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CAREER ═══ */}
      <section className="screen section-yellow" id="career" ref={assignRef("career")}>
        <div className="screen-inner screen-content screen-content-spread">
          <div className="block headline sa">
            <h2>Your Shortcut Into Tech Industry</h2>
          </div>
          <div className="collage collage-spread">
            <div className="block chip sa sa-d1">Structured Roadmaps</div>
            <div className="block chip wide sa sa-d2">Peer Learning Ecosystem</div>
            <div className="block chip tilt sa sa-d3">Expert Interaction</div>
            <div className="block chip sa sa-d4">Fresher Job Insights</div>
            <div className="block chip wide sa sa-d5">Portfolio Building Support</div>
          </div>
          <div className="sa sa-d6">
            <button className="btn primary" onClick={() => scrollTo("waitlist")}>
              Secure Your Spot
            </button>
          </div>
        </div>
      </section>

      {/* ═══ COMMUNITY ═══ */}
      <section className="screen section-black" id="community" ref={assignRef("community")}>
        <div className="screen-inner screen-content">
          <div className="block headline sa">
            <h2>Community Proof / Social Energy</h2>
            <p>This is not renting. This is belonging.</p>
          </div>
          <div className="collage">
            <div className="block media-card sa sa-d1">
              <h3>Member Testimonials</h3>
              <p>&ldquo;I grew 3x faster with accountability squads.&rdquo;</p>
            </div>
            <div className="block media-card tilt sa sa-d2">
              <h3>Podcast Clips</h3>
              <p>Founder chats, career myths, and tech trends.</p>
            </div>
            <div className="block media-card sa sa-d3">
              <h3>Hackathon Snapshots</h3>
              <p>Weekend builds, demos, and community energy.</p>
            </div>
            <div className="block media-card wide sa sa-d4">
              <h3>Room Vibes</h3>
              <p>Premium beds, ambient light, and calm focus.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ LOCATION ═══ */}
      <section className="screen section-white" id="location" ref={assignRef("location")}>
        <div className="screen-inner screen-content screen-content-spread">
          <div className="block headline sa">
            <h2>Location Advantage</h2>
            <p>
              Based in Bangalore&apos;s tech hub with effortless access to
              institutes, startups, and networking zones.
            </p>
          </div>
          <div className="collage collage-spread">
            <div className="block chip sa sa-d1">Tech Hub Access</div>
            <div className="block chip wide sa sa-d2">Transport to Institutes</div>
            <div className="block chip tilt sa sa-d3">Startup Exposure</div>
            <div className="block chip sa sa-d4">Networking Proximity</div>
          </div>
          <div className="block map-card sa sa-d5">
            <div className="map-label">Bangalore Tech Hub</div>
          </div>
        </div>
      </section>

      {/* ═══ WAITLIST ═══ */}
      <section className="screen section-yellow" id="waitlist" ref={assignRef("waitlist")}>
        <div className="screen-inner screen-content screen-content-center">
          <div className="waitlist-box">
            <div className="waitlist-copy sa">
              <h2>Early Members Get First Access + Special Perks</h2>
              <p>
                Join the founding community and unlock priority onboarding,
                limited pricing, and exclusive events.
              </p>
            </div>
            {formSuccess ? (
              <div className="waitlist-success sa sa-d2">
                <div className="success-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <h3>You&apos;re on the list!</h3>
                <p>We&apos;ll reach out on WhatsApp with next steps. Welcome to NG Cult.</p>
                <button className="btn primary" type="button" onClick={() => setFormSuccess(false)}>
                  Submit Another
                </button>
              </div>
            ) : (
              <form className="waitlist-form sa sa-d2" onSubmit={handleWaitlistSubmit} noValidate>
                {formErrors.form && <div className="form-error-banner">{formErrors.form}</div>}
                <label>
                  Name
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className={formErrors.name ? "input-error" : ""}
                  />
                  {formErrors.name && <span className="field-error">{formErrors.name}</span>}
                </label>
                <label>
                  WhatsApp Number
                  <div className={`wa-input-wrap${formErrors.whatsapp ? " input-error" : ""}`}>
                    <span className="wa-prefix">+91</span>
                    <input
                      type="tel"
                      placeholder="98765 43210"
                      value={formWhatsApp}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, "").slice(0, 10);
                        setFormWhatsApp(raw);
                      }}
                      maxLength={10}
                    />
                  </div>
                  {formErrors.whatsapp && <span className="field-error">{formErrors.whatsapp}</span>}
                </label>
                <label>
                  Email
                  <input
                    type="email"
                    placeholder="you@email.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className={formErrors.email ? "input-error" : ""}
                  />
                  {formErrors.email && <span className="field-error">{formErrors.email}</span>}
                </label>
                <div className="city-field" ref={cityRef}>
                  <label>
                    Current Town / City
                    <input
                      type="text"
                      placeholder="Start typing your city…"
                      value={formCity}
                      onChange={(e) => handleCityChange(e.target.value)}
                      onFocus={() => { if (formCitySuggestions.length) setFormCityOpen(true); }}
                      className={formErrors.city ? "input-error" : ""}
                    />
                    {formErrors.city && <span className="field-error">{formErrors.city}</span>}
                  </label>
                  {formCityOpen && formCitySuggestions.length > 0 && (
                    <ul className="city-dropdown">
                      {formCitySuggestions.map((s) => (
                        <li
                          key={s}
                          className={`city-option${formCity === s ? " selected" : ""}`}
                          onClick={() => {
                            setFormCity(s);
                            setFormCityOpen(false);
                            setFormCitySuggestions([]);
                          }}
                        >
                          <svg className="city-pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                          {s}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="career-field" ref={careerRef}>
                  <label>
                    Career Interest
                    <input
                      type="text"
                      placeholder="Search courses…"
                      value={careerSelected === "Other" ? "Other" : careerQuery}
                      onChange={(e) => {
                        setCareerQuery(e.target.value);
                        setCareerSelected("");
                        setCareerOpen(true);
                      }}
                      onFocus={() => setCareerOpen(true)}
                      readOnly={careerSelected !== "" && careerSelected !== "Other"}
                      onClick={() => {
                        if (careerSelected && careerSelected !== "Other") {
                          setCareerQuery("");
                          setCareerSelected("");
                        }
                        setCareerOpen(true);
                      }}
                      className={formErrors.career ? "input-error" : ""}
                    />
                    {formErrors.career && <span className="field-error">{formErrors.career}</span>}
                  </label>
                  {careerOpen && filteredCourses.length > 0 && (
                    <ul className="career-dropdown">
                      {filteredCourses.map((c) => (
                        <li
                          key={c.name}
                          className={`career-option${careerSelected === c.name ? " selected" : ""}`}
                          onClick={() => {
                            setCareerSelected(c.name);
                            setCareerQuery(c.name === "Other" ? "" : c.name);
                            setCareerOpen(false);
                            if (c.name !== "Other") setCareerOther("");
                          }}
                        >
                          <span className="career-option-name">{c.name}</span>
                          <span className="career-option-hint">{c.hint}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {careerSelected === "Other" && (
                    <input
                      type="text"
                      className={`career-other-input${formErrors.career ? " input-error" : ""}`}
                      placeholder="Tell us your career interest…"
                      value={careerOther}
                      onChange={(e) => setCareerOther(e.target.value)}
                      autoFocus
                    />
                  )}
                </div>
                <label>
                  Preferred Location
                  <select
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                  >
                    <option value="Any">Any</option>
                    <option value="HSR">HSR</option>
                    <option value="Marathahalli">Marathahalli</option>
                    <option value="Electronic City">Electronic City</option>
                    <option value="Whitefield">Whitefield</option>
                    <option value="Yelahanka">Yelahanka</option>
                  </select>
                </label>
                <button className="btn primary" type="submit" disabled={formSubmitting}>
                  {formSubmitting ? "Submitting…" : "Register"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="screen screen-short footer-screen">
        <div className="screen-inner screen-content screen-content-center">
          <div className="footer-grid">
            <div>
              <div className="footer-brand">NG CULT</div>
              <p className="footer-tagline">
                Build Skills. Build Network. Build Life.
              </p>
            </div>
            <div className="footer-links">
              <a href="#">Instagram</a>
              <a href="#">Community Discord</a>
              <a href="#">Newsletter</a>
              <a href="#">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
