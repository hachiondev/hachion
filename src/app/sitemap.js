import { buildCanonicalUrl } from "@/lib/seo";
import { getBlogPath } from "@/lib/blogUrl";
import { slugifyCourseText } from "@/components/UserPanel/CoursePage/courseRouteUtils";
import { slugifyWorkshopTitle } from "@/lib/workshopSlug";
import { slugifyJobTitle } from "@/lib/jobSlug";
import { getAllBlogs } from "@/components/UserPanel/HomePage/TrendingBlogSection/services/blogsService";
import { getApprovedJobs } from "@/components/UserPanel/services/careerService";
import { API_BASE_URL } from "@/lib/apiBase";

// Auto-served at /sitemap.xml (Next.js MetadataRoute.Sitemap convention).
// Didn't exist at all before this — robots.js referenced a sitemap URL with
// a stray "/hachion" segment that 404'd regardless, and the one HTML page
// meant to help crawlers discover courses/categories (/sitemap, and the
// /courses listing itself) fetches everything via useEffect, so its
// server-rendered HTML contains zero links. Together those meant no
// individual course, category, blog, trainer, workshop, or job page was
// discoverable by a crawler that doesn't execute JS — this is very likely
// the reason a Screaming Frog crawl only found ~17 pages. Individual detail
// pages were always fully server-rendered with correct metadata (verified);
// nothing linked *to* them.
//
// Static path list + priority/frequency mirror each page's own
// generateMetadata() `robots: { index: true }` — keep in sync if a page's
// indexability changes. Pages with `index: false` (login, register, OTP
// screens, enrollment/payment flow, userdashboard, etc.) are deliberately
// excluded here.
const STATIC_ROUTES = [
  { path: "/", priority: 1.0, changeFrequency: "daily" },
  { path: "/courses", priority: 0.9, changeFrequency: "daily" },
  { path: "/blogs", priority: 0.8, changeFrequency: "daily" },
  { path: "/workshop", priority: 0.7, changeFrequency: "weekly" },
  { path: "/instructor-profiles", priority: 0.6, changeFrequency: "weekly" },
  { path: "/discountdeals", priority: 0.6, changeFrequency: "weekly" },
  { path: "/career", priority: 0.6, changeFrequency: "weekly" },
  { path: "/view-all-reviews", priority: 0.5, changeFrequency: "weekly" },
  { path: "/corporate", priority: 0.6, changeFrequency: "monthly" },
  { path: "/become-instructor", priority: 0.5, changeFrequency: "monthly" },
  { path: "/hire-from-us", priority: 0.5, changeFrequency: "monthly" },
  { path: "/aboutus", priority: 0.5, changeFrequency: "monthly" },
  { path: "/summer-tech-bootcamp-for-teens", priority: 0.5, changeFrequency: "monthly" },
  { path: "/contactus", priority: 0.4, changeFrequency: "monthly" },
  { path: "/viewfaqs", priority: 0.4, changeFrequency: "monthly" },
  { path: "/sitemap", priority: 0.3, changeFrequency: "weekly" },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/refundpolicy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
  { path: "/unsubscribe", priority: 0.1, changeFrequency: "yearly" },
];

