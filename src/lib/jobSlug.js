// Job postings have no backend slug field — every job link (JobCard on the
// /career listing, the /career/apply/[jobSlug] route itself) derives its
// slug from jobTitle at render time using this exact function, ported
// verbatim from CRA's JobCard.jsx.
export function slugifyJobTitle(text = "") {
  return text.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, "-");
}
