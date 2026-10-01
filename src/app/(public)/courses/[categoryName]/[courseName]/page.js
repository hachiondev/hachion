import { buildCanonicalUrl, SITE_ORIGIN } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/breadcrumbSchema";
import JsonLd from "@/components/common/JsonLd";
import NewCourseDetails from "@/components/UserPanel/NewcoursePage/NewCourseDetails";
import { resolveCourseApiName } from "@/lib/courseApiName";
import { CourseApiNameProvider } from "@/components/UserPanel/CoursePage/CourseApiNameContext";
import { API_BASE_URL } from "@/lib/apiBase";

// The default parameter only covers `undefined` — API fields that are
// explicitly `null` (e.g. an unset metaTitle) skip it entirely and crash
// on `.replace`, so the null case needs its own guard.
const stripHtml = (html = "") =>
  (html || "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();

const toDisplayName = (slug = "") =>
  decodeURIComponent(slug)
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

// Server-side fetch (plain fetch, not the client useCourseByName/
// useFaqsByCourse react-query hooks, which can't run in generateMetadata) —
// same endpoints those hooks call. Ported from CourseBanner.jsx's <Helmet>
// + 5 JSON-LD <script> blocks (Organization/WebPage/Breadcrumb/Course/
// FAQPage), moved here per this app's generateMetadata()/JsonLd convention.
async function fetchCourseForMetadata(apiName) {
  try {
    const res = await fetch(`${API_BASE_URL}/courses/getByCourseName/${encodeURIComponent(apiName)}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data) ? data[0] ?? null : null;
  } catch {
    return null;
  }
}

async function fetchFaqsForMetadata(apiName) {
  try {
    const res = await fetch(`${API_BASE_URL}/faq/course/${encodeURIComponent(apiName)}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

// Same endpoint useCurriculumAll's queryFn calls, fetched server-side so the
// curriculum accordion (CourseCurriculum.jsx) can be seeded with
// react-query `initialData` and render real module titles/topics in the
// server-rendered HTML instead of "Loading curriculum...". Normalization
// mirrors useCurriculumAll's own `normalizedCourse` derivation exactly (see
// that hook) so the query-cache key this seeds actually matches the one the
// client component reads from.
async function fetchCurriculumForMetadata(apiName) {
  try {
    const normalizedCourse = apiName.toLowerCase().replace(/[\s\-_]/g, "");
    if (!normalizedCourse) return null;
    const res = await fetch(`${API_BASE_URL}/curriculum/course/${normalizedCourse}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data)) return null;
    return { uiCurriculum: data, curriculum: data };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { categoryName, courseName } = await params;
  const course = await fetchCourseForMetadata(await resolveCourseApiName(courseName, categoryName));
  const canonicalUrl = buildCanonicalUrl(`/courses/${categoryName}/${courseName}`);

  // Courses created from the admin panel often have no metaTitle/
  // metaDescription yet - fall back to the real stored name, not a
  // slug-derived one ("AI-Augmented", not "Ai Augmented").
  const fallbackTitle = `${course?.courseName || toDisplayName(courseName)} Training Course & Certification | Hachion`;
  const title = course?.metaTitle || fallbackTitle;
  const description = course?.metaDescription || stripHtml(course?.aboutCourse || "").slice(0, 160) || "Transform your career with Hachion's online IT courses! Enroll now, earn a certificate, get job assistance & try our FREE demo!";
  const ogImage = course?.courseImage ? `${API_BASE_URL}/${course.courseImage}` : `${SITE_ORIGIN}/Hachion-logo.png`;

  return {
    title,
    description,
    ...(course?.metaKeyword ? { keywords: course.metaKeyword } : {}),
    alternates: { canonical: canonicalUrl },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      siteName: "Hachion",
      url: canonicalUrl,
      title,
      description,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      site: "@hachionofficial",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function CourseDetailsPage({ params }) {
  const { categoryName, courseName } = await params;
  const apiCourseName = await resolveCourseApiName(courseName, categoryName);
  const [course, faqs, curriculum] = await Promise.all([
    fetchCourseForMetadata(apiCourseName),
    fetchFaqsForMetadata(apiCourseName),
    fetchCurriculumForMetadata(apiCourseName),
  ]);

  const canonicalUrl = buildCanonicalUrl(`/courses/${categoryName}/${courseName}`);
  const categoryDisplay = course?.courseCategory || toDisplayName(categoryName);
  const courseDisplay = course?.metaTitle || course?.courseName || toDisplayName(courseName);
  // Breadcrumb UI wants the short course name (matches production's
  // "Machine Learning Training" style label), not the long SEO metaTitle
  // that courseDisplay uses for <title>/JSON-LD.
  const courseBreadcrumbLabel = course?.courseName || toDisplayName(courseName);

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Courses", path: "/courses" },
    { name: categoryDisplay, path: `/courses/${categoryName}` },
    { name: courseDisplay, path: `/courses/${categoryName}/${courseName}` },
  ]);

  const schemas = [breadcrumbSchema];

  if (course) {
    const inrPrices = [course.itotal, course.ictotal, course.imtotal, course.isqtotal, course.istotal].filter((p) => Number(p) > 0);
    const usdPrices = [course.total, course.ctotal, course.mtotal, course.sqtotal, course.stotal].filter((p) => Number(p) > 0);
    // Server-rendered structured data can't know the visitor's country the
    // way the client-side useCurrency() hook does, so this defaults to USD
    // pricing — the actual user-facing price display (CourseBanner/
    // DemoClassSection) still resolves the visitor's real currency
    // client-side; only this SEO-only schema simplifies to USD.
    const schemaLowPrice = usdPrices.length ? Math.min(...usdPrices) : inrPrices.length ? Math.min(...inrPrices) : 0;
    const schemaHighPrice = usdPrices.length ? Math.max(...usdPrices) : inrPrices.length ? Math.max(...inrPrices) : 0;

    schemas.push({
      "@context": "https://schema.org",
      "@type": "Course",
      "@id": `${canonicalUrl}#course`,
      // Matches CourseBanner.jsx's own title precedence exactly
      // (course.seoH1Title?.trim() || course.courseName) — this used to read
      // metaTitle first, which is a different, independently-editable field
      // (only ever used for <title>/OG tags elsewhere on this same page), so
      // whenever it diverged from seoH1Title the Course schema's `name`
      // silently didn't match the page's actual visible <h1>.
      name: stripHtml(course.seoH1Title) || stripHtml(course.courseName),
      description: course.metaDescription,
      url: canonicalUrl,
      image: `${API_BASE_URL}/${course.courseImage}`,
      courseMode: "Online",
      inLanguage: "en",
      educationalCredentialAwarded: `${course.courseName} Completion Certification`,
      provider: {
        "@type": "EducationalOrganization",
        "@id": `${SITE_ORIGIN}/#organization`,
        name: "Hachion",
        url: SITE_ORIGIN,
      },
      hasCourseInstance: { "@type": "CourseInstance", courseMode: "Online" },
      offers: {
        "@type": "AggregateOffer",
        lowPrice: schemaLowPrice,
        highPrice: schemaHighPrice,
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
    });
  }

  if (faqs.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${canonicalUrl}#faq`,
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: (faq.faq_title || "").trim(),
        acceptedAnswer: { "@type": "Answer", text: stripHtml(faq.description || "") },
      })),
    });
  }

  return (
    <>
      <JsonLd data={schemas} />
      <CourseApiNameProvider value={apiCourseName}>
        <NewCourseDetails
          categoryName={categoryName}
          categoryDisplay={categoryDisplay}
          courseDisplay={courseBreadcrumbLabel}
          initialCourse={course}
          initialFaqs={faqs}
          initialCurriculum={curriculum}
        />
      </CourseApiNameProvider>
    </>
  );
}
