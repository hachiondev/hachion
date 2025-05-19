import React, {useState, useEffect} from 'react'
import Topbar from './Topbar';
import NavbarTop from './NavbarTop';
import Footer from './Footer';
import StickyBar from './StickyBar';
import WorkshopCard from './WorkshopCard';
import {MdKeyboardArrowRight} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Workshop = () => {
const [workshops, setWorkshops] = useState([]);
useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const response = await axios.get('https://api.hachion.co/workshopschedule');
        setWorkshops(response.data);
      } catch (error) {
        console.error('Error fetching workshop data:', error);
      }
    };

    fetchWorkshops();
  }, []);
const navigate=useNavigate();
const slugify = (text) =>
    text
      .toString()
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-') 
  return (
    <>
   <div className='home-background'>
<Topbar/>
<NavbarTop/>
<div>
    <h1 className='course-banner-content'>Workshop</h1>
</div>
<div className='blogs-header'>
      <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/">Home</a> <MdKeyboardArrowRight/> </li>
            <li className="breadcrumb-item active" aria-current="page">
            Workshop
            </li>
          </ol>
        </nav>
        </div>

   <div className="blogs-container">

      {workshops.length > 0 ? (
            workshops.map((workshop) => {
              const slug = slugify(workshop.course_name);
              return (
                <WorkshopCard
                  key={workshop.id}
                  banner_image={`https://api.hachion.co/${workshop.banner_image}`}
                  title={workshop.course_name}
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
            <p>Loading recent workshops...</p>
      )}
    </div>
<Footer/>
</div>
<StickyBar/>

    </>
  );
}

export default Workshop;