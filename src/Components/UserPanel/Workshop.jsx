import React, { useState, useEffect } from 'react';
import Topbar from './Topbar';
import NavbarTop from './NavbarTop';
import Footer from './Footer';
import StickyBar from './StickyBar';
import WorkshopCard from './WorkshopCard';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Corporate.css';

const Workshop = () => {
  const [workshops, setWorkshops] = useState([]);
  const [filteredWorkshops, setFilteredWorkshops] = useState([]);
  const [category, setCategory] = useState([]);
  const [courseCategory, setCourseCategory] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [sortOrder, setSortOrder] = useState('newest');

  const navigate = useNavigate();

  useEffect(() => {
  const fetchWorkshops = async () => {
    try {
      const response = await axios.get('https://api.test.hachion.co/workshopschedule');
      const data = response.data;

      setWorkshops(data);
      setFilteredWorkshops(data);

      // Extract unique categories
      const categoryMap = new Map();
      data.forEach(w => {
        if (w.category && w.category.name && !categoryMap.has(w.category.name)) {
          categoryMap.set(w.category.name, w.category);
        }
      });

      // Extract unique courses
      const courseMap = new Map();
      data.forEach(w => {
        if (w.course && w.course.title && !courseMap.has(w.course.title)) {
          courseMap.set(w.course.title, w.course);
        }
      });

      setCategory(Array.from(categoryMap.values()));
      setCourseCategory(Array.from(courseMap.values()));

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
    selectedCategories.includes(w.category?.category_name)
  );
}

if (selectedCourses.length > 0) {
  filtered = filtered.filter(w =>
    selectedCourses.includes(w.course?.course_name)
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
      <div className='home-background'>
        <Topbar />
        <NavbarTop />
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

        <div className="workshop-page">
          <aside className="workshop-sidebar">
            <h4>Filter</h4>

            <h6>Category</h6>
{category.map((cat) => (
  <label key={cat.id} style={{ display: 'block', marginBottom: '6px' }}>
    <input
      type="checkbox"
      checked={selectedCategories.includes(cat.category_name)}
      onChange={() => handleCheckboxChange(cat.category_name, 'category')}
      style={{ marginRight: '8px' }}
    />
    {cat.category_name}
  </label>
))}

           <h6>Course</h6>
{courseCategory.map((course) => (
  <label key={course.id} style={{ display: 'block', marginBottom: '6px' }}>
    <input
      type="checkbox"
      checked={selectedCourses.includes(course.course_name)}
      onChange={() => handleCheckboxChange(course.course_name, 'course')}
      style={{ marginRight: '8px' }}
    />
    {course.course_name}
  </label>
))}

            <h6 style={{ whiteSpace: 'nowrap' }}>Sort by Date</h6>
            <div className="filter-workshop">
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
        <Footer />
      </div>
      <StickyBar />
    </>
  );
};

export default Workshop;
