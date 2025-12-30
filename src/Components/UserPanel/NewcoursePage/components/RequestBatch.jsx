import React, { useEffect, useState, useRef } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import './RequestBatch.css';

const RequestBatch = ({ closeModal }) => {
  const { courseName } = useParams();
  const queryClient = useQueryClient();

  const [startDate, setStartDate] = useState("");
  const [time, setTime] = useState("");
  const [mode, setMode] = useState("");
  const [mobile, setMobile] = useState("");
  const [selectedTrainer, setSelectedTrainer] = useState("");

  const datePickerRef = useRef(null);
  const timeInputRef = useRef(null);
  const today = new Date().toISOString().split('T')[0];

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
    return mode && startDate && time && mobile && selectedTrainer && userEmail;
  };

  /* 🔒 Prevent background scroll */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  /* 🔹 Fetch user profile to get mobile number */
  const { data: userProfile } = useQuery({
    queryKey: ['userProfile', userEmail],
    queryFn: async () => {
      if (!userEmail) return null;
      const res = await fetch(
        `https://api.test.hachion.co/api/v1/user/myprofile?email=${userEmail}`
      );
      return res.json();
    },
    enabled: !!userEmail,
  });

  
  /* 🔹 Fetch trainers for the course */
  const { 
    data: trainers = [], 
    isLoading: loadingTrainers,
    isError: trainersError 
  } = useQuery({
    queryKey: ['trainers', formattedCourseName],
    queryFn: async () => {
      if (!formattedCourseName) return [];
      const res = await fetch(
        `https://api.test.hachion.co/api/v1/trainers/${encodeURIComponent(formattedCourseName)}`
      );
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
    enabled: !!formattedCourseName,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  /* 🔹 Mutation for submitting the request */
  const submitRequestMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await fetch(
        "https://api.test.hachion.co/requestbatch/add",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      
      if (!res.ok) {
        throw new Error('Failed to submit request');
      }
      
      return res.json();
    },
    onSuccess: () => {
      // Invalidate relevant queries if needed
      queryClient.invalidateQueries(['userRequests']);
      
      // Show success message and close modal
      setTimeout(closeModal, 2500);
    },
    onError: (error) => {
      console.error('Submission error:', error);
    },
  });

  // Update mobile when userProfile is loaded
  useEffect(() => {
    if (userProfile?.mobile && !mobile) {
      setMobile(userProfile.mobile);
    }
  }, [userProfile, mobile]);

  const handleSubmit = async () => {
    // Double-check validation before submission
    if (!isFormValid()) {
      submitRequestMutation.reset(); // Clear any previous errors
      return;
    }

    const payload = {
      schedule_date: startDate,
      time_zone: time,
      email: userEmail,
      mobile,
      mode,
      selected_trainer: selectedTrainer,
      country: "India",
      courseName: formattedCourseName,
      userName,
    };

    submitRequestMutation.mutate(payload);
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
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="requestBatchDateInput"
                ref={datePickerRef}
                min={today} 
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

          <div className="requestBatchField">
            <label className="requestBatchLabel">
              Trainer List <span className="required-star">*</span>
            </label>
            <select
              value={selectedTrainer}
              onChange={(e) => setSelectedTrainer(e.target.value)}
              className="requestBatchSelect"
              required
              disabled={loadingTrainers}
            >
              <option value="">Select Trainer</option>
              {loadingTrainers ? (
                <option value="" disabled>Loading trainers...</option>
              ) : trainersError ? (
                <option value="" disabled>Failed to load trainers</option>
              ) : trainers.length > 0 ? (
                trainers.map((trainer) => (
                  <option key={trainer.id || trainer.trainer_id} value={trainer.trainer_name}>
                    {trainer.trainer_name}
                  </option>
                ))
              ) : (
                <option value="" disabled>No trainers available for this course</option>
              )}
            </select>
            {loadingTrainers && (
              <p className="requestBatchHint">Loading trainers...</p>
            )}
          </div>

          {/* Display success/error messages from mutation */}
          {submitRequestMutation.isSuccess && (
            <p className="requestBatchSuccess">✅ Request submitted successfully!</p>
          )}
          
          {submitRequestMutation.isError && (
            <p className="requestBatchError">❌ Error submitting request. Please try again.</p>
          )}
          
          {!isFormValid() && submitRequestMutation.isError && (
            <p className="requestBatchError">❌ Please fill all required fields</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={submitRequestMutation.isPending || !isFormValid() || loadingTrainers}
            className={`requestBatchSubmitBtn ${!isFormValid() || loadingTrainers ? 'disabled' : ''}`}
          >
            {submitRequestMutation.isPending ? "Submitting..." : "Submit Request"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestBatch;