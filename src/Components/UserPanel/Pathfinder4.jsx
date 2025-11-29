
import axios from "axios";
import React, { useState, useEffect } from "react";

const Pathfinder4 = ({ formData, onChange, onNext, onBack, onSubmit }) => {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");

  useEffect(() => {
    const storedUserRaw = localStorage.getItem("loginuserData");
    if (!storedUserRaw) return;

    const storedUser = JSON.parse(storedUserRaw);
    const email = storedUser.email;
    if (!email) return;

    setStudentEmail(email);

    axios
      .get("https://api.hachion.co/api/v1/user/myprofile", {
        params: { email },
      })
      .then((resp) => {
        const data = resp.data || {};
        if (data.studentId) setStudentId(data.studentId);
        if (data.name) setStudentName(data.name);
      })
      .catch((err) => {
        console.error("Failed to load profile for popup onboarding:", err);
      });
  }, []);

  const handleUpdate = async () => {
    setSuccessMessage("");
    setErrorMessage("");

    const emailToUse = formData.studentEmail || studentEmail;
    if (!emailToUse) {
      setErrorMessage("User email not found.");
      return;
    }

    const payload = {
      studentId: studentId || formData.studentId || "",
      studentName: studentName || "",
      studentEmail: emailToUse,
      currentRole: formData.role,
      primaryGoal: formData.goal,
      areasOfInterest: (formData.selectedCourses || []).join(", "),
      preferToLearn: formData.preferToLearn,
      preferredTrainingMode: formData.trainingMode,
      currentSkill: formData.skillLevel,
      lookingForJob: formData.careerGoal,
      realTimeProjects: formData.realTimeProjects,
      certificationOrPlacement: formData.certOrPlacement,
      speakToCourseAdvisor: formData.advisorCall,
      whereYouHeard: formData.heardFrom,
      additionalInfo: formData.additionalInfo,
    };

    try {
      await axios.put(
        "https://api.hachion.co/popup-onboarding/update-by-email",
        payload
      );
      setSuccessMessage("Your details have been updated successfully!");
      setErrorMessage("");
    } catch (err) {
      console.error("Error updating onboarding data:", err);
      setErrorMessage(
        err.response?.data || "Failed to update details. Please try again."
      );
    }
  };

  return (
     <div className="resume-div">
        <div className="popup-interest">
            <div className="pathfinder-header">
      <p>Follow-Up & Communication</p>
      </div>
        <form className="pathfinder-form">
      <div className="mb-3">
        <label htmlFor="pathfinder" className="Pathfinder-label">
            Q10. Would you like to speak to a course advisor?</label>
        <select
          className="form-control-pathfinder"
        id="pathfinder"
          value={formData.advisorCall || ""}
          onChange={(e) => onChange("advisorCall", e.target.value)}
        >
          <option value="">-- Select --</option>
          <option value="Yes, please schedule a call">Yes, please schedule a call</option>
          <option value="No, I'll decide on my own">No, I'll decide on my own</option>
          <option value="Maybe later">Maybe later</option>
        </select>
      </div>

      {/* Q11 */}
      <div className="mb-3">
        <label htmlFor="pathfinder" className="Pathfinder-label">Q11. How did you hear about Hachion?</label>
        <select
          className="form-control-pathfinder"
        id="pathfinder"
          value={formData.heardFrom || ""}
          onChange={(e) => onChange("heardFrom", e.target.value)}
        >
          <option value="">-- Select --</option>
          <option value="Google">Google</option>
          <option value="Instagram / Facebook">Instagram / Facebook</option>
          <option value="LinkedIn">LinkedIn</option>
          <option value="Referral">Referral</option>
          <option value="Email">Email</option>
          <option value="Other">Other</option>
        </select>

        {formData.heardFrom === "Other" && (
          <input
            type="text"
            className="form-control-pathfinder mt-2"
            placeholder="Please specify"
            value={formData.heardFromOther || ""}
            onChange={(e) => onChange("heardFromOther", e.target.value)}
          />
        )}
      </div>

      <div class="form-group row">
        <div class="col-auto">
        <button class="path-button" type="button" onClick={onBack}>Preview</button>
        </div>
        <div class="col-auto">
        <button class="path-button" type="button" onClick={handleUpdate}>Submit</button>
      </div>
    </div>
     {/* Success / Error Messages */}
          {successMessage && (
            <p style={{ color: "green", marginTop: "10px" }}>{successMessage}</p>
          )}
          {errorMessage && (
            <p style={{ color: "red", marginTop: "10px" }}>{errorMessage}</p>
          )}
    </form>
    </div>
    </div>
  );
};

export default Pathfinder4;
