import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Blogs.css";
import { useNavigate } from "react-router-dom";
import RecentEntriesCard from "./TrendingBlogSection/components/RecentEntriesCard";

const LatestArticles = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        
        const response = await axios.get("https://api.test.hachion.co/blog/recent");
        const mappedBlogs = response.data.map((row) => {
          const [
            id,
            category_name,
            title,
            author,
            author_image,
            blog_image,
            date,
          ] = row;

          const avatarPath = author_image || "";
          const blogImagePath = blog_image || "";

          return {
            id,
            category_name,
            title,
            author,
            date,
            
            description: "",
            avatar: avatarPath
              ? `https://api.test.hachion.co/uploads/prod/blogs/${avatarPath}`
              : "",
            blog_image: blogImagePath
              ? `https://api.test.hachion.co/uploads/prod/blogs/${blogImagePath}`
              : "",
          };
        });

        setBlogs(mappedBlogs);
      } catch (error) {
        console.error("Error fetching blog data:", error);
      }
    };

    fetchBlogs();
  }, []);

  const visibleBlogs = blogs.slice(0, 4);

  return (
    <div className="training-events container">
      <h2 className="trending-title">Latest Articles</h2>
      <div className="home-blog-cards">
        <div className="recent-entries-container">
          <div className="recent-entries-grid">
            {visibleBlogs.map((blog) => (
              <RecentEntriesCard
                key={blog.id}
                imageSrc={`${blog.blog_image}`}
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
      </div>
    </div>
  );
};

export default LatestArticles;
