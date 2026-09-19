// Ported from the CRA app's
// src/Components/UserPanel/CoursePage/courseRouteUtils.js — the slug/route
// helpers shared by Course.jsx, Sidebar.jsx, SidebarRight.jsx and
// SidebarCard.jsx so category/course slugs match the detail-page route
// exactly.
//
// Deliberately does NOT strip non-alphanumeric characters (e.g. "+", "#").
// The original CRA/ported version replaced anything outside [a-z0-9-] with
// "-", which silently swallows characters like "+" — for a real course
// named "Programming with C++" that produced the slug "programming-with-c"
// (both "+" dropped entirely, unrecoverable). The course-details page
// (NewCourseDetails.jsx) matches courses via its own local slugify that
// only lowercases/hyphenates whitespace and does NOT strip other
// characters, so a listing-page link built with the old stripping version
// pointed at a URL the details page could never match against any real
// course — the "View" button changed the URL but landed on a course-not-
// found state. Matching NewCourseDetails.jsx's (lenient) behavior here
// fixes the round-trip and keeps exactly one slug convention in use.
export const slugifyCourseText = (value = '') =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '');

export const buildCourseDetailsPath = (categoryName = '', courseName = '') => {
  const categorySlug = slugifyCourseText(categoryName);
  const courseSlug = slugifyCourseText(courseName);
  if (!categorySlug || !courseSlug) return '/courses';
  return `/courses/${categorySlug}/${courseSlug}`;
};

export const matchesCourseRoute = (categoryName, categorySlug, courseName, courseSlug) => {
  return (
    slugifyCourseText(categoryName) === slugifyCourseText(categorySlug) &&
    slugifyCourseText(courseName) === slugifyCourseText(courseSlug)
  );
};

// Reconstructs the human-readable course name the backend's
// /courses/getByCourseName/:name endpoint expects from a URL slug (the
// inverse of the whitespace-to-hyphen step above, plus special-casing
// "xx-000"-style codes like "az-500" so the hyphen there isn't turned back
// into a space). This exact block used to be copy-pasted independently into
// CourseBanner.jsx, DemoClassSection.jsx, FAQSection.jsx, LearnSection.jsx,
// InstructorSection.jsx, and this route's own page.js — one copy
// (InstructorSection.jsx) had silently drifted to a `.replace(/\+\+/g,
// "pp")` step nowhere else has, turning "c++" into "cpp" and breaking its
// own useCourseByName lookup for that course specifically. Centralizing
// here removes the duplication that let that drift happen unnoticed.
export const toApiCourseName = (slug = '') =>
  decodeURIComponent(slug)
    .replace(/---+/g, ' - ')
    .replace(/\b([a-zA-Z]{2,3})-(\d{3})\b/g, '$1@@$2')
    .replace(/[-_]+/g, ' ')
    .replace(/@@/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
