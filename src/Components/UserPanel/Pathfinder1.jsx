import React, { useEffect, useState} from "react";
import Select from "react-select";
import axios from "axios";

const Pathfinder1 = ({ formData, onChange, onNext, onEdit }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [courses, setCourses] = useState([]);
  
  const [isEditing, setIsEditing] = useState(false);
    useEffect(() => {
        axios
          .get("http://localhost:8081/courses/all")
          .then((res) => {
            setCourses(res.data);
          })
          .catch((err) => {
            console.error("Error fetching courses:", err);
            setErrorMessage("Failed to load courses. Please try again.");
          });
      }, []);
    
      const courseOptions = courses.map((course) => ({
        value: course.courseName,
        label: course.courseName,
      }));
    
      const handleCourseChange = (selectedOptions) => {
    const selectedValues = selectedOptions
      ? selectedOptions.map((opt) => opt.value)
      : [];
      
    onChange("selectedCourses", selectedValues);
  };
const handleEditClick = () => {
    setIsEditing((prev) => !prev);
    if (typeof onEdit === "function") {
      onEdit();
    }
  };

  const isFormFilled =
    formData.role &&
    formData.goal &&
    (formData.selectedCourses || []).length > 0 &&
    (formData.role !== "Other" || formData.otherRole.trim() !== "");

  return (
    <div className="resume-div">
        <div className="popup-interest">
            <div className="pathfinder-header">
      <p>Basic Background & Goals</p>
      </div>
        <form className="pathfinder-form">
      <div className="mb-3">
        <label htmlFor="pathfinder" className="Pathfinder-label">
            1. What is your current role or background?</label>
        <select
          className="form-control-pathfinder"
        id="pathfinder"
          value={formData.role}
          onChange={(e) => onChange("role", e.target.value)}
          
        >
          <option value="">-- Select your role --</option>
          <option value="School Student">School Student</option>
          <option value="College Student">College Student</option>
          <option value="Working Professional">Working Professional</option>
          <option value="Career Switcher">Career Switcher</option>
          <option value="Job Seeker">Job Seeker</option>
          <option value="Other">Other</option>
        </select>

        {formData.role === "Other" && (
          <input
            type="text"
            className="form-control-pathfinder"
            id="pathfinder"
            placeholder="Please specify"
            value={formData.otherRole}
            onChange={(e) => onChange("otherRole", e.target.value)}
            
          />
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="pathfinder" className="Pathfinder-label">2. What is your primary goal for joining Hachion?</label>
        <select
          className="form-control-pathfinder"
            id="pathfinder"
          value={formData.goal}
          onChange={(e) => onChange("goal", e.target.value)}
          
        >
          <option value="">-- Select your goal --</option>
          <option value="Get a job in tech">Get a job in tech</option>
          <option value="Switch career domain">Switch career domain</option>
          <option value="Learn new skills for current job">Learn new skills for current job</option>
          <option value="Work on freelance/side projects">Work on freelance/side projects</option>
          <option value="Just exploring options">Just exploring options</option>
        </select>
      </div>
      <div className="mb-3">
                    <label htmlFor="pathfinder" className="Pathfinder-label">
                      3. What are your areas of interest? (Select all that apply)
                    </label>
                    <Select
                      className="form-control-pathfinder"
                      id="pathfinder1"
                      options={courseOptions}
                      isMulti
                      value={(formData.selectedCourses || []).map((course) => ({
    value: course,
    label: course,
  }))}
  onChange={handleCourseChange}
  placeholder="Search or select courses..."
                  />
                    <div
                      className="border rounded p-2 mt-2"
                      style={{ maxHeight: "150px", overflowY: "auto" }}
                    >
                      {(formData.selectedCourses || []).map((courseName, index) => (
                        <div className="form-check" key={index}>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked
                            
                          />
                          <label className="form-check-label">{courseName}</label>
                        </div>
                      ))}
                    </div>
                  </div>

        <div class="form-group row">
        <div class="col-auto">
        <button class="edit-path-button" type="button" onClick={handleEditClick}>{isEditing ? "Cancel" : "Edit"}</button>
        </div>
        <div class="col-auto">
        <button class="path-button" type="button" onClick={onNext} disabled={!isFormFilled}>Next</button>
      </div>
      </div>
      </form>
      </div>
    </div>
  );
};


export default Pathfinder1;
