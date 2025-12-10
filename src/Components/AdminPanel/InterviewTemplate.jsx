import React, { useEffect, useState } from "react";
import axios from "axios";
import "./InterviewTabs.css";
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "https://api.hachion.co";


const LIST_ENDPOINT = `${API_BASE_URL}/api/interview-templates`; 
const DETAIL_ENDPOINT = (id) =>
  `${API_BASE_URL}/api/interview-templates/${id}`; 

const InterviewTemplate = () => {
  
  const [templates, setTemplates] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  
  const [viewMode, setViewMode] = useState("list"); 

  
  const [editingTemplate, setEditingTemplate] = useState(null); 

  const [templateTitle, setTemplateTitle] = useState("");
  const [templateType, setTemplateType] = useState(""); 
  const [statusActive, setStatusActive] = useState(true);
  const [description, setDescription] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [totalQuestions, setTotalQuestions] = useState(5);

  const isEditMode = !!editingTemplate;

  
  const fetchTemplates = async (search = "") => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(LIST_ENDPOINT, {
        params: search ? { search } : {},
      });

      const list = Array.isArray(response.data)
        ? response.data
        : response.data?.content || [];

      setTemplates(list);
    } catch (err) {
      console.error("Error fetching interview templates:", err);
      setError("Failed to load templates. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  
  const handleSearch = (e) => {
    e.preventDefault();
    fetchTemplates(searchText.trim());
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this template?");
    if (!ok) return;

    try {
      await axios.delete(DETAIL_ENDPOINT(id));
      fetchTemplates(searchText.trim());
    } catch (err) {
      console.error("Error deleting template:", err);
      alert("Failed to delete template. Please try again.");
    }
  };

  const openAddForm = () => {
    setEditingTemplate(null);
    resetForm();
    setViewMode("form");
  };

  const openEditForm = (tpl) => {
    setEditingTemplate(tpl);
    fillFormFromTemplate(tpl);
    setViewMode("form");
  };

  
  const resetForm = () => {
    setTemplateTitle("");
    setTemplateType("");
    setStatusActive(true);
    setDescription("");
    setDurationMinutes(30);
    setTotalQuestions(5);
  };

  const fillFormFromTemplate = (tpl) => {
    setTemplateTitle(tpl.templateTitle || tpl.title || "");
    setTemplateType(tpl.type || tpl.templateType || "");
    setStatusActive(
      tpl.active !== undefined
        ? !!tpl.active
        : tpl.status === "Active" || tpl.status === "ACTIVE"
    );
    setDescription(tpl.description || "");
    setDurationMinutes(tpl.durationMinutes || tpl.duration || 30);
    setTotalQuestions(tpl.totalQuestions || tpl.questionCount || 5);
  };

  const formatStatus = (activeVal) => {
    if (typeof activeVal === "string") return activeVal;
    return activeVal ? "Active" : "Inactive";
  };

  const formatDate = (value) => {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString("en-GB"); 
  };

  
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    
    const payload = {
      title: templateTitle, 
      type: templateType,
      active: statusActive,
      description,
      durationMinutes: Number(durationMinutes),
      totalQuestions: Number(totalQuestions),
    };

    try {
      setLoading(true);
      if (isEditMode) {
        await axios.put(DETAIL_ENDPOINT(editingTemplate.id), payload);
        alert("Template updated successfully");
      } else {
        await axios.post(LIST_ENDPOINT, payload);
        alert("Template created successfully");
      }

      await fetchTemplates(searchText.trim());
      setViewMode("list");
    } catch (err) {
      console.error("Error saving template:", err);
      alert("Failed to save template. Please check console.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelForm = () => {
    setViewMode("list");
    setEditingTemplate(null);
    resetForm();
  };

  
  if (viewMode === "form") {
    
    return (
      <div style={{ paddingTop: "0.5rem" }}>
        {/* Breadcrumb */}
        <div style={{ marginBottom: "0.5rem", fontSize: "0.85rem" }}>
          <span style={{ color: "#6b7280" }}>Interview Template</span>
          <span> &gt; </span>
          <span style={{ fontWeight: 500 }}>
            {isEditMode ? "Edit Template" : "Add Template"}
          </span>
        </div>

        {/* Blue header bar */}
        <div
          style={{
            background: "#0ea5e9",
            color: "white",
            padding: "0.7rem 1rem",
            borderRadius: "6px 6px 0 0",
            fontWeight: 600,
          }}
        >
          {isEditMode ? "Edit Interview Template" : "Add Interview Template"}
        </div>

        {/* White card with form */}
        <div
          style={{
            background: "white",
            borderRadius: "0 0 10px 10px",
            padding: "1.5rem",
            boxShadow: "0 8px 20px rgba(15, 23, 42, 0.08)",
          }}
        >
          <form
            onSubmit={handleFormSubmit}
            style={{
              display: "grid",
              gap: "1rem",
            }}
          >
            {/* Template Title */}
            <div>
              <label
                htmlFor="templateTitle"
                style={{ display: "block", marginBottom: "0.25rem" }}
              >
                Template Title
              </label>
              <input
                id="templateTitle"
                type="text"
                value={templateTitle}
                onChange={(e) => setTemplateTitle(e.target.value)}
                placeholder="e.g. React Trainer Screening"
                required
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "4px",
                  border: "1px solid #d1d5db",
                }}
              />
            </div>

            {/* Type + Duration + Total Questions */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: "1rem",
              }}
            >
              <div>
                <label
                  htmlFor="templateType"
                  style={{ display: "block", marginBottom: "0.25rem" }}
                >
                  Type
                </label>
                <select
                  id="templateType"
                  value={templateType}
                  onChange={(e) => setTemplateType(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    borderRadius: "4px",
                    border: "1px solid #d1d5db",
                  }}
                >
                  <option value="">-- Select --</option>
                  <option value="TRAINER">Trainer</option>
                  <option value="STUDENT">Student</option>
                  <option value="INTERNAL">Internal</option>
                </select>
              </div>

            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                style={{ display: "block", marginBottom: "0.25rem" }}
              >
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description about this interview template."
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "4px",
                  border: "1px solid #d1d5db",
                  resize: "vertical",
                }}
              />
            </div>

            {/* Status toggle */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginTop: "0.5rem",
              }}
            >
              <span>Status:</span>
              <label
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={statusActive}
                  onChange={(e) => setStatusActive(e.target.checked)}
                  style={{ cursor: "pointer" }}
                />
                <span>{statusActive ? "Active" : "Inactive"}</span>
              </label>
            </div>

            {/* Buttons */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "1rem",
              }}
            >
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: "0.5rem 1.5rem",
                    borderRadius: "4px",
                    border: "none",
                    backgroundColor: "#0ea5e9",
                    color: "#ffffff",
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                >
                  {isEditMode ? "Update" : "Submit"}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    padding: "0.5rem 1.5rem",
                    borderRadius: "4px",
                    border: "1px solid #d1d5db",
                    backgroundColor: "white",
                    cursor: "pointer",
                  }}
                >
                  Reset
                </button>
              </div>

              <button
                type="button"
                onClick={handleCancelForm}
                style={{
                  padding: "0.5rem 1.5rem",
                  borderRadius: "4px",
                  border: "1px solid #d1d5db",
                  backgroundColor: "white",
                  cursor: "pointer",
                }}
              >
                Back to List
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  
  return (
    <div className="interview-template-wrapper">
      {/* Title */}
      <h2 className="interview-template-title">INTERVIEW TEMPLATE DETAILS</h2>

      {/* Search + Add Template row */}
      <form className="interview-template-toolbar" onSubmit={handleSearch}>
        <div className="interview-template-search">
          <input
            type="text"
            placeholder="Search Template..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button type="submit">Search</button>
        </div>

        <button
          type="button"
          className="interview-template-add-btn"
          onClick={openAddForm}
        >
          + Add Template
        </button>
      </form>

    
      {error && <p className="interview-template-error">{error}</p>}
      {loading && <p className="interview-template-loading">Loading...</p>}

      {/* Table */}
      {!loading && (
        <div className="interview-template-table-wrapper">
          <table className="interview-template-table">
            <thead>
              <tr>
                {/* <th>ID</th> */}
                <th>S.No</th>  
                <th>Template Title</th>
                <th>Type</th>
                <th>Duration (min)</th>
                <th>Total Questions</th>
                <th>Description</th>
                <th>Status</th>
                <th>Created Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {templates.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center" }}>
                    No templates found.
                  </td>
                </tr>
              )}

              {templates.map((tpl, index) => (
                <tr key={tpl.id ?? index}>
                  {/* ID */}
                  <td>{ index + 1}</td>

                  {/* Template Title */}
                  <td>{tpl.templateTitle || tpl.title || "-"}</td>

                  {/* Type */}
                  <td>{tpl.type || tpl.templateType || "-"}</td>

                  {/* Duration (min) */}
                  <td>{tpl.durationMinutes ?? tpl.duration ?? "-"}</td>

                  {/* Total Questions */}
                  <td>{tpl.totalQuestions ?? tpl.questionCount ?? "-"}</td>

                  {/* Description */}
                  <td>{tpl.description || "-"}</td>

                  {/* Status */}
                  <td>
                    <span
                      className={`status-pill ${
                        tpl.active || tpl.status === "Active"
                          ? "status-active"
                          : "status-inactive"
                      }`}
                    >
                      {formatStatus(tpl.active ?? tpl.status)}
                    </span>
                  </td>

                  {/* Created Date */}
                  <td>{formatDate(tpl.createdDate || tpl.createdAt)}</td>

                  {/* Action */}
                  <td className="interview-template-actions">
                    <button
                      type="button"
                      className="link-btn"
                      onClick={() => openEditForm(tpl)}
                    >
                      Edit
                    </button>
                    <span className="action-separator">|</span>
                    <button
                      type="button"
                      className="link-btn delete"
                      onClick={() => handleDelete(tpl.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InterviewTemplate;
