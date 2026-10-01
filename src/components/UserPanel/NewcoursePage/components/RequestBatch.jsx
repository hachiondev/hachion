"use client";

import React, { useEffect, useState, useRef } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useCourseApiName } from "@/components/UserPanel/CoursePage/CourseApiNameContext";
import "./RequestBatch.css";
import { API_BASE_URL } from "@/lib/apiBase";

// Ported from the CRA app's
// src/Components/UserPanel/NewcoursePage/components/RequestBatch.jsx.
// useParams (react-router-dom) -> useParams (next/navigation) — same
// "read current route's dynamic segments" semantics either way.
const RequestBatch = ({ closeModal }) => {
  const [startDate, setStartDate] = useState("");
  const [time, setTime] = useState("");
  const [mode, setMode] = useState("");
  const [mobile, setMobile] = useState("");
  const [selectedTrainer, setSelectedTrainer] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingTrainers, setLoadingTrainers] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [trainers, setTrainers] = useState([]);
  const [trainersError, setTrainersError] = useState("");
  const datePickerRef = useRef(null);
  const timeInputRef = useRef(null);
  const formattedCourseName = useCourseApiName();
  const userData = JSON.parse(localStorage.getItem("loginuserData")) || {};
  const userName = userData.name || "";
  const userEmail = userData.email || "";

  const isFormValid = () => {
    return mode && startDate && time && selectedTrainer;
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  useEffect(() => {
    if (!userEmail) return;
    fetch(`${API_BASE_URL}/api/v1/user/myprofile?email=${userEmail}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.mobile) setMobile(data.mobile);
      })
      .catch(() => {});
  }, [userEmail]);

  useEffect(() => {
    const fetchTrainers = async () => {
      if (!formattedCourseName) return;
      setLoadingTrainers(true);
      setTrainersError("");
      try {
        const response = await fetch(`${API_BASE_URL}/trainernames/by-course?courseName=${encodeURIComponent(formattedCourseName)}`);
        if (!response.ok) {
          throw new Error("Failed to fetch trainers");
        }
        const data = await response.json();

        if (data && Array.isArray(data)) {
          setTrainers(data);
        } else if (data && Array.isArray(data.trainers)) {
          setTrainers(data.trainers);
        } else {
          setTrainers([]);
        }
      } catch (error) {
        console.error("Error fetching trainers:", error);
        setTrainersError("Failed to load trainers");
        setTrainers([]);
      } finally {
        setLoadingTrainers(false);
      }
    };
    fetchTrainers();
  }, [formattedCourseName]);

  const handleSubmit = async () => {
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
      trainerName: selectedTrainer,
      country: "India",
      courseName: formattedCourseName,
      userName,
    };
    try {
      const res = await fetch(`${API_BASE_URL}/requestbatch/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      setSuccessMessage("✅ Request submitted successfully!");
      const formattedDate = new Date(startDate).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
      const formattedTime = new Date(`1970-01-01T${time}`).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
      const successText = `Request batch details [${mode} / Date: ${formattedDate} / Time: ${formattedTime} / Trainer: ${selectedTrainer}] have been successfully submitted to the Hachion support team.`;
      setSuccessMessage(successText);
      setTimeout(closeModal, 10000);
    } catch {
      setErrorMessage("❌ Error submitting request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="requestBatchOverlay" onClick={closeModal}>
      <div className="requestBatchModal" onClick={(e) => e.stopPropagation()}>
        <div className="requestBatchHeader">
          Let us know your preferred start date
          <AiOutlineCloseCircle className="requestBatchCloseIcon" onClick={closeModal} />
        </div>

        <div className="requestBatchBody">
          <div className="requestBatchField">
            <label className="requestBatchLabel">
              Mode of Trainings <span className="required-star">*</span>
            </label>
            <select value={mode} onChange={(e) => setMode(e.target.value)} className="requestBatchSelect" required>
              <option value="">Select Mode</option>
              <option value="Live Class">Live Class</option>
              <option value="Live Demo">Live Demo</option>
              <option value="Crash Course">Crash Course(Fast Track)</option>
              <option value="Mentoring Mode">Mentoring Mode</option>
              <option value="Self-Paced">Self-Paced Learning</option>
              <option value="Corporate Training">Corporate Training</option>
            </select>
          </div>

          <div className="requestBatchField">
            <label className="requestBatchLabel">
              Preferred batch start date <span className="required-star">*</span>
            </label>
            <div className="requestBatchDateWrapper">
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="requestBatchDateInput" ref={datePickerRef} required />
            </div>
          </div>

          <div className="requestBatchField">
            <label className="requestBatchLabel">
              Preferred batch Time <span className="required-star">*</span>
            </label>
            <input type="time" ref={timeInputRef} value={time} onChange={(e) => setTime(e.target.value)} className="requestBatchTimeInput" required />
          </div>

          <div className="requestBatchField">
            <label className="requestBatchLabel">
              Trainer List <span className="required-star">*</span>
            </label>
            <select value={selectedTrainer} onChange={(e) => setSelectedTrainer(e.target.value)} className="requestBatchSelect" required disabled={loadingTrainers}>
              <option value="">Select Trainer</option>
              {loadingTrainers ? (
                <option value="" disabled>
                  Loading trainers...
                </option>
              ) : trainersError ? (
                <option value="" disabled>
                  Failed to load trainers
                </option>
              ) : trainers.length > 0 ? (
                trainers.map((trainer, index) => {
                  const trainerValue = typeof trainer === "string" ? trainer : trainer.trainerName || trainer.trainer_name || trainer.name;
                  return (
                    <option key={index} value={trainerValue}>
                      {trainerValue}
                    </option>
                  );
                })
              ) : (
                <option value="" disabled>
                  No trainers available for this course
                </option>
              )}
            </select>
            {loadingTrainers && <p className="requestBatchHint">Loading trainers...</p>}
          </div>

          {successMessage && <p className="requestBatchSuccess">{successMessage}</p>}
          {errorMessage && <p className="requestBatchError">{errorMessage}</p>}

          <button onClick={handleSubmit} disabled={loading || !isFormValid()} className={`requestBatchSubmitBtn ${!isFormValid() ? "disabled" : ""}`}>
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestBatch;
