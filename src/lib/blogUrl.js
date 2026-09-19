// Single source of truth for building a blog's canonical path
// (/blogs/{category}/{slug}), used by every place that links to a blog:
// the detail route's own redirect/canonical logic, the sitemap, and every
// internal <Link>/router.push call site. Before this existed, each call
// site re-implemented this slugging independently and two of them had
// drifted (wrong field casing / missing normalization), producing hrefs
// that didn't match the canonical URL for the same blog.
// Admin's "Short Blog URL" field is free text (letters/spaces only, per the
// backend's validation) rather than an auto-generated slug, so a value
// saved with a leading/trailing space - invisible in a text input, and not
// rejected by that validation - turned straight into a leading/trailing
// "-" once spaces became hyphens below. Trimming the source string first,
// then stripping any leading/trailing hyphen left over from punctuation
// (the title fallback's `[^\w\s-]` strip can itself leave a lone trailing
// "-" where a trailing symbol used to be), fixes every blog's URL from
// this one shared function - no per-record data migration needed, since
// the path is computed fresh from `blog.shortTitle`/`blog.title` on every
// call rather than read back out of a stored slug column.
function toSlug(text) {
  return text.trim().replace(/\s+/g, "-").replace(/^-+|-+$/g, "");
}

export function getBlogPath(blog) {
  if (!blog) return null;
  const categorySlug = toSlug((blog.category_name || "").toLowerCase());
  if (!categorySlug) return null;
  const hasShortTitle = blog.shortTitle && blog.shortTitle.trim() !== "";
  const titleSlug = toSlug((blog.title || "").toLowerCase().replace(/[^\w\s-]/g, ""));
  const slug = hasShortTitle
    ? toSlug(blog.shortTitle.toLowerCase())
    : blog.id
    ? `${titleSlug}-${blog.id}`
    : null;
  if (!slug) return null;
  return `/blogs/${categorySlug}/${slug}`;
}
