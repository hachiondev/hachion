import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import "./InterviewTabs.css";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "https://api.hachion.co";


const TEMPLATES_ENDPOINT = `${API_BASE_URL}/api/interview-templates`;


const ALL_QUESTIONS_ENDPOINT = `${API_BASE_URL}/api/interviews/questions`;


const QUESTIONS_FOR_TEMPLATE = (templateId) =>
  `${API_BASE_URL}/api/interviews/templates/${templateId}/questions`;

const QUESTION_BY_ID = (questionId) =>
  `${API_BASE_URL}/api/interviews/questions/${questionId}`;

const InterviewQuestionsList = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState(""); 
  const [questions, setQuestions] = useState([]);
  const [searchText, setSearchText] = useState("");

  const [viewMode, setViewMode] = useState("list"); 
  const [editingQuestion, setEditingQuestion] = useState(null);
  const isEditMode = !!editingQuestion;

  const [loading, setLoading] = useState(false);

  
  const [questionText, setQuestionText] = useState("");
  const [answerType, setAnswerType] = useState("");
  const [maxDurationSeconds, setMaxDurationSeconds] = useState("");
  const [prepTimeSeconds, setPrepTimeSeconds] = useState("");
  const [maxRetries, setMaxRetries] = useState("");
  const [displayOrder, setDisplayOrder] = useState("");

  
  const fetchTemplates = async () => {
    try {
      const res = await axios.get(TEMPLATES_ENDPOINT);
      const list = Array.isArray(res.data) ? res.data : res.data?.content || [];
      setTemplates(list);
    } catch (err) {
      console.error("Failed to load templates:", err);
    }
  };

  
  const fetchAllQuestions = async () => {
    try {
      setLoading(true);
      const res = await axios.get(ALL_QUESTIONS_ENDPOINT);
      setQuestions(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load questions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
    fetchAllQuestions();
  }, []);

  
  useEffect(() => {
    if (viewMode === "list") {
      fetchAllQuestions();
    }
  }, [viewMode]);

  
  const filteredQuestions = useMemo(() => {
    if (!searchText) return questions;
    const q = searchText.toLowerCase();
    return questions.filter(
      (item) =>
        (item.questionText && item.questionText.toLowerCase().includes(q)) ||
        (item.answerType && item.answerType.toLowerCase().includes(q))
    );
  }, [questions, searchText]);

  
  const resetFormFields = () => {
    setEditingQuestion(null);
    setQuestionText("");
    setAnswerType("");
    setMaxDurationSeconds("");
    setPrepTimeSeconds("");
    setMaxRetries("");
    setDisplayOrder("");
    setSelectedTemplateId(""); 
  };

  const openAddForm = () => {
    resetFormFields();
    setViewMode("form");
  };

  const openEditForm = (question) => {
    setEditingQuestion(question);
    setSelectedTemplateId(String(question.templateId)); 
    setQuestionText(question.questionText || "");
    setAnswerType(question.answerType || "");
    setMaxDurationSeconds(question.maxDurationSeconds ?? "");
    setPrepTimeSeconds(question.prepTimeSeconds ?? "");
    setMaxRetries(question.maxRetries ?? "");
    setDisplayOrder(question.displayOrder ?? "");
    setViewMode("form");
  };

  const handleCancelForm = () => {
    resetFormFields();
    setViewMode("list");
  };

  const getTemplateTitleById = (id) => {
    const tpl = templates.find((t) => String(t.id) === String(id));
    return tpl ? tpl.title : "-";
  };

  const formatDate = (value) => {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString("en-GB");
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!selectedTemplateId) {
      alert("Template Title is mandatory. Please select an Interview Template.");
      return;
    }

    const payload = {
      questionText,
      answerType,
      maxDurationSeconds:
        maxDurationSeconds === "" ? null : Number(maxDurationSeconds),
      prepTimeSeconds:
        prepTimeSeconds === "" ? null : Number(prepTimeSeconds),
      maxRetries: maxRetries === "" ? null : Number(maxRetries),
      displayOrder: displayOrder === "" ? null : Number(displayOrder),
    };

    try {
      setLoading(true);
      if (isEditMode) {
        await axios.put(QUESTION_BY_ID(editingQuestion.id), payload);
        alert("Question updated successfully");
      } else {
        
        await axios.post(QUESTIONS_FOR_TEMPLATE(selectedTemplateId), payload);
        alert("Question created successfully");
      }

      resetFormFields();
      setViewMode("list"); 
    } catch (err) {
      console.error("Failed to save question:", err);
      alert("Failed to save question. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this question?");
    if (!ok) return;

    try {
      await axios.delete(QUESTION_BY_ID(id));
      fetchAllQuestions();
    } catch (err) {
      console.error("Failed to delete question:", err);
      alert("Failed to delete question.");
    }
  };


  if (viewMode === "form") {
    const isTemplateSelected = !!selectedTemplateId;

    const labelStyle = (active = isTemplateSelected) => ({
      display: "block",
      marginBottom: "0.25rem",
      color: active ? "#111827" : "#9ca3af",
    });

    const fieldStyle = (active = isTemplateSelected) => ({
      width: "100%",
      padding: "0.5rem",
      border: "1px solid",
      borderColor: active ? "#d1d5db" : "#e5e7eb",
      backgroundColor: active ? "#ffffff" : "#f9fafb",
      color: active ? "#111827" : "#9ca3af",
    });

    return (
      <div className="interview-question-wrapper">
        {/* Breadcrumb */}
        <div style={{ marginBottom: "0.5rem", fontSize: "13px" }}>
          <span
            style={{ cursor: "pointer", color: "#2563eb" }}
            onClick={() => {
              resetFormFields();
              setViewMode("list");
            }}
          >
            Interview Questions List
          </span>{" "}
          &gt; <span>{isEditMode ? "Edit Question" : "Add Question"}</span>
        </div>

        <h2 style={{ marginBottom: "0.75rem" }}>
          {isEditMode ? "Edit Interview Question" : "Add Interview Question"}
        </h2>

        {/* Template dropdown */}
        <div style={{ marginBottom: "0.5rem" }}>
          <label
            htmlFor="template-select"
            style={{
              display: "block",
              marginBottom: "0.25rem",
              fontWeight: 500,
            }}
          >
            Select Interview Template <span style={{ color: "red" }}>*</span>
          </label>
          <select
            id="template-select"
            value={selectedTemplateId}
            onChange={(e) => setSelectedTemplateId(e.target.value)}
            style={{ ...fieldStyle(true), color: "#111827" }}
            required
          >
            <option value="">-- Select Template --</option>
            {templates.map((tpl) => (
              <option key={tpl.id} value={tpl.id}>
                {tpl.title}
              </option>
            ))}
          </select>
        </div>

        {!isTemplateSelected && (
          <p style={{ color: "#b91c1c", marginBottom: "0.75rem" }}>
            Template Title is mandatory. Please select an Interview Template.
          </p>
        )}

        {/* Form fields */}
        <form
          onSubmit={handleFormSubmit}
          style={{ display: "grid", gap: "0.75rem" }}
        >
          <div>
            <label htmlFor="questionText" style={labelStyle()}>
              Question Text <span style={{ color: "red" }}>*</span>
            </label>
            <textarea
              id="questionText"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              rows={3}
              required
              disabled={!isTemplateSelected}
              style={{ ...fieldStyle(), minHeight: "80px" }}
            />
          </div>

          <div>
            <label htmlFor="answerType" style={labelStyle()}>
              Answer Type <span style={{ color: "red" }}>*</span>
            </label>
            <select
              id="answerType"
              value={answerType}
              onChange={(e) => setAnswerType(e.target.value)}
              required
              disabled={!isTemplateSelected}
              style={fieldStyle()}
            >
              <option value="">-- Select --</option>
              <option value="TEXT">Text</option>
              <option value="VIDEO">Video</option>
              <option value="AUDIO">Audio</option>
              <option value="MCQ">MCQ</option>
            </select>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "0.75rem",
            }}
          >
            <div>
              <label htmlFor="maxDurationSeconds" style={labelStyle()}>
                Max Duration (seconds)
              </label>
              <input
                id="maxDurationSeconds"
                type="number"
                min={0}
                value={maxDurationSeconds}
                onChange={(e) => setMaxDurationSeconds(e.target.value)}
                disabled={!isTemplateSelected}
                style={fieldStyle()}
              />
            </div>

            <div>
              <label htmlFor="prepTimeSeconds" style={labelStyle()}>
                Prep Time (seconds)
              </label>
              <input
                id="prepTimeSeconds"
                type="number"
                min={0}
                value={prepTimeSeconds}
                onChange={(e) => setPrepTimeSeconds(e.target.value)}
                disabled={!isTemplateSelected}
                style={fieldStyle()}
              />
            </div>

            <div>
              <label htmlFor="maxRetries" style={labelStyle()}>
                Max Retries
              </label>
              <input
                id="maxRetries"
                type="number"
                min={0}
                value={maxRetries}
                onChange={(e) => setMaxRetries(e.target.value)}
                disabled={!isTemplateSelected}
                style={fieldStyle()}
              />
            </div>
          </div>

          <div>
            <label htmlFor="displayOrder" style={labelStyle()}>
              Display Order
            </label>
            <input
              id="displayOrder"
              type="number"
              min={0}
              value={displayOrder}
              onChange={(e) => setDisplayOrder(e.target.value)}
              disabled={!isTemplateSelected}
              style={fieldStyle()}
            />
          </div>

          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
            <button
              type="submit"
              disabled={loading || !isTemplateSelected}
              className="interview-template-add-btn"
            >
              {isEditMode ? "Update" : "Submit"}
            </button>
            <button type="button" onClick={resetFormFields}>
              Reset
            </button>
            <button type="button" onClick={handleCancelForm}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  
  return (
    <div className="interview-question-wrapper">
      <h2 className="interview-template-title">INTERVIEW QUESTIONS LIST</h2>

      <div className="interview-template-toolbar">
        <div className="interview-template-search">
          <input
            type="text"
            placeholder="Search Question..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <button
          type="button"
          className="interview-template-add-btn"
          onClick={openAddForm}
        >
          + Add Question
        </button>
      </div>

      <div className="interview-template-table-wrapper">
        <table className="interview-template-table">
          <thead>
            <tr>
              {/* <th>ID</th> */}
              <th>S.No</th>  
              <th>Template Title</th>
              <th>Question</th>
              <th>Answer Type</th>
              <th>Duration</th>
              <th>Prep</th>
              <th>Retries</th>
              <th>Order</th>
              <th>Created</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {!loading && filteredQuestions.length === 0 && (
              <tr>
                <td colSpan={10} style={{ textAlign: "center" }}>
                  No questions found.
                </td>
              </tr>
            )}

            {filteredQuestions.map((q, index) => (
              <tr key={q.id}>
                <td>{index + 1}</td>
                {/* <td>{q.id}</td> */}
                <td>{getTemplateTitleById(q.templateId)}</td>
                <td>{q.questionText}</td>
                <td>{q.answerType}</td>
                <td>{q.maxDurationSeconds ?? "-"}</td>
                <td>{q.prepTimeSeconds ?? "-"}</td>
                <td>{q.maxRetries ?? "-"}</td>
                <td>{q.displayOrder ?? "-"}</td>
                <td>{formatDate(q.createdAt)}</td>
                <td className="interview-template-actions">
                  <button
                    type="button"
                    className="link-btn"
                    onClick={() => openEditForm(q)}
                  >
                    Edit
                  </button>
                  <span className="action-separator">|</span>
                  <button
                    type="button"
                    className="link-btn delete"
                    onClick={() => handleDelete(q.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {loading && (
              <tr>
                <td colSpan={10} style={{ textAlign: "center" }}>
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

export default InterviewQuestionsList;
