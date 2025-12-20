// src/InterviewCandidatePage.jsx
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "https://api.hachion.co";

const GET_ASSIGNMENT = (id, token) =>
  `${API_BASE_URL}/api/interviews/assignments/${id}?token=${encodeURIComponent(
    token
  )}`;

const GET_QUESTIONS_FOR_TEMPLATE = (templateId) =>
  `${API_BASE_URL}/api/interviews/templates/${templateId}/questions`;

const START_INTERVIEW = (id, token) =>
  `${API_BASE_URL}/api/interviews/assignments/${id}/start?token=${encodeURIComponent(
    token
  )}`;

const COMPLETE_INTERVIEW = (id, token) =>
  `${API_BASE_URL}/api/interviews/assignments/${id}/complete?token=${encodeURIComponent(
    token
  )}`;

const SAVE_RESPONSE = (assignmentId, token) =>
  `${API_BASE_URL}/api/interviews/assignments/${assignmentId}/responses?token=${encodeURIComponent(
    token
  )}`;

// 🔹 You will create this endpoint in backend to upload the recorded file
const UPLOAD_VIDEO = `${API_BASE_URL}/api/interviews/upload-video`;

const InterviewCandidatePage = () => {
  const [assignment, setAssignment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // TEXT answer state (for non-video questions)
  const [textAnswer, setTextAnswer] = useState("");

  // VIDEO recording state
  const videoRef = useRef(null);
  const previewRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [recording, setRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState("");
  const [timeLeft, setTimeLeft] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // read assignmentId + token from URL
  const params = new URLSearchParams(window.location.search);
  const assignmentId = params.get("assignmentId");
  const token = params.get("token");

  // ========== INITIAL LOAD ==========
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        if (!assignmentId || !token) {
          setError("Missing assignmentId or token in the URL.");
          return;
        }

        // 1) validate assignment
        const aRes = await axios.get(GET_ASSIGNMENT(assignmentId, token));
        const a = aRes.data;
        setAssignment(a);

        // 2) load questions
        const qRes = await axios.get(
          GET_QUESTIONS_FOR_TEMPLATE(a.templateId)
        );
        const qs = Array.isArray(qRes.data) ? qRes.data : [];
        setQuestions(qs);

        // 3) mark as started
        await axios.put(START_INTERVIEW(assignmentId, token));

        // 4) turn on camera immediately (like xInterview)
        await startCamera();
      } catch (err) {
        console.error(err);
        setError("Invalid or expired interview link.");
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // cleanup on unmount
    return () => {
      stopCamera();
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ========== CAMERA / RECORDER HELPERS ==========

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
      }
    } catch (err) {
      console.error(err);
      setError(
        "Unable to access camera or microphone. Please allow permissions and refresh."
      );
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
    }
    setStream(null);
  };

  const startRecording = () => {
    if (!stream) {
      alert("Camera is not available.");
      return;
    }
    const current = questions[currentIndex];
    if (!current) return;

    const maxDuration =
      current.maxDurationSeconds && current.maxDurationSeconds > 0
        ? current.maxDurationSeconds
        : 120; // default 2 min

    // respect maxRetries
    if (
      current.maxRetries != null &&
      current.maxRetries >= 0 &&
      retryCount >= current.maxRetries
    ) {
      alert("You have reached the maximum number of retries for this question.");
      return;
    }

    chunksRef.current = [];
    const mr = new MediaRecorder(stream, { mimeType: "video/webm" });
    mediaRecorderRef.current = mr;

    mr.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };

    mr.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      setVideoBlob(blob);
      const url = URL.createObjectURL(blob);
      setVideoPreviewUrl(url);
      if (previewRef.current) {
        previewRef.current.src = url;
      }
    };

    mr.start();
    setRecording(true);
    setVideoBlob(null);
    setVideoPreviewUrl("");
    setTimeLeft(maxDuration);
    setRetryCount((prev) => prev + 1);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          stopRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    const mr = mediaRecorderRef.current;
    if (mr && mr.state !== "inactive") {
      mr.stop();
    }
    setRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimeLeft(null);
  };

  const handleReRecord = () => {
    setVideoBlob(null);
    setVideoPreviewUrl("");
    if (previewRef.current) {
      previewRef.current.src = "";
    }
  };

  // ========== UPLOAD VIDEO FILE ==========
  const uploadVideo = async (blob, fileName) => {
    const formData = new FormData();
    formData.append("file", blob, fileName);

    const res = await axios.post(UPLOAD_VIDEO, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // expect backend to respond { url: "https://..." }
    return res.data.url;
  };

  // ========== NAVIGATION & SAVE ==========
  const handleSaveAndNext = async () => {
    const current = questions[currentIndex];
    if (!current) return;

    try {
      setLoading(true);

      let videoUrl = null;
      let videoDuration = null;

      if (current.answerType === "VIDEO") {
        if (!videoBlob) {
          alert("Please record your answer before proceeding.");
          setLoading(false);
          return;
        }
        const fileName = `assignment-${assignmentId}-q-${current.id}-${Date.now()}.webm`;
        videoUrl = await uploadVideo(videoBlob, fileName);
        // simple approximation: use maxDurationSeconds as duration
        videoDuration =
          current.maxDurationSeconds && current.maxDurationSeconds > 0
            ? current.maxDurationSeconds
            : null;
      }

      await axios.post(SAVE_RESPONSE(assignmentId, token), {
        questionId: current.id,
        videoUrl: videoUrl, // for VIDEO
        videoDurationSeconds: videoDuration,
        retriesUsed: retryCount,
      });

      // reset per-question state
      setVideoBlob(null);
      setVideoPreviewUrl("");
      setTextAnswer("");
      if (previewRef.current) previewRef.current.src = "";

      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(currentIndex + 1);
        setRetryCount(0);
      } else {
        // last question
        await axios.put(COMPLETE_INTERVIEW(assignmentId, token));
        alert("Interview submitted. Thank you!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save answer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ========== RENDER ==========
  if (loading && !assignment) {
    return <p style={{ padding: "1rem" }}>Loading...</p>;
  }

  if (error) {
    return (
      <p style={{ padding: "1rem", color: "red", maxWidth: 600, margin: "1rem auto" }}>
        {error}
      </p>
    );
  }

  if (!assignment || questions.length === 0) {
    return (
      <div style={{ padding: "1rem" }}>
        <h2>Interview</h2>
        <p>No questions configured for this interview.</p>
      </div>
    );
  }

  const current = questions[currentIndex];
  const isVideo = current.answerType === "VIDEO";

  return (
    <div style={{ maxWidth: "900px", margin: "1.5rem auto", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ marginBottom: "0.25rem" }}>
        {assignment.candidateName}, welcome to your interview
      </h1>
      <p style={{ marginTop: 0, marginBottom: "0.5rem", color: "#6b7280" }}>
        Template: <strong>{assignment.templateTitle || ""}</strong>
      </p>

      <p style={{ marginTop: 0, marginBottom: "1rem", color: "#4b5563" }}>
        Question {currentIndex + 1} of {questions.length}
      </p>

      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          padding: "1.25rem",
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: "0.25rem" }}>
          {current.questionText}
        </h2>
        <p
          style={{
            marginTop: 0,
            marginBottom: "0.75rem",
            fontSize: "0.85rem",
            color: "#6b7280",
          }}
        >
          Answer Type: {current.answerType}
        </p>

        {isVideo ? (
          <>
            {/* Live camera preview */}
            <div
              style={{
                display: "flex",
                gap: "1rem",
                flexWrap: "wrap",
                marginBottom: "0.75rem",
              }}
            >
              <div style={{ flex: "1 1 260px" }}>
                <p
                  style={{
                    margin: "0 0 0.25rem",
                    fontSize: "0.85rem",
                    color: "#4b5563",
                  }}
                >
                  Live Camera
                </p>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{
                    width: "100%",
                    maxHeight: "260px",
                    backgroundColor: "#000",
                    borderRadius: "6px",
                  }}
                />
              </div>

              {/* Recorded preview */}
              <div style={{ flex: "1 1 260px" }}>
                <p
                  style={{
                    margin: "0 0 0.25rem",
                    fontSize: "0.85rem",
                    color: "#4b5563",
                  }}
                >
                  Recorded Preview
                </p>
                <video
                  ref={previewRef}
                  controls
                  style={{
                    width: "100%",
                    maxHeight: "260px",
                    backgroundColor: "#000",
                    borderRadius: "6px",
                  }}
                />
              </div>
            </div>

            {/* Recording controls */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                marginBottom: "0.5rem",
              }}
            >
              {!recording ? (
                <button
                  type="button"
                  onClick={startRecording}
                  style={{
                    padding: "0.45rem 1.4rem",
                    borderRadius: "999px",
                    border: "none",
                    backgroundColor: "#ef4444",
                    color: "white",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  ● Start Recording
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopRecording}
                  style={{
                    padding: "0.45rem 1.4rem",
                    borderRadius: "999px",
                    border: "none",
                    backgroundColor: "#f97316",
                    color: "white",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  ■ Stop
                </button>
              )}

              {videoBlob && (
                <button
                  type="button"
                  onClick={handleReRecord}
                  style={{
                    padding: "0.35rem 1rem",
                    borderRadius: "999px",
                    border: "1px solid #d1d5db",
                    backgroundColor: "white",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                  }}
                >
                  Re-record
                </button>
              )}

              {timeLeft != null && (
                <span
                  style={{
                    fontSize: "0.85rem",
                    color: "#111827",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  Time left: {timeLeft}s
                </span>
              )}

              {current.maxRetries != null && current.maxRetries >= 0 && (
                <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                  Attempt {retryCount} of {current.maxRetries}
                </span>
              )}
            </div>
          </>
        ) : (
          <>
            {/* TEXT fallback */}
            <textarea
              rows={4}
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              placeholder="Type your answer here..."
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "4px",
                border: "1px solid #d1d5db",
              }}
            />
          </>
        )}

        <button
          type="button"
          onClick={handleSaveAndNext}
          disabled={loading}
          style={{
            marginTop: "0.75rem",
            padding: "0.5rem 1.75rem",
            borderRadius: "4px",
            border: "none",
            backgroundColor: "#2563eb",
            color: "white",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          {currentIndex + 1 === questions.length
            ? "Submit Interview"
            : "Save & Next"}
        </button>
      </div>
    </div>
  );
};

export default InterviewCandidatePage;
