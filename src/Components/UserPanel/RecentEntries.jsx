
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
        
        const { data } = await axios.get("https://api.hachion.co/blog/recent");

        
        const mapped = data.map((row) => {
          const [
            id,
            category_name,
            title,
            author,
            author_image,
            blog_image,
            date,
          ] = row;

          const avatar = author_image
            ? `https://api.hachion.co/uploads/prod/blogs/${author_image}`
            : "";

          const blogImg = blog_image
            ? `https://api.hachion.co/uploads/prod/blogs/${blog_image}`
            : "";

          return {
            id,
            category_name,
            title,
            author,
            date,
            avatar,
            blog_image: blogImg,
            
          };
        });

        setBlogs(mapped);
      } catch (error) {
        console.error("Error fetching blog data:", error);
      }
    };
    fetchBlogs();
  }, []);

  
  const visibleBlogs = blogs;

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
                imageSrc={blog.blog_image}
                content={blog.title}
                category={blog.category_name}
                
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
                    `/blogs/${blog.category_name.replace(/\s+/g, "-").toLowerCase()}/${blog.id}`
                  );
                  window.scrollTo(0, 0);
                }}
              />
            ))}
          </div>
        </div>
        <button
          className="home-start-button"
          onClick={() => { navigate("/blogs"); }}
        >
          View More Blogs
        </button>
      </div>
    </div>
  );
};

export default RecentEntries;
