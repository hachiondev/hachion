"use client";

import "./PopupInterest.css";

// Ported from the CRA app's src/Components/UserPanel/PopupInterest4.jsx
// (onboarding survey step 4 of 4, final submit).
const PopupInterest4 = ({ formData, onChange, onBack, onSubmit }) => {
  return (
    <div className="have-modal-overlay">
      <div className="interest-modal-content">
        <div className="popup-interest">
          <div className="pathfinder-header">
            <p>Follow-Up &amp; Communication</p>
          </div>
          <form className="pathfinder-form">
            <div className="mb-3">
              <label htmlFor="pathfinderAdvisor" className="Pathfinder-label">
                Q10. Would you like to speak to a course advisor?
              </label>
              <select
                className="form-control-pathfinder"
                id="pathfinderAdvisor"
                value={formData.speakToCourseAdvisor || ""}
                onChange={(e) => onChange("speakToCourseAdvisor", e.target.value)}
              >
                <option value="">-- Select --</option>
                <option value="Yes, please schedule a call">Yes, please schedule a call</option>
                <option value="No, I'll decide on my own">No, I&apos;ll decide on my own</option>
                <option value="Maybe later">Maybe later</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="pathfinderHeard" className="Pathfinder-label">
                Q11. How did you hear about Hachion?
              </label>
              <select
                className="form-control-pathfinder"
                id="pathfinderHeard"
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

            <div className="form-group row">
              <div className="col-auto">
                <button className="path-button" type="button" onClick={onBack}>
                  Preview
                </button>
              </div>
              <div className="col-auto">
                <button className="path-button" type="button" onClick={onSubmit}>
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PopupInterest4;
