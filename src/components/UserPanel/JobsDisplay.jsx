"use client";

import "./Blogs.css";
import JobCard from "./JobCard";
import { useApprovedJobs } from "@/Api/hooks/CareerApi/useApprovedJobs";

const EMPTY_ARRAY = [];

const JobsDisplay = ({ filters }) => {
  const { jobTitle, jobType, experience, location } = filters;
  const { data: jobCards = EMPTY_ARRAY } = useApprovedJobs();

  const filteredJobs = jobCards.filter((job) => {
    const matchTitle = jobTitle ? job.jobTitle.toLowerCase().includes(jobTitle.toLowerCase()) : true;
    const matchType = jobType ? job.type.toLowerCase() === jobType.toLowerCase() : true;
    const matchExperience = experience ? job.exp === experience : true;
    const matchLocation = location ? job.location.toLowerCase() === location.toLowerCase() : true;
    return matchTitle && matchType && matchExperience && matchLocation;
  });

  return (
    <div>
      <div className="job-part">
        {filteredJobs.length ? (
          filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              jobTitle={job.jobTitle}
              companyName={job.companyName}
              image={job.image}
              exp={job.exp}
              location={job.location}
              time={job.time}
              type={job.type}
              post={job.post}
              vacancy={job.vacancy}
            />
          ))
        ) : (
          <p>No jobs match the selected filters.</p>
        )}
      </div>
    </div>
  );
};

export default JobsDisplay;
