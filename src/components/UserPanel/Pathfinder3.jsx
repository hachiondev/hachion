"use client";

import "./PopupInterest.css";

// Ported from the CRA app's src/Components/UserPanel/Pathfinder3.jsx.
const Pathfinder3 = ({ formData, onChange, onNext, onBack }) => {
  return (
    <div className="resume-div">
      <div className="popup-interest">
        <div className="pathfinder-header">
          <p>Personalized Recommendations</p>
        </div>
        <form className="pathfinder-form">
          <div className="mb-3">
            <label htmlFor="pathfinderJob" className="Pathfinder-label">
              Q7. Are you looking for a job/internship after the course?
            </label>
            <select
              className="form-control-pathfinder"
              id="pathfinderJob"
              value={formData.careerGoal || ""}
              onChange={(e) => onChange("careerGoal", e.target.value)}
            >
              <option value="">-- Select --</option>
              <option value="Yes, job">Yes, job</option>
              <option value="Yes, internship">Yes, internship</option>
              <option value="No, just learning">No, just learning</option>
              <option value="Not sure yet">Not sure yet</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="pathfinderProjects" className="Pathfinder-label">
              Q8. Do you want to work on real-time projects during the course?
            </label>
            <select
              className="form-control-pathfinder"
              id="pathfinderProjects"
              value={formData.realTimeProjects || ""}
              onChange={(e) => onChange("realTimeProjects", e.target.value)}
            >
              <option value="">-- Select --</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
              <option value="Maybe">Maybe</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="pathfinderCertification" className="Pathfinder-label">
              Q9. Do you prefer certification or placement assistance?
            </label>
            <select
              className="form-control-pathfinder"
              id="pathfinderCertification"
              value={formData.certOrPlacement || ""}
              onChange={(e) => onChange("certOrPlacement", e.target.value)}
            >
              <option value="">-- Select --</option>
              <option value="Certification only">Certification only</option>
              <option value="Placement assistance only">Placement assistance only</option>
              <option value="Both">Both</option>
              <option value="Not required">Not required</option>
            </select>
          </div>

          <div className="form-group row">
            <div className="col-auto">
              <button className="path-button" type="button" onClick={onBack}>
                Preview
              </button>
            </div>
            <div className="col-auto">
              <button className="path-button" type="button" onClick={onNext}>
                Next
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Pathfinder3;
