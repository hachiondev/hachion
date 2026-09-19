import dayjs from "dayjs";

// Ported from CRA's JobsDisplay.jsx — the same field-mapping/posted-label
// logic, extracted into a plain function so both the client-side
// useApprovedJobs() hook and the server-side page.js metadata fetch (which
// can't use react-query hooks) can share it instead of duplicating it.
export function formatApprovedJobs(rawJobs) {
  return rawJobs.map((job, index) => {
    const postedDate = job.date ? dayjs(job.date) : dayjs();
    const today = dayjs();
    const daysAgo = today.diff(postedDate, "day");
    let postedLabel = "";
    if (daysAgo <= 30) {
      postedLabel = daysAgo === 0 ? "Today" : `${daysAgo} day${daysAgo > 1 ? "s" : ""} ago`;
    } else {
      postedLabel = "30+ days ago";
    }
    return {
      id: job.hireFromUsId || index,
      jobTitle: job.jobTitle,
      companyName: job.company || "Unknown",
      image: job.companyLogo ? `https://api.hachion.co/hire-from-us/${job.companyLogo}` : null,
      exp: job.experience,
      location: job.location,
      time: job.employmentType,
      type: job.jobType,
      post: postedLabel,
      datePosted: job.date || null,
      vacancy: job.vacancies,
      salary: job.salary || "Not Disclosed",
      noticePeriod: job.noticePeriod || "Not Mentioned",
      workDays: job.workDays || "Not Mentioned",
      description: job.description,
      qualification: job.qualification,
      jobId: job.jobId,
    };
  });
}

export async function getApprovedJobs() {
  const res = await fetch(`https://api.hachion.co/hire-from-us/getApprovedJobs`);
  if (!res.ok) throw new Error("Failed to fetch approved jobs");
  const data = await res.json();
  return Array.isArray(data) ? formatApprovedJobs(data) : [];
}
