import "./Blogs.css";
import JobDetailsCard from "./JobDetailsCard";
import HachionLogo from "@/assets/HachionLogo.webp";

// CRA's version read this data from react-router's useLocation().state,
// handed off by JobCard.jsx's navigate(path, {state}) call. There's no App
// Router equivalent for a fresh page load reached by URL/refresh/direct
// link, so the resolved job object is passed down as a prop from
// JobDetails.jsx (which fetches the full approved-jobs list and matches by
// slug — see src/lib/jobSlug.js) instead.
const ApplyDetails = ({ job }) => {
  if (!job) {
    return <p>Job details not available. Please go back and select a job.</p>;
  }

  const {
    jobTitle,
    companyName,
    image = HachionLogo.src,
    exp,
    location,
    time,
    type,
    post,
    workDays = "Mon-Fri",
    vacancy,
    salary = "Not disclosed",
    noticePeriod = "N/A",
    description = "No description provided.",
    qualification = "No qualifications specified.",
  } = job;

  return (
    <div className="Details-part">
      <JobDetailsCard
        jobTitle={jobTitle}
        companyName={companyName}
        image={image}
        exp={exp}
        location={location}
        time={time}
        type={type}
        post={post}
        workDays={workDays}
        vacancy={vacancy}
        salary={salary}
        noticePeriod={noticePeriod}
        description={description}
        qualification={qualification}
      />
    </div>
  );
};

export default ApplyDetails;
