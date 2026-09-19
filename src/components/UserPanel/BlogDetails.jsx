"use client";

import { useEffect, useMemo, useState, lazy, Suspense } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import "./Blogs.css";
import { MdKeyboardArrowRight } from "react-icons/md";
import Blogimageplaceholder from "@/assets/blogplaceholder.webp";
import { FaCalendarAlt, FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { IoLogoWhatsapp, IoMdMail } from "react-icons/io";
import { BiSearch, BiX } from "react-icons/bi";
import { BsArrowRight } from "react-icons/bs";
import TableOfContents from "./BlogDetailComponents/TableOfContents";
import ReadingProgress from "./BlogDetailComponents/ReadingProgress";
import processBlogContent from "./BlogDetailComponents/processBlogContent";
import MobileShareButton from "./BlogDetailComponents/MobileShareButton";
import { useAllCourses } from "@/Api/hooks/SitemapPageApi/useAllCourses";
import { useAllBlogs } from "@/Api/hooks/HomePageApi/TrendingBlogApi/useAllBlogs";
import { getBlogBySlug } from "./HomePage/TrendingBlogSection/services/blogsService";
import { slugifyCourseText } from "./CoursePage/courseRouteUtils";
import { getBlogPath } from "@/lib/blogUrl";

// Below-the-fold — related posts, share-preview card, and the inquiry form
// all render after the main article; no reason to ship their code upfront.
const MoreBlogs = lazy(() => import("./MoreBlogs"));
const BlogInquiryForm = lazy(() => import("./BlogInquiryForm"));

// Stable reference: `data: allCourses = []`-style destructuring defaults
// create a brand-new array every render while the query is still loading,
// which re-triggers any effect keyed on that value on every render —
// an infinite setState loop ("Maximum update depth exceeded"). A single
// module-level constant keeps the fallback reference stable across renders.
const EMPTY_ARRAY = [];

const escapeRegExp = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const FAQ_HEADING_RE = /faq|frequently\s*asked\s*questions/i;

// FAQ Links: within the FAQ section only, the first mention of a real course
// name is wrapped in a genuine <a href> to that course's Details page.
// Mutates `doc` in place; reuses whatever course list the caller already
// fetched (no new API call), and links each matching course only once.
const linkifyFaqCourseMentions = (doc, courses) => {
  if (!Array.isArray(courses) || !courses.length) return;
  const headings = Array.from(doc.querySelectorAll("h1, h2, h3, h4, h5, h6"));
  const faqHeading = headings.find(heading => FAQ_HEADING_RE.test(heading.textContent || ""));
  if (!faqHeading) return;

  const sortedCourses = courses
    .filter(c => c.courseName && c.courseCategory)
    .sort((a, b) => b.courseName.length - a.courseName.length);
  const linkedCourseKeys = new Set();

  let node = faqHeading.nextElementSibling;
  while (node && !/^H[1-6]$/.test(node.tagName)) {
    const targets = node.matches?.("p, li") ? [node] : Array.from(node.querySelectorAll?.("p, li") || []);
    targets.forEach(el => {
      for (const course of sortedCourses) {
        const key = `${course.courseCategory}::${course.courseName}`;
        if (linkedCourseKeys.has(key)) continue;
        const re = new RegExp(`\\b${escapeRegExp(course.courseName)}\\b`, "i");
        const walker = doc.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        let textNode;
        let matched = false;
        while ((textNode = walker.nextNode())) {
          if (textNode.parentElement?.closest("a")) continue;
          const match = textNode.textContent.match(re);
          if (!match) continue;
          const idx = match.index;
          const matchedText = match[0];
          const before = textNode.textContent.slice(0, idx);
          const after = textNode.textContent.slice(idx + matchedText.length);
          const anchor = doc.createElement("a");
          anchor.setAttribute("href", `/courses/${slugifyCourseText(course.courseCategory)}/${slugifyCourseText(course.courseName)}`);
          anchor.textContent = matchedText;
          const parent = textNode.parentNode;
          parent.insertBefore(doc.createTextNode(before), textNode);
          parent.insertBefore(anchor, textNode);
          parent.insertBefore(doc.createTextNode(after), textNode);
          parent.removeChild(textNode);
          matched = true;
          break;
        }
        if (matched) {
          linkedCourseKeys.add(key);
          break;
        }
      }
    });
    node = node.nextElementSibling;
  }
};

const IMAGE_URL_RE = /(https?:\/\/\S+\.(?:png|jpg|jpeg|gif|webp))/gi;

// Turns bare (unlinked) image URLs sitting in the article's text into real
// <img> elements, and fixes up an <a> whose visible text is itself a single
// image URL. Two variants of that showed up in real blog content (confirmed
// against the live /blog API - every affected blog matches one of these, none
// use a genuine <img> tag for inline/CTA images):
//   - href === text: the editor auto-linked a pasted image URL to itself,
//     with no real destination - unwrap the whole <a> into a plain <img>.
//   - href !== text: a CTA banner - the author linked real, useful text
//     (e.g. a course URL or a bit.ly redirect) but typed the raw image URL
//     as the link's visible label instead of inserting the image, expecting
//     it to render as a clickable banner image. Keep the <a> (and its
//     destination) so the CTA still links out; replace only its text with
//     the <img>, so it becomes <a href="...cta..."><img src="...banner"></a>.
// Walks real DOM text nodes/attributes instead of regex-replacing the
// serialized innerHTML string — a plain string replace matches inside
// href="..." attribute values just as readily as visible text, splicing
// literal "<img .../>" markup into the middle of an <a> tag and corrupting
// it on reparse, which is what made a pasted image URL show up as raw URL
// text instead of an image whenever the editor had auto-linked it. An
// anchor whose visible text is not a single image URL is left untouched.
const convertImageUrlsToImages = (doc) => {
  Array.from(doc.querySelectorAll("a[href]")).forEach(anchor => {
    const href = anchor.getAttribute("href") || "";
    const text = anchor.textContent.trim();
    IMAGE_URL_RE.lastIndex = 0;
    const match = IMAGE_URL_RE.exec(text);
    if (!match || match[0] !== text) return;

    const img = doc.createElement("img");
    img.setAttribute("src", match[0]);
    img.setAttribute("alt", "Blog Image");
    img.setAttribute("loading", "lazy");
    img.setAttribute("class", "blog-content-image");

    if (href === text) {
      anchor.replaceWith(img);
    } else {
      anchor.replaceChildren(img);
    }
  });

  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  let node;
  while ((node = walker.nextNode())) {
    if (node.parentElement?.closest("a, script, style")) continue;
    IMAGE_URL_RE.lastIndex = 0;
    if (IMAGE_URL_RE.test(node.nodeValue)) textNodes.push(node);
  }
  textNodes.forEach(textNode => {
    const text = textNode.nodeValue;
    const frag = doc.createDocumentFragment();
    let lastIndex = 0;
    let match;
    IMAGE_URL_RE.lastIndex = 0;
    while ((match = IMAGE_URL_RE.exec(text))) {
      if (match.index > lastIndex) frag.appendChild(doc.createTextNode(text.slice(lastIndex, match.index)));
      const img = doc.createElement("img");
      img.setAttribute("src", match[1]);
      img.setAttribute("alt", "Blog Image");
      img.setAttribute("loading", "lazy");
      img.setAttribute("class", "blog-content-image");
      frag.appendChild(img);
      lastIndex = match.index + match[1].length;
    }
    if (lastIndex < text.length) frag.appendChild(doc.createTextNode(text.slice(lastIndex)));
    textNode.parentNode.replaceChild(frag, textNode);
  });
};

// `initialBlog` is the same blog object app/(public)/blogs/[category_name]/
// [title]/page.js's server-side fetchBlogForMetadata() already fetches for
// generateMetadata()/JSON-LD. Seeding this component's state with it (instead
// of leaving selectedBlog as `useState(null)` populated only by the effect
// below) is what makes the server-rendered HTML contain the real <h1>/article
// body — without it, this whole page rendered nothing but an empty
// ".blog-details-skeleton-card" in the initial HTML (loading=true, no text
// content at all) until client JS ran, the same class of bug Task 2 fixed
// on the course-details page's CourseBanner/CourseCurriculum/FAQSection.
const BlogDetails = ({ initialBlog = null } = {}) => {
  // Next.js's useParams() (unlike react-router's) does not auto-decode
  // percent-escapes in dynamic segments — decode explicitly.
  const rawParams = useParams();
  const category_name = decodeURIComponent(rawParams.category_name || "");
  const rawTitle = decodeURIComponent(rawParams.title || "");
  const lastPart = rawTitle.split("-").pop();
  const id = /^\d+$/.test(lastPart) ? lastPart : null;

  const [selectedBlog, setSelectedBlog] = useState(initialBlog);
  const [headings, setHeadings] = useState([]);
  const [processedHtml, setProcessedHtml] = useState("");
  const [loading, setLoading] = useState(!initialBlog);
  const [searchQuery, setSearchQuery] = useState("");

  // FAQ Links: reuses the same course list already fetched elsewhere in the
  // app (10-min cache) — no new API call just to auto-link FAQ mentions.
  const { data: allCourses = EMPTY_ARRAY } = useAllCourses("blogFaqLinks");
  // "Recent Post" sidebar + Previous/Next + Related Blogs all derive from
  // this one already-fetched, newest-first list — no separate endpoints.
  const { data: blogs = EMPTY_ARRAY, isLoading: recentLoading } = useAllBlogs();

  // Sync selectedBlog from the server-fetched initialBlog. Keyed on
  // initialBlog itself (not just mount) so a client-side navigation to a
  // *different* blog — which re-runs page.js on the server and hands this
  // component a fresh initialBlog for the new route — still updates
  // selectedBlog correctly, with zero extra network requests: the server
  // already fetched this exact blog for this exact request. A client fetch
  // only happens as a fallback when the server genuinely returned nothing
  // (e.g. a transient backend failure), not as a routine "fetch it again"
  // on every mount — that used to fire a duplicate request straight to the
  // backend even when initialBlog was already correct and fresh.
  useEffect(() => {
    if (initialBlog) {
      setSelectedBlog(initialBlog);
      setLoading(false);
      return;
    }
    let cancelled = false;
    const fetchSelectedBlog = async () => {
      setLoading(true);
      try {
        const blog = await getBlogBySlug(rawTitle);
        if (!cancelled) setSelectedBlog(blog);
      } catch (error) {
        console.error("Error fetching selected blog:", error);
        if (!cancelled) setSelectedBlog(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchSelectedBlog();
    return () => {
      cancelled = true;
    };
  }, [initialBlog, rawTitle]);

  const filteredBlogs = searchQuery.trim()
    ? blogs.filter(blog => blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || blog.category_name.toLowerCase().includes(searchQuery.toLowerCase()))
    : blogs;

  // Parse HTML for headings and inline images
  useEffect(() => {
    if (selectedBlog?.description) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(selectedBlog.description, "text/html");
      const foundHeadings = [];
      const headingTags = doc.querySelectorAll("h1, h2, h3, h4, h5, h6");
      headingTags.forEach(heading => {
        const text = heading.textContent.trim();
        const headingId = text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
        heading.setAttribute("id", headingId);
        foundHeadings.push({ id: headingId, text });
      });
      convertImageUrlsToImages(doc);
      linkifyFaqCourseMentions(doc, allCourses);
      // Syncs from the fetched blog's HTML content (an external source).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHeadings(foundHeadings);
      setProcessedHtml(doc.body.innerHTML);
    }
  }, [selectedBlog, allCourses]);

  const handleImageError = e => {
    e.target.src = Blogimageplaceholder.src;
  };

  // Always share the production URL (never the localhost/staging host the
  // app happens to be running on) so social crawlers can actually fetch it
  // and pull the og/twitter image and title.
  const blogUrl = `https://www.hachion.co${typeof window !== "undefined" ? window.location.pathname : ""}`;
  const blogShareTitle = selectedBlog?.title || (typeof document !== "undefined" ? document.title : "") || "Hachion Blog";

  const shareLinks = {
    facebook: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(blogUrl)}`, "_blank", "noopener,noreferrer,width=600,height=400"),
    twitter: () => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(blogUrl)}&text=${encodeURIComponent(blogShareTitle)}&via=hachionofficial`, "_blank", "noopener,noreferrer,width=600,height=400"),
    linkedin: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(blogUrl)}`, "_blank", "noopener,noreferrer,width=600,height=600"),
    whatsapp: () => window.open(`https://wa.me/?text=${encodeURIComponent(`${blogShareTitle} ${blogUrl}`)}`, "_blank", "noopener,noreferrer"),
    email: () => {
      const emailSubject = blogShareTitle;
      const emailBody = `I thought you might like this blog: "${blogShareTitle}"\n\n${blogUrl}`;
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      window.open(gmailUrl, "_blank");
    }
  };

  // Shared slug logic (src/lib/blogUrl.js) — same one every other blog link
  // on this page and site-wide uses, so every link points at the same
  // canonical URL for a given blog.
  const getBlogUrl = (blog) => getBlogPath(blog) || "/blogs";

  // Related Blogs: same category first, filled from latest if fewer than
  // 3, current post always excluded. Derived from the same already-fetched
  // `blogs` list — no new API call, no hardcoded blog names.
  const relatedBlogs = useMemo(() => {
    if (!selectedBlog) return [];
    const others = blogs.filter((b) => b.id !== selectedBlog.id);
    const sameCategory = others.filter((b) => b.category_name === selectedBlog.category_name);
    const filler = others.filter((b) => b.category_name !== selectedBlog.category_name);
    return [...sameCategory, ...filler].slice(0, 6);
  }, [selectedBlog, blogs]);

  return (
    <div className="home-background">
      <ReadingProgress />
      <MobileShareButton selectedBlog={selectedBlog} />

      <div className="blogs-header">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link href="/">Home</Link> <MdKeyboardArrowRight />
            </li>
            <li className="breadcrumb-item">
              <Link href="/blogs">Blog</Link> <MdKeyboardArrowRight />
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {category_name?.replace(/-/g, " ") || "Loading..."}
            </li>
          </ol>
        </nav>
      </div>

      <div className="detail-blog container">
        <div className="detail-blog-right">
          {loading ? (
            <div className="blog-details-skeleton-card large"></div>
          ) : selectedBlog ? (
            <>
              <div className="detail-middle">
                {/* Above-the-fold hero/LCP image — must load eagerly. */}
                <img
                  src={`https://api.hachion.co/uploads/prod/blogs/${selectedBlog.blog_image}`}
                  alt={selectedBlog.title}
                  onError={handleImageError}
                  fetchPriority="high"
                  className="featured-blog-image"
                />
                <div>
                  <div className="detail-top">
                    <div className="detail-top-date">
                      {(() => {
                        const d = new Date(selectedBlog.date);
                        return d.toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric", timeZone: "UTC" });
                      })()}
                    </div>
                  </div>
                  <h1 className="blog-detail-title">{selectedBlog.title}</h1>
                </div>
              </div>

              {processedHtml && (
                <div className="estimated-read-time">
                  ⏱️ {Math.ceil(processedHtml.split(' ').length / 200)} min read
                  <span className="read-time-separator">•</span>
                  <span className="word-count">{processedHtml.split(' ').length} words</span>
                </div>
              )}

              {headings.length > 0 && <TableOfContents headings={headings} />}

              {/* processedHtml (heading ids, image-tag rewrites, FAQ
                  auto-links) and processBlogContent (Q&A card wrapping) both
                  require DOMParser, a browser-only API — unavailable during
                  SSR, so they're only computed by the client-side effect
                  above. Until that runs, fall back to the raw
                  (server-fetched, unprocessed) article HTML so the actual
                  article text — not an empty shell — is what's present in
                  the server-rendered HTML a crawler sees. */}
              <div
                className="topics enhanced-blog-content"
                dangerouslySetInnerHTML={{ __html: processedHtml ? processBlogContent(processedHtml) : selectedBlog.description || "" }}
              />
            </>
          ) : (
            <div className="blog-not-found">
              <p>Blog post not found</p>
            </div>
          )}

          <div className="detail-right">
            <div className="detail-right-icon">
              <p className="share-label">Share :</p>
              <FaFacebookF className="social-icon facebook" onClick={shareLinks.facebook} style={{ cursor: "pointer" }} />
              <FaTwitter className="social-icon twitter" onClick={shareLinks.twitter} style={{ cursor: "pointer" }} />
              <FaLinkedinIn className="social-icon linkedin" onClick={shareLinks.linkedin} style={{ cursor: "pointer" }} />
              <IoLogoWhatsapp className="social-icon whatsapp" onClick={shareLinks.whatsapp} style={{ cursor: "pointer" }} />
              <IoMdMail onClick={shareLinks.email} className="social-icon mail" />
            </div>
          </div>
        </div>

        <div className="detail-blog-left">
          <div className="search-input-blog">
            <div className="search-input-wrapper-blog">
              <BiSearch className="search-icon" />
              <input type="text" placeholder="Search blogs by title or category..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              {searchQuery && (
                <button className="search-clear-btn" onClick={() => setSearchQuery("")} aria-label="Clear search">
                  <BiX />
                  <span className="clear-tooltip">Clear</span>
                </button>
              )}
            </div>

            {searchQuery.trim() && (
              <div className="search-dropdown">
                <div className="dropdown-header">
                  <span className="results-count">{filteredBlogs.length} result{filteredBlogs.length !== 1 ? 's' : ''}</span>
                  {filteredBlogs.length > 6 && (
                    <span className="showing-count">Showing {Math.min(filteredBlogs.length, 10)} of {filteredBlogs.length}</span>
                  )}
                </div>

                <div className="dropdown-results">
                  {filteredBlogs.length > 0 ? filteredBlogs.slice(0, 10).map((blog) => (
                    <Link key={blog.id} href={getBlogUrl(blog)} className="search-dropdown-item" onClick={() => { setSearchQuery(""); window.scrollTo(0, 0); }}>
                      <div className="image-wrapper">
                        <img src={blog.blog_image} alt={blog.title} className="search-dropdown-img" onError={e => e.target.src = Blogimageplaceholder.src} />
                      </div>
                      <div className="search-dropdown-text">
                        <span className="search-dropdown-category">{blog.category_name}</span>
                        <p className="search-dropdown-title">{blog.title}</p>
                        <span className="read-more-hint">
                          Read <BsArrowRight className="arrow-icon" />
                        </span>
                      </div>
                    </Link>
                  )) : (
                    <div className="search-no-results">
                      <BiSearch className="no-results-icon" />
                      <div className="no-results-text">
                        No blogs found for &quot;<strong>{searchQuery}</strong>&quot;
                      </div>
                      <div className="no-results-suggestion">Try different keywords or browse all blogs</div>
                    </div>
                  )}
                </div>

                {filteredBlogs.length > 5 && <div className="scroll-indicator" />}
              </div>
            )}
          </div>

          <h3>Recent Post</h3>

          {recentLoading ? Array.from({ length: 5 }).map((_, i) => (
            <div className="recent-post-skeleton" key={i}>
              <div className="recent-skeleton-image"></div>
              <div className="recent-skeleton-text subtitle"></div>
              <div className="recent-skeleton-text title"></div>
            </div>
          )) : blogs.length > 0 ? blogs.slice(0, 5).map(blog => {
            const recentPostUrl = getBlogUrl(blog);
            return (
              <Link key={blog.id} href={recentPostUrl} className="recent-post-item" style={{ textDecoration: "none", color: "inherit" }} onClick={() => window.scrollTo(0, 0)}>
                <img src={blog.blog_image} alt={blog.title} className="recent-post-img" onError={e => e.target.src = Blogimageplaceholder.src} loading="lazy" />
                <div className="recent-post-text">
                  <div className="recent-post-row">
                    <FaCalendarAlt className="recent-post-date-icon" />
                    <p className="recent-post-date">
                      {(() => {
                        const d = new Date(blog.date);
                        return d.toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric", timeZone: "UTC" });
                      })()}
                    </p>
                  </div>
                  <h5 className="recent-post-title">{blog.title}</h5>
                </div>
              </Link>
            );
          }) : <p className="no-blogs-message">📭 No blogs available</p>}

          {selectedBlog && !loading && (
            <Suspense fallback={null}>
              <BlogInquiryForm blogTitle={selectedBlog?.category_name} />
            </Suspense>
          )}
        </div>
      </div>

      <div className="blog-bottom">
        <Suspense fallback={null}>
          <MoreBlogs scrollToTop={false} blogs={relatedBlogs} loading={recentLoading} />
        </Suspense>
      </div>
    </div>
  );
};
export default BlogDetails;
