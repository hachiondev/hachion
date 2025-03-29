import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RecentEntriesCard from './RecentEntriesCard';
import './Blogs.css';
import { useNavigate } from 'react-router-dom';

const RecentEntries = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]); // State to store blogs

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('http://localhost:8080/blog');
        setBlogs(response.data); // Store API data in state
      } catch (error) {
        console.error('Error fetching blog data:', error);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className='recent-entries'>
      {blogs.length > 0 ? (
        blogs.map((blog) => (
          <RecentEntriesCard
            key={blog.id} // Unique key
            imageSrc={`http://localhost:8080/blogs/${blog.blog_image}`} // Correct image URL
            content={blog.title}
            views={blog.views || '100'} // Fallback if views are missing
            date={blog.date}
            onClick={() => navigate(`/blogs/${blog.category_name}`)} // Dynamic navigation
          />
        ))
      ) : (
        <p>Loading recent entries...</p>
      )}
    </div>
  );
};

export default RecentEntries;