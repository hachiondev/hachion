import { buildCanonicalUrl } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/breadcrumbSchema";
import JsonLd from "@/components/common/JsonLd";
import JobDetails from "@/components/UserPanel/JobDetails";
import { getApprovedJobs } from "@/components/UserPanel/services/careerService";
import { slugifyJobTitle } from "@/lib/jobSlug";

// Server-side fetch (plain fetch via the shared careerService, not the
// client-side useApprovedJobs() hook the JobDetails.jsx component uses on
// its own) — same /hire-from-us/getApprovedJobs endpoint; there's no
// dedicated "get job by slug" endpoint, so this fetches the full list and
// re-derives the slug the same way the client component does.
async function fetchJobForMetadata(jobSlug) {
  try {
    const jobs = await getApprovedJobs();
    return jobs.find((j) => slugifyJobTitle(j.jobTitle) === jobSlug) || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { jobSlug } = await params;
  const job = await fetchJobForMetadata(jobSlug);
  const canonicalUrl = buildCanonicalUrl(`/career/apply/${jobSlug}`);

  const title = job ? `${job.jobTitle} at ${job.companyName} | Hachion Careers` : "Job Details | Hachion Careers";
  const description = job ? `Apply for ${job.jobTitle} at ${job.companyName} — ${job.location || "multiple locations"}.` : "View job details and apply on Hachion Careers.";

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    robots: { index: Boolean(job), follow: true },
    openGraph: { title, description, url: canonicalUrl },
  };
}

export default async function JobDetailsPage({ params }) {
  const { jobSlug } = await params;
  const job = await fetchJobForMetadata(jobSlug);
  const canonicalUrl = buildCanonicalUrl(`/career/apply/${jobSlug}`);

  const schemas = [
    buildBreadcrumbSchema([
      { name: "Career", path: "/career" },
      { name: job?.jobTitle || "Job Details", path: `/career/apply/${jobSlug}` },
    ]),
  ];

  if (job) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "JobPosting",
      "@id": `${canonicalUrl}#jobposting`,
      title: job.jobTitle,
      description: job.description || `${job.jobTitle} at ${job.companyName}`,
      datePosted: job.datePosted || undefined,
      employmentType: job.time,
      hiringOrganization: { "@type": "Organization", name: job.companyName },
      jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: job.location } },
    });
  }

  return (
    <>
      <JsonLd data={schemas} />
      <JobDetails />
    </>
  );
}
