import Link from "next/link";
import { buildCanonicalUrl } from "@/lib/seo";
import { getBlogPath } from "@/lib/blogUrl";
import Blogs from "@/components/UserPanel/Blogs";
import { getAllBlogsLightweight } from "@/components/UserPanel/HomePage/TrendingBlogSection/services/blogsService";

const CANONICAL_URL = buildCanonicalUrl("/blogs");

// The CRA original's Helmet only ever set title/description (no
// robots/OG) — preserved, but added robots:index/follow explicitly since
// this is a real content page that should be crawled.
export function generateMetadata() {
  return {
    title: "Hachion's Blog | Online learning news, trends & insights",
    description:
      "Get the latest from Hachion, a global online learning platform offering world-class learning experiences to transform lives worldwide.",
    alternates: { canonical: CANONICAL_URL },
    robots: { index: true, follow: true },
  };
}

// Visually-hidden (not a design change — same technique BlogList/Course
// already use elsewhere for crawler-only content) but present in the
// server-rendered HTML: a plain <a href> to every blog post. Belt-and-braces
// alongside BlogList now showing every blog by default (BlogsSidebar no
// longer auto-narrows to one category client-side) — this block remains the
// single source of truth for "every blog is reachable from crawlable HTML
// starting at /blogs" even for a client that doesn't run JS at all, and is
// completely independent of BlogList/BlogsSidebar's filtering/pagination.
function AllBlogsCrawlLinks({ blogs }) {
  const links = (blogs || [])
    .map((blog) => ({ title: blog?.title || "Blog", href: getBlogPath(blog) }))
    .filter((b) => b.href);

  if (links.length === 0) return null;

  return (
    <nav
      aria-hidden="true"
      style={{
        position: "absolute",
        width: "1px",
        height: "1px",
        padding: 0,
        margin: "-1px",
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        whiteSpace: "nowrap",
        border: 0,
      }}
    >
      {links.map((blog, i) => (
        <Link key={`blog-${blog.href}-${i}`} href={blog.href} prefetch={false}>
          {blog.title}
        </Link>
      ))}
    </nav>
  );
}

export default async function BlogsPage() {
  const blogs = await getAllBlogsLightweight().catch(() => []);
  return (
    <>
      <AllBlogsCrawlLinks blogs={blogs} />
      <Blogs />
    </>
  );
}
