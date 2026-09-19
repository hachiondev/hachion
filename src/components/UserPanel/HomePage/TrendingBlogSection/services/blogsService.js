import Blogimageplaceholder from "../../../../../assets/blogplaceholder.webp";

/**
 * Fetch a single blog by numeric id or short-title slug — mirrors
 * BlogDetails.jsx's own lookup: a purely-numeric last segment of the URL
 * slug is treated as an id (GET /blog/:id), anything else is decoded back
 * into its space-separated short title (GET /blog/check/:shortTitle).
 */
export const getBlogBySlug = async (titleSlug) => {
  const lastPart = titleSlug?.split("-").pop();
  const id = /^\d+$/.test(lastPart) ? lastPart : null;
  const url = id
    ? `https://api.hachion.co/blog/${id}`
    : `https://api.hachion.co/blog/check/${encodeURIComponent(decodeURIComponent(titleSlug).replace(/-/g, " "))}`;
  const response = await fetch(url, { next: { revalidate: 300 } });
  if (!response.ok) return null;
  const data = await response.json();
  return data || null;
};

/**
 * Fetch every blog (object-shaped, full list) — used for the sidebar
 * "Recent Post" list, Previous/Next navigation, and Related Blogs, all of
 * which are derived client-side from this same array in CRA's
 * BlogDetails.jsx, not separate endpoints.
 */
export const getAllBlogs = async () => {
  const response = await fetch(`https://api.hachion.co/blog`);
  if (!response.ok) throw new Error("Failed to fetch blogs");
  const data = await response.json();
  if (!Array.isArray(data)) return [];
  const mapped = data.map((blog) => ({
    ...blog,
    blog_image: blog.blog_image
      ? `https://api.hachion.co/uploads/prod/blogs/${blog.blog_image}`
      : Blogimageplaceholder.src,
  }));
  return mapped.sort((a, b) => new Date(b.date) - new Date(a.date));
};

/**
 * Fetch every blog, but as the same lightweight row-tuple shape
 * getRecentBlogs()/BlogList.jsx's own per-category fetch use (id,
 * category_name, title, short_title, ...) — no `description` field. Used
 * where only enough data to build a /blogs/:category/:slug link is needed
 * (e.g. the /blogs listing page's crawlable link list), not the full
 * article body.
 *
 * There is no backend "list all blogs, lightweight" endpoint; GET /blog
 * returns the full entity (including `description`) for all ~224 rows,
 * which measured at a ~7MB response and 30-45s — too slow to run on every
 * request and too large for Next's fetch cache (2MB cap) to help. Instead
 * this reuses GET /blog/filter (the same lightweight, no-description
 * endpoint BlogList.jsx already calls per-category) with every known
 * category passed at once, since its backing query is `WHERE category_name
 * IN (:categories)` — equivalent to "all blogs" without the heavy payload.
 */
export const getAllBlogsLightweight = async () => {
  const categoriesRes = await fetch(`https://api.hachion.co/blog/categories`, { next: { revalidate: 300 } });
  if (!categoriesRes.ok) return [];
  const categories = await categoriesRes.json();
  if (!Array.isArray(categories) || categories.length === 0) return [];

  const params = new URLSearchParams();
  categories.forEach((c) => params.append("category", c));
  const blogsRes = await fetch(`https://api.hachion.co/blog/filter?${params.toString()}`, { next: { revalidate: 300 } });
  if (!blogsRes.ok) return [];
  const rows = await blogsRes.json();
  if (!Array.isArray(rows)) return [];

  return rows.map((row) => {
    const [id, category_name, title, short_title] = row;
    return { id, category_name, title, shortTitle: short_title };
  });
};

/**
 * Fetch recent blog posts
 * Returns transformed blog data with full image URLs
 */
export const getRecentBlogs = async () => {
  const response = await fetch(`https://api.hachion.co/blog/recent`);
  if (!response.ok) {
    throw new Error("Failed to fetch recent blogs");
  }
  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error("Invalid blog data format");
  }

  // Transform array response to object format. shortTitle (camelCase) to
  // match every other blog object this service produces (getBlogBySlug,
  // getAllBlogsLightweight) and what src/lib/blogUrl.js's shared
  // getBlogPath() expects — this function used to be the one place that
  // kept the raw snake_case short_title, silently breaking short-title
  // links for anything built from this endpoint's data.
  return data.map(row => {
    const [id, category_name, title, short_title, author, author_image, blog_image, date] = row;
    const avatar = author_image ? `https://api.hachion.co/uploads/prod/blogs/${author_image}` : "";
    const blogImg = blog_image ? `https://api.hachion.co/uploads/prod/blogs/${blog_image}` : "";
    return {
      id,
      category_name,
      title,
      shortTitle: short_title,
      author,
      date,
      avatar,
      blog_image: blogImg
    };
  });
};
