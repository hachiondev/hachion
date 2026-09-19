import { buildCanonicalUrl, SITE_ORIGIN } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/breadcrumbSchema";
import JsonLd from "@/components/common/JsonLd";
import WorkshopDetails from "@/components/UserPanel/WorkshopDetails";
import { slugifyWorkshopTitle } from "@/lib/workshopSlug";

// Server-side fetch (plain fetch, not the client-side useWorkshops() hook the
// WorkshopDetails.jsx component uses on its own) — same /workshopschedule
// endpoint; there's no dedicated "get workshop by slug" endpoint (workshops
// have no backend slug field), so this fetches the full list and re-derives
// the slug the same way the client component does, matching CRA's own
// find-by-slug approach.
async function fetchWorkshopForMetadata(slug) {
  try {
    const res = await fetch(`https://api.hachion.co/workshopschedule`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data)) return null;
    return data.find((w) => slugifyWorkshopTitle(w.title) === slug) || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const workshop = await fetchWorkshopForMetadata(slug);
  const canonicalUrl = buildCanonicalUrl(`/workshop/${slug}`);

  const title = workshop?.meta_title || "Hachion Workshop";
  const description = workshop?.meta_description || "Workshop description";

  return {
    title,
    description,
    ...(workshop?.meta_keyword ? { keywords: workshop.meta_keyword } : {}),
    alternates: { canonical: canonicalUrl },
    robots: { index: Boolean(workshop), follow: true },
    openGraph: {
      title: workshop?.meta_title || "Best Online IT Workshop Courses",
      description: workshop?.meta_description || "Transform your career with Hachion's Online IT Courses.",
      url: canonicalUrl,
    },
  };
}

export default async function WorkshopDetailsPage({ params }) {
  const { slug } = await params;
  const workshop = await fetchWorkshopForMetadata(slug);
  const canonicalUrl = buildCanonicalUrl(`/workshop/${slug}`);

  const schemas = [
    buildBreadcrumbSchema([
      { name: "Workshop", path: "/workshop" },
      { name: workshop?.title || "Workshop Details", path: `/workshop/${slug}` },
    ]),
  ];

  // CRA's WorkshopDetails.jsx had no structured data at all despite this
  // being a dated/timed event — a genuine SEO improvement, not present in
  // the CRA source, using fields (date/time/time_zone) already returned by
  // this same endpoint.
  if (workshop?.date) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Event",
      "@id": `${canonicalUrl}#event`,
      name: workshop.title,
      startDate: workshop.date,
      eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      location: { "@type": "VirtualLocation", url: canonicalUrl },
      description: workshop?.meta_description || `Join ${workshop.title}, a live online workshop by Hachion.`,
      organizer: { "@type": "EducationalOrganization", "@id": `${SITE_ORIGIN}/#organization`, name: "Hachion", url: SITE_ORIGIN },
    });
  }

  return (
    <>
      <JsonLd data={schemas} />
      <WorkshopDetails />
    </>
  );
}
