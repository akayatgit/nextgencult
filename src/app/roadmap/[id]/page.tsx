"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";

interface RoadmapStep {
  id: number;
  step_number: number;
  content: string;
}

interface RoadmapPrerequisite {
  id: number;
  content: string;
}

interface Roadmap {
  id: number;
  rank: number;
  title: string;
  skills: string;
  salary: string;
  category_id: number;
  description?: string;
  duration?: string;
  category?: {
    id: number;
    name: string;
  };
  steps?: RoadmapStep[];
  prerequisites?: RoadmapPrerequisite[];
}

export default function RoadmapDetails() {
  const params = useParams();
  const roadmapId = parseInt(params.id as string);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRoadmap() {
      try {
        const response = await fetch(`/api/roadmaps/${roadmapId}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError("Roadmap not found");
          } else {
            setError("Failed to load roadmap");
          }
          return;
        }
        const data = await response.json();
        setRoadmap(data);
      } catch (err) {
        console.error("Error fetching roadmap:", err);
        setError("Failed to load roadmap");
      } finally {
        setLoading(false);
      }
    }

    if (roadmapId) {
      fetchRoadmap();
    }
  }, [roadmapId]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", padding: "100px 20px", textAlign: "center" }}>
        <p>Loading roadmap...</p>
      </div>
    );
  }

  if (error || !roadmap) {
    return (
      <div style={{ minHeight: "100vh", padding: "100px 20px", textAlign: "center" }}>
        <h1>{error || "Roadmap not found"}</h1>
        <Link href="/roadmaps">Back to Roadmaps</Link>
      </div>
    );
  }

  const getCardColorClass = (rank: number) => {
    const colors = ["roadmap-card-1", "roadmap-card-2", "roadmap-card-3", "roadmap-card-4", "roadmap-card-5"];
    return colors[(rank - 1) % 5];
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--white)" }}>
      {/* Header */}
      <header className="top-header" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, width: "100%" }}>
        <div className="header-container">
          <Link href="/" className="header-logo" style={{ textDecoration: "none", color: "inherit" }}>
            NG <span style={{ color: "#ff6b2b" }}>Cult</span>
          </Link>
          <nav className="header-nav">
            <Link href="/">Home</Link>
            <Link href="/roadmaps">All Roadmaps</Link>
            <Link href="/#pricing">Pricing</Link>
            <Link href="/#about">About</Link>
          </nav>
          <div className="header-actions">
            <Link href="/#register" style={{ textDecoration: "none" }}>
              <button className="btn-login">Book Consultation</button>
            </Link>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "120px 4vw 40px 4vw" }}>
        {/* Breadcrumb */}
        <div style={{ marginBottom: "24px", fontSize: "0.9rem", color: "var(--muted)" }}>
          <Link href="/" style={{ color: "var(--muted)", textDecoration: "none" }}>Home</Link>
          {" > "}
          <Link href="/roadmaps" style={{ color: "var(--muted)", textDecoration: "none" }}>Roadmaps</Link>
          {" > "}
          <span style={{ color: "var(--ink)" }}>{roadmap.title}</span>
        </div>

        {/* Roadmap Header Card */}
        <div className={`concern-card roadmap-card ${getCardColorClass(roadmap.rank)}`} style={{ marginBottom: "40px", cursor: "default" }}>
          <div className="roadmap-rank">#{roadmap.rank}</div>
          <div className="roadmap-content">
            <div className="roadmap-title" style={{ fontSize: "1.8rem", marginBottom: "12px" }}>
              {roadmap.title}
            </div>
            <div className="roadmap-skills" style={{ fontSize: "1rem", marginBottom: "16px" }}>
              <strong>Key Skills:</strong> {roadmap.skills}
            </div>
            <div className="roadmap-salary" style={{ fontSize: "1.1rem", marginBottom: "16px" }}>
              Salary: From ₹{roadmap.salary} LPA
            </div>
            {roadmap.description && (
              <div style={{ fontSize: "0.95rem", color: "var(--ink)", lineHeight: "1.6", marginTop: "16px" }}>
                {roadmap.description}
              </div>
            )}
          </div>
        </div>

        {/* Roadmap Steps */}
        <div style={{ marginBottom: "40px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "24px", color: "var(--ink)" }}>
            Career Roadmap Steps
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {roadmap.steps && roadmap.steps.length > 0 ? (
              roadmap.steps.map((step, index) => (
                <div
                  key={step.id}
                  style={{
                    padding: "20px",
                    background: "var(--white)",
                    border: "2px solid rgba(0, 0, 0, 0.1)",
                    borderRadius: "12px",
                    display: "flex",
                    gap: "16px",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      background: "var(--accent-orange)",
                      color: "var(--white)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {step.step_number}
                  </div>
                  <div style={{ flex: 1, fontSize: "1rem", lineHeight: "1.6", color: "var(--ink)" }}>
                    {step.content}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: "20px", textAlign: "center", color: "var(--muted)" }}>
                No steps available for this roadmap.
              </div>
            )}
          </div>
        </div>

        {/* Additional Info */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "40px" }}>
          <div style={{ padding: "24px", background: "var(--yellow)", borderRadius: "12px" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "8px" }}>Duration</h3>
            <p style={{ fontSize: "1.1rem", fontWeight: 600 }}>{roadmap.duration || "Not specified"}</p>
          </div>
          <div style={{ padding: "24px", background: "rgba(255, 138, 61, 0.1)", borderRadius: "12px" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "8px" }}>Category</h3>
            <p style={{ fontSize: "1.1rem", fontWeight: 600 }}>{roadmap.category?.name || "Uncategorized"}</p>
          </div>
        </div>

        {/* Prerequisites */}
        {roadmap.prerequisites && roadmap.prerequisites.length > 0 && (
          <div style={{ marginBottom: "40px" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "16px" }}>Prerequisites</h3>
            <ul style={{ paddingLeft: "24px", fontSize: "1rem", lineHeight: "1.8" }}>
              {roadmap.prerequisites.map((req) => (
                <li key={req.id}>{req.content}</li>
              ))}
            </ul>
          </div>
        )}

        {/* CTA */}
        <div style={{ textAlign: "center", padding: "40px", background: "var(--yellow)", borderRadius: "16px" }}>
          <h3 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "12px" }}>
            Need Personalized Guidance?
          </h3>
          <p style={{ marginBottom: "24px", fontSize: "1rem" }}>
            Get a customized roadmap tailored to your skills, timeline, and goals.
          </p>
          <Link href="/#register" style={{ textDecoration: "none" }}>
            <button className="btn-primary-hero" style={{ fontSize: "1.1rem", padding: "16px 40px" }}>
              Book ₹99 Consultation
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
