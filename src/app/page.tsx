"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Roadmap {
  id: number;
  rank: number;
  title: string;
  skills: string;
  salary: string;
}

const SECTIONS = [
  { id: "hero", num: "01", title: "Home" },
  { id: "who", num: "02", title: "Who It's For" },
  { id: "what", num: "03", title: "What You Get" },
  { id: "why", num: "04", title: "Why Roadmap" },
  { id: "pricing", num: "05", title: "Pricing" },
  { id: "about", num: "06", title: "About" },
  { id: "register", num: "07", title: "Register" },
  { id: "faq", num: "08", title: "FAQ" },
];

const DARK_SECTIONS = new Set(["about", "who"]);

const INTEREST_OPTIONS = [
  "Development",
  "Data",
  "AI",
  "Cloud",
  "Cybersecurity",
  "UI/UX",
  "Not sure",
];

const FAQ_DATA = [
  {
    question: "What is IT career counselling?",
    answer:
      "IT career counselling is a structured process where tech experts assess your skills, interests, strengths, weaknesses, and career goals to recommend the right IT career path. We help you avoid choosing careers based on assumptions, gossip, or social media hype.",
  },
  {
    question: "How do you create a personalized career roadmap?",
    answer:
      "We analyze your current skills, available time, risk tolerance, strengths, weaknesses, and market opportunities. Based on this assessment, we create a step-by-step roadmap tailored to your profile, timeline, and goals.",
  },
  {
    question: "Is this better than choosing a course from YouTube?",
    answer:
      "Yes. YouTube courses are generic and don't consider your specific profile, market demand, or career goals. Our counselling ensures you choose the right path based on evidence, not trends.",
  },
  {
    question: "Do you recommend courses?",
    answer:
      "We provide course guidance only if needed and only courses that fit your roadmap. We do not push random trending tech or sell courses. Our focus is on prescribing the right path, not selling products.",
  },
  {
    question: "How long does it take to get clarity?",
    answer:
      "After booking the ₹99 consultation, we schedule a session where we assess your profile and provide the roadmap. The consultation typically takes 30-45 minutes, and you'll receive clarity on your IT career path.",
  },
  {
    question: "Can parents join the consultation?",
    answer:
      "Yes, parents are welcome to join the consultation. We understand that career decisions often involve family discussions, and we're happy to provide clarity to both students and parents.",
  },
  {
    question: "What if I'm already working but want to switch careers?",
    answer:
      "Our counselling is perfect for career switchers. We consider your limited time, existing skills, and risk tolerance to create a roadmap that fits your situation and helps you transition smoothly.",
  },
  {
    question: "Do you guarantee job placement?",
    answer:
      "We are a career counselling and roadmap platform, not a placement agency. We help you choose the right path and build the right skills. Job placement depends on your execution of the roadmap and market conditions.",
  },
  {
    question: "What makes your roadmap different from free online resources?",
    answer:
      "Our roadmaps are personalized to your profile, not generic templates. We consider your skills, time, strengths, weaknesses, and real market opportunities. Free resources are one-size-fits-all; we provide tailored guidance.",
  },
  {
    question: "How do I book the ₹99 consultation?",
    answer:
      "Click 'Create Your Customized Career Roadmap' on the homepage, fill in your details, and submit. We'll contact you on WhatsApp to schedule the consultation at a convenient time.",
  },
];

