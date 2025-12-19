import React from "react";

const PopupInterest3 = ({ formData, onChange, onNext, onBack }) => {

  return (
    <div className="have-modal-overlay">
      <div className="interest-modal-content">
        <div className="popup-interest">
            <div className="pathfinder-header">
      <p>Personalized Recommendations</p>
      </div>
        <form className="pathfinder-form">
      <div className="mb-3">
        <label htmlFor="pathfinder" className="Pathfinder-label">
            Q7. Are you looking for a job/internship after the course?</label>
        <select
          className="form-control-pathfinder"
        id="pathfinder"
          value={formData.lookingForJob || ""}
          onChange={(e) => onChange("lookingForJob", e.target.value)}
        >
          <option value="">-- Select --</option>
          <option value="Yes, job">Yes, job</option>
          <option value="Yes, internship">Yes, internship</option>
          <option value="No, just learning">No, just learning</option>
          <option value="Not sure yet">Not sure yet</option>
        </select>
      </div>

      {/* Q8 */}
      <div className="mb-3">
        <label htmlFor="pathfinder" className="Pathfinder-label">Q8. Do you want to work on real-time projects during the course?</label>
        <select
          className="form-control-pathfinder"
        id="pathfinder"
          value={formData.realTimeProjects || ""}
          onChange={(e) => onChange("realTimeProjects", e.target.value)}
        >
          <option value="">-- Select --</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
          <option value="Maybe">Maybe</option>
        </select>
      </div>

      {/* Q9 */}
      <div className="mb-3">
        <label htmlFor="pathfinder" className="Pathfinder-label">Q9. Do you prefer certification or placement assistance?</label>
        <select
          className="form-control-pathfinder"
        id="pathfinder"
          value={formData.certificationOrPlacement || ""}
          onChange={(e) => onChange("certificationOrPlacement", e.target.value)}
        >
          <option value="">-- Select --</option>
          <option value="Certification only">Certification only</option>
          <option value="Placement assistance only">Placement assistance only</option>
          <option value="Both">Both</option>
          <option value="Not required">Not required</option>
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

export default PopupInterest3;
