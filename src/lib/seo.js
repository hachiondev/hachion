export const SITE_ORIGIN = "https://www.hachion.co";

// Builds a canonical URL from a path, always against the preferred
// www + https origin, lowercased and without a query string, fragment,
// or trailing slash — so mixed-case/param-polluted requests to the same
// page all collapse onto one signal instead of self-referencing whatever
// was actually typed/linked.
// Ported from the CRA app's src/Components/Common/Canonical.jsx (same
// logic, minus the react-helmet-async wrapper — Next.js pages consume
// this directly inside generateMetadata()'s alternates.canonical).
export function buildCanonicalUrl(path = "/") {
  const clean = String(path).split("?")[0].split("#")[0].toLowerCase();
  const normalized = clean.startsWith("/") ? clean : `/${clean}`;
  if (normalized === "/") return `${SITE_ORIGIN}/`;
  return `${SITE_ORIGIN}${normalized.replace(/\/+$/, "")}`;
}