async function safeFetchJson(url, options) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function getCourseEntries() {
  const [categories, courses] = await Promise.all([
    safeFetchJson(`${API_BASE_URL}/course-categories/all`, {
      headers: { Authorization: `Bearer ${process.env.SITEMAP_API_TOKEN}` },
      next: { revalidate: 3600 },
    }),
    // /courses/all returns full course entities (long-form description/
    // curriculum HTML per course) and was observed taking 60+ seconds to
    // even finish transferring against production - blowing well past
    // Next.js's ~60s per-attempt budget for generating this route during
    // `next build` and failing the build outright (confirmed via direct
    // curl timing: /courses/all didn't finish downloading 1.2MB+ in 60s,
    // vs. names-and-categories returning the same courseName/courseCategory
    // fields this function actually uses in ~1.2s). Swapped to the
    // lightweight projection endpoint instead.
    safeFetchJson(`${API_BASE_URL}/courses/names-and-categories`, { next: { revalidate: 3600 } }),
  ]);

  const entries = [];

  if (Array.isArray(categories)) {
    for (const item of categories) {
      const name = item?.name || item?.category_name || item?.category || "";
      const slug = slugifyCourseText(name);
      if (slug) {
        entries.push({ url: buildCanonicalUrl(`/courses/${slug}`), changeFrequency: "weekly", priority: 0.7 });
      }
    }
  }

  if (Array.isArray(courses)) {
    for (const course of courses) {
      const categorySlug = slugifyCourseText(course?.courseCategory || "");
      const courseSlug = slugifyCourseText(course?.courseName || "");
      if (categorySlug && courseSlug) {
        entries.push({
          url: buildCanonicalUrl(`/courses/${categorySlug}/${courseSlug}`),
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }
    }
  }

  return entries;
}

async function getBlogEntries() {
  try {
    const blogs = await getAllBlogs();
    return blogs
      .map((blog) => {
        const path = getBlogPath(blog);
        return path ? { url: buildCanonicalUrl(path), changeFrequency: "monthly", priority: 0.6 } : null;
      })
      .filter(Boolean);
  } catch {
    return [];
  }
}

// Matches instructor-profiles/[trainerSlug]/page.js's own slugifyName().
function slugifyTrainerName(name = "") {
  return name.trim().toLowerCase().replace(/\s+/g, "-");
}

async function getTrainerEntries() {
  const trainers = await safeFetchJson(`${API_BASE_URL}/trainersnames-unique`, { next: { revalidate: 3600 } });
  if (!Array.isArray(trainers)) return [];
  return trainers
    .map((t) => {
      const slug = slugifyTrainerName(t?.trainer_name || "");
      return slug ? { url: buildCanonicalUrl(`/instructor-profiles/${slug}`), changeFrequency: "monthly", priority: 0.5 } : null;
    })
    .filter(Boolean);
}

async function getWorkshopEntries() {
  const workshops = await safeFetchJson(`${API_BASE_URL}/workshopschedule`, { next: { revalidate: 3600 } });
  if (!Array.isArray(workshops)) return [];
  return workshops
    .map((w) => {
      const slug = slugifyWorkshopTitle(w?.title || "");
      return slug ? { url: buildCanonicalUrl(`/workshop/${slug}`), changeFrequency: "weekly", priority: 0.5 } : null;
    })
    .filter(Boolean);
}

async function getJobEntries() {
  try {
    const jobs = await getApprovedJobs();
    if (!Array.isArray(jobs)) return [];
    return jobs
      .map((j) => {
        const slug = slugifyJobTitle(j?.jobTitle || "");
        return slug ? { url: buildCanonicalUrl(`/career/apply/${slug}`), changeFrequency: "weekly", priority: 0.4 } : null;
      })
      .filter(Boolean);
  } catch {
    return [];
  }
}

export default async function sitemap() {
  const staticEntries = STATIC_ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: buildCanonicalUrl(path),
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));

  const [courseEntries, blogEntries, trainerEntries, workshopEntries, jobEntries] = await Promise.all([
    getCourseEntries(),
    getBlogEntries(),
    getTrainerEntries(),
    getWorkshopEntries(),
    getJobEntries(),
  ]);

  const dynamicEntries = [...courseEntries, ...blogEntries, ...trainerEntries, ...workshopEntries, ...jobEntries].map(
    (entry) => ({ ...entry, lastModified: new Date() })
  );

  // De-dupe by URL (defensive — e.g. a course listed under a mistyped
  // duplicate category shouldn't produce two sitemap entries).
  const seen = new Set();
  const all = [...staticEntries, ...dynamicEntries].filter((entry) => {
    if (seen.has(entry.url)) return false;
    seen.add(entry.url);
    return true;
  });

  return all;
}
