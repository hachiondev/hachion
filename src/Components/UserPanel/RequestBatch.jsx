import React, { useEffect, useState, useRef } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import calendar from "../../Assets/calendar.webp";
import { useParams } from "react-router-dom";
import './RequestBatch.css'

const RequestBatch = ({ closeModal }) => {
  const { courseName } = useParams();

  const [startDate, setStartDate] = useState("");
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

  // Check if all required fields are filled
  const isFormValid = () => {
    return mode && startDate && time && mobile && userEmail;
  };

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
    // Double-check validation before submission
    if (!isFormValid()) {
      setErrorMessage("❌ Please fill all required fields");
      return;
    }

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
    <div className="requestBatchOverlay" onClick={closeModal}>
      <div
        className="requestBatchModal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="requestBatchHeader">
          Let us know your preferred start date
          <AiOutlineCloseCircle
            className="requestBatchCloseIcon"
            onClick={closeModal}
          />
        </div>

        {/* Body */}
        <div className="requestBatchBody">
          <div className="requestBatchField">
            <label className="requestBatchLabel">
              Mode of Trainings <span className="required-star">*</span>
            </label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="requestBatchSelect"
              required
            >
              <option value="">Select Mode</option>
              <option value="Live Class">Live Class</option>
              <option value="Live Demo">Live Demo</option>
              <option value="Crash Course">Crash Course</option>
              <option value="Self-Paced">Self-Paced</option>
              <option value="Corporate Training">Corporate Training</option>
            </select>
          </div>

          <div className="requestBatchField">
            <label className="requestBatchLabel">
              Preferred batch start date <span className="required-star">*</span>
            </label>
            <div className="requestBatchDateWrapper">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="requestBatchDateInput"
                ref={datePickerRef}
                required
              />
            </div>
          </div>

          <div className="requestBatchField">
            <label className="requestBatchLabel">
              Preferred batch Time <span className="required-star">*</span>
            </label>
            <input
              type="time"
              ref={timeInputRef}
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="requestBatchTimeInput"
              required
            />
          </div>

          {successMessage && (
            <p className="requestBatchSuccess">{successMessage}</p>
          )}
          {errorMessage && (
            <p className="requestBatchError">{errorMessage}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || !isFormValid()}
            className={`requestBatchSubmitBtn ${!isFormValid() ? 'disabled' : ''}`}
          >
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestBatch;