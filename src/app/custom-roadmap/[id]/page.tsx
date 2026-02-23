"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface DayTask {
  day: number;
  newTopic: string;
  review1?: string; // N-3 day topic
  review2?: string; // N-6 day topic
}

// 21-day Python roadmap structure
const ROADMAP_DATA: DayTask[] = [
  { day: 1, newTopic: "Variables" },
  { day: 2, newTopic: "Strings" },
  { day: 3, newTopic: "Lists" },
  { day: 4, newTopic: "Dictionaries", review1: "Variables" },
  { day: 5, newTopic: "Functions", review1: "Strings" },
  { day: 6, newTopic: "If/Else", review1: "Lists" },
  { day: 7, newTopic: "Loops", review1: "Dictionaries", review2: "Variables" },
  { day: 8, newTopic: "While Loop", review1: "Functions", review2: "Strings" },
  { day: 9, newTopic: "File Handling", review1: "If/Else", review2: "Lists" },
  { day: 10, newTopic: "Try/Except", review1: "Loops", review2: "Dictionaries" },
  { day: 11, newTopic: "Classes", review1: "While Loop", review2: "Functions" },
  { day: 12, newTopic: "Methods", review1: "File Handling", review2: "If/Else" },
  { day: 13, newTopic: "Modules", review1: "Try/Except", review2: "Loops" },
  { day: 14, newTopic: "Comprehensions", review1: "Classes", review2: "While Loop" },
  { day: 15, newTopic: "Lambda", review1: "Methods", review2: "File Handling" },
  { day: 16, newTopic: "Decorators", review1: "Modules", review2: "Try/Except" },
  { day: 17, newTopic: "Generators", review1: "Comprehensions", review2: "Classes" },
  { day: 18, newTopic: "Args & Kwargs", review1: "Lambda", review2: "Methods" },
  { day: 19, newTopic: "Context Managers", review1: "Decorators", review2: "Modules" },
  { day: 20, newTopic: "Advanced OOP", review1: "Generators", review2: "Comprehensions" },
  { day: 21, newTopic: "Job-Level Project", review1: "Args & Kwargs", review2: "Lambda" },
];

interface TaskStatus {
  [key: string]: boolean; // key format: "day-1-new" or "day-1-review1" or "day-1-review2"
}

export default function CustomRoadmapPage() {
  const params = useParams();
  const roadmapId = params.id as string;
  const [taskStatus, setTaskStatus] = useState<TaskStatus>({});
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [userId, setUserId] = useState<number | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showSignup, setShowSignup] = useState(true);
  const [signupName, setSignupName] = useState("");
  const [signupWhatsapp, setSignupWhatsapp] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState("");

  // Check for existing session
  useEffect(() => {
    const savedSession = localStorage.getItem(`roadmap-session-${roadmapId}`);
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        setUserId(session.user_id);
        setSessionId(session.session_id);
        setShowSignup(false);
        loadProgressFromSupabase(session.user_id);
      } catch (e) {
        console.error("Error loading session:", e);
      }
    }
  }, [roadmapId]);

  // Load progress from Supabase
  const loadProgressFromSupabase = async (uid: number) => {
    try {
      const response = await fetch(`/api/custom-roadmap/progress?user_id=${uid}&roadmap_id=${roadmapId}`);
      if (response.ok) {
        const data = await response.json();
        const progress: TaskStatus = {};
        data.progress.forEach((p: any) => {
          const key = `day-${p.day}-${p.task_type}`;
          progress[key] = p.completed;
        });
        setTaskStatus(progress);
      }
    } catch (error) {
      console.error("Error loading progress from Supabase:", error);
    }
  };

  // Handle signup
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupLoading(true);
    setSignupError("");

    try {
      const response = await fetch("/api/custom-roadmap/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signupName,
          whatsapp: signupWhatsapp,
          roadmap_id: roadmapId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to sign up");
      }

      const data = await response.json();
      setUserId(data.user_id);
      setSessionId(data.session_id);
      setShowSignup(false);

      // Save session to localStorage
      localStorage.setItem(
        `roadmap-session-${roadmapId}`,
        JSON.stringify({ user_id: data.user_id, session_id: data.session_id })
      );

      // Load existing progress
      await loadProgressFromSupabase(data.user_id);
    } catch (err: any) {
      setSignupError(err.message || "Failed to sign up");
    } finally {
      setSignupLoading(false);
    }
  };

  // Save progress to Supabase
  const saveProgressToSupabase = async (day: number, taskType: "new" | "review1" | "review2", completed: boolean) => {
    if (!userId) return;

    try {
      await fetch("/api/custom-roadmap/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          roadmap_id: roadmapId,
          day: day,
          task_type: taskType,
          completed: completed,
        }),
      });
    } catch (error) {
      console.error("Error saving progress to Supabase:", error);
    }
  };

  const toggleTask = (day: number, taskType: "new" | "review1" | "review2") => {
    const key = `day-${day}-${taskType}`;
    const newStatus = !taskStatus[key];
    
    setTaskStatus((prev) => ({
      ...prev,
      [key]: newStatus,
    }));

    // Save to Supabase if user is signed up
    if (userId) {
      saveProgressToSupabase(day, taskType, newStatus);
    }
  };

  const getTaskKey = (day: number, taskType: "new" | "review1" | "review2") => {
    return `day-${day}-${taskType}`;
  };

  const isTaskCompleted = (day: number, taskType: "new" | "review1" | "review2") => {
    return taskStatus[getTaskKey(day, taskType)] || false;
  };

  const getDayProgress = (day: number) => {
    const dayData = ROADMAP_DATA[day - 1];
    const totalTasks = 1 + (dayData.review1 ? 1 : 0) + (dayData.review2 ? 1 : 0);
    const completedTasks =
      (isTaskCompleted(day, "new") ? 1 : 0) +
      (dayData.review1 && isTaskCompleted(day, "review1") ? 1 : 0) +
      (dayData.review2 && isTaskCompleted(day, "review2") ? 1 : 0);
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };

  const getOverallProgress = () => {
    let totalTasks = 0;
    let completedTasks = 0;
    ROADMAP_DATA.forEach((dayData) => {
      totalTasks += 1 + (dayData.review1 ? 1 : 0) + (dayData.review2 ? 1 : 0);
      completedTasks +=
        (isTaskCompleted(dayData.day, "new") ? 1 : 0) +
        (dayData.review1 && isTaskCompleted(dayData.day, "review1") ? 1 : 0) +
        (dayData.review2 && isTaskCompleted(dayData.day, "review2") ? 1 : 0);
    });
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };

  const shareOnWhatsApp = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = `Check out this 21-day Python learning roadmap! 🚀\n\n${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const getCalendarDays = () => {
    const days: { date: Date; dayNumber: number }[] = [];
    const startDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() - (startDate.getDay() || 7) + 1); // Start from Monday

    for (let i = 0; i < 21; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push({ date, dayNumber: i + 1 });
    }
    return days;
  };

  const calendarDays = getCalendarDays();
  const overallProgress = getOverallProgress();

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @media (min-width: 1024px) {
          .main-content-grid {
            grid-template-columns: 1fr 350px !important;
          }
          .instagram-sidebar {
            display: block !important;
          }
          .header-nav {
            flex-direction: row !important;
            gap: 24px !important;
            align-items: center !important;
          }
        }
        @media (max-width: 640px) {
          .calendar-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}} />
      <div style={{ minHeight: "100vh", background: "var(--white)" }}>
      {/* Header */}
      <header className="top-header" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, width: "100%" }}>
        <div className="header-container">
          <Link href="/" className="header-logo" style={{ textDecoration: "none", color: "inherit" }}>
            NG <span style={{ color: "#ff6b2b" }}>Cult</span>
          </Link>
          <nav className="header-nav" style={{ flexDirection: "column", gap: "8px", alignItems: "flex-start" }}>
            <Link href="/" style={{ textDecoration: "none", color: "var(--ink)", fontWeight: 600, fontSize: "0.9rem" }}>Home</Link>
            <Link href="/roadmaps" style={{ textDecoration: "none", color: "var(--ink)", fontWeight: 600, fontSize: "0.9rem" }}>All Roadmaps</Link>
          </nav>
        </div>
      </header>

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "120px 4vw 40px 4vw" }}>
        {/* Signup Modal */}
        {showSignup && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "20px",
            }}
          >
            <div
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "32px",
                maxWidth: "400px",
                width: "100%",
              }}
            >
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "16px", color: "var(--ink)" }}>
                Get Started 🚀
              </h2>
              <p style={{ fontSize: "0.95rem", color: "var(--muted)", marginBottom: "24px" }}>
                Sign up to track your progress and save it across devices
              </p>
              <form onSubmit={handleSignup}>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, fontSize: "0.9rem" }}>
                    Name *
                  </label>
                  <input
                    type="text"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "2px solid rgba(0,0,0,0.1)",
                      borderRadius: "8px",
                      fontSize: "1rem",
                    }}
                    placeholder="Enter your name"
                  />
                </div>
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, fontSize: "0.9rem" }}>
                    WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    value={signupWhatsapp}
                    onChange={(e) => setSignupWhatsapp(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "2px solid rgba(0,0,0,0.1)",
                      borderRadius: "8px",
                      fontSize: "1rem",
                    }}
                    placeholder="+91 9876543210"
                  />
                </div>
                {signupError && (
                  <div style={{ padding: "12px", background: "#fee", color: "#c00", borderRadius: "8px", marginBottom: "16px", fontSize: "0.9rem" }}>
                    {signupError}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={signupLoading}
                  style={{
                    width: "100%",
                    padding: "14px",
                    background: "var(--accent-orange)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    fontWeight: 700,
                    cursor: signupLoading ? "not-allowed" : "pointer",
                  }}
                >
                  {signupLoading ? "Signing up..." : "Start Learning 🎯"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Title and Progress */}
        <div style={{ marginBottom: "48px", textAlign: "center" }}>
          <h1 style={{ fontSize: "clamp(1.8rem, 5vw, 2.5rem)", fontWeight: 900, marginBottom: "12px", lineHeight: "1.2" }}>
            <span style={{ color: "#6366f1" }}>21-Day Python Learning Roadmap</span>
            <br />
            <span style={{ fontSize: "clamp(1.4rem, 4vw, 1.8rem)", color: "#ec4899" }}>1-4-7 Technique 🎯</span>
          </h1>
          <p style={{ fontSize: "clamp(1rem, 3vw, 1.3rem)", color: "var(--ink)", marginBottom: "24px", fontWeight: 600 }}>
            You're just <span style={{ color: "var(--accent-orange)" }}>21 days away</span> from being a Python Developer! 🐍✨
          </p>
          <div style={{ marginBottom: "24px" }}>
            <button
              onClick={shareOnWhatsApp}
              style={{
                padding: "12px 24px",
                background: "#25D366",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                margin: "0 auto",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Share this roadmap with your friends
            </button>
          </div>
          <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontWeight: 600 }}>Overall Progress</span>
              <span style={{ fontWeight: 700, color: "var(--accent-orange)" }}>{overallProgress}%</span>
            </div>
            <div
              style={{
                width: "100%",
                height: "12px",
                background: "rgba(0,0,0,0.1)",
                borderRadius: "6px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${overallProgress}%`,
                  height: "100%",
                  background: "var(--accent-orange)",
                  transition: "width 0.3s ease",
                }}
              />
            </div>
          </div>
        </div>

        {/* Main Content with Instagram Preview */}
        <div className="main-content-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "32px", marginBottom: "64px" }}>
          {/* Calendar View */}
          <section>
            <h2 style={{ fontSize: "clamp(1.4rem, 4vw, 1.8rem)", fontWeight: 700, marginBottom: "24px", color: "var(--ink)" }}>
              Calendar View 📅
            </h2>
            <div
              className="calendar-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(min(140px, 100%), 1fr))",
                gap: "12px",
              }}
            >
              {calendarDays.map(({ date, dayNumber }) => {
                const dayData = ROADMAP_DATA[dayNumber - 1];
                const progress = getDayProgress(dayNumber);
                const isToday = date.toDateString() === new Date().toDateString();
                
                // Pastel colors array
                const pastelColors = [
                  "#FFE5F1", // Pink
                  "#E5F3FF", // Light Blue
                  "#FFF5E5", // Peach
                  "#F0F8E5", // Light Green
                  "#F5E5FF", // Lavender
                  "#E5FFF5", // Mint
                  "#FFE5E5", // Light Red
                  "#FFF0E5", // Apricot
                  "#E5F0FF", // Sky Blue
                  "#F0FFE5", // Lime
                  "#FFE5F5", // Rose
                  "#E5FFF0", // Seafoam
                  "#FFF5F0", // Cream
                  "#F0E5FF", // Periwinkle
                  "#E5FFE5", // Pale Green
                  "#FFE5E8", // Blush
                  "#E5F5FF", // Powder Blue
                  "#FFF0F5", // Pink Cream
                  "#F5FFE5", // Pale Yellow
                  "#E5E5FF", // Light Indigo
                  "#FFE5F8", // Pink Rose
                ];
                
                const cardColor = isToday ? "#fff9e6" : pastelColors[(dayNumber - 1) % pastelColors.length];

                return (
                  <div
                    key={dayNumber}
                    style={{
                      border: isToday ? "2px solid var(--accent-orange)" : "2px solid rgba(0,0,0,0.15)",
                      borderRadius: "12px",
                      padding: "16px",
                      background: cardColor,
                      minHeight: "140px",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div style={{ marginBottom: "8px" }}>
                      <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>Day {dayNumber}</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ marginBottom: "8px" }}>
                        <label
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            cursor: "pointer",
                            fontSize: "0.9rem",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isTaskCompleted(dayNumber, "new")}
                            onChange={() => toggleTask(dayNumber, "new")}
                            style={{ width: "18px", height: "18px", cursor: "pointer" }}
                          />
                          <span style={{ fontWeight: 600 }}>{dayData.newTopic}</span>
                        </label>
                      </div>
                      {dayData.review1 && (
                        <div style={{ marginBottom: "6px" }}>
                          <label
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              cursor: "pointer",
                              fontSize: "0.85rem",
                              color: "var(--muted)",
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={isTaskCompleted(dayNumber, "review1")}
                              onChange={() => toggleTask(dayNumber, "review1")}
                              style={{ width: "16px", height: "16px", cursor: "pointer" }}
                            />
                            <span>Review: {dayData.review1}</span>
                          </label>
                        </div>
                      )}
                      {dayData.review2 && (
                        <div style={{ marginBottom: "6px" }}>
                          <label
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              cursor: "pointer",
                              fontSize: "0.85rem",
                              color: "var(--muted)",
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={isTaskCompleted(dayNumber, "review2")}
                              onChange={() => toggleTask(dayNumber, "review2")}
                              style={{ width: "16px", height: "16px", cursor: "pointer" }}
                            />
                            <span>Review: {dayData.review2}</span>
                          </label>
                        </div>
                      )}
                    </div>
                    <div
                      style={{
                        marginTop: "8px",
                        fontSize: "0.75rem",
                        color: "var(--muted)",
                        fontWeight: 600,
                      }}
                    >
                      {progress}% done
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Instagram Preview Sidebar - Desktop Only */}
          <aside className="instagram-sidebar" style={{ position: "sticky", top: "120px", height: "fit-content", display: "none" }}>
            <div
              style={{
                border: "1px solid rgba(0,0,0,0.1)",
                borderRadius: "12px",
                overflow: "hidden",
                background: "white",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              <div style={{ padding: "12px", borderBottom: "1px solid rgba(0,0,0,0.1)", display: "flex", alignItems: "center", gap: "8px" }}>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #f58529, #dd2a7b, #8134af, #515bd4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: "26px",
                      height: "26px",
                      borderRadius: "50%",
                      background: "white",
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>ngcult.ai</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>Instagram</div>
                </div>
              </div>
              <div style={{ padding: "16px", background: "#fafafa" }}>
                <blockquote
                  className="instagram-media"
                  data-instgrm-permalink="https://www.instagram.com/p/DVDNoYdEYzC/"
                  data-instgrm-version="14"
                  style={{
                    background: "#FFF",
                    border: "0",
                    borderRadius: "3px",
                    boxShadow: "0 0 1px 0 rgba(0,0,0,0.5), 0 1px 10px 0 rgba(0,0,0,0.15)",
                    margin: "1px",
                    maxWidth: "100%",
                    minWidth: "326px",
                    padding: "0",
                    width: "calc(100% - 2px)",
                  }}
                >
                  <div style={{ padding: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #f58529, #dd2a7b, #8134af, #515bd4)",
                          marginRight: "12px",
                        }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>ngcult.ai</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>View on Instagram</div>
                      </div>
                    </div>
                    <a
                      href="https://www.instagram.com/p/DVDNoYdEYzC/"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "block",
                        padding: "12px",
                        background: "var(--accent-orange)",
                        color: "white",
                        textAlign: "center",
                        borderRadius: "8px",
                        textDecoration: "none",
                        fontWeight: 600,
                        fontSize: "0.9rem",
                      }}
                    >
                      View Original Post →
                    </a>
                  </div>
                </blockquote>
                <script async src="//www.instagram.com/embed.js"></script>
              </div>
              <div style={{ padding: "12px", fontSize: "0.85rem", color: "var(--muted)", borderTop: "1px solid rgba(0,0,0,0.1)" }}>
                <div style={{ fontWeight: 600, marginBottom: "4px" }}>Follow us for more roadmaps! 📚</div>
                <a
                  href="https://instagram.com/ngcult.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--accent-orange)", textDecoration: "none", fontWeight: 600 }}
                >
                  @ngcult.ai →
                </a>
              </div>
            </div>
          </aside>
        </div>

        {/* Todo List View */}
        <section style={{ marginBottom: "64px" }}>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "24px", color: "var(--ink)" }}>
            Complete Todo List 📋
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {ROADMAP_DATA.map((dayData) => {
              const progress = getDayProgress(dayData.day);
              return (
                <div
                  key={dayData.day}
                  style={{
                    border: "1px solid rgba(0,0,0,0.1)",
                    borderRadius: "12px",
                    padding: "20px",
                    background: progress === 100 ? "#e8f5e9" : "white",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--ink)" }}>
                      Day {dayData.day}
                    </h3>
                    <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--accent-orange)" }}>
                      {progress}% Complete
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        cursor: "pointer",
                        padding: "8px",
                        borderRadius: "6px",
                        background: isTaskCompleted(dayData.day, "new") ? "#e8f5e9" : "transparent",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isTaskCompleted(dayData.day, "new")}
                        onChange={() => toggleTask(dayData.day, "new")}
                        style={{ width: "20px", height: "20px", cursor: "pointer" }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "1rem" }}>New Topic: {dayData.newTopic}</div>
                      </div>
                    </label>
                    {dayData.review1 && (
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          cursor: "pointer",
                          padding: "8px",
                          borderRadius: "6px",
                          background: isTaskCompleted(dayData.day, "review1") ? "#e8f5e9" : "transparent",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isTaskCompleted(dayData.day, "review1")}
                          onChange={() => toggleTask(dayData.day, "review1")}
                          style={{ width: "20px", height: "20px", cursor: "pointer" }}
                        />
                        <div>
                          <div style={{ fontSize: "0.95rem", color: "var(--muted)" }}>
                            Review: {dayData.review1}
                          </div>
                        </div>
                      </label>
                    )}
                    {dayData.review2 && (
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          cursor: "pointer",
                          padding: "8px",
                          borderRadius: "6px",
                          background: isTaskCompleted(dayData.day, "review2") ? "#e8f5e9" : "transparent",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isTaskCompleted(dayData.day, "review2")}
                          onChange={() => toggleTask(dayData.day, "review2")}
                          style={{ width: "20px", height: "20px", cursor: "pointer" }}
                        />
                        <div>
                          <div style={{ fontSize: "0.95rem", color: "var(--muted)" }}>
                            Review: {dayData.review2}
                          </div>
                        </div>
                      </label>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* NG Cult Info and CTA */}
        <section
          style={{
            background: "var(--yellow)",
            borderRadius: "16px",
            padding: "48px 32px",
            textAlign: "center",
            marginTop: "64px",
          }}
        >
          <h2 style={{ fontSize: "2rem", fontWeight: 900, marginBottom: "16px", color: "var(--ink)" }}>
            About NG Cult
          </h2>
          <p style={{ fontSize: "1.1rem", color: "var(--ink)", marginBottom: "24px", maxWidth: "800px", margin: "0 auto 24px" }}>
            NG Cult is a tech career counselling and personalized roadmap platform. We help you choose the right IT career
            path based on your skills, interests, and market opportunities. Get evidence-based guidance tailored to your
            specific situation.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "600px", margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "8px" }}>Personalized Guidance</div>
                <div style={{ fontSize: "0.95rem", color: "var(--muted)" }}>
                  Get roadmaps tailored to your profile
                </div>
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "8px" }}>Skill Assessment</div>
                <div style={{ fontSize: "0.95rem", color: "var(--muted)" }}>
                  Identify gaps and strengths
                </div>
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "8px" }}>Course Guidance</div>
                <div style={{ fontSize: "0.95rem", color: "var(--muted)" }}>
                  Right courses for your roadmap
                </div>
              </div>
            </div>
            <Link href="/#register" style={{ textDecoration: "none", marginTop: "24px" }}>
              <button
                style={{
                  padding: "16px 32px",
                  background: "var(--accent-orange)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                Book Your ₹99 Consultation
              </button>
            </Link>
            <p style={{ fontSize: "0.9rem", color: "var(--muted)", marginTop: "16px" }}>
              Get personalized career roadmap tailored to your profile
            </p>
          </div>
        </section>
      </div>
    </div>
    </>
  );
}
