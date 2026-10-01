"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import CardsPagination from "./Common/CardsPagination";
import "./Blogs.css";
import RecentEntriesCard from "./HomePage/TrendingBlogSection/components/RecentEntriesCard";
import { getBlogPath } from "@/lib/blogUrl";
import { API_BASE_URL } from "@/lib/apiBase";

const MoreBlogs = ({
  scrollToTop = false,
  // Optional: a caller (BlogDetails.jsx) that has already fetched and
  // curated a blog list (e.g. same-category-first "Related Blogs") can
  // pass it directly, skipping this component's own fetch entirely — no
  // duplicate API call, and the caller's curation (excluding the current
  // post, preferring its category) is respected instead of overwritten.
  blogs: providedBlogs,
  // Optional: when a controlling caller passes this (even `true`), this
  // component never self-fetches, full stop — it just reflects the
  // caller's own loading state. Without this, a caller whose data is still
  // loading (so `blogs` is momentarily empty) would look identical to "no
  // caller at all", and this component would race the caller's own fetch
  // for the same endpoint. Omit entirely for standalone usage with no
  // controlling parent — the original self-fetching behavior is unchanged.
  loading: externalLoading
}) => {
  const isControlled = externalLoading !== undefined;
  const [fetchedBlogs, setFetchedBlogs] = useState([]);
  const [selfLoading, setSelfLoading] = useState(!providedBlogs);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage, setCardsPerPage] = useState(4);

  // Fetch blogs from API (skipped entirely when a controlling caller owns
  // the data lifecycle, or when it already supplied a curated list)
  useEffect(() => {
    if (isControlled) return;
    // If this mounts before the caller's curated list is ready (e.g.
    // BlogDetails.jsx renders this unconditionally before `selectedBlog`
    // loads), `loading` initializes to `true` from the very first render.
    // Once `providedBlogs` later arrives, this effect re-fires — without
    // this explicit reset, `loading` would never flip back to `false` and
    // the section would be stuck on its skeleton state forever.
    if (providedBlogs) {
      // Syncs from the caller's prop (an external source relative to this
      // component's own mount-time state).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelfLoading(false);
      return;
    }
    const fetchBlogs = async () => {
      setSelfLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/blog`);
        const mappedBlogs = response.data.map(blog => ({
          ...blog,
          avatar: blog.authorImage ? `${API_BASE_URL}/uploads/prod/blogs/${blog.authorImage}` : "",
          blog_image: blog.blog_image ? `${API_BASE_URL}/uploads/prod/blogs/${blog.blog_image}` : ""
        }));

        const sortedBlogs = mappedBlogs.sort((a, b) => new Date(b.date) - new Date(a.date));
        setFetchedBlogs(sortedBlogs);
      } catch (error) {
        console.error("Error fetching blog data:", error);
      } finally {
        setSelfLoading(false);
      }
    };
    fetchBlogs();
  }, [providedBlogs, isControlled]);

  const loading = isControlled ? externalLoading : selfLoading;
  const blogs = providedBlogs || fetchedBlogs;

  // Dynamically adjust cards per page based on screen width
  useEffect(() => {
    const updateCardsPerPage = () => {
      const width = window.innerWidth;
      if (width <= 480) {
        setCardsPerPage(1);
      } else if (width <= 768) {
        setCardsPerPage(2);
      } else if (width <= 1024) {
        setCardsPerPage(3);
      } else {
        setCardsPerPage(4);
      }
    };
    updateCardsPerPage();
    window.addEventListener("resize", updateCardsPerPage);
    return () => window.removeEventListener("resize", updateCardsPerPage);
  }, []);

  const start = currentPage - 1;
  const end = start + cardsPerPage;
  const currentBlogs = blogs.slice(start, end);

  const handlePageChange = page => {
    const totalCards = blogs.length;
    const maxPage = Math.max(totalCards - cardsPerPage + 1, 1);
    const next = Math.min(Math.max(page, 1), maxPage);
    setCurrentPage(next);
    if (scrollToTop) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="training-events container">
      <div className="training-title-head">
        <div className="home-spacing">
          <h2 className="association-head">More Blogs</h2>
        </div>

        {blogs.length > cardsPerPage && (
          <div className="card-pagination-container">
            <CardsPagination currentPage={currentPage} totalCards={blogs.length} cardsPerPage={cardsPerPage} onPageChange={handlePageChange} />
          </div>
        )}
      </div>

      <div className="home-blog-cards">
        <div className="recent-entries-container">
          <div className="recent-entries-grid">
            {loading
              ? Array.from({ length: cardsPerPage }).map((_, index) => (
                  <div className="skeleton-card" key={index}></div>
                ))
              : currentBlogs.length > 0
              ? currentBlogs.map((blog) => {
                  const to = getBlogPath(blog) || "/blogs";
                  const date = (() => {
                    if (!blog?.date) return "Loading...";
                    const d = new Date(blog.date);
                    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
                  })();
                  return (
                    <RecentEntriesCard
                      key={blog.id}
                      imageSrc={blog.blog_image}
                      content={blog.title}
                      category={blog.category_name}
                      description={blog.description}
                      author={blog.author}
                      avatarSrc={blog.avatar}
                      date={date}
                      to={to}
                      onClick={() => window.scrollTo(0, 0)}
                    />
                  );
                })
              : <p>No blogs found.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoreBlogs;
