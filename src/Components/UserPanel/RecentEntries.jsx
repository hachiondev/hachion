import React, { useEffect, useState } from "react";
import axios from "axios";
import RecentEntriesCard from "./RecentEntriesCard";
import "./Blogs.css";
import { useNavigate } from "react-router-dom";

const RecentEntries = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);

 useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("https://api.test.hachion.co/blog");

        const mappedBlogs = response.data.map((blog) => ({
          ...blog,
          avatar: blog.authorImage
            ? `https://api.test.hachion.co/uploads/prod/blogs/${blog.authorImage}`
            : "", 
          blog_image: blog.blog_image
            ? `https://api.test.hachion.co/uploads/prod/blogs/${blog.blog_image}`
            : "",
        }));

        setBlogs(mappedBlogs.reverse());
      } catch (error) {
        console.error("Error fetching blog data:", error);
      }
    };
    fetchBlogs();
  }, []);

  const visibleBlogs = blogs.slice(0, 8);
  return (
    <div className="training-events container">
      <h2 className='association-head'>Trending Blog</h2>
      <p className="association-head-tag">Discover our useful resources and read articles on different categories</p>
      <div className="home-blog-cards">
    <div className="recent-entries-container">
    <div className="recent-entries-grid">
      {visibleBlogs.map((blog) => (
        <RecentEntriesCard
          key={blog.id}
          imageSrc={`https://api.test.hachion.co/blogs/${blog.blog_image}`}
          content={blog.title}
          category={blog.category_name}
          description={blog.description}
          author={blog.author}
          avatarSrc={blog.avatar}
          date={(() => {
            if (!blog?.date) return "Loading...";
            const d = new Date(blog.date);
            const options = { year: "numeric", month: "long", day: "numeric" };
            return d.toLocaleDateString("en-US", options);
          })()}
          onClick={() => {
            navigate(
              `/blogs/${blog.category_name
                .replace(/\s+/g, "-")
                .toLowerCase()}/${blog.id}`
            );
            window.scrollTo(0, 0);
          }}
        />
      ))}
    </div>
    </div>
    <button
  className="home-start-button"
  onClick={() => {
    navigate("/blogs");}}>
  View More Blogs
</button>
    </div>
    </div>
  );
};

export default RecentEntries;
