"use client";

import { useState } from "react";
import Link from "next/link";

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

interface CalendarDay {
  date: Date;
  dayNumber: number;
}

type TaskType = "new" | "review1" | "review2";

interface CustomRoadmapTemplateProps {
  roadmapId: string;
  title?: string;
  days: DayTask[];
  calendarDays: CalendarDay[];
  overallProgress: number;
  isTaskCompleted: (day: number, type: TaskType) => boolean;
  toggleTask: (day: number, type: TaskType) => void;
  shareOnWhatsApp: () => void;
}

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

export function CustomRoadmapTemplate({
  roadmapId,
  title,
  days,
  calendarDays,
  overallProgress,
  isTaskCompleted,
  toggleTask,
  shareOnWhatsApp,
}: CustomRoadmapTemplateProps) {
  const [activeView] = useState<"calendar" | "todo">("todo");

  const BASE_GRADIENT_DARK =
    "linear-gradient(135deg, #7a4b28 0%, #1f2937 40%, #020617 70%, #3b0764 100%)";
  const BASE_GRADIENT_LIGHT =
    "linear-gradient(135deg, #f9fafb 0%, #e5e7eb 40%, #d1d5db 100%)";
  const BASE_GRADIENT = BASE_GRADIENT_DARK;
  const heading = (title && title.trim()) || "Roadmap";
  const subHeading = "Arena";

  const isDayComplete = (dayData: DayTask) => {
    const baseDone = isTaskCompleted(dayData.day, "new");
    const review1Done =
      !dayData.review1 || isTaskCompleted(dayData.day, "review1");
    const review2Done =
      !dayData.review2 || isTaskCompleted(dayData.day, "review2");
    return baseDone && review1Done && review2Done;
  };

  const isDayUnlocked = (dayNumber: number) => {
    if (dayNumber === 1) return true;
    const prevDay = days.find((d) => d.day === dayNumber - 1);
    if (!prevDay) return true;
    return isDayComplete(prevDay);
  };

  return (
    <div style={{ minHeight: "100vh", background: BASE_GRADIENT, padding: "32px 0" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 4vw" }}>
        <div className="roadmap-ff-layout">
          <main className="roadmap-ff-main">
            <div className="roadmap-ff-topbar">
              <div className="roadmap-ff-topbar-left">
                <div className="roadmap-ff-tag">{heading}</div>
                <div className="roadmap-ff-title">{subHeading}</div>
              </div>
              <div className="roadmap-ff-topbar-right">
                <div className="roadmap-ff-progress-label">Progress</div>
                <div className="roadmap-ff-progress-value">{overallProgress}%</div>
                <div className="roadmap-ff-progress-bar">
                  <div
                    className="roadmap-ff-progress-fill"
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="roadmap-ff-content">
              <div className="roadmap-ff-center">
                <div className="roadmap-game-shell">
                  <div className="roadmap-game-content">

                      {activeView === "todo" && (
                        <section style={{ marginTop: "16px" }}>
                          <div className="roadmap-day-grid">
                            {days.map((dayData) => {
                              const dayUnlocked = isDayUnlocked(dayData.day);
                              const dayComplete = isDayComplete(dayData);
                              return (
                                <div
                                  key={dayData.day}
                                  style={{
                                    border: "1px solid rgba(15,23,42,0.9)",
                                    borderRadius: "10px",
                                    padding: "12px 14px",
                                    background:
                                      BASE_GRADIENT_DARK,
                                    color: "#e5e7eb",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      marginBottom: "6px",
                                    }}
                                  >
                                    <div
                                      style={{
                                        fontSize: "0.95rem",
                                        fontWeight: 700,
                                      }}
                                    >
                                      Day {dayData.day}
                                    </div>
                                  </div>
                                  {dayData.tasks &&
                                    dayData.tasks[0] &&
                                    dayData.tasks[0].description && (
                                      <div
                                        style={{
                                          marginBottom: "6px",
                                          fontSize: "0.8rem",
                                          color: "rgba(226,232,240,0.85)",
                                        }}
                                        dangerouslySetInnerHTML={{
                                          __html:
                                            dayData.tasks[0].description || "",
                                        }}
                                      />
                                    )}
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      gap: "6px",
                                    }}
                                  >
                                    <label
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        cursor: dayUnlocked
                                          ? "pointer"
                                          : "not-allowed",
                                        padding: "4px 0",
                                        borderRadius: "4px",
                                        opacity: dayUnlocked ? 1 : 0.5,
                                      }}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={isTaskCompleted(dayData.day, "new")}
                                        onChange={() =>
                                          dayUnlocked &&
                                          toggleTask(dayData.day, "new")
                                        }
                                        disabled={!dayUnlocked}
                                        style={{
                                          width: "18px",
                                          height: "18px",
                                          cursor: dayUnlocked
                                            ? "pointer"
                                            : "not-allowed",
                                        }}
                                      />
                                      <span
                                        style={{
                                          fontSize: "0.9rem",
                                          fontWeight: 600,
                                          textDecoration: dayComplete
                                            ? "line-through"
                                            : "none",
                                          opacity: dayComplete ? 0.7 : 1,
                                        }}
                                      >
                                        {dayData.newTopic}
                                      </span>
                                    </label>
                                    {dayData.review1 && (
                                      <label
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: "8px",
                                          cursor: dayUnlocked
                                            ? "pointer"
                                            : "not-allowed",
                                          padding: "2px 0",
                                          marginLeft: "24px",
                                          opacity: dayUnlocked ? 1 : 0.5,
                                        }}
                                      >
                                        <input
                                          type="checkbox"
                                          checked={isTaskCompleted(dayData.day, "review1")}
                                          onChange={() =>
                                            dayUnlocked &&
                                            toggleTask(dayData.day, "review1")
                                          }
                                          disabled={!dayUnlocked}
                                          style={{
                                            width: "16px",
                                            height: "16px",
                                            cursor: dayUnlocked
                                              ? "pointer"
                                              : "not-allowed",
                                          }}
                                        />
                                        <span
                                          style={{
                                            fontSize: "0.8rem",
                                            color: "rgba(226,232,240,0.85)",
                                            textDecoration: isTaskCompleted(
                                              dayData.day,
                                              "review1"
                                            )
                                              ? "line-through"
                                              : "none",
                                            opacity: isTaskCompleted(
                                              dayData.day,
                                              "review1"
                                            )
                                              ? 0.7
                                              : 1,
                                          }}
                                        >
                                          {dayData.review1}
                                        </span>
                                      </label>
                                    )}
                                    {dayData.review2 && (
                                      <label
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: "8px",
                                          cursor: dayUnlocked
                                            ? "pointer"
                                            : "not-allowed",
                                          padding: "2px 0",
                                          marginLeft: "24px",
                                          opacity: dayUnlocked ? 1 : 0.5,
                                        }}
                                      >
                                        <input
                                          type="checkbox"
                                          checked={isTaskCompleted(dayData.day, "review2")}
                                          onChange={() =>
                                            dayUnlocked &&
                                            toggleTask(dayData.day, "review2")
                                          }
                                          disabled={!dayUnlocked}
                                          style={{
                                            width: "16px",
                                            height: "16px",
                                            cursor: dayUnlocked
                                              ? "pointer"
                                              : "not-allowed",
                                          }}
                                        />
                                        <span
                                          style={{
                                            fontSize: "0.8rem",
                                            color: "rgba(226,232,240,0.85)",
                                            textDecoration: isTaskCompleted(
                                              dayData.day,
                                              "review2"
                                            )
                                              ? "line-through"
                                              : "none",
                                            opacity: isTaskCompleted(
                                              dayData.day,
                                              "review2"
                                            )
                                              ? 0.7
                                              : 1,
                                          }}
                                        >
                                          {dayData.review2}
                                        </span>
                                      </label>
                                    )}
                                    {dayData.youtubeVideos &&
                                      dayData.youtubeVideos.length > 0 && (
                                        <div
                                          style={{
                                            marginTop: "8px",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "4px",
                                          }}
                                        >
                                          <div
                                            style={{
                                              fontSize: "0.75rem",
                                              textTransform: "uppercase",
                                              letterSpacing: "0.08em",
                                              color: "rgba(226,232,240,0.8)",
                                            }}
                                          >
                                            Videos
                                          </div>
                                          <div
                                            style={{
                                              display: "flex",
                                              gap: "8px",
                                              overflowX: "auto",
                                            }}
                                          >
                                            {dayData.youtubeVideos.map(
                                              (video, idx) => {
                                                if (!video.url) return null;
                                                const id = getYouTubeId(
                                                  video.url
                                                );
                                                const thumb = id
                                                  ? `https://img.youtube.com/vi/${id}/hqdefault.jpg`
                                                  : null;
                                                return (
                                                  <a
                                                    key={idx}
                                                    href={dayUnlocked ? video.url : undefined}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{
                                                      minWidth: "120px",
                                                      maxWidth: "140px",
                                                      borderRadius: "8px",
                                                      overflow: "hidden",
                                                      background:
                                                        "rgba(15,23,42,0.9)",
                                                      border:
                                                        "1px solid rgba(148,163,184,0.6)",
                                                      textDecoration: "none",
                                                      color: "#e5e7eb",
                                                      opacity: dayUnlocked ? 1 : 0.4,
                                                      pointerEvents: dayUnlocked
                                                        ? "auto"
                                                        : "none",
                                                      flexShrink: 0,
                                                    }}
                                                  >
                                                    {thumb && (
                                                      <img
                                                        src={thumb}
                                                        alt={
                                                          video.title ||
                                                          "YouTube video"
                                                        }
                                                        style={{
                                                          width: "100%",
                                                          height: "80px",
                                                          objectFit: "cover",
                                                        }}
                                                      />
                                                    )}
                                                    <div
                                                      style={{
                                                        padding: "6px 8px",
                                                        fontSize: "0.75rem",
                                                        fontWeight: 600,
                                                      }}
                                                    >
                                                      {video.title ||
                                                        "Watch video"}
                                                    </div>
                                                  </a>
                                                );
                                              }
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    {dayData.links &&
                                      dayData.links.length > 0 && (
                                        <div
                                          style={{
                                            marginTop: "8px",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "4px",
                                          }}
                                        >
                                          <div
                                            style={{
                                              fontSize: "0.75rem",
                                              textTransform: "uppercase",
                                              letterSpacing: "0.08em",
                                              color: "rgba(226,232,240,0.8)",
                                            }}
                                          >
                                            Links
                                          </div>
                                          <div
                                            style={{
                                              display: "flex",
                                              flexWrap: "wrap",
                                              gap: "6px",
                                            }}
                                          >
                                            {dayData.links.map((link, idx) => {
                                              if (!link.url) return null;
                                              return (
                                                <a
                                                  key={idx}
                                                  href={dayUnlocked ? link.url : undefined}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  style={{
                                                    padding: "4px 10px",
                                                    borderRadius: "999px",
                                                    border:
                                                      "1px solid rgba(148,163,184,0.7)",
                                                    fontSize: "0.75rem",
                                                    textDecoration: "none",
                                                    color: "#e5e7eb",
                                                    opacity: dayUnlocked ? 1 : 0.4,
                                                    pointerEvents: dayUnlocked
                                                      ? "auto"
                                                      : "none",
                                                    background:
                                                      "rgba(15,23,42,0.9)",
                                                  }}
                                                >
                                                  {link.title || "Open link"}
                                                </a>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </section>
                      )}
                    </div>
                  </div>
                </div>

                <aside className="roadmap-ff-panel">
                  <div className="roadmap-ff-card">
                    <div className="roadmap-ff-card-header">
                      <span className="roadmap-ff-chip">Session</span>
                      <span className="roadmap-ff-id">ID: {roadmapId}</span>
                    </div>
                    <div className="roadmap-ff-level-row">
                      <div className="roadmap-ff-level-badge">Lv. 1</div>
                      <div className="roadmap-ff-level-text">Roadmap Session</div>
                    </div>
                    <div className="roadmap-ff-stat-row">
                      <span>Days</span>
                      <span>{days.length}</span>
                    </div>
                    <div className="roadmap-ff-stat-row">
                      <span>Mode</span>
                      <span>Todo</span>
                    </div>
                    <button
                      type="button"
                      className="roadmap-ff-primary-btn"
                      onClick={shareOnWhatsApp}
                    >
                      Share on WhatsApp
                    </button>
                  </div>

                  <div className="roadmap-ff-card">
                    <div className="roadmap-ff-card-header">
                      <span className="roadmap-ff-chip">NG Cult</span>
                      <span className="roadmap-ff-id">Actions</span>
                    </div>
                    <Link href="/#register" className="roadmap-ff-secondary-btn">
                      Clarify Doubt with NG Bro
                    </Link>
                    <a
                      href="https://instagram.com/ngcult.ai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="roadmap-ff-secondary-btn"
                    >
                      Follow Instagram
                    </a>
                    <a
                      href="https://chat.whatsapp.com/GGHq1Cy5ByJ81BSd6blMtU?mode=gi_t"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="roadmap-ff-secondary-btn"
                    >
                      Join Community
                    </a>
                  </div>
                </aside>
              </div>
            </main>
          </div>
      </div>
    </div>
  );
}

