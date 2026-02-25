 "use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { CustomRoadmapTemplate } from "@/app/components/CustomRoadmapTemplate";

interface DayVideo {
  title: string;
  url: string;
}

interface DayLink {
  title: string;
  url: string;
}

interface BuilderSubtask {
  id: string;
  title: string;
}

interface BuilderTask {
  id: string;
  title: string;
  subtasks: BuilderSubtask[];
  description: string;
}

interface DayTask {
  day: number;
  newTopic: string; // mirrors primary task title for viewer/preview
  review1?: string; // mirrors first subtask
  review2?: string; // mirrors second subtask
  tasks: BuilderTask[];
  youtubeVideos?: DayVideo[];
  links?: DayLink[];
}

export default function CustomRoadmapBuilderPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const createEmptyTask = (): BuilderTask => ({
    id: `task_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    title: "",
    subtasks: [
      {
        id: `sub_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        title: "",
      },
    ],
    description: "",
  });

  const [days, setDays] = useState<DayTask[]>([{
    day: 1,
    newTopic: "",
    tasks: [createEmptyTask()],
  }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateDay = (index: number, patch: Partial<DayTask>) => {
    setDays((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...patch };
      return next;
    });
  };

  const syncPrimaryFromTasks = (tasks: BuilderTask[]) => {
    const primary = tasks[0];
    const firstSub = primary?.subtasks[0];
    const secondSub = primary?.subtasks[1];
    return {
      newTopic: primary?.title ?? "",
      review1: firstSub && firstSub.title.trim() ? firstSub.title : undefined,
      review2: secondSub && secondSub.title.trim() ? secondSub.title : undefined,
    };
  };

  const addDay = () => {
    setDays((prev) => [
      ...prev,
      {
        day: prev.length + 1,
        newTopic: "",
        tasks: [createEmptyTask()],
      },
    ]);
  };

  const removeDay = (index: number) => {
    setDays((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((d, i) => ({ ...d, day: i + 1 }))
    );
  };

  const addTask = (dayIndex: number) => {
    setDays((prev) => {
      const next = [...prev];
      const day = next[dayIndex];
      const tasks = [...(day.tasks || []), createEmptyTask()];
      const primary = syncPrimaryFromTasks(tasks);
      next[dayIndex] = { ...day, tasks, ...primary };
      return next;
    });
  };

  const removeTask = (dayIndex: number, taskIndex: number) => {
    setDays((prev) => {
      const next = [...prev];
      const day = next[dayIndex];
      let tasks = (day.tasks || []).filter((_, i) => i !== taskIndex);
      if (tasks.length === 0) {
        tasks = [createEmptyTask()];
      }
      const primary = syncPrimaryFromTasks(tasks);
      next[dayIndex] = { ...day, tasks, ...primary };
      return next;
    });
  };

  const updateTaskTitle = (
    dayIndex: number,
    taskIndex: number,
    value: string
  ) => {
    setDays((prev) => {
      const next = [...prev];
      const day = next[dayIndex];
      const tasks = (day.tasks || []).map((t, i) =>
        i === taskIndex ? { ...t, title: value } : t
      );
      const primary = syncPrimaryFromTasks(tasks);
      next[dayIndex] = { ...day, tasks, ...primary };
      return next;
    });
  };

  const addSubtask = (dayIndex: number, taskIndex: number) => {
    setDays((prev) => {
      const next = [...prev];
      const day = next[dayIndex];
      const tasks = (day.tasks || []).map((t, i) => {
        if (i !== taskIndex) return t;
        const subtasks = [
          ...(t.subtasks || []),
          {
            id: `sub_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
            title: "",
          },
        ];
        return { ...t, subtasks };
      });
      const primary = syncPrimaryFromTasks(tasks);
      next[dayIndex] = { ...day, tasks, ...primary };
      return next;
    });
  };

  const updateSubtask = (
    dayIndex: number,
    taskIndex: number,
    subIndex: number,
    value: string
  ) => {
    setDays((prev) => {
      const next = [...prev];
      const day = next[dayIndex];
      const tasks = (day.tasks || []).map((t, i) => {
        if (i !== taskIndex) return t;
        const subtasks = (t.subtasks || []).map((s, j) =>
          j === subIndex ? { ...s, title: value } : s
        );
        return { ...t, subtasks };
      });
      const primary = syncPrimaryFromTasks(tasks);
      next[dayIndex] = { ...day, tasks, ...primary };
      return next;
    });
  };

  const removeSubtask = (
    dayIndex: number,
    taskIndex: number,
    subIndex: number
  ) => {
    setDays((prev) => {
      const next = [...prev];
      const day = next[dayIndex];
      const tasks = (day.tasks || []).map((t, i) => {
        if (i !== taskIndex) return t;
        let subtasks = (t.subtasks || []).filter((_, j) => j !== subIndex);
        if (subtasks.length === 0) {
          subtasks = [
            {
              id: `sub_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
              title: "",
            },
          ];
        }
        return { ...t, subtasks };
      });
      const primary = syncPrimaryFromTasks(tasks);
      next[dayIndex] = { ...day, tasks, ...primary };
      return next;
    });
  };

  const updateTaskDescription = (
    dayIndex: number,
    taskIndex: number,
    value: string
  ) => {
    setDays((prev) => {
      const next = [...prev];
      const day = next[dayIndex];
      const tasks = (day.tasks || []).map((t, i) =>
        i === taskIndex ? { ...t, description: value } : t
      );
      const primary = syncPrimaryFromTasks(tasks);
      next[dayIndex] = { ...day, tasks, ...primary };
      return next;
    });
  };

  const addYoutubeVideo = (dayIndex: number) => {
    setDays((prev) => {
      const next = [...prev];
      const target = next[dayIndex];
      const videos = target.youtubeVideos ? [...target.youtubeVideos] : [];
      videos.push({ title: "", url: "" });
      next[dayIndex] = { ...target, youtubeVideos: videos };
      return next;
    });
  };

  const updateYoutubeVideo = (
    dayIndex: number,
    videoIndex: number,
    field: "title" | "url",
    value: string
  ) => {
    setDays((prev) => {
      const next = [...prev];
      const target = next[dayIndex];
      const videos = (target.youtubeVideos ? [...target.youtubeVideos] : []).map(
        (v, i) => (i === videoIndex ? { ...v, [field]: value } : v)
      );
      next[dayIndex] = { ...target, youtubeVideos: videos };
      return next;
    });
  };

  const removeYoutubeVideo = (dayIndex: number, videoIndex: number) => {
    setDays((prev) => {
      const next = [...prev];
      const target = next[dayIndex];
      const videos = (target.youtubeVideos || []).filter(
        (_, i) => i !== videoIndex
      );
      next[dayIndex] = { ...target, youtubeVideos: videos };
      return next;
    });
  };

  const addLink = (dayIndex: number) => {
    setDays((prev) => {
      const next = [...prev];
      const target = next[dayIndex];
      const links = target.links ? [...target.links] : [];
      links.push({ title: "", url: "" });
      next[dayIndex] = { ...target, links };
      return next;
    });
  };

  const updateLink = (
    dayIndex: number,
    linkIndex: number,
    field: "title" | "url",
    value: string
  ) => {
    setDays((prev) => {
      const next = [...prev];
      const target = next[dayIndex];
      const links = (target.links ? [...target.links] : []).map((l, i) =>
        i === linkIndex ? { ...l, [field]: value } : l
      );
      next[dayIndex] = { ...target, links };
      return next;
    });
  };

  const removeLink = (dayIndex: number, linkIndex: number) => {
    setDays((prev) => {
      const next = [...prev];
      const target = next[dayIndex];
      const links = (target.links || []).filter((_, i) => i !== linkIndex);
      next[dayIndex] = { ...target, links };
      return next;
    });
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Add a title");
      return;
    }
    if (
      days.some(
        (d) =>
          !d.tasks ||
          d.tasks.length === 0 ||
          !d.tasks[0].title ||
          !d.tasks[0].title.trim()
      )
    ) {
      setError("Add at least one task title for each day");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/custom-roadmap/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          ui_mode_default: "dark",
          days,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save");
      }

      const data = await res.json();
      const id = data.id as string;
      router.push(`/custom-roadmap/${id}`);
    } catch (err: any) {
      setError(err.message || "Failed to save");
      setSaving(false);
    }
  };

  const calendarDays = useMemo(() => {
    const out: { date: Date; dayNumber: number }[] = [];
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    for (let i = 0; i < days.length; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      out.push({ date: d, dayNumber: i + 1 });
    }
    return out;
  }, [days]);

  const overallProgress = 0;

  return (
    <div style={{ minHeight: "100vh", background: "#020617", padding: "32px 0" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 4vw" }}>
        <div
          style={{
            marginBottom: "24px",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.16em",
                opacity: 0.7,
              }}
            >
              Builder
            </div>
            <h1
              style={{
                fontSize: "1.4rem",
                fontWeight: 800,
                marginTop: "4px",
              }}
            >
              New Custom Roadmap
            </h1>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: "10px 18px",
              borderRadius: "999px",
              border: "none",
              background: "#f97316",
              color: "white",
              fontWeight: 700,
              fontSize: "0.9rem",
              cursor: saving ? "not-allowed" : "pointer",
            }}
          >
            {saving ? "Saving..." : "Save & Get Link"}
          </button>
        </div>

        <div
          className="builder-row"
          style={{
            gap: "24px",
            alignItems: "flex-start",
            marginTop: "8px",
          }}
        >
          {/* Left: Builder form */}
          <div className="builder-left">
            <div
              style={{
                marginBottom: "20px",
                background: "#020617",
                borderRadius: "16px",
                padding: "16px 18px",
                border: "1px solid rgba(148,163,184,0.4)",
              }}
            >
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  color: "#e5e7eb",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                }}
              >
                Title
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Python 21-Day Kickstart"
                  style={{
                    padding: "10px 12px",
                    borderRadius: "10px",
                    border: "1px solid rgba(148,163,184,0.6)",
                    background: "#020617",
                    color: "#f9fafb",
                  }}
                />
              </label>
            </div>

            {error && (
              <div
                style={{
                  marginBottom: "12px",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  background: "#7f1d1d",
                  color: "#fee2e2",
                  fontSize: "0.8rem",
                }}
              >
                {error}
              </div>
            )}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {days.map((day, index) => (
                <div
                  key={index}
                  style={{
                    background: "#020617",
                    borderRadius: "14px",
                    padding: "12px 14px",
                    border: "1px solid rgba(148,163,184,0.4)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    color: "#e5e7eb",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                    }}
                  >
                    <span>Day {day.day}</span>
                    {days.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDay(index)}
                        style={{
                          border: "none",
                          background: "transparent",
                          color: "#fca5a5",
                          fontSize: "0.75rem",
                          cursor: "pointer",
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        opacity: 0.8,
                      }}
                    >
                      Tasks & subtasks
                    </div>
                    {(day.tasks || []).map((task, tIndex) => (
                      <div
                        key={task.id}
                        style={{
                          padding: "8px 10px",
                          borderRadius: "10px",
                          border: "1px solid rgba(148,163,184,0.5)",
                          background: "rgba(15,23,42,0.9)",
                          display: "flex",
                          flexDirection: "column",
                          gap: "6px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: "6px",
                            alignItems: "center",
                          }}
                        >
                          <input
                            value={task.title}
                            onChange={(e) =>
                              updateTaskTitle(index, tIndex, e.target.value)
                            }
                            placeholder="Task title"
                            style={{
                              flex: 1,
                              padding: "6px 8px",
                              borderRadius: "8px",
                              border:
                                "1px solid rgba(148,163,184,0.6)",
                              background: "#020617",
                              color: "#f9fafb",
                              fontSize: "0.8rem",
                            }}
                          />
                          {day.tasks.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeTask(index, tIndex)}
                              style={{
                                border: "none",
                                borderRadius: "999px",
                                padding: "4px 8px",
                                fontSize: "0.7rem",
                                background: "rgba(239,68,68,0.15)",
                                color: "#fecaca",
                                cursor: "pointer",
                              }}
                            >
                              ✕
                            </button>
                          )}
                        </div>

                        <div>
                          <div
                            style={{
                              fontSize: "0.7rem",
                              textTransform: "uppercase",
                              letterSpacing: "0.08em",
                              opacity: 0.8,
                              marginBottom: "4px",
                            }}
                          >
                            Description
                          </div>
                          <div
                            contentEditable
                            suppressContentEditableWarning
                            onInput={(e) =>
                              updateTaskDescription(
                                index,
                                tIndex,
                                (e.currentTarget as HTMLDivElement)
                                  .innerHTML
                              )
                            }
                            style={{
                              minHeight: "60px",
                              padding: "8px 10px",
                              borderRadius: "8px",
                              border:
                                "1px solid rgba(148,163,184,0.5)",
                              background: "#020617",
                              color: "#f9fafb",
                              fontSize: "0.8rem",
                              outline: "none",
                            }}
                          />
                        </div>

                        <div>
                          <div
                            style={{
                              fontSize: "0.7rem",
                              textTransform: "uppercase",
                              letterSpacing: "0.08em",
                              opacity: 0.8,
                              marginBottom: "4px",
                            }}
                          >
                            Subtasks
                          </div>
                          {(task.subtasks || []).map((sub, sIndex) => (
                            <div
                              key={sub.id}
                              style={{
                                display: "flex",
                                gap: "6px",
                                alignItems: "center",
                                marginBottom: "4px",
                              }}
                            >
                              <input
                                value={sub.title}
                                onChange={(e) =>
                                  updateSubtask(
                                    index,
                                    tIndex,
                                    sIndex,
                                    e.target.value
                                  )
                                }
                                placeholder={`Subtask ${sIndex + 1}`}
                                style={{
                                  flex: 1,
                                  padding: "6px 8px",
                                  borderRadius: "8px",
                                  border:
                                    "1px solid rgba(148,163,184,0.5)",
                                  background: "#020617",
                                  color: "#f9fafb",
                                  fontSize: "0.8rem",
                                }}
                              />
                              {task.subtasks.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeSubtask(index, tIndex, sIndex)
                                  }
                                  style={{
                                    border: "none",
                                    borderRadius: "999px",
                                    padding: "4px 8px",
                                    fontSize: "0.7rem",
                                    background:
                                      "rgba(239,68,68,0.15)",
                                    color: "#fecaca",
                                    cursor: "pointer",
                                  }}
                                >
                                  ✕
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => addSubtask(index, tIndex)}
                            style={{
                              marginTop: "2px",
                              padding: "4px 10px",
                              borderRadius: "999px",
                              border:
                                "1px dashed rgba(148,163,184,0.7)",
                              background: "transparent",
                              color: "#e5e7eb",
                              fontSize: "0.75rem",
                              cursor: "pointer",
                            }}
                          >
                            + Add subtask
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addTask(index)}
                      style={{
                        marginTop: "4px",
                        alignSelf: "flex-start",
                        padding: "4px 10px",
                        borderRadius: "999px",
                        border:
                          "1px dashed rgba(148,163,184,0.7)",
                        background: "transparent",
                        color: "#e5e7eb",
                        fontSize: "0.75rem",
                        cursor: "pointer",
                      }}
                    >
                      + Add task
                    </button>
                  </div>

                  <div
                    style={{
                      marginTop: "6px",
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
                        opacity: 0.8,
                      }}
                    >
                      YouTube videos
                    </div>
                    {(day.youtubeVideos || []).map((video, vIndex) => (
                      <div
                        key={vIndex}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "4px",
                          padding: "6px 8px",
                          borderRadius: "8px",
                          background: "rgba(15,23,42,0.9)",
                        }}
                      >
                        <input
                          value={video.title}
                          onChange={(e) =>
                            updateYoutubeVideo(index, vIndex, "title", e.target.value)
                          }
                          placeholder="Video title (optional)"
                          style={{
                            padding: "6px 8px",
                            borderRadius: "6px",
                            border: "1px solid rgba(148,163,184,0.5)",
                            background: "#020617",
                            color: "#f9fafb",
                            fontSize: "0.75rem",
                          }}
                        />
                        <div
                          style={{
                            display: "flex",
                            gap: "6px",
                            alignItems: "center",
                          }}
                        >
                          <input
                            value={video.url}
                            onChange={(e) =>
                              updateYoutubeVideo(index, vIndex, "url", e.target.value)
                            }
                            placeholder="YouTube URL"
                            style={{
                              flex: 1,
                              padding: "6px 8px",
                              borderRadius: "6px",
                              border: "1px solid rgba(148,163,184,0.5)",
                              background: "#020617",
                              color: "#f9fafb",
                              fontSize: "0.75rem",
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => removeYoutubeVideo(index, vIndex)}
                            style={{
                              border: "none",
                              borderRadius: "999px",
                              padding: "4px 8px",
                              fontSize: "0.7rem",
                              background: "rgba(239,68,68,0.15)",
                              color: "#fecaca",
                              cursor: "pointer",
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addYoutubeVideo(index)}
                      style={{
                        alignSelf: "flex-start",
                        marginTop: "2px",
                        padding: "4px 10px",
                        borderRadius: "999px",
                        border: "1px dashed rgba(148,163,184,0.7)",
                        background: "transparent",
                        color: "#e5e7eb",
                        fontSize: "0.75rem",
                        cursor: "pointer",
                      }}
                    >
                      + Add video
                    </button>
                  </div>

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
                        opacity: 0.8,
                      }}
                    >
                      Links
                    </div>
                    {(day.links || []).map((link, lIndex) => (
                      <div
                        key={lIndex}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "4px",
                          padding: "6px 8px",
                          borderRadius: "8px",
                          background: "rgba(15,23,42,0.9)",
                        }}
                      >
                        <input
                          value={link.title}
                          onChange={(e) =>
                            updateLink(index, lIndex, "title", e.target.value)
                          }
                          placeholder="Link title"
                          style={{
                            padding: "6px 8px",
                            borderRadius: "6px",
                            border: "1px solid rgba(148,163,184,0.5)",
                            background: "#020617",
                            color: "#f9fafb",
                            fontSize: "0.75rem",
                          }}
                        />
                        <div
                          style={{
                            display: "flex",
                            gap: "6px",
                            alignItems: "center",
                          }}
                        >
                          <input
                            value={link.url}
                            onChange={(e) =>
                              updateLink(index, lIndex, "url", e.target.value)
                            }
                            placeholder="Link URL"
                            style={{
                              flex: 1,
                              padding: "6px 8px",
                              borderRadius: "6px",
                              border: "1px solid rgba(148,163,184,0.5)",
                              background: "#020617",
                              color: "#f9fafb",
                              fontSize: "0.75rem",
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => removeLink(index, lIndex)}
                            style={{
                              border: "none",
                              borderRadius: "999px",
                              padding: "4px 8px",
                              fontSize: "0.7rem",
                              background: "rgba(239,68,68,0.15)",
                              color: "#fecaca",
                              cursor: "pointer",
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addLink(index)}
                      style={{
                        alignSelf: "flex-start",
                        marginTop: "2px",
                        padding: "4px 10px",
                        borderRadius: "999px",
                        border: "1px dashed rgba(148,163,184,0.7)",
                        background: "transparent",
                        color: "#e5e7eb",
                        fontSize: "0.75rem",
                        cursor: "pointer",
                      }}
                    >
                      + Add link
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addDay}
              style={{
                marginTop: "14px",
                padding: "8px 14px",
                borderRadius: "999px",
                border: "1px dashed rgba(148,163,184,0.7)",
                background: "transparent",
                color: "#e5e7eb",
                fontSize: "0.8rem",
                cursor: "pointer",
              }}
            >
              + Add Day
            </button>
          </div>

          {/* Right: Live preview using the same frontend template */}
          <div className="builder-right">
            <CustomRoadmapTemplate
              roadmapId={title || "preview"}
              title={title}
              days={days}
              calendarDays={calendarDays}
              overallProgress={overallProgress}
              isTaskCompleted={() => false}
              toggleTask={() => {}}
              shareOnWhatsApp={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

