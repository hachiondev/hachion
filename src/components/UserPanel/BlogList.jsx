"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BsPersonCircle } from "react-icons/bs";
import Blogimageplaceholder from "@/assets/blogplaceholder.webp";
import { getBlogPath } from "@/lib/blogUrl";
import "./Bloglist.css";
const BlogList = ({
  selectedCategories,
  // Every known category (reported by BlogsSidebar once its own
  // /blog/categories fetch resolves) — used as the filter's category list
  // when the visitor hasn't clicked any category checkbox yet, so the page
  // shows every blog by default instead of showing nothing until a category
  // is chosen.
  allCategories,
  currentPage,
  cardsPerPage,
  onTotalBlogsChange
}) => {
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const hasExplicitSelection = selectedCategories && selectedCategories.length > 0;
    const categoriesToFetch = hasExplicitSelection ? selectedCategories : allCategories;

    const fetchBlogs = async () => {
      if (!categoriesToFetch || categoriesToFetch.length === 0) {
        // Categories haven't loaded yet (and none were explicitly picked) —
        // this is a loading state, not "nothing to show".
        setLoading(true);
        return;
      }
      setLoading(true);
      try {
        const res = await axios.get(`https://api.hachion.co/blog/filter`, {
          params: {
            category: categoriesToFetch
          }
        });
        const mapped = res.data.map(row => {
          const [id, category_name, title, shortTitle, author, author_image, blog_image, date] = row;
          const avatarPath = author_image || "";
          const blogImagePath = blog_image || "";
          return {
            id,
            category_name,
            title,
            shortTitle: shortTitle,
            author,
            date,
            avatar: avatarPath ? `https://api.hachion.co/uploads/prod/blogs/${avatarPath}` : "",
            blog_image: blogImagePath ? `https://api.hachion.co/uploads/prod/blogs/${blogImagePath}` : ""
          };
        });
        setBlogs(mapped);
        onTotalBlogsChange(mapped.length);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [selectedCategories, allCategories, onTotalBlogsChange]);
  const indexOfLast = currentPage * cardsPerPage;
  const indexOfFirst = indexOfLast - cardsPerPage;
  const currentBlogs = blogs.slice(indexOfFirst, indexOfLast);
  const handleImageError = e => {
    e.target.src = Blogimageplaceholder.src;
  };
  const getBlogUrl = blog => getBlogPath(blog) || "/blogs";
  const handleCardClick = blog => {
    router.push(getBlogUrl(blog));
  };
  return <div className="blog-list p-2">
      {loading ? Array.from({
      length: cardsPerPage
    }).map((_, i) => <div className="skeleton-card" key={i}></div>) : currentBlogs.length > 0 ? currentBlogs.map(blog => <div key={blog.id} className="bloglist-card" role="button" tabIndex={0} onClick={() => handleCardClick(blog)} onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleCardClick(blog)} style={{
      cursor: "pointer"
    }}>
            <img src={blog.blog_image} alt={blog.title} className="recent-blog-card-image" onError={handleImageError} />
            <div className="content-block">
              {blog.category_name && <span className="category-badge">{blog.category_name}</span>}
              <h3 className="content">{blog.title}</h3>

              <div className="author-info">
                {blog.avatar ? <img src={blog.avatar} alt={blog.author} className="author-avatar" onError={e => e.target.style.display = "none"} /> : <BsPersonCircle size={48} color="#b3b3b3" />}
                <div className="author-details">
                  <p className="blog-author">{blog.author}</p>
                  <p className="date">
                    {blog.date ? new Date(blog.date).toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric"
              }) : ""}
                  </p>
                </div>
              </div>
            </div>
            <Link href={getBlogUrl(blog)} className="txtReadmore" prefetch={false} onClick={e => e.stopPropagation()}>
  Read More
      </Link>
          </div>) : <p>No blogs found.</p>}
    </div>;
};
export default BlogList;
