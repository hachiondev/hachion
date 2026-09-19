import { Suspense } from "react";
import { buildCanonicalUrl, SITE_ORIGIN } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/breadcrumbSchema";
import JsonLd from "@/components/common/JsonLd";
import Course from "@/components/UserPanel/CoursePage/Course";
import { fetchCourseListingInitialData, getInitialCardsPerPage } from "@/components/UserPanel/CoursePage/courseListingData";

const TITLE = "Best Online IT Certification Courses & Programs | Hachion";
const DESCRIPTION =
  "Transform your career with Hachion's online IT courses! Enroll now, earn a certificate, get job assistance & try our FREE demo! Join today!";

const toDisplayName = (slug = "") =>
  decodeURIComponent(slug)
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

// Ported from the CRA app's src/Components/UserPanel/CoursePage/Course.jsx
// (the /courses/:categoryName route in src/App.js) — same listing page,
// pre-filtered by the category segment. <Helmet>/<Canonical> -> generateMetadata().
export async function generateMetadata({ params }) {
  const { categoryName } = await params;
  const canonicalUrl = buildCanonicalUrl(`/courses/${categoryName}`);
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: canonicalUrl },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      siteName: "Hachion",
      url: canonicalUrl,
      title: TITLE,
      description: DESCRIPTION,
      images: [`${SITE_ORIGIN}/Hachion-logo.png`],
    },
    twitter: {
      card: "summary_large_image",
      site: "@hachionofficial",
      title: TITLE,
      description: DESCRIPTION,
      images: [`${SITE_ORIGIN}/Hachion-logo.png`],
    },
  };
}

// See courses/page.js for why this is force-dynamic: the Course subtree's
// <Suspense> boundary (required by useSearchParams()) resolves to its
// fallback in a statically-cached page, not real content — confirmed via a
// diagnostic marker test. This route was already server-rendered per-request
// (ƒ, not statically prerendered) since it has a dynamic [categoryName]
// segment, so this mainly documents the same reasoning rather than changing
// its caching behavior.
export const dynamic = "force-dynamic";

export default async function CoursesByCategoryPage({ params }) {
  const { categoryName } = await params;
  const schema = buildBreadcrumbSchema([
    { name: "Courses", path: "/courses" },
    { name: toDisplayName(categoryName), path: `/courses/${categoryName}` },
  ]);
  const [{ categories, courses, discountRules }, initialCardsPerPage] = await Promise.all([
    fetchCourseListingInitialData(),
    getInitialCardsPerPage(),
  ]);

  return (
    <>
      <JsonLd data={schema} />
      {/* useSearchParams() inside Course requires a Suspense boundary so the
          route can still be statically prerendered. */}
      <Suspense fallback={null}>
        <Course
          categoryNameParam={categoryName}
          initialCategories={categories}
          initialCourses={courses}
          initialDiscountRules={discountRules}
          initialCardsPerPage={initialCardsPerPage}
        />
      </Suspense>
    </>
  );
}
