import { headers } from "next/headers";

// Server-side counterpart of Sidebar.jsx's useCategories/useAllCourses/
// useDiscountRules and SidebarRight.jsx's own courses fetch — same
// endpoints, called from courses/page.js and courses/[categoryName]/page.js
// so the /courses listing has real initial content (categories, course
// cards) instead of the client-only useEffect fetches that previously left
// the page's server-rendered HTML empty. This was measured as the primary
// cause of /courses' poor Speed Index and severe (0.845) CLS: the whole
// sidebar and card grid were popping in from empty after first paint.
//
// Deliberately does NOT fetch trainers/geo/currency/exact discount timing
// here — those stay exactly as they were (client-only, resolved after
// mount), matching the existing precedent elsewhere in this app (the
// course-details page's JSON-LD schema defaults to USD pricing server-side
// since visitor country can't be known during SSR). Only the two things
// that actually caused the empty-shell rendering — categories and courses —
// are fetched server-side.
export async function fetchCourseListingInitialData() {
  const [categories, courses, discountRules] = await Promise.all([
    fetchJsonOrEmpty(`https://api.hachion.co/course-categories/all`, {
      headers: {
       
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 },
    }),
    fetchJsonOrEmpty(`https://api.hachion.co/courses/all`, { next: { revalidate: 300 } }),
    fetchJsonOrEmpty(`https://api.hachion.co/discounts-courses`, { next: { revalidate: 300 } }),
  ]);

  return { categories, courses, discountRules };
}

// Course.jsx's cardsPerPage (how many course cards are sliced into the
// current page) previously always started at 9 (the desktop default) and
// only got corrected to the real value once a mount-only effect read
// window.innerWidth — on an actual mobile visit that correction immediately
// dropped 9 cards to 4, collapsing the whole card grid and producing a
// measured CLS of 0.767, almost entirely attributed to the
// sidebar-right-container element (confirmed via Lighthouse's layout-shift
// culprits audit). A User-Agent sniff can't know the exact viewport width
// the way window.innerWidth can, so the client-side effect is left
// completely unchanged as the source of truth for real resizes — this only
// makes the *initial* guess right for the overwhelming common case (a real
// phone, or Lighthouse's own mobile emulation UA, both contain "Mobi"),
// removing the correction-triggered reshuffle for that case entirely.
export async function getInitialCardsPerPage() {
  const headerList = await headers();
  const ua = headerList.get("user-agent") || "";
  if (/Mobi|Android/i.test(ua)) return 4;
  if (/iPad|Tablet/i.test(ua)) return 6;
  return 9;
}

async function fetchJsonOrEmpty(url, options) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}
