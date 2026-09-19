// Workshop records have no backend slug field — every workshop page (listing
// cards, details lookup, recent-entries cards) derives its URL slug from
// `title` at render time using this exact same function. Ported verbatim
// from CRA, where it was duplicated across Workshop.jsx/WorkshopDetails.jsx/
// WorkshopEntries.jsx — centralized here so all three (and the Next.js
// equivalents) stay byte-for-byte in sync.
export function slugifyWorkshopTitle(text = "") {
  return text
    .toString()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}
