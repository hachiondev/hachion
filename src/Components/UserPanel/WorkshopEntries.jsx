import React, { useEffect, useState } from 'react';
import axios from 'axios';
import WorkshopEntriesCard from './WorkshopEntriesCard';
import './Blogs.css';
import { useNavigate } from 'react-router-dom';

const WorkshopEntries = () => {
  const navigate = useNavigate();
  const [workshop, setWorkshop] = useState([]);

  useEffect(() => {
    const fetchWorkshop = async () => {
      try {
        const response = await axios.get('https://api.test.hachion.co/workshopschedule');
        setWorkshop(response.data);
      } catch (error) {
        console.error('Error fetching workshop data:', error);
      }
    };

    fetchWorkshop();
  }, []);

  const slugify = (text) =>
    (text || '')
      .toString()
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');

  return (
    <div className="workshop-entries">
      {workshop.length > 0 ? (
        workshop.map((entry) => (
          <WorkshopEntriesCard
            key={entry.id}
            banner_image={`https://api.test.hachion.co/${entry.banner_image}`}
            title={entry.title}
            date={(() => {
              if (!entry?.date) return 'Loading...';
              const d = new Date(entry.date);
              const mm = String(d.getMonth() + 1).padStart(2, '0');
              const dd = String(d.getDate()).padStart(2, '0');
              const yyyy = d.getFullYear();
              return `${mm}-${dd}-${yyyy}`;
            })()}
            time={entry.time}
            timeZone={entry.time_zone}
            onClick={() => {
            window.scrollTo(0, 0);
            navigate(`/workshop/${slugify(entry.title)}`);
            }}
          />
        ))
      ) : (
        <p>Loading Workshop entries...</p>
      )}
    </div>
  );
};

export default WorkshopEntries;
