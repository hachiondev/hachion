import React, { useEffect, useState, useRef } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import calendar from "../../Assets/calendar.webp";
import { useParams } from "react-router-dom";

const RequestBatch = ({ closeModal }) => {
  const { courseName } = useParams();

  const [startDate, setStartDate] = useState(null);
  const [time, setTime] = useState("");
  const [mode, setMode] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const datePickerRef = useRef(null);
  const timeInputRef = useRef(null);

  const formattedCourseName = courseName
    ?.replace(/-/g, " ")
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const userData = JSON.parse(localStorage.getItem("loginuserData")) || {};
  const userName = userData.name || "";
  const userEmail = userData.email || "";

  /* 🔒 Prevent background scroll */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  /* 🔹 Fetch mobile from profile */
  useEffect(() => {
    if (!userEmail) return;

    fetch(
      `https://api.test.hachion.co/api/v1/user/myprofile?email=${userEmail}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data?.mobile) setMobile(data.mobile);
      })
      .catch(() => {});
  }, [userEmail]);

  const handleSubmit = async () => {
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    const payload = {
      schedule_date: startDate,
      time_zone: time,
      email: userEmail,
      mobile,
      mode,
      country: "India",
      courseName: formattedCourseName,
      userName,
    };

    try {
      const res = await fetch(
        "https://api.test.hachion.co/requestbatch/add",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error();

      setSuccessMessage("✅ Request submitted successfully!");
      setTimeout(closeModal, 2500);
    } catch {
      setErrorMessage("❌ Error submitting request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    /* 🔹 Overlay */
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={closeModal}
    >
      {/* 🔹 Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "420px",
          maxWidth: "95%",
          background: "#fff",
          borderRadius: "10px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
          overflow: "hidden",
          animation: "scaleIn 0.2s ease",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(90deg,#0072ff,#00c6ff)",
            color: "#fff",
            padding: "14px 16px",
            fontWeight: "600",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Let us know your preferred start date
          <AiOutlineCloseCircle
            onClick={closeModal}
            style={{ cursor: "pointer", fontSize: "22px" }}
          />
        </div>

        {/* Body */}
        <div style={{ padding: "18px" }}>
          {/* Mode */}
          <label style={{ fontWeight: 500 }}>Mode of Trainings</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "6px" }}
          >
            <option value="">Select Mode</option>
            <option>Live Class</option>
            <option>Live Demo</option>
            <option>Crash Course</option>
            <option>Self-Paced</option>
            <option>Corporate Training</option>
          </select>

          {/* Date */}
          <label style={{ fontWeight: 500, marginTop: "14px", display: "block" }}>
            Preferred batch start date
          </label>
          <div style={{ position: "relative", marginTop: "6px" }}>
            <DatePicker
              selected={startDate}
              onChange={(d) => setStartDate(d)}
              dateFormat="dd/MM/yyyy"
              placeholderText="DD/MM/YYYY"
              ref={datePickerRef}
              style={{ width: "100%" }}
            />
            <img
              src={calendar}
              alt="calendar"
              onClick={() => datePickerRef.current.setFocus()}
              style={{
                position: "absolute",
                right: "10px",
                top: "8px",
                width: "18px",
                cursor: "pointer",
              }}
            />
          </div>

          {/* Time */}
          <label style={{ fontWeight: 500, marginTop: "14px", display: "block" }}>
            Preferred batch Time
          </label>
          <input
            type="time"
            ref={timeInputRef}
            value={time}
            onChange={(e) => setTime(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "6px" }}
          />

          {/* Messages */}
          {successMessage && (
            <p style={{ color: "green", marginTop: "10px" }}>
              {successMessage}
            </p>
          )}
          {errorMessage && (
            <p style={{ color: "red", marginTop: "10px" }}>
              {errorMessage}
            </p>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: "100%",
              marginTop: "16px",
              padding: "10px",
              background: "#0d6efd",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </div>
      </div>

      {/* animation */}
      <style>
        {`
          @keyframes scaleIn {
            from { opacity:0; transform:scale(0.95); }
            to { opacity:1; transform:scale(1); }
          }
        `}
      </style>
    </div>
  );
};

export default RequestBatch;
