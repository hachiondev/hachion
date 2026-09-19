import { buildCanonicalUrl, SITE_ORIGIN } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/breadcrumbSchema";
import JsonLd from "@/components/common/JsonLd";
import InstructorDetails from "@/components/UserPanel/InstructorsPage/InstructorDetails";

const slugifyName = (name = "") => name.trim().toLowerCase().replace(/\s+/g, "-");

// Server-side fetch (plain fetch, not the client-side useTrainerOptions()
// hook the InstructorDetails.jsx component uses on its own) — same
// /trainersnames-unique endpoint (one row per unique trainer, with real
// trainer_name/course_name/summary/trainerImage/trainerRating fields), just
// to resolve this trainer's profile for metadata. CRA's InstructorDetails.jsx
// had no <Helmet> beyond a generic title/description and no structured data
// at all; adding a Person schema here is a genuine SEO improvement, not
// present in the CRA source.
async function fetchTrainerForMetadata(trainerSlug) {
  try {
    const res = await fetch(`https://api.hachion.co/trainersnames-unique`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data)) return null;
    return data.find((t) => slugifyName(t.trainer_name) === trainerSlug.toLowerCase()) || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { trainerSlug } = await params;
  const trainer = await fetchTrainerForMetadata(trainerSlug);
  const canonicalUrl = buildCanonicalUrl(`/instructor-profiles/${trainerSlug}`);

  const title = trainer ? `${trainer.trainer_name} - Instructor Profile | Hachion` : "Instructor Profile | Hachion";
  const description = trainer
    ? `Meet ${trainer.trainer_name}, an expert instructor at Hachion.`
    : "Meet Hachion's expert instructors.";

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    robots: { index: Boolean(trainer), follow: true },
    openGraph: { title, description, url: canonicalUrl },
  };
}

export default async function InstructorDetailsPage({ params }) {
  const { trainerSlug } = await params;
  const trainer = await fetchTrainerForMetadata(trainerSlug);
  const canonicalUrl = buildCanonicalUrl(`/instructor-profiles/${trainerSlug}`);

  const schemas = [
    buildBreadcrumbSchema([
      { name: "Instructor Profiles", path: "/instructor-profiles" },
      { name: trainer?.trainer_name || "Instructor", path: `/instructor-profiles/${trainerSlug}` },
    ]),
  ];

  if (trainer) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": `${canonicalUrl}#person`,
      name: trainer.trainer_name,
      jobTitle: trainer.course_name ? `${trainer.course_name} Instructor` : "Instructor",
      description: `Meet ${trainer.trainer_name}, an expert instructor at Hachion.`,
      image: trainer.trainerImage ? `https://api.hachion.co/${trainer.trainerImage}` : undefined,
      url: canonicalUrl,
      worksFor: { "@type": "EducationalOrganization", "@id": `${SITE_ORIGIN}/#organization`, name: "Hachion" },
    });
  }

  return (
    <>
      <JsonLd data={schemas} />
      <InstructorDetails />
    </>
  );
}
