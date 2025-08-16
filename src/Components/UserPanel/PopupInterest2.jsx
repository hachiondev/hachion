import React from "react";

const PopupInterest2 = ({ formData, onChange, onNext, onBack }) => {
  const handleCheckboxGroup = (field, value) => {
    let updated = [...(formData[field] || [])];
    if (updated.includes(value)) {
      updated = updated.filter((item) => item !== value);
    } else {
      updated.push(value);
    }
    onChange(field, updated);
  };

  return (
    <div className="have-modal-overlay">
      <div className="interest-modal-content">
        <div className="popup-interest">
            <div className="pathfinder-header">
      <p>Learning Preferences</p>
</div>
        <form className="pathfinder-form">
      <div className="mb-3">
        <label htmlFor="pathfinder" className="Pathfinder-label">
            Q4. How do you prefer to learn?</label>
        {[
          "Live classes with instructor",
          "Self-paced videos",
          "One-on-one mentoring",
          "Hands-on projects",
          "Group-based learning",
          "Reading + exercises",
          "Any of the above",
        ].map((option) => (
          <div className="form-check" key={option}>
            <input
              className="form-check-input"
              type="checkbox"
              checked={formData.learningMethods?.includes(option)}
              onChange={() => handleCheckboxGroup("learningMethods", option)}
            />
            <label className="form-check-label">{option}</label>
          </div>
        ))}
      </div>

      {/* Q5 */}
      <div className="mb-3">
        <label htmlFor="pathfinder" className="Pathfinder-label">
            Q5. What is your preferred training mode?</label>
        <select
          className="form-control-pathfinder"
        id="pathfinder"
          value={formData.trainingMode || ""}
          onChange={(e) => onChange("trainingMode", e.target.value)}
        >
          <option value="">-- Select --</option>
          <option value="Live Training">Live Training</option>
          <option value="Mentoring Mode">Mentoring Mode</option>
          <option value="Self Placed">Self Placed</option>
          <option value="Corporate Training">Corporate Training (if company-sponsored)</option>
        </select>
      </div>

      {/* Q6 */}
      <div className="mb-3">
        <label htmlFor="pathfinder" className="Pathfinder-label">
            Q6. What is your current skill level in your selected domain(s)?</label>
        <select
          className="form-control-pathfinder"
        id="pathfinder"
          value={formData.skillLevel || ""}
          onChange={(e) => onChange("skillLevel", e.target.value)}
        >
          <option value="">-- Select --</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      <div class="form-group row">
        <div class="col-auto">
        <button class="path-button" type="button" onClick={onBack}>Preview</button>
        </div>
        <div class="col-auto">
        <button class="path-button" type="button" onClick={onNext}>Next</button>
      </div>
      </div>
      </form>
      </div>
    </div>
    </div>
  );
};

export default PopupInterest2;