// Client-only structured data component to avoid hydration issues
function StructuredData() {
  useEffect(() => {
    const siteUrl = typeof window !== "undefined" ? window.location.origin : "";
    
    // ProfessionalService schema
    const professionalServiceScript = document.createElement("script");
    professionalServiceScript.type = "application/ld+json";
    professionalServiceScript.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      name: "NG Cult",
      description: "IT Career Counselling & Personalized Tech Roadmap Platform",
      url: siteUrl,
      telephone: "+91",
      areaServed: {
        "@type": "Country",
        name: "India",
      },
      serviceType: "IT Career Counselling",
      priceRange: "₹99",
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        reviewCount: "50",
      },
    });
    document.head.appendChild(professionalServiceScript);

    // FAQPage schema
    const faqScript = document.createElement("script");
    faqScript.type = "application/ld+json";
    faqScript.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ_DATA.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    });
    document.head.appendChild(faqScript);

    // Organization schema
    const orgScript = document.createElement("script");
    orgScript.type = "application/ld+json";
    orgScript.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "NG Cult",
      description: "Tech Career Counselling & Personalized Roadmap Platform",
      url: siteUrl,
      logo: siteUrl ? `${siteUrl}/logo.png` : "",
      sameAs: [
        "https://instagram.com/ng_cult",
        "https://twitter.com/ng_cult",
        "https://facebook.com/ngcult",
      ],
    });
    document.head.appendChild(orgScript);

    return () => {
      // Cleanup on unmount
      if (document.head.contains(professionalServiceScript)) {
        document.head.removeChild(professionalServiceScript);
      }
      if (document.head.contains(faqScript)) {
        document.head.removeChild(faqScript);
      }
      if (document.head.contains(orgScript)) {
        document.head.removeChild(orgScript);
      }
    };
  }, []);

  return null;
}

