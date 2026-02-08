"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const SECTIONS = [
  { id: "hero", num: "01", title: "Home" },
  { id: "about", num: "02", title: "About" },
  { id: "lifestyle", num: "03", title: "Bootcamp" },
  { id: "career", num: "04", title: "RoadMap" },
  { id: "community", num: "05", title: "Who It's For" },
  { id: "location", num: "06", title: "Why Different" },
  { id: "waitlist", num: "07", title: "Waitlist" },
];

const DARK_SECTIONS = new Set(["about", "community"]);

const COURSES = [
  {
    name: "AI & Machine Learning Foundations",
    hint: "Understand how AI works before building with it — core ML concepts, model basics, and real-world use cases.",
  },
  {
    name: "AI Workflow Automation",
    hint: "Turn repetitive work into automated systems using n8n, Make.com, and Zapier.",
  },
  {
    name: "Agentic AI Systems",
    hint: "Build AI that acts, not just responds — LangChain, autonomous workflows, and multi-agent orchestration.",
  },
  {
    name: "RAG Systems & Knowledge AI",
    hint: "Make AI work with your data — embeddings, vector databases, and retrieval-augmented generation.",
  },
  {
    name: "Generative AI & Prompt Engineering",
    hint: "Create content, systems, and automation — prompt design, ComfyUI workflows, and GenAI productivity.",
  },
  {
    name: "Machine Learning Frameworks",
    hint: "Hands-on exposure to TensorFlow, PyTorch, and Scikit-learn — focus on application, not theory.",
  },
  {
    name: "Other",
    hint: "Don't see your track? Tell us what you're interested in.",
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
                Not just a hostel.<br />
                Not just a course.
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
              NG Cult is an AI-focused growth community where freshers, freelancers, and digital nomads live, learn, and build real automation skills together — so you don&apos;t figure AI alone.
            </p>
            <p>
              Premium living meets hands-on AI learning, mindset support, and strong community energy designed to accelerate your next chapter.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ WHAT THIS BOOTCAMP IS ABOUT ═══ */}
      <section className="screen section-white" id="lifestyle" ref={assignRef("lifestyle")}>
        <div className="screen-inner screen-content">
          <div className="block headline sa">
            <h2>What This Bootcamp Is About</h2>
            <p>
              AI isn&apos;t just theory anymore.<br />
              It&apos;s automation, productivity, and opportunity.
            </p>
            <p>This bootcamp focuses on:</p>
          </div>
          <div className="collage">
            <div className="block tile wide sa sa-d1">
              <h3>Practical AI skills</h3>
            </div>
            <div className="block tile tilt sa sa-d2">
              <h3>Real workflow automation</h3>
            </div>
            <div className="block tile sa sa-d3">
              <h3>Collaborative learning</h3>
            </div>
            <div className="block tile wide sa sa-d4">
              <h3>Exposure to emerging AI tools</h3>
            </div>
            <div className="block tile sa sa-d5">
              <h3>Community accountability</h3>
            </div>
          </div>
          <div className="block headline sa sa-d6">
            <p>You learn faster because you live in it.</p>
          </div>
        </div>
      </section>

      {/* ═══ CORE LEARNING TRACKS ═══ */}
      <section className="screen section-yellow" id="career" ref={assignRef("career")}>
        <div className="screen-inner screen-content screen-content-spread">
          <div className="block headline sa">
            <h2>Core Learning Tracks</h2>
          </div>
          <div className="collage">
            <div className="block card sa sa-d1">
              <h3>AI & Machine Learning Foundations</h3>
              <p>Understand how AI works before building with it.</p>
              <ul style={{ marginTop: "12px", paddingLeft: "20px" }}>
                <li>Core ML concepts simplified</li>
                <li>Model basics & workflows</li>
                <li>Real-world AI use cases</li>
                <li>Hands-on exploration mindset</li>
              </ul>
            </div>
            <div className="block card tilt sa sa-d2">
              <h3>AI Workflow Automation</h3>
              <p>Turn repetitive work into automated systems.</p>
              <ul style={{ marginTop: "12px", paddingLeft: "20px" }}>
                <li>n8n automation workflows</li>
                <li>Make.com integrations</li>
                <li>Zapier automation pipelines</li>
                <li>Practical business automations</li>
              </ul>
              <p style={{ marginTop: "12px", fontStyle: "italic" }}>This is where AI meets real productivity.</p>
            </div>
            <div className="block card wide sa sa-d3">
              <h3>Agentic AI Systems</h3>
              <p>Build AI that acts, not just responds.</p>
              <ul style={{ marginTop: "12px", paddingLeft: "20px" }}>
                <li>LangChain ecosystem</li>
                <li>Autonomous AI workflows</li>
                <li>Multi-agent orchestration</li>
                <li>Real-world automation scenarios</li>
              </ul>
              <p style={{ marginTop: "12px", fontStyle: "italic" }}>Future-ready skills.</p>
            </div>
            <div className="block card sa sa-d4">
              <h3>RAG Systems & Knowledge AI</h3>
              <p>Make AI work with your data.</p>
              <ul style={{ marginTop: "12px", paddingLeft: "20px" }}>
                <li>Embeddings fundamentals</li>
                <li>Vector databases</li>
                <li>Retrieval-Augmented Generation</li>
                <li>Practical knowledge assistants</li>
              </ul>
              <p style={{ marginTop: "12px", fontStyle: "italic" }}>Critical for modern AI applications.</p>
            </div>
            <div className="block card sa sa-d5">
              <h3>Generative AI & Prompt Engineering</h3>
              <p>Create content, systems, and automation.</p>
              <ul style={{ marginTop: "12px", paddingLeft: "20px" }}>
                <li>Prompt design strategies</li>
                <li>ComfyUI workflows</li>
                <li>Image/video AI pipelines</li>
                <li>GenAI productivity use cases</li>
              </ul>
              <p style={{ marginTop: "12px", fontStyle: "italic" }}>Build faster with AI assistance.</p>
            </div>
            <div className="block card tilt wide sa sa-d6">
              <h3>Machine Learning Frameworks</h3>
              <p>Hands-on exposure to industry tools.</p>
              <ul style={{ marginTop: "12px", paddingLeft: "20px" }}>
                <li>TensorFlow fundamentals</li>
                <li>PyTorch basics</li>
                <li>Scikit-learn workflows</li>
                <li>Practical ML implementation mindset</li>
              </ul>
              <p style={{ marginTop: "12px", fontStyle: "italic" }}>Focus on application, not academic overload.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ WHO THIS IS FOR ═══ */}
      <section className="screen section-black" id="community" ref={assignRef("community")}>
        <div className="screen-inner screen-content">
          <div className="block headline sa">
            <h2>Who This Is For</h2>
          </div>
          <div className="collage">
            <div className="block tile sa sa-d1">
              <h3>Freshers entering the AI era</h3>
            </div>
            <div className="block tile tilt sa sa-d2">
              <h3>Freelancers automating workflows</h3>
            </div>
            <div className="block tile sa sa-d3">
              <h3>Digital nomads building remote income</h3>
            </div>
            <div className="block tile wide sa sa-d4">
              <h3>Creators exploring AI tools</h3>
            </div>
            <div className="block tile sa sa-d5">
              <h3>Anyone serious about AI exposure</h3>
            </div>
          </div>
          <div className="block headline sa sa-d6">
            <p>If you want passive consumption, this isn&apos;t it.</p>
            <p>If you want hands-on growth, welcome.</p>
          </div>
        </div>
      </section>

      {/* ═══ WHY NG CULT IS DIFFERENT ═══ */}
      <section className="screen section-white" id="location" ref={assignRef("location")}>
        <div className="screen-inner screen-content screen-content-spread">
          <div className="block headline sa">
            <h2>Why NG Cult Is Different</h2>
          </div>
          <div className="collage">
            <div className="block card sa sa-d1">
              <h3>Learn + Live Ecosystem</h3>
              <p>You don&apos;t attend classes. You live inside the learning environment.</p>
            </div>
            <div className="block card tilt sa sa-d2">
              <h3>Community Accountability</h3>
              <p>Peers accelerate your consistency.</p>
            </div>
            <div className="block card wide sa sa-d3">
              <h3>Exposure Over Isolation</h3>
              <p>Daily conversations about AI, tools, ideas, opportunities.</p>
            </div>
            <div className="block card sa sa-d4">
              <h3>Mindset + Skill Together</h3>
              <p>Technical growth + personal growth.</p>
            </div>
          </div>
          <div className="block headline sa sa-d5">
            <h3>Beyond Learning</h3>
            <p>You also get:</p>
          </div>
          <div className="collage collage-spread">
            <div className="block chip sa sa-d6">Premium hostel accommodation</div>
            <div className="block chip wide sa sa-d7">Strong peer community</div>
            <div className="block chip tilt sa sa-d8">Networking exposure</div>
            <div className="block chip sa sa-d9">Content & personal brand support</div>
            <div className="block chip wide sa sa-d10">Industry conversations</div>
          </div>
          <div className="block headline sa sa-d11">
            <p>This is about transformation, not just courses.</p>
          </div>
          <div className="block headline sa sa-d12">
            <h2>Core Belief</h2>
            <p>AI growth shouldn&apos;t be lonely.</p>
            <p>When you live with ambitious learners:</p>
            <ul style={{ marginTop: "12px", paddingLeft: "20px" }}>
              <li>Momentum becomes normal</li>
              <li>Opportunities appear naturally</li>
              <li>Confidence builds faster</li>
            </ul>
            <p style={{ marginTop: "24px", fontWeight: "bold" }}>That&apos;s NG Cult.</p>
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
