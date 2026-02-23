"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Category {
  id: number;
  name: string;
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
  category?: Category;
}

interface RoadmapStep {
  id: number;
  step_number: number;
  content: string;
}

interface RoadmapPrerequisite {
  id: number;
  content: string;
}

export default function AdminRoadmapsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [editingRoadmapId, setEditingRoadmapId] = useState<number | null>(null);
  const [editingSteps, setEditingSteps] = useState<RoadmapStep[]>([]);
  const [editingPrerequisites, setEditingPrerequisites] = useState<RoadmapPrerequisite[]>([]);

  // Form states
  const [newCategory, setNewCategory] = useState("");
  const [selectedRoadmapId, setSelectedRoadmapId] = useState<number | null>(null);
  
  // Roadmap form
  const [roadmapForm, setRoadmapForm] = useState({
    rank: "",
    title: "",
    skills: "",
    salary: "",
    category_id: "",
    description: "",
    duration: "",
  });

  // Steps form
  const [steps, setSteps] = useState<{ step_number: number; content: string }[]>([]);
  const [newStep, setNewStep] = useState("");

  // Prerequisites form
  const [prerequisites, setPrerequisites] = useState<string[]>([]);
  const [newPrerequisite, setNewPrerequisite] = useState("");

  useEffect(() => {
    fetchCategories();
    fetchRoadmaps();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/roadmaps");
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchRoadmaps = async () => {
    try {
      const response = await fetch("/api/roadmaps");
      const data = await response.json();
      setRoadmaps(data.roadmaps || []);
    } catch (err) {
      console.error("Error fetching roadmaps:", err);
    }
  };

  const fetchRoadmapDetails = async (id: number) => {
    try {
      const response = await fetch(`/api/roadmaps/${id}`);
      if (response.ok) {
        const data = await response.json();
        setEditingSteps(data.steps || []);
        setEditingPrerequisites(data.prerequisites || []);
      }
    } catch (err) {
      console.error("Error fetching roadmap details:", err);
    }
  };

  const handleEditRoadmap = (roadmap: Roadmap) => {
    setEditingRoadmapId(roadmap.id);
    setRoadmapForm({
      rank: roadmap.rank.toString(),
      title: roadmap.title,
      skills: roadmap.skills,
      salary: roadmap.salary,
      category_id: roadmap.category_id.toString(),
      description: roadmap.description || "",
      duration: roadmap.duration || "",
    });
    setSelectedRoadmapId(roadmap.id);
    fetchRoadmapDetails(roadmap.id);
  };

  const handleCancelEdit = () => {
    setEditingRoadmapId(null);
    setRoadmapForm({
      rank: "",
      title: "",
      skills: "",
      salary: "",
      category_id: "",
      description: "",
      duration: "",
    });
    setSelectedRoadmapId(null);
    setSteps([]);
    setPrerequisites([]);
    setEditingSteps([]);
    setEditingPrerequisites([]);
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to add category");
      }

      setSuccess("Category added successfully!");
      setNewCategory("");
      fetchCategories();
    } catch (err: any) {
      setError(err.message || "Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  const handleAddRoadmap = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const url = editingRoadmapId
        ? `/api/admin/roadmaps/${editingRoadmapId}`
        : "/api/admin/roadmaps";
      const method = editingRoadmapId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...roadmapForm,
          rank: parseInt(roadmapForm.rank),
          category_id: parseInt(roadmapForm.category_id),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save roadmap");
      }

      const data = await response.json();
      setSuccess(editingRoadmapId ? "Roadmap updated successfully!" : "Roadmap added successfully!");
      setSelectedRoadmapId(data.roadmap.id);
      
      if (!editingRoadmapId) {
        setRoadmapForm({
          rank: "",
          title: "",
          skills: "",
          salary: "",
          category_id: "",
          description: "",
          duration: "",
        });
        setSteps([]);
        setPrerequisites([]);
      }
      
      fetchRoadmaps();
    } catch (err: any) {
      setError(err.message || "Failed to save roadmap");
    } finally {
      setLoading(false);
    }
  };

  const handleAddStep = () => {
    if (!newStep.trim()) return;
    if (!selectedRoadmapId) {
      setError("Please create or select a roadmap first");
      return;
    }

    const stepNumber = steps.length + editingSteps.length + 1;
    setSteps([...steps, { step_number: stepNumber, content: newStep }]);
    setNewStep("");
  };

  const handleRemoveStep = (index: number, isEditing: boolean = false) => {
    if (isEditing) {
      const updated = editingSteps.filter((_, i) => i !== index);
      setEditingSteps(updated);
    } else {
      const updatedSteps = steps.filter((_, i) => i !== index).map((step, i) => ({
        ...step,
        step_number: editingSteps.length + i + 1,
      }));
      setSteps(updatedSteps);
    }
  };

  const handleSaveSteps = async () => {
    if (!selectedRoadmapId) {
      setError("Please create or select a roadmap first");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Delete existing steps if editing
      if (editingRoadmapId && editingSteps.length > 0) {
        await fetch(`/api/admin/roadmaps/${selectedRoadmapId}/steps`, {
          method: "DELETE",
        });
      }

      // Add all steps (both existing edited ones and new ones)
      const allSteps = editingRoadmapId
        ? [...editingSteps.map((s, i) => ({ step_number: i + 1, content: s.content })), ...steps]
        : steps;

      if (allSteps.length === 0) {
        throw new Error("Please add at least one step");
      }

      const response = await fetch(`/api/admin/roadmaps/${selectedRoadmapId}/steps`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ steps: allSteps }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save steps");
      }

      setSuccess("Steps saved successfully!");
      setSteps([]);
      if (editingRoadmapId) {
        fetchRoadmapDetails(editingRoadmapId);
      }
    } catch (err: any) {
      setError(err.message || "Failed to save steps");
    } finally {
      setLoading(false);
    }
  };

  const handleAddPrerequisite = () => {
    if (!newPrerequisite.trim()) return;
    if (!selectedRoadmapId) {
      setError("Please create or select a roadmap first");
      return;
    }

    setPrerequisites([...prerequisites, newPrerequisite]);
    setNewPrerequisite("");
  };

  const handleRemovePrerequisite = (index: number, isEditing: boolean = false) => {
    if (isEditing) {
      const updated = editingPrerequisites.filter((_, i) => i !== index);
      setEditingPrerequisites(updated);
    } else {
      setPrerequisites(prerequisites.filter((_, i) => i !== index));
    }
  };

  const handleSavePrerequisites = async () => {
    if (!selectedRoadmapId) {
      setError("Please create or select a roadmap first");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Delete existing prerequisites if editing
      if (editingRoadmapId && editingPrerequisites.length > 0) {
        await fetch(`/api/admin/roadmaps/${selectedRoadmapId}/prerequisites`, {
          method: "DELETE",
        });
      }

      // Add all prerequisites (both existing edited ones and new ones)
      const allPrerequisites = editingRoadmapId
        ? [...editingPrerequisites.map((p) => p.content), ...prerequisites]
        : prerequisites;

      if (allPrerequisites.length === 0) {
        throw new Error("Please add at least one prerequisite");
      }

      const response = await fetch(`/api/admin/roadmaps/${selectedRoadmapId}/prerequisites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prerequisites: allPrerequisites }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save prerequisites");
      }

      setSuccess("Prerequisites saved successfully!");
      setPrerequisites([]);
      if (editingRoadmapId) {
        fetchRoadmapDetails(editingRoadmapId);
      }
    } catch (err: any) {
      setError(err.message || "Failed to save prerequisites");
    } finally {
      setLoading(false);
    }
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
            <Link href="/admin/roadmaps">Admin</Link>
          </nav>
        </div>
      </header>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "120px 4vw 40px 4vw" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 900, marginBottom: "32px" }}>Admin - Manage Roadmaps</h1>

        {error && (
          <div style={{ padding: "16px", background: "#fee", color: "#c00", borderRadius: "8px", marginBottom: "24px" }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ padding: "16px", background: "#efe", color: "#0c0", borderRadius: "8px", marginBottom: "24px" }}>
            {success}
          </div>
        )}

        {/* All Roadmaps List */}
        <section style={{ marginBottom: "48px", padding: "24px", border: "2px solid rgba(0,0,0,0.1)", borderRadius: "12px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "16px" }}>All Roadmaps ({roadmaps.length})</h2>
          <div style={{ display: "grid", gap: "12px" }}>
            {roadmaps.map((roadmap) => (
              <div
                key={roadmap.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px",
                  background: editingRoadmapId === roadmap.id ? "#fff9e6" : "#f5f5f5",
                  borderRadius: "8px",
                  border: editingRoadmapId === roadmap.id ? "2px solid var(--accent-orange)" : "1px solid rgba(0,0,0,0.1)",
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>
                    #{roadmap.rank} - {roadmap.title}
                  </div>
                  <div style={{ fontSize: "0.9rem", color: "var(--muted)", marginTop: "4px" }}>
                    {roadmap.category?.name || "Uncategorized"} | Skills: {roadmap.skills} | Salary: ₹{roadmap.salary} LPA
                  </div>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => handleEditRoadmap(roadmap)}
                    style={{
                      padding: "8px 16px",
                      background: editingRoadmapId === roadmap.id ? "var(--accent-orange)" : "var(--yellow)",
                      color: editingRoadmapId === roadmap.id ? "white" : "var(--ink)",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    {editingRoadmapId === roadmap.id ? "Editing..." : "Edit"}
                  </button>
                  {editingRoadmapId === roadmap.id && (
                    <button
                      onClick={handleCancelEdit}
                      style={{
                        padding: "8px 16px",
                        background: "#fee",
                        color: "#c00",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Add Category */}
        <section style={{ marginBottom: "48px", padding: "24px", border: "2px solid rgba(0,0,0,0.1)", borderRadius: "12px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "16px" }}>Add Category</h2>
          <form onSubmit={handleAddCategory}>
            <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Category name (e.g., Data, AI, Development)"
                required
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  border: "2px solid rgba(0,0,0,0.1)",
                  borderRadius: "8px",
                  fontSize: "1rem",
                }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "12px 24px",
                  background: "var(--accent-orange)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: 600,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                Add Category
              </button>
            </div>
          </form>
        </section>

        {/* Add/Edit Roadmap */}
        <section style={{ marginBottom: "48px", padding: "24px", border: "2px solid rgba(0,0,0,0.1)", borderRadius: "12px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "16px" }}>
            {editingRoadmapId ? `Edit Roadmap #${editingRoadmapId}` : "Add Roadmap"}
          </h2>
          <form onSubmit={handleAddRoadmap}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px", marginBottom: "16px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>Rank *</label>
                <input
                  type="number"
                  value={roadmapForm.rank}
                  onChange={(e) => setRoadmapForm({ ...roadmapForm, rank: e.target.value })}
                  placeholder="1"
                  required
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "2px solid rgba(0,0,0,0.1)",
                    borderRadius: "8px",
                    fontSize: "1rem",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>Title *</label>
                <input
                  type="text"
                  value={roadmapForm.title}
                  onChange={(e) => setRoadmapForm({ ...roadmapForm, title: e.target.value })}
                  placeholder="Data Analyst"
                  required
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "2px solid rgba(0,0,0,0.1)",
                    borderRadius: "8px",
                    fontSize: "1rem",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>Skills *</label>
                <input
                  type="text"
                  value={roadmapForm.skills}
                  onChange={(e) => setRoadmapForm({ ...roadmapForm, skills: e.target.value })}
                  placeholder="SQL, Excel, Power BI"
                  required
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "2px solid rgba(0,0,0,0.1)",
                    borderRadius: "8px",
                    fontSize: "1rem",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>Salary *</label>
                <input
                  type="text"
                  value={roadmapForm.salary}
                  onChange={(e) => setRoadmapForm({ ...roadmapForm, salary: e.target.value })}
                  placeholder="4.5 or 5-7"
                  required
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "2px solid rgba(0,0,0,0.1)",
                    borderRadius: "8px",
                    fontSize: "1rem",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>Category *</label>
                <select
                  value={roadmapForm.category_id}
                  onChange={(e) => setRoadmapForm({ ...roadmapForm, category_id: e.target.value })}
                  required
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "2px solid rgba(0,0,0,0.1)",
                    borderRadius: "8px",
                    fontSize: "1rem",
                  }}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>Duration</label>
                <input
                  type="text"
                  value={roadmapForm.duration}
                  onChange={(e) => setRoadmapForm({ ...roadmapForm, duration: e.target.value })}
                  placeholder="3-6 months"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "2px solid rgba(0,0,0,0.1)",
                    borderRadius: "8px",
                    fontSize: "1rem",
                  }}
                />
              </div>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>Description</label>
              <textarea
                value={roadmapForm.description}
                onChange={(e) => setRoadmapForm({ ...roadmapForm, description: e.target.value })}
                placeholder="A Data Analyst collects, processes, and performs statistical analyses..."
                rows={4}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "2px solid rgba(0,0,0,0.1)",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontFamily: "inherit",
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "12px 24px",
                background: "var(--accent-orange)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Saving..." : editingRoadmapId ? "Update Roadmap" : "Add Roadmap"}
            </button>
          </form>
        </section>

        {/* Add Steps */}
        {selectedRoadmapId && (
          <section style={{ marginBottom: "48px", padding: "24px", border: "2px solid rgba(0,0,0,0.1)", borderRadius: "12px" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "16px" }}>
              Manage Steps for Roadmap ID: {selectedRoadmapId}
            </h2>
            
            {/* Existing Steps (when editing) */}
            {editingSteps.length > 0 && (
              <div style={{ marginBottom: "16px" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "12px" }}>Existing Steps:</h3>
                {editingSteps.map((step, index) => (
                  <div
                    key={step.id}
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "center",
                      padding: "12px",
                      background: "#f5f5f5",
                      borderRadius: "8px",
                      marginBottom: "8px",
                    }}
                  >
                    <span style={{ fontWeight: 700, minWidth: "30px" }}>{step.step_number}.</span>
                    <input
                      type="text"
                      value={step.content}
                      onChange={(e) => {
                        const updated = [...editingSteps];
                        updated[index].content = e.target.value;
                        setEditingSteps(updated);
                      }}
                      style={{
                        flex: 1,
                        padding: "8px 12px",
                        border: "1px solid rgba(0,0,0,0.1)",
                        borderRadius: "6px",
                        fontSize: "0.95rem",
                      }}
                    />
                    <button
                      onClick={() => handleRemoveStep(index, true)}
                      style={{
                        padding: "6px 12px",
                        background: "#fee",
                        color: "#c00",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Steps */}
            <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
              <input
                type="text"
                value={newStep}
                onChange={(e) => setNewStep(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddStep())}
                placeholder="Enter step content"
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  border: "2px solid rgba(0,0,0,0.1)",
                  borderRadius: "8px",
                  fontSize: "1rem",
                }}
              />
              <button
                onClick={handleAddStep}
                style={{
                  padding: "12px 24px",
                  background: "var(--yellow)",
                  color: "var(--ink)",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Add Step
              </button>
            </div>
            
            {/* New Steps List */}
            {steps.length > 0 && (
              <div style={{ marginBottom: "16px" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "12px" }}>New Steps:</h3>
                {steps.map((step, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "center",
                      padding: "12px",
                      background: "#e8f5e9",
                      borderRadius: "8px",
                      marginBottom: "8px",
                    }}
                  >
                    <span style={{ fontWeight: 700, minWidth: "30px" }}>{step.step_number}.</span>
                    <span style={{ flex: 1 }}>{step.content}</span>
                    <button
                      onClick={() => handleRemoveStep(index)}
                      style={{
                        padding: "6px 12px",
                        background: "#fee",
                        color: "#c00",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            {(editingSteps.length > 0 || steps.length > 0) && (
              <button
                onClick={handleSaveSteps}
                disabled={loading}
                style={{
                  padding: "12px 24px",
                  background: "var(--accent-orange)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: 600,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Saving..." : "Save All Steps"}
              </button>
            )}
          </section>
        )}

        {/* Add Prerequisites */}
        {selectedRoadmapId && (
          <section style={{ marginBottom: "48px", padding: "24px", border: "2px solid rgba(0,0,0,0.1)", borderRadius: "12px" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "16px" }}>
              Manage Prerequisites for Roadmap ID: {selectedRoadmapId}
            </h2>

            {/* Existing Prerequisites (when editing) */}
            {editingPrerequisites.length > 0 && (
              <div style={{ marginBottom: "16px" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "12px" }}>Existing Prerequisites:</h3>
                {editingPrerequisites.map((prereq, index) => (
                  <div
                    key={prereq.id}
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "center",
                      padding: "12px",
                      background: "#f5f5f5",
                      borderRadius: "8px",
                      marginBottom: "8px",
                    }}
                  >
                    <input
                      type="text"
                      value={prereq.content}
                      onChange={(e) => {
                        const updated = [...editingPrerequisites];
                        updated[index].content = e.target.value;
                        setEditingPrerequisites(updated);
                      }}
                      style={{
                        flex: 1,
                        padding: "8px 12px",
                        border: "1px solid rgba(0,0,0,0.1)",
                        borderRadius: "6px",
                        fontSize: "0.95rem",
                      }}
                    />
                    <button
                      onClick={() => handleRemovePrerequisite(index, true)}
                      style={{
                        padding: "6px 12px",
                        background: "#fee",
                        color: "#c00",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Prerequisites */}
            <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
              <input
                type="text"
                value={newPrerequisite}
                onChange={(e) => setNewPrerequisite(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddPrerequisite())}
                placeholder="Enter prerequisite"
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  border: "2px solid rgba(0,0,0,0.1)",
                  borderRadius: "8px",
                  fontSize: "1rem",
                }}
              />
              <button
                onClick={handleAddPrerequisite}
                style={{
                  padding: "12px 24px",
                  background: "var(--yellow)",
                  color: "var(--ink)",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Add Prerequisite
              </button>
            </div>

            {/* New Prerequisites List */}
            {prerequisites.length > 0 && (
              <div style={{ marginBottom: "16px" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "12px" }}>New Prerequisites:</h3>
                {prerequisites.map((prereq, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "center",
                      padding: "12px",
                      background: "#e8f5e9",
                      borderRadius: "8px",
                      marginBottom: "8px",
                    }}
                  >
                    <span style={{ flex: 1 }}>{prereq}</span>
                    <button
                      onClick={() => handleRemovePrerequisite(index)}
                      style={{
                        padding: "6px 12px",
                        background: "#fee",
                        color: "#c00",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            {(editingPrerequisites.length > 0 || prerequisites.length > 0) && (
              <button
                onClick={handleSavePrerequisites}
                disabled={loading}
                style={{
                  padding: "12px 24px",
                  background: "var(--accent-orange)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: 600,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Saving..." : "Save All Prerequisites"}
              </button>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
