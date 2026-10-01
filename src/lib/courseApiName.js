import { API_BASE_URL } from "@/lib/apiBase";
import { findCourseNameForSlug, toApiCourseName } from "@/components/UserPanel/CoursePage/courseRouteUtils";

// Server-side: turns a course URL slug into the exact course_name stored in
// the database (see findCourseNameForSlug for why the slug alone is not
// enough). /courses/names-and-categories is the lightweight (~16 KB) list,
// cached with the same 5-minute revalidate the course page already uses, so
// a course added from the admin panel resolves within that window.
export async function resolveCourseApiName(courseSlug, categorySlug) {
  if (!courseSlug) return "";
  try {
    const res = await fetch(`${API_BASE_URL}/courses/names-and-categories`, { next: { revalidate: 300 } });
    if (res.ok) {
      const match = findCourseNameForSlug(await res.json(), courseSlug, categorySlug);
      if (match) return match;
    }
  } catch {
    // Fall through to the slug-derived guess below.
  }
  return toApiCourseName(courseSlug);
}
