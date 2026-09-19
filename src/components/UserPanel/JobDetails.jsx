"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import "./Blogs.css";
import ApplyDetails from "./ApplyDetails";
import ApplyForm from "./ApplyForm";
import jobdetails from "@/assets/apply.webp";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useApprovedJobs } from "@/Api/hooks/CareerApi/useApprovedJobs";
import { slugifyJobTitle } from "@/lib/jobSlug";

const EMPTY_ARRAY = [];

// CRA's JobDetails.jsx (and ApplyDetails.jsx/ApplyForm.jsx within it) relied
// entirely on react-router's navigate(path, {state}) handoff from JobCard.jsx
// — there was no fallback fetch-by-slug, so a direct page load or refresh
// broke it there too. Since there's no equivalent state handoff across a
// fresh Next.js page load, this fetches the full approved-jobs list (same
// endpoint the /career listing already uses, via the shared
// useApprovedJobs() hook) and matches by the same slug JobCard.jsx builds
// its link from — the same fetch-list-and-match-by-slug pattern already
// used for Blog/Instructor/Workshop details pages in this migration.
const JobDetails = () => {
  const rawParams = useParams();
  const jobSlug = decodeURIComponent(rawParams.jobSlug || "");
  const { data: jobs = EMPTY_ARRAY, isLoading } = useApprovedJobs();

  const job = useMemo(() => jobs.find((j) => slugifyJobTitle(j.jobTitle) === jobSlug) || null, [jobs, jobSlug]);

  return (
    <div>
      <div className="home-background">
        <div className="blogs-header">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link href="/">Home</Link> <MdKeyboardArrowRight />{" "}
              </li>
              <li className="breadcrumb-item">
                <Link href="/career">Career</Link> <MdKeyboardArrowRight />{" "}
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Job Details
              </li>
            </ol>
          </nav>
        </div>
        <div>
          <img className="career-banner-img" src={jobdetails.src} alt="Apply Banner" fetchPriority="high" width="1440" height="420" />
          <div className="career-part">
            {isLoading ? <p>Loading job details...</p> : <ApplyDetails job={job} />}
            {!isLoading && job && <ApplyForm job={job} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
