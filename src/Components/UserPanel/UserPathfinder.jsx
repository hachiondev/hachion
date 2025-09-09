import React, { useState, useEffect } from "react";
import Pathfinder1 from "./Pathfinder1";
import Pathfinder2 from "./Pathfinder2";
import Pathfinder3 from "./Pathfinder3";
import Pathfinder4 from "./Pathfinder4";
import axios from "axios";

const UserPathfinder = () => {
  const [step, setStep] = useState(1);

   const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    role: "",
    otherRole: "",
    goal: "",
    selectedCourses: [],
    additionalInfo: "",
    preferences: "",
    preferToLearn: [],
    trainingMode: "",
    skillLevel: "",
    careerGoal: "",
    realTimeProjects: "",
    certOrPlacement: "",
    advisorCall: "",
    heardFrom: ""

  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("loginuserData")) || {};
    const userEmail = userData.email || "";

    if (userEmail) {
      setFormData((prev) => ({
        ...prev,
        studentEmail: userEmail,
      }));
    }
  }, []);

  
  useEffect(() => {
    if (formData.studentEmail) {
      setLoading(true);
      axios
        .get(`https://api.hachion.co/popup-onboarding/get-by-email/${formData.studentEmail}`)
        .then((res) => {
          const data = res.data;
          setFormData((prev) => ({
            ...prev,
            role: data.currentRole || "",
            otherRole: data.otherRole || "",
            goal: data.primaryGoal || "",
            selectedCourses: data.areasOfInterest
              ? data.areasOfInterest.split(",")
              : [],
            additionalInfo: data.additionalInfo || "",
            preferences: data.preferToLearn || "",
              preferToLearn: Array.isArray(data.preferToLearn) ? data.preferToLearn : [],
          trainingMode: data.preferredTrainingMode || "", 
          skillLevel: data.currentSkill || "",
          careerGoal: data.lookingForJob || "",
realTimeProjects: data.realTimeProjects || "",
certOrPlacement: data.certificationOrPlacement || "",
advisorCall: data.speakToCourseAdvisor || "",
    heardFrom: data.whereYouHeard || ""
          }));
        })
        .catch((err) => {
          console.error("Error fetching onboarding data:", err);
          setErrorMessage("Failed to load details.");
        })
        .finally(() => setLoading(false));
    }
  }, [formData.studentEmail]);

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const handleEdit = () => {
  
};

  return (
    <div>
    <nav className='dashboard-nav'>
      Pathfinder
      </nav>

    <div>
      {step === 1 && (
        <Pathfinder1
          formData={formData}
          onChange={handleChange}
          onNext={handleNext}
          onEdit={handleEdit} 
          // onUpdate={handleUpdate}
        />
      )}
      {step === 2 && (
        <Pathfinder2
          formData={formData}
          onChange={handleChange}
          onNext={handleNext}
          onBack={handleBack}
          // onUpdate={handleUpdate}
        />
      )}
      {step === 3 && (
        <Pathfinder3
          formData={formData}
          onChange={handleChange}
          onNext={handleNext}
          onBack={handleBack}
          // onUpdate={handleUpdate}
        />
      )}
      {step === 4 && (
        <Pathfinder4
            formData={formData}
            onChange={handleChange}
            onNext={handleNext}
            onBack={handleBack}
            // onUpdate={handleUpdate}
        />
        )}
    </div>
    </div>
  );
};

export default UserPathfinder;
