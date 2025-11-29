import React, { useState, useEffect } from 'react';
import WorkshopCard from './WorkshopCard';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Corporate.css';
import { Helmet } from 'react-helmet-async';

const Workshop = () => {
  const [workshops, setWorkshops] = useState([]);
  const [filteredWorkshops, setFilteredWorkshops] = useState([]);
  const [category, setCategory] = useState([]);
  const [courseCategory, setCourseCategory] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [sortOrder, setSortOrder] = useState('newest');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const response = await axios.get('https://api.test.hachion.co/workshopschedule');
        const data = response.data;

        setWorkshops(data);
        setFilteredWorkshops(data);

        // Extract unique used category and course names from workshops
        const categoriesUsed = Array.from(new Set(data.map(w => w.category_name).filter(Boolean)));
        const coursesUsed = Array.from(new Set(data.map(w => w.course_name).filter(Boolean)));

        setCategory(categoriesUsed);
        setCourseCategory(coursesUsed);
      } catch (error) {
        console.error('Error fetching workshop data:', error);
      }
    };

    fetchWorkshops();
  }, []);

  useEffect(() => {
    let filtered = [...workshops];

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(w =>
        selectedCategories.includes(w.category_name)
      );
    }

    if (selectedCourses.length > 0) {
      filtered = filtered.filter(w =>
        selectedCourses.includes(w.course_name)
      );
    }

    if (sortOrder === 'newest') {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortOrder === 'oldest') {
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    setFilteredWorkshops(filtered);
  }, [selectedCategories, selectedCourses, sortOrder, workshops]);

  const slugify = (text) =>
    text
      .toString()
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');

  const handleCheckboxChange = (value, type) => {
    if (type === 'category') {
      setSelectedCategories(prev =>
        prev.includes(value) ? prev.filter(c => c !== value) : [...prev, value]
      );
    } else if (type === 'course') {
      setSelectedCourses(prev =>
        prev.includes(value) ? prev.filter(c => c !== value) : [...prev, value]
      );
    }
  };

  return (
    <>
    <Helmet>
          <title>IT Certification Workshops | Job-Ready Skills | Hachion</title>
          <meta name="description" content="Join hands-on IT workshops in the US! Get certified in high-demand tech skills with expert-led training. Boost your career today - limited seats available!" />
          <meta name="keywords" content="IT workshops USA, tech certification training, hands-on IT courses, best IT workshops 2025, IT skills training near me, certified tech workshops" />
          <meta property="og:title" content="Online IT Training: Get Certified, Find Your Dream Job" />
          <meta property="og:description" content="Learn online with the best courses at Hachion." />
          <meta property="og:image" content="/Hachion-logo.png" />
          <link rel="canonical" href="https://hachion.co/workshop" />
          <script type="application/ld+json">
            {`
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "Hachion",
                "url": "https://www.hachion.co",
                "logo": "https://www.hachion.co/Hachion-logo.png",
                "sameAs": [
                "https://www.facebook.com/hachion.co",
                "https://x.com/hachion_co",
                "https://www.linkedin.com/company/hachion",
                "https://www.instagram.com/hachion_trainings",
                "https://www.quora.com/profile/Hachion-4",
                "https://www.youtube.com/@hachion"
              ]
              }
            `}
          </script>
        </Helmet>
      <div className='home-background'>
        <div>
          <h1 className='course-banner-content'>Workshop</h1>
        </div>
        <div className='blogs-header'>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/">Home</a> <MdKeyboardArrowRight />
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Workshop
              </li>
            </ol>
          </nav>
        </div>

        <div className="mobile-filter-toggle">
        <button className='clear-button' onClick={() => setShowMobileFilters(!showMobileFilters)}>
          {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>
        <div className="workshop-page">
          <aside className={`workshop-sidebar ${showMobileFilters ? 'show' : 'hide'}`}>
            <h4>Filter</h4>
            <p className="workshop-note">Select either Category or Course filter not both.</p>
            <h6>Category</h6>
            {category.map((cat, index) => (
              <label key={index} style={{ display: 'block', marginBottom: '6px', marginLeft: '8px' }}>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => handleCheckboxChange(cat, 'category')}
                  style={{ marginRight: '8px' }}
                />
                {cat}
              </label>
            ))}

            <h6>Course</h6>
            {courseCategory.map((course, index) => (
              <label key={index} style={{ display: 'block', marginBottom: '6px', marginLeft: '8px' }}>
                <input
                  type="checkbox"
                  checked={selectedCourses.includes(course)}
                  onChange={() => handleCheckboxChange(course, 'course')}
                  style={{ marginRight: '8px' }}
                />
                {course}
              </label>
            ))}

            <h6 style={{ whiteSpace: 'nowrap' }}>Sort by Date</h6>
            <div className="filter-workshop">
              <div>
              <label>
                <input
                  type="radio"
                  name="sort"
                  style={{ marginRight: '8px' }}
                  checked={sortOrder === 'newest'}
                  onChange={() => setSortOrder('newest')}
                />
                Newest
              </label>
              </div>
              <div>
              <label>
                <input
                  type="radio"
                  name="sort"
                  style={{ marginRight: '8px' }}
                  checked={sortOrder === 'oldest'}
                  onChange={() => setSortOrder('oldest')}
                />
                Oldest
              </label>
              </div>
            </div>
            <div className='clear-align'>
            <button
            onClick={() => {
              setSelectedCategories([]);
              setSelectedCourses([]);
              setSortOrder('newest');
            }}
            className='clear-button'
          >
            Clear Filters
          </button>
          </div>
          </aside>

          <div className="workshop-container">
            {filteredWorkshops.length > 0 ? (
              filteredWorkshops.map((workshop) => {
                const slug = slugify(workshop.title);
                return (
                  <WorkshopCard
                    key={workshop.id}
                    banner_image={`https://api.test.hachion.co/${workshop.banner_image}`}
                    title={workshop.title}
                    date={(() => {
                      if (!workshop?.date) return 'Loading...';
                      const d = new Date(workshop.date);
                      const mm = String(d.getMonth() + 1).padStart(2, '0');
                      const dd = String(d.getDate()).padStart(2, '0');
                      const yyyy = d.getFullYear();
                      return `${mm}-${dd}-${yyyy}`;
                    })()}
                    time={workshop.time}
                    timeZone={workshop.time_zone}
                    onClick={() => navigate(`/workshop/${slug}`)}
                  />
                );
              })
            ) : (
              <p>No workshops found.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Workshop;
