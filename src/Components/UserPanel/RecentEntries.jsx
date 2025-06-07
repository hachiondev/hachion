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
        const response = await axios.get('https://api.hachion.co/blog');
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
  key={blog.id}
  imageSrc={`https://api.hachion.co/blogs/${blog.blog_image}`}
  content={blog.title}
  views={blog.views || '100'}
  date={blog.date}
  onClick={() =>
    navigate(`/blogs/${blog.category_name.replace(/\s+/g, '-').toLowerCase()}`)
  }
/>

        ))
      ) : (
        <p>Loading recent entries...</p>
      )}
    </div>
  );
};

export default RecentEntries;