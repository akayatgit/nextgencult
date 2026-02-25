"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CustomRoadmapTemplate } from "@/app/components/CustomRoadmapTemplate";

interface DayVideo {
  title: string;
  url: string;
}

interface DayLink {
  title: string;
  url: string;
}

interface DayTask {
  day: number;
  newTopic: string;
  review1?: string;
  review2?: string;
  youtubeVideos?: DayVideo[];
  links?: DayLink[];
  tasks?: {
    title: string;
    description?: string;
    subtasks?: { title: string }[];
  }[];
}

// Default 21-day Python roadmap (used only when no template is found)
const DEFAULT_ROADMAP_DATA: DayTask[] = [
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
  const [roadmapDays, setRoadmapDays] = useState<DayTask[]>(DEFAULT_ROADMAP_DATA);
  const [roadmapTitle, setRoadmapTitle] = useState<string | undefined>(undefined);
  const [taskStatus, setTaskStatus] = useState<TaskStatus>({});
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [userId, setUserId] = useState<number | null>(null);
  const [activeView, setActiveView] = useState<"calendar" | "todo">("todo");
  const [uiMode, setUiMode] = useState<"dark" | "light">("dark");
  const [uiModeDefault, setUiModeDefault] = useState<"dark" | "light">("dark");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showSignup, setShowSignup] = useState(true);
  const [signupName, setSignupName] = useState("");
  const [signupWhatsapp, setSignupWhatsapp] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState("");

  const getYouTubeId = (url: string): string | null => {
    try {
      const u = new URL(url);
      if (u.hostname.includes("youtu.be")) {
        return u.pathname.slice(1);
      }
      if (u.hostname.includes("youtube.com")) {
        if (u.pathname === "/watch") {
          return u.searchParams.get("v");
        }
        if (u.pathname.startsWith("/embed/")) {
          const parts = u.pathname.split("/");
          return parts[2] || null;
        }
      }
      return null;
    } catch {
      return null;
    }
  };

  // Load template for this roadmap (if it exists)
  useEffect(() => {
    async function loadTemplate() {
      try {
        const res = await fetch(`/api/custom-roadmap/templates?id=${roadmapId}`);
        if (!res.ok) return; // fall back to default roadmap
        const data = await res.json();
        if (data.title) {
          setRoadmapTitle(data.title as string);
        }
        if (Array.isArray(data.days) && data.days.length > 0) {
          setRoadmapDays(
            data.days.map((d: any, index: number) => ({
              day: typeof d.day === "number" ? d.day : index + 1,
              newTopic: d.newTopic ?? "",
              review1: d.review1 ?? undefined,
              review2: d.review2 ?? undefined,
              youtubeVideos: Array.isArray(d.youtubeVideos)
                ? d.youtubeVideos
                : undefined,
              links: Array.isArray(d.links) ? d.links : undefined,
              tasks: Array.isArray(d.tasks) ? d.tasks : undefined,
            }))
          );
        }
        if (data.ui_mode_default === "light" || data.ui_mode_default === "dark") {
          setUiModeDefault(data.ui_mode_default);
          setUiMode(data.ui_mode_default);
        }
      } catch (e) {
        console.error("Error loading custom roadmap template:", e);
      }
    }
    loadTemplate();
  }, [roadmapId]);

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

    // Update local state
    setTaskStatus((prev) => {
      const next: TaskStatus = {
        ...prev,
        [key]: newStatus,
      };

      // If the title-level task is toggled, cascade to subtasks (review1/review2)
      if (taskType === "new") {
        const dayData = roadmapDays.find((d) => d.day === day);
        if (dayData?.review1) {
          const r1Key = `day-${day}-review1`;
          next[r1Key] = newStatus;
        }
        if (dayData?.review2) {
          const r2Key = `day-${day}-review2`;
          next[r2Key] = newStatus;
        }
      }

      return next;
    });

    // Persist the clicked task
    if (userId) {
      saveProgressToSupabase(day, taskType, newStatus);

      // If title-level is toggled, also persist subtasks in Supabase
      if (taskType === "new") {
        const dayData = roadmapDays.find((d) => d.day === day);
        if (dayData?.review1) {
          saveProgressToSupabase(day, "review1", newStatus);
        }
        if (dayData?.review2) {
          saveProgressToSupabase(day, "review2", newStatus);
        }
      }
    }
  };

  const getTaskKey = (day: number, taskType: "new" | "review1" | "review2") => {
    return `day-${day}-${taskType}`;
  };

  const isTaskCompleted = (day: number, taskType: "new" | "review1" | "review2") => {
    return taskStatus[getTaskKey(day, taskType)] || false;
  };

  const getDayProgress = (day: number) => {
    const dayData = roadmapDays[day - 1];
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
    roadmapDays.forEach((dayData) => {
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

    for (let i = 0; i < roadmapDays.length; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push({ date, dayNumber: i + 1 });
    }
    return days;
  };

  const calendarDays = getCalendarDays();
  const overallProgress = getOverallProgress();

  const BASE_GRADIENT_DARK = "linear-gradient(135deg, #7a4b28 0%, #1f2937 40%, #020617 70%, #3b0764 100%)";
  const BASE_GRADIENT = BASE_GRADIENT_DARK;

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
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
      `,
        }}
      />
      <div
        style={{
          minHeight: "100vh",
          background: BASE_GRADIENT,
          padding: "32px 0",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "0 4vw",
          }}
        >
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
                <h2
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    marginBottom: "24px",
                    color: "var(--ink)",
                  }}
                >
                  Get Started🚀, Its 100% Free.
                </h2>
                <form onSubmit={handleSignup}>
                  <div style={{ marginBottom: "16px" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: 600,
                        fontSize: "0.9rem",
                      }}
                    >
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
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: 600,
                        fontSize: "0.9rem",
                      }}
                    >
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
                    <div
                      style={{
                        padding: "12px",
                        background: "#fee",
                        color: "#c00",
                        borderRadius: "8px",
                        marginBottom: "16px",
                        fontSize: "0.9rem",
                      }}
                    >
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
                    {signupLoading ? "Signing up..." : "Start Learning Free 🎯"}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Full-page layout UI is shared via CustomRoadmapTemplate */}
          <CustomRoadmapTemplate
            roadmapId={roadmapId}
            title={roadmapTitle}
            days={roadmapDays}
            calendarDays={calendarDays}
            overallProgress={overallProgress}
            isTaskCompleted={isTaskCompleted}
            toggleTask={toggleTask}
            shareOnWhatsApp={shareOnWhatsApp}
          />
        </div>
      </div>
    </>
  );
}
