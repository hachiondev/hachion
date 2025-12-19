import React from "react";

const PopupInterest4 = ({ formData, onChange, onNext, onBack, onSubmit }) => {
  return (
     <div className="have-modal-overlay">
      <div className="interest-modal-content">
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
          value={formData.speakToCourseAdvisor || ""}
          onChange={(e) => onChange("speakToCourseAdvisor", e.target.value)}
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
          value={formData.whereYouHeard || ""}
          onChange={(e) => onChange("whereYouHeard", e.target.value)}
        >
          <option value="">-- Select --</option>
          <option value="Google">Google</option>
          <option value="Instagram / Facebook">Instagram / Facebook</option>
          <option value="LinkedIn">LinkedIn</option>
          <option value="Referral">Referral</option>
          <option value="Email">Email</option>
          <option value="Other">Other</option>
        </select>

        {formData.whereYouHeard === "Other" && (
          <input
            type="text"
            className="form-control-pathfinder mt-2"
            placeholder="Please specify"
            value={formData.whereYouHeardOther || ""}
            onChange={(e) => onChange("whereYouHeardOther", e.target.value)}
          />
        )}
      </div>

      <div class="form-group row">
        <div class="col-auto">
        <button class="path-button" type="button" onClick={onBack}>Preview</button>
        </div>
        <div class="col-auto">
        <button class="path-button" type="button" onClick={onSubmit}>Submit</button>
      </div>
    </div>
    </form>
    </div>
    </div>
    </div>
  );
};

export default PopupInterest4;
