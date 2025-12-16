import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import "./InterviewTabs.css";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "https://api.test.hachion.co";


const TEMPLATES_ENDPOINT = `${API_BASE_URL}/api/interview-templates`;


const ASSIGNMENTS_SEARCH_ENDPOINT = `${API_BASE_URL}/api/interviews/assignments`;
const ASSIGNMENT_CREATE = (templateId) =>
  `${API_BASE_URL}/api/interviews/templates/${templateId}/assignments`;
const ASSIGNMENT_UPDATE = (assignmentId) =>
  `${API_BASE_URL}/api/interviews/assignments/${assignmentId}`;
const ASSIGNMENT_DELETE = (assignmentId) =>
  `${API_BASE_URL}/api/interviews/assignments/${assignmentId}`;


const getCandidateLink = (assignmentId, token) => {
  const base =
    process.env.REACT_APP_INTERVIEW_CANDIDATE_URL ||
    `${window.location.origin}/interview`;
  return `${base}?assignmentId=${assignmentId}&token=${token}`;
};

const InterviewAssignment = () => {
  const [templates, setTemplates] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

  const [viewMode, setViewMode] = useState("list"); 
  const [editingAssignment, setEditingAssignment] = useState(null);
  const isEditMode = !!editingAssignment;

  
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [candidateUserId, setCandidateUserId] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [expiryTime, setExpiryTime] = useState(""); 

  
  const fetchTemplates = async () => {
    try {
      const res = await axios.get(TEMPLATES_ENDPOINT);
      const list = Array.isArray(res.data) ? res.data : res.data?.content || [];
      setTemplates(list);
    } catch (err) {
      console.error("Failed to load templates:", err);
    }
  };

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      let url = ASSIGNMENTS_SEARCH_ENDPOINT;

      const params = [];
      if (searchText.trim()) {
        params.push(`search=${encodeURIComponent(searchText.trim())}`);
      }
      if (params.length > 0) {
        url += `?${params.join("&")}`;
      }

      const res = await axios.get(url);
      setAssignments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load assignments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
    fetchAssignments();
  }, []);

  
  const resetForm = () => {
    setEditingAssignment(null);
    setSelectedTemplateId("");
    setCandidateName("");
    setCandidateEmail("");
    setCandidateUserId("");
    setExpiryDate("");
    setExpiryTime("");
  };

  const openAddForm = () => {
    resetForm();
    setViewMode("form");
  };

  const openEditForm = (a) => {
    setEditingAssignment(a);
    setSelectedTemplateId(String(a.templateId));
    setCandidateName(a.candidateName || "");
    setCandidateEmail(a.candidateEmail || "");
    setCandidateUserId(a.candidateUserId ?? "");

    
    if (a.expiryDateTime) {
      const d = new Date(a.expiryDateTime);
      if (!Number.isNaN(d.getTime())) {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        const hh = String(d.getHours()).padStart(2, "0");
        const mi = String(d.getMinutes()).padStart(2, "0");
        setExpiryDate(`${yyyy}-${mm}-${dd}`);
        setExpiryTime(`${hh}:${mi}`);
      } else {
        setExpiryDate("");
        setExpiryTime("");
      }
    } else {
      setExpiryDate("");
      setExpiryTime("");
    }

    setViewMode("form");
  };

  const handleCancelForm = () => {
    resetForm();
    setViewMode("list");
  };

  const getTemplateTitleById = (id) => {
    const tpl = templates.find((t) => String(t.id) === String(id));
    return tpl ? tpl.title : "-";
  };

  const formatDateTime = (value) => {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateOnly = (value) => {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString("en-GB");
  };

  const filteredAssignments = useMemo(() => {
    if (!searchText) return assignments;
    const q = searchText.toLowerCase();
    return assignments.filter(
      (a) =>
        (a.candidateName && a.candidateName.toLowerCase().includes(q)) ||
        (a.candidateEmail && a.candidateEmail.toLowerCase().includes(q)) ||
        getTemplateTitleById(a.templateId).toLowerCase().includes(q)
    );
  }, [assignments, searchText, templates]);

  
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!selectedTemplateId) {
      alert("Template is mandatory.");
      return;
    }

    if (!candidateName || !candidateEmail) {
      alert("Candidate Name and Email are mandatory.");
      return;
    }

    let expiryDateTime = null;
    if (expiryDate && expiryTime) {
      expiryDateTime = `${expiryDate}T${expiryTime}:00`; 
    }

    const payload = {
      candidateUserId:
        candidateUserId && String(candidateUserId).trim() !== ""
          ? Number(candidateUserId)
          : null,
      candidateName,
      candidateEmail,
      expiryDateTime,
    };

    try {
      setLoading(true);
      if (isEditMode) {
        await axios.put(ASSIGNMENT_UPDATE(editingAssignment.id), payload);
        alert("Assignment updated successfully");
      } else {
        await axios.post(ASSIGNMENT_CREATE(selectedTemplateId), payload);
        alert("Assignment created successfully");
      }

      resetForm();
      setViewMode("list");
      fetchAssignments();
    } catch (err) {
      console.error("Failed to save assignment:", err);
      alert("Failed to save assignment.");
    } finally {
      setLoading(false);
    }
  };

  
  const handleDelete = async (assignment) => {
    const ok = window.confirm(
      `Delete assignment for ${assignment.candidateName}?`
    );
    if (!ok) return;

    try {
      await axios.delete(ASSIGNMENT_DELETE(assignment.id));
      fetchAssignments();
    } catch (err) {
      console.error("Failed to delete assignment:", err);
      alert("Delete failed.");
    }
  };

  
  const handleCopyLink = (assignment) => {
    const link = getCandidateLink(assignment.id, assignment.secureToken);

    if (navigator.clipboard) {
      navigator.clipboard.writeText(link).then(() => {
        alert("Copied:\n" + link);
      });
    } else {
      alert("Link:\n" + link);
    }
  };

  
  if (viewMode === "form") {
    const formTitle = isEditMode
      ? "Edit Interview Assignment"
      : "Add Interview Assignment";

    return (
      <div className="interview-question-wrapper">
        {/* Breadcrumb */}
        <div style={{ marginBottom: "0.5rem", fontSize: "13px" }}>
          <span
            style={{ cursor: "pointer", color: "#2563eb" }}
            onClick={handleCancelForm}
          >
            Interview Assignment List
          </span>{" "}
          &gt; <span>{formTitle}</span>
        </div>

        <h2 style={{ marginBottom: "0.75rem" }}>{formTitle}</h2>

        <form
          onSubmit={handleFormSubmit}
          style={{ display: "grid", gap: "0.75rem", maxWidth: "650px" }}
        >
          {/* Template */}
          <div>
            <label>Select Interview Template *</label>
            <select
              value={selectedTemplateId}
              onChange={(e) => setSelectedTemplateId(e.target.value)}
              style={{ width: "100%", padding: "0.5rem" }}
              required
              disabled={isEditMode} 
            >
              <option value="">-- Select Template --</option>
              {templates.map((tpl) => (
                <option key={tpl.id} value={tpl.id}>
                  {tpl.title}
                </option>
              ))}
            </select>
          </div>

          {/* Candidate Name */}
          <div>
            <label>Candidate Name *</label>
            <input
              type="text"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              style={{ width: "100%", padding: "0.5rem" }}
              required
            />
          </div>

          {/* Candidate Email */}
          <div>
            <label>Candidate Email *</label>
            <input
              type="email"
              value={candidateEmail}
              onChange={(e) => setCandidateEmail(e.target.value)}
              style={{ width: "100%", padding: "0.5rem" }}
              required
            />
          </div>

          {/* Candidate User ID */}
          <div>
            <label>Candidate User ID (optional)</label>
            <input
              type="number"
              value={candidateUserId}
              onChange={(e) => setCandidateUserId(e.target.value)}
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </div>

          {/* Expiry Date & Time */}
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <div style={{ flex: 1 }}>
              <label>Expiry Date (optional)</label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                style={{ width: "100%", padding: "0.5rem" }}
              />
            </div>

            <div style={{ flex: 1 }}>
              <label>Expiry Time (optional)</label>
              <input
                type="time"
                value={expiryTime}
                onChange={(e) => setExpiryTime(e.target.value)}
                style={{ width: "100%", padding: "0.5rem" }}
              />
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
            <button type="submit" disabled={loading}>
              {isEditMode ? "Update" : "Submit"}
            </button>
            <button type="button" onClick={resetForm}>
              Reset
            </button>
            <button type="button" onClick={handleCancelForm}>
              Back to List
            </button>
          </div>
        </form>
      </div>
    );
  }


  return (
    <div className="interview-question-wrapper">
      <h2 className="interview-template-title">INTERVIEW ASSIGNMENT LIST</h2>

      {/* toolbar */}
      <div className="interview-template-toolbar">
        <div className="interview-template-search">
          <input
            type="text"
            placeholder="Search by candidate name / email..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button style={{ marginLeft: "0.5rem" }} onClick={fetchAssignments}>
            Search
          </button>
        </div>

        <button
          type="button"
          className="interview-template-add-btn"
          onClick={openAddForm}
        >
          + Add Assignment
        </button>
      </div>

      {/* table */}
      <div className="interview-template-table-wrapper">
        <table className="interview-template-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Template Title</th>
              <th>Candidate Name</th>
              <th>Candidate Email</th>
              <th>Status</th>
              <th>Expiry Date/Time</th>
              <th>Created</th>
              <th>Started At</th>
              <th>Completed At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {!loading && filteredAssignments.length === 0 && (
              <tr>
                <td colSpan="10" style={{ textAlign: "center" }}>
                  No assignments found.
                </td>
              </tr>
            )}

            {filteredAssignments.map((a, index) => (
              <tr key={a.id}>
                {/* serial number */}
                <td>{index + 1}</td>
                <td>{getTemplateTitleById(a.templateId)}</td>
                <td>{a.candidateName}</td>
                <td>{a.candidateEmail}</td>
                <td>{a.status}</td>
                <td>{formatDateTime(a.expiryDateTime)}</td>
                <td>{formatDateOnly(a.createdAt)}</td>
                <td>{formatDateTime(a.startedAt)}</td>
                <td>{formatDateTime(a.completedAt)}</td>
                <td className="interview-template-actions">
                  <button
                    className="link-btn"
                    onClick={() => openEditForm(a)}
                  >
                    Edit
                  </button>
                  <span className="action-separator">|</span>
                  <button
                    className="link-btn"
                    onClick={() => alert("Responses tab in 5th tab")}
                  >
                    Responses
                  </button>
                  <span className="action-separator">|</span>
                  <button
                    className="link-btn"
                    onClick={() => handleCopyLink(a)}
                  >
                    Copy Link
                  </button>
                  <span className="action-separator">|</span>
                  <button
                    className="link-btn delete"
                    onClick={() => handleDelete(a)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {loading && (
              <tr>
                <td colSpan="10" style={{ textAlign: "center" }}>
                  Loading...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InterviewAssignment;
