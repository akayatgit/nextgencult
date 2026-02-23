"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Roadmap {
  id: number;
  rank: number;
  title: string;
  skills: string;
  salary: string;
  category_id: number;
  category?: {
    id: number;
    name: string;
  };
}

interface Category {
  id: number;
  name: string;
}

const SALARY_RANGES = [
  { label: "All", min: 0, max: 999 },
  { label: "₹3-5 LPA", min: 3, max: 5 },
  { label: "₹5-7 LPA", min: 5, max: 7 },
  { label: "₹7-9 LPA", min: 7, max: 9 },
  { label: "₹9+ LPA", min: 9, max: 999 },
];

export default function RoadmapsList() {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSalary, setSelectedSalary] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const params = new URLSearchParams();
        if (selectedCategory !== "All") {
          params.append("category", selectedCategory);
        }
        if (searchQuery) {
          params.append("search", searchQuery);
        }

        const response = await fetch(`/api/roadmaps?${params.toString()}`);
        const data = await response.json();
        
        setRoadmaps(data.roadmaps || []);
        setCategories(data.categories || []);
      } catch (error) {
        console.error("Error fetching roadmaps:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [selectedCategory, searchQuery]);

  const filteredRoadmaps = roadmaps.filter((roadmap) => {
    let matchesSalary = true;
    if (selectedSalary !== "All") {
      const range = SALARY_RANGES.find(r => r.label === selectedSalary);
      if (range) {
        const salaryStr = roadmap.salary.split("-")[0].replace("₹", "").trim();
        const roadmapMin = parseFloat(salaryStr);
        matchesSalary = roadmapMin >= range.min && roadmapMin <= range.max;
      }
    }
    
    return matchesSalary;
  });

  const getCardColorClass = (index: number) => {
    const colors = ["roadmap-card-1", "roadmap-card-2", "roadmap-card-3", "roadmap-card-4", "roadmap-card-5"];
    return colors[index % 5];
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
            <Link href="/#who">Who It&apos;s For</Link>
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

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "120px 4vw 40px 4vw" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 900, marginBottom: "32px", color: "var(--ink)" }}>
          Career Roadmaps for Trending IT Jobs
        </h1>

        {/* Filters */}
        <div style={{ marginBottom: "32px", display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center" }}>
          <div style={{ flex: "1", minWidth: "300px" }}>
            <input
              type="text"
              placeholder="Search roadmaps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "2px solid rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
                fontSize: "1rem",
              }}
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: "12px 16px",
              border: "2px solid rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
              fontSize: "0.95rem",
              cursor: "pointer",
            }}
          >
            <option value="All">All</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
          <select
            value={selectedSalary}
            onChange={(e) => setSelectedSalary(e.target.value)}
            style={{
              padding: "12px 16px",
              border: "2px solid rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
              fontSize: "0.95rem",
              cursor: "pointer",
            }}
          >
            {SALARY_RANGES.map((range) => (
              <option key={range.label} value={range.label}>
                Salary: {range.label}
              </option>
            ))}
          </select>
        </div>

        {/* Results count */}
        <div style={{ marginBottom: "24px", color: "var(--muted)", fontSize: "0.9rem" }}>
          {loading ? "Loading..." : `Showing ${filteredRoadmaps.length} roadmap${filteredRoadmaps.length !== 1 ? "s" : ""}`}
        </div>

        {/* Roadmaps Grid */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--muted)" }}>
            Loading roadmaps...
          </div>
        ) : filteredRoadmaps.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--muted)" }}>
            No roadmaps found. Try adjusting your filters.
          </div>
        ) : (
          <div className="concerns-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))" }}>
            {filteredRoadmaps.map((roadmap) => (
              <div
                key={roadmap.id}
                className={`concern-card roadmap-card ${getCardColorClass(roadmap.rank - 1)}`}
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