export default function Home() {
  const router = useRouter();
  const [active, setActive] = useState("hero");
  const [roadmapModalOpen, setRoadmapModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [topRoadmaps, setTopRoadmaps] = useState<Roadmap[]>([]);
  const [roadmapsLoading, setRoadmapsLoading] = useState(true);
  const [formName, setFormName] = useState("");
  const [formWhatsApp, setFormWhatsApp] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [currentStatus, setCurrentStatus] = useState("");
  const [formCity, setFormCity] = useState("");
  const [formCitySuggestions, setFormCitySuggestions] = useState<string[]>([]);
  const [formCityOpen, setFormCityOpen] = useState(false);
  const [timeAvailable, setTimeAvailable] = useState("");
  const [currentSkills, setCurrentSkills] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [strengthsWeaknesses, setStrengthsWeaknesses] = useState("");
  const [goalTimeline, setGoalTimeline] = useState("");
  const [riskPreference, setRiskPreference] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [courseJoined, setCourseJoined] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const pageRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);
  const cityDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Fetch top 5 roadmaps ── */
  useEffect(() => {
    async function fetchTopRoadmaps() {
      try {
        const response = await fetch("/api/roadmaps");
        const data = await response.json();
        // Get top 5 by rank
        const top5 = (data.roadmaps || []).slice(0, 5);
        setTopRoadmaps(top5);
      } catch (error) {
        console.error("Error fetching top roadmaps:", error);
      } finally {
        setRoadmapsLoading(false);
      }
    }
    fetchTopRoadmaps();
  }, []);

  /* ── Click-outside to close dropdowns ── */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
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
    if (val.trim().length < 2) {
      setFormCitySuggestions([]);
      return;
    }
    cityDebounce.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/places?q=${encodeURIComponent(val.trim())}`);
        const data = await res.json();
        if (Array.isArray(data)) setFormCitySuggestions(data);
      } catch {
        setFormCitySuggestions([]);
      }
    }, 300);
  };

  /* ── Roadmap form submission ── */
  const handleRoadmapSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!formName.trim() || formName.trim().length < 2)
      errors.name = "Enter your full name";
    const digits = formWhatsApp.replace(/\D/g, "");
    if (digits.length !== 10) errors.whatsapp = "Enter a valid 10-digit number";
    if (!currentStatus) errors.currentStatus = "Select your current status";

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setFormSubmitting(true);
    try {
      const res = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName.trim(),
          whatsapp: "+91 " + formWhatsApp.replace(/\D/g, ""),
          email: formEmail.trim() || "",
          currentStatus,
          city: formCity.trim() || "",
          timeAvailable: timeAvailable || "",
          currentSkills: currentSkills.trim() || "",
          interests: interests.join(", ") || "",
          strengthsWeaknesses: strengthsWeaknesses.trim() || "",
          goalTimeline: goalTimeline || "",
          riskPreference: riskPreference || "",
          ageRange: ageRange || "",
          budgetRange: budgetRange || "",
          courseJoined: courseJoined.trim() || "",
        }),
      });
      if (!res.ok) throw new Error("Submission failed");
      setFormSuccess(true);
      // Reset form
      setFormName("");
      setFormWhatsApp("");
      setFormEmail("");
      setCurrentStatus("");
      setFormCity("");
      setTimeAvailable("");
      setCurrentSkills("");
      setInterests([]);
      setStrengthsWeaknesses("");
      setGoalTimeline("");
      setRiskPreference("");
      setAgeRange("");
      setBudgetRange("");
      setCourseJoined("");
    } catch {
      setFormErrors({ form: "Something went wrong. Please try again." });
    } finally {
      setFormSubmitting(false);
    }
  };

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

  const scrollTo = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleRoadmapButtonClick = () => {
    // Prefill form fields based on search query
    if (searchQuery.trim()) {
      // Try to detect if it's a skill/interest
      const lowerQuery = searchQuery.toLowerCase();
      const detectedInterests = INTEREST_OPTIONS.filter(opt => 
        lowerQuery.includes(opt.toLowerCase())
      );
      if (detectedInterests.length > 0) {
        setInterests(detectedInterests);
      } else {
        // If no match, add to current skills or strengths
        setCurrentSkills(searchQuery);
      }
    }
    setRoadmapModalOpen(true);
  };

  return (
    <div className="page" ref={pageRef}>
      {/* ── TOP HEADER NAVIGATION ── */}
      <header className="top-header">
        <div className="header-container">
          <div className="header-logo">
            NG <span style={{ color: "#ff6b2b" }}>Cult</span>
          </div>
          <nav className="header-nav">
            <a href="#home" onClick={(e) => { e.preventDefault(); scrollTo("hero"); }} className={active === "hero" ? "active" : ""}>Home</a>
            <a href="#who" onClick={(e) => { e.preventDefault(); scrollTo("who"); }} className={active === "who" ? "active" : ""}>Who It's For</a>
            <a href="#what" onClick={(e) => { e.preventDefault(); scrollTo("what"); }} className={active === "what" ? "active" : ""}>What You Get</a>
            <a href="#why" onClick={(e) => { e.preventDefault(); scrollTo("why"); }} className={active === "why" ? "active" : ""}>Why Roadmap</a>
            <a href="#pricing" onClick={(e) => { e.preventDefault(); scrollTo("pricing"); }} className={active === "pricing" ? "active" : ""}>Pricing</a>
            <a href="#about" onClick={(e) => { e.preventDefault(); scrollTo("about"); }} className={active === "about" ? "active" : ""}>About</a>
            <a href="#register" onClick={(e) => { e.preventDefault(); scrollTo("register"); }} className={active === "register" ? "active" : ""}>Register</a>
            <a href="#faq" onClick={(e) => { e.preventDefault(); scrollTo("faq"); }} className={active === "faq" ? "active" : ""}>FAQ</a>
          </nav>
          <div className="header-actions">
            <button className="btn-login" onClick={() => setRoadmapModalOpen(true)}>
              Book Consultation
            </button>
          </div>
        </div>
      </header>

      {/* ═══ HERO ═══ */}
      <header className="screen" id="hero" ref={assignRef("hero")}>
        <div className="screen-inner hero-conversion-layout">
          {/* Main Search Section */}
          <div className="main-search-section">
            <div className="search-container">
              <div className="search-input-wrapper">
                <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                <input
                  type="text"
                  placeholder="Search career paths, skills, or concerns..."
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleRoadmapButtonClick();
                    }
                  }}
                />
              </div>
              <button
                className="btn-roadmap"
                onClick={handleRoadmapButtonClick}
              >
                Get Roadmap
              </button>
            </div>
          </div>

          {/* Service Categories */}
          <div className="service-categories">
            <div className="service-card" onClick={() => setRoadmapModalOpen(true)}>
              <div className="service-card-image">
                <img src="/hero_img.png" alt="Career Counselling" />
              </div>
              <h3>Career Counselling</h3>
              <p>Get personalized guidance</p>
            </div>
            <Link href="/roadmaps" className="service-card" style={{ textDecoration: "none", color: "inherit" }}>
              <div className="service-card-image">
                <img src="/hero_img.png" alt="Get Roadmap" />
              </div>
              <h3>Get Roadmap</h3>
              <p>Step-by-step career plan</p>
            </Link>
            <div className="service-card" onClick={() => setRoadmapModalOpen(true)}>
              <div className="service-card-image">
                <img src="/hero_img.png" alt="Skill Assessment" />
              </div>
              <h3>Skill Assessment</h3>
              <p>Identify gaps & strengths</p>
            </div>
            <div className="service-card" onClick={() => setRoadmapModalOpen(true)}>
              <div className="service-card-image">
                <img src="/hero_img.png" alt="Course Guidance" />
              </div>
              <h3>Course Guidance</h3>
              <p>Right courses for you</p>
            </div>
          </div>

          {/* Career Roadmaps Section */}
          <div className="career-concerns-section">
            <div className="concerns-header">
              <div>
                <h2>Career Roadmaps for Trending IT Jobs</h2>
              </div>
              <Link href="/roadmaps" className="btn-view-all" style={{ textDecoration: "none", display: "inline-block" }}>
                See All Roadmaps
              </Link>
            </div>
            <div className="concerns-grid">
              {roadmapsLoading ? (
                <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px", color: "var(--muted)" }}>
                  Loading roadmaps...
                </div>
              ) : topRoadmaps.length === 0 ? (
                <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px", color: "var(--muted)" }}>
                  No roadmaps available.
                </div>
              ) : (
                topRoadmaps.map((roadmap, index) => {
                  const cardColors = ["roadmap-card-1", "roadmap-card-2", "roadmap-card-3", "roadmap-card-4", "roadmap-card-5"];
                  return (
                    <div
                      key={roadmap.id}
                      className={`concern-card roadmap-card ${cardColors[index % 5]}`}
                      style={{ 
                        textDecoration: "none", 
                        color: "inherit",
                        position: "relative",
                        opacity: 0.7,
                        cursor: "not-allowed",
                        pointerEvents: "none"
                      }}
                    >
                      <div className="roadmap-rank">#{roadmap.rank}</div>
                      <div className="roadmap-content">
                        <div className="roadmap-title">{roadmap.title}</div>
                        <div className="roadmap-skills">{roadmap.skills}</div>
                        <div className="roadmap-salary">Salary: From ₹{roadmap.salary} LPA</div>
                      </div>
                      <div style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "rgba(255, 255, 255, 0.9)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "12px",
                        padding: "16px",
                        textAlign: "center"
                      }}>
                        <div style={{ 
                          fontWeight: 700, 
                          fontSize: "1rem", 
                          color: "var(--accent-orange)",
                          marginBottom: "8px"
                        }}>
                          Work In Progress
                        </div>
                        <div style={{ 
                          fontSize: "0.85rem", 
                          color: "var(--muted)",
                          marginBottom: "12px"
                        }}>
                          Follow{" "}
                          <a 
                            href="https://instagram.com/ngcult.ai" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            style={{ 
                              color: "var(--accent-orange)", 
                              textDecoration: "underline",
                              pointerEvents: "auto"
                            }}
                          >
                            @ngcult.ai
                          </a>
                          {" "}for updates
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ═══ ROADMAP MODAL ── */}
      {roadmapModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => {
            if (!formSubmitting) {
              setRoadmapModalOpen(false);
              setFormSuccess(false);
            }
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => {
                if (!formSubmitting) {
                  setRoadmapModalOpen(false);
                  setFormSuccess(false);
                }
              }}
              disabled={formSubmitting}
            >
              ×
            </button>
            {formSuccess ? (
              <div className="modal-success">
                <div className="success-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <h3>Request received</h3>
                <p>
                  We&apos;ll contact you on WhatsApp with next steps.
                </p>
                <button
                  className="btn primary"
                  type="button"
                  onClick={() => {
                    setRoadmapModalOpen(false);
                    setFormSuccess(false);
                  }}
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleRoadmapSubmit} noValidate>
                <h2>Get Your Customized Roadmap</h2>
                {formErrors.form && (
                  <div className="form-error-banner">{formErrors.form}</div>
                )}
                <label>
                  Full Name <span style={{ color: "#dc2626" }}>*</span>
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className={formErrors.name ? "input-error" : ""}
                    required
                  />
                  {formErrors.name && (
                    <span className="field-error">{formErrors.name}</span>
                  )}
                </label>
                <label>
                  WhatsApp Number <span style={{ color: "#dc2626" }}>*</span>
                  <div
                    className={`wa-input-wrap${
                      formErrors.whatsapp ? " input-error" : ""
                    }`}
                  >
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
                      required
                    />
                  </div>
                  {formErrors.whatsapp && (
                    <span className="field-error">{formErrors.whatsapp}</span>
                  )}
                </label>
                <label>
                  Email (Optional)
                  <input
                    type="email"
                    placeholder="you@email.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                  />
                </label>
                <label>
                  Current Status <span style={{ color: "#dc2626" }}>*</span>
                  <select
                    value={currentStatus}
                    onChange={(e) => setCurrentStatus(e.target.value)}
                    className={formErrors.currentStatus ? "input-error" : ""}
                    required
                  >
                    <option value="">Select your status</option>
                    <option value="School">School</option>
                    <option value="College">College</option>
                    <option value="Graduate">Graduate</option>
                    <option value="Working">Working</option>
                    <option value="Career Switcher">Career Switcher</option>
                  </select>
                  {formErrors.currentStatus && (
                    <span className="field-error">
                      {formErrors.currentStatus}
                    </span>
                  )}
                </label>
                <div className="city-field" ref={cityRef}>
                  <label>
                    Current City (Optional)
                    <input
                      type="text"
                      placeholder="Start typing your city…"
                      value={formCity}
                      onChange={(e) => handleCityChange(e.target.value)}
                      onFocus={() => {
                        if (formCitySuggestions.length) setFormCityOpen(true);
                      }}
                    />
                  </label>
                  {formCityOpen && formCitySuggestions.length > 0 && (
                    <ul className="city-dropdown">
                      {formCitySuggestions.map((s) => (
                        <li
                          key={s}
                          className={`city-option${
                            formCity === s ? " selected" : ""
                          }`}
                          onClick={() => {
                            setFormCity(s);
                            setFormCityOpen(false);
                            setFormCitySuggestions([]);
                          }}
                        >
                          <svg
                            className="city-pin"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          {s}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <label>
                  Time Available Per Day/Week
                  <select
                    value={timeAvailable}
                    onChange={(e) => setTimeAvailable(e.target.value)}
                  >
                    <option value="">Select time available</option>
                    <option value="1-2 hours/day">1-2 hours/day</option>
                    <option value="3-4 hours/day">3-4 hours/day</option>
                    <option value="5-6 hours/day">5-6 hours/day</option>
                    <option value="Full-time (8+ hours/day)">Full-time (8+ hours/day)</option>
                    <option value="Weekends only">Weekends only</option>
                  </select>
                </label>
                <label>
                  Current Skills
                  <textarea
                    placeholder="List your current skills (e.g., Python basics, HTML/CSS, etc.)"
                    value={currentSkills}
                    onChange={(e) => setCurrentSkills(e.target.value)}
                    rows={3}
                  />
                </label>
                <label>
                  Interests
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "8px",
                      marginTop: "8px",
                    }}
                  >
                    {INTEREST_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => toggleInterest(opt)}
                        className={`interest-chip${
                          interests.includes(opt) ? " active" : ""
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </label>
                <label>
                  Strengths & Weaknesses
                  <textarea
                    placeholder="Briefly describe your strengths and areas you want to improve"
                    value={strengthsWeaknesses}
                    onChange={(e) => setStrengthsWeaknesses(e.target.value)}
                    rows={3}
                  />
                </label>
                <label>
                  Goal Timeline
                  <select
                    value={goalTimeline}
                    onChange={(e) => setGoalTimeline(e.target.value)}
                  >
                    <option value="">Select timeline</option>
                    <option value="1-3 months">1-3 months</option>
                    <option value="3-6 months">3-6 months</option>
                    <option value="6-12 months">6-12 months</option>
                    <option value="12+ months">12+ months</option>
                  </select>
                </label>
                <label>
                  Risk Preference
                  <select
                    value={riskPreference}
                    onChange={(e) => setRiskPreference(e.target.value)}
                  >
                    <option value="">Select preference</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </label>
                <label>
                  Age Range
                  <select
                    value={ageRange}
                    onChange={(e) => setAgeRange(e.target.value)}
                  >
                    <option value="">Select age range</option>
                    <option value="16-18">16-18</option>
                    <option value="19-22">19-22</option>
                    <option value="23-26">23-26</option>
                    <option value="27-30">27-30</option>
                    <option value="30+">30+</option>
                  </select>
                </label>
                <label>
                  Budget Range for Learning (Optional)
                  <select
                    value={budgetRange}
                    onChange={(e) => setBudgetRange(e.target.value)}
                  >
                    <option value="">Select budget range</option>
                    <option value="Under ₹10,000">Under ₹10,000</option>
                    <option value="₹10,000 - ₹50,000">₹10,000 - ₹50,000</option>
                    <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</option>
                    <option value="₹1,00,000+">₹1,00,000+</option>
                    <option value="Not sure">Not sure</option>
                  </select>
                </label>
                <label>
                  Any Course Already Joined? (Optional)
                  <input
                    type="text"
                    placeholder="Mention any course you've already enrolled in"
                    value={courseJoined}
                    onChange={(e) => setCourseJoined(e.target.value)}
                  />
                </label>
                <button
                  className="btn primary"
                  type="submit"
                  disabled={formSubmitting}
                  style={{ width: "100%", marginTop: "16px" }}
                >
                  {formSubmitting ? "Submitting…" : "Send My Roadmap Request"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ═══ PROCESS ═══ */}
      <section className="screen section-white" id="analogy" ref={assignRef("analogy")}>
        <div className="screen-inner screen-content">
          <div className="block headline sa">
            <h2>How It Works</h2>
          </div>
          <div className="process-steps">
            <div className="process-step">
              <div className="step-number">1</div>
              <h3>Assessment</h3>
              <p>We analyze your skills & profile</p>
            </div>
            <div className="process-step">
              <div className="step-number">2</div>
              <h3>Consultation</h3>
              <p>30-45 min expert session</p>
            </div>
            <div className="process-step">
              <div className="step-number">3</div>
              <h3>Roadmap</h3>
              <p>Personalized plan delivered</p>
            </div>
            <div className="process-step">
              <div className="step-number">4</div>
              <h3>Follow-up</h3>
              <p>Optional progress tracking</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ WHO IT'S FOR ═══ */}
      <section className="screen section-black" id="who" ref={assignRef("who")}>
        <div className="screen-inner screen-content">
          <div className="block headline sa">
            <h2>
              Who This Is <span style={{ color: "#ff6b2b" }}>For</span>
            </h2>
          </div>
          <div className="who-grid">
            <div className="who-card">
              <h3>Students</h3>
              <p>Confused by too many IT options</p>
            </div>
            <div className="who-card">
              <h3>Graduates</h3>
              <p>Without clear direction</p>
            </div>
            <div className="who-card">
              <h3>Career Switchers</h3>
              <p>Limited time, need clarity</p>
            </div>
            <div className="who-card">
              <h3>Parents</h3>
              <p>Want guidance before investing</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ WHAT YOU WILL GET ═══ */}
      <section className="screen section-yellow" id="what" ref={assignRef("what")}>
        <div className="screen-inner screen-content">
          <div className="block headline sa">
            <h2>
              What You Will <span style={{ color: "#ff6b2b" }}>Get</span>
            </h2>
          </div>
          <div className="benefits-grid">
            <div className="benefit-card">
              <h3>Career Assessment</h3>
              <p>Skills & profile evaluation</p>
            </div>
            <div className="benefit-card">
              <h3>Personalized Roadmap</h3>
              <p>Tailored step-by-step plan</p>
            </div>
            <div className="benefit-card">
              <h3>Skill Gap Analysis</h3>
              <p>What to learn & when</p>
            </div>
            <div className="benefit-card">
              <h3>Market Insights</h3>
              <p>Real opportunities, not trends</p>
            </div>
            <div className="benefit-card">
              <h3>Course Guidance</h3>
              <p>Fit-based, not sales-driven</p>
            </div>
            <div className="benefit-card">
              <h3>Follow-up Support</h3>
              <p>Optional progress tracking</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ WHY ROADMAP ═══ */}
      <section className="screen section-white" id="why" ref={assignRef("why")}>
        <div className="screen-inner screen-content">
          <div className="block headline sa">
            <h2>
              Why a Career <span style={{ color: "#ff6b2b" }}>Roadmap</span>
            </h2>
          </div>
          <div className="why-grid">
            <div className="why-card">
              <h3>✓ Saves Time</h3>
              <p>No random course jumping</p>
            </div>
            <div className="why-card">
              <h3>✓ Avoids Wrong Investment</h3>
              <p>Choose right courses</p>
            </div>
            <div className="why-card">
              <h3>✓ Reduces Confusion</h3>
              <p>Clear direction</p>
            </div>
            <div className="why-card">
              <h3>✓ Faster Job Readiness</h3>
              <p>Right skills, right order</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section className="screen section-yellow" id="pricing" ref={assignRef("pricing")}>
        <div className="screen-inner screen-content screen-content-spread">
          <div className="block headline sa">
            <h2>
              Pricing for Career <span style={{ color: "#ff6b2b" }}>Consultation</span>
            </h2>
            <p style={{ marginTop: "16px", fontSize: "1.2rem", fontWeight: "700" }}>
              ₹99 Intro Career Consultation
            </p>
          </div>
          <div className="block card" style={{ maxWidth: "600px", margin: "0 auto" }}>
            <h3>What&apos;s Included:</h3>
            <ul style={{ marginTop: "16px", paddingLeft: "20px" }}>
              <li>Assessment + roadmap discussion</li>
              <li>Transparent guidance</li>
              <li>No forced course selling</li>
              <li>Personalized career path recommendation</li>
              <li>Skill gap analysis</li>
            </ul>
            <button
              className="btn primary"
              onClick={() => scrollTo("register")}
              style={{ width: "100%", marginTop: "24px" }}
            >
              Book ₹99 Consultation
            </button>
          </div>
        </div>
      </section>

      {/* ═══ ABOUT ═══ */}
      <section className="screen section-black" id="about" ref={assignRef("about")}>
        <div className="screen-inner screen-content">
          <div className="block headline sa">
            <h2>
              About <span style={{ color: "#ff6b2b" }}>NG Cult</span>
            </h2>
            <div className="about-grid">
              <div className="about-card">
                <h3>What We Are</h3>
                <p>Tech career counselling & roadmap platform</p>
              </div>
              <div className="about-card">
                <h3>What We're NOT</h3>
                <p>Not a training institute, bootcamp, or course seller</p>
              </div>
              <div className="about-card">
                <h3>Our Mission</h3>
                <p>Reduce confusion & wrong career decisions</p>
              </div>
              <div className="about-card">
                <h3>Our Approach</h3>
                <p>Evidence-based counselling with personalized roadmaps</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ REGISTER ═══ */}
      <section className="screen section-yellow" id="register" ref={assignRef("register")}>
        <div className="screen-inner screen-content screen-content-center">
          <div className="waitlist-box">
            <div className="waitlist-copy sa">
              <h2>
                Book Your <span style={{ color: "#ff6b2b" }}>₹99 Consultation</span>
              </h2>
              <p>
                Fill in your details and we&apos;ll contact you on WhatsApp to schedule
                your career counselling session.
              </p>
            </div>
            {formSuccess ? (
              <div className="waitlist-success sa sa-d2">
                <div className="success-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <h3>Request received!</h3>
                <p>We&apos;ll contact you on WhatsApp with next steps.</p>
                <button
                  className="btn ghost"
                  type="button"
                  onClick={() => setFormSuccess(false)}
                  style={{ marginTop: "8px" }}
                >
                  Submit Another
                </button>
              </div>
            ) : (
              <form
                className="waitlist-form sa sa-d2"
                onSubmit={handleRoadmapSubmit}
                noValidate
              >
                {formErrors.form && (
                  <div className="form-error-banner">{formErrors.form}</div>
                )}
                <label>
                  Name
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className={formErrors.name ? "input-error" : ""}
                  />
                  {formErrors.name && (
                    <span className="field-error">{formErrors.name}</span>
                  )}
                </label>
                <label>
                  WhatsApp Number
                  <div
                    className={`wa-input-wrap${
                      formErrors.whatsapp ? " input-error" : ""
                    }`}
                  >
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
                  {formErrors.whatsapp && (
                    <span className="field-error">{formErrors.whatsapp}</span>
                  )}
                </label>
                <label>
                  Email
                  <input
                    type="email"
                    placeholder="you@email.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                  />
                </label>
                <label>
                  Current Status
                  <select
                    value={currentStatus}
                    onChange={(e) => setCurrentStatus(e.target.value)}
                    className={formErrors.currentStatus ? "input-error" : ""}
                  >
                    <option value="">Select your status</option>
                    <option value="School">School</option>
                    <option value="College">College</option>
                    <option value="Graduate">Graduate</option>
                    <option value="Working">Working</option>
                    <option value="Career Switcher">Career Switcher</option>
                  </select>
                  {formErrors.currentStatus && (
                    <span className="field-error">
                      {formErrors.currentStatus}
                    </span>
                  )}
                </label>
                <label>
                  Preferred Time Slot
                  <select value={timeAvailable} onChange={(e) => setTimeAvailable(e.target.value)}>
                    <option value="">Select preferred time</option>
                    <option value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</option>
                    <option value="Afternoon (12 PM - 4 PM)">Afternoon (12 PM - 4 PM)</option>
                    <option value="Evening (4 PM - 8 PM)">Evening (4 PM - 8 PM)</option>
                    <option value="Weekend">Weekend</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                </label>
                <button
                  className="btn primary"
                  type="submit"
                  disabled={formSubmitting}
                >
                  {formSubmitting ? "Submitting…" : "Book Consultation"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="screen section-white" id="faq" ref={assignRef("faq")}>
        <div className="screen-inner screen-content">
          <div className="block headline sa">
            <h2>
              Frequently Asked <span style={{ color: "#ff6b2b" }}>Questions</span>
            </h2>
          </div>
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            {FAQ_DATA.map((faq, idx) => (
              <div
                key={idx}
                className="faq-item"
                style={{
                  marginBottom: "24px",
                  padding: "20px",
                  border: "1px solid rgba(0,0,0,0.1)",
                  borderRadius: "8px",
                }}
              >
                <h3 style={{ marginBottom: "12px", fontSize: "1.1rem" }}>
                  {faq.question}
                </h3>
                <p style={{ color: "var(--muted)", lineHeight: "1.6" }}>
                  {faq.answer}
                </p>
              </div>
            ))}
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
                Tech Career Counselling & Personalized Roadmap Platform
              </p>
              <p style={{ marginTop: "12px", fontSize: "0.85rem", color: "var(--muted)" }}>
                Not a training institute. Not a bootcamp. Not a course-selling platform.
              </p>
            </div>
            <div className="footer-links">
              <a
                href="https://instagram.com/ng_cult"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
              <a
                href="https://twitter.com/ng_cult"
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter
              </a>
              <a
                href="https://facebook.com/ngcult"
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook
              </a>
              <button onClick={() => scrollTo("register")}>Contact</button>
            </div>
          </div>
        </div>
      </footer>

      {/* ═══ FLOATING WHATSAPP BUTTON ═══ */}
      <a
        href="https://chat.whatsapp.com/GGHq1Cy5ByJ81BSd6blMtU?mode=gi_t"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        aria-label="Join WhatsApp Group"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </a>

      {/* ═══ STRUCTURED DATA (SCHEMA.ORG) ═══ */}
      <StructuredData />
    </div>
  );
}
