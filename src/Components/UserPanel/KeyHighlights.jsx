import React,{useState,useEffect} from 'react'
import './Course.css'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import LiveOnline from '../../Assets/la_chalkboard-teacher.webp';
import LiveVideo from '../../Assets/ri_live-line.webp';
import LiveProject from '../../Assets/heroicons_rocket-launch.webp';
import JobAssistance from '../../Assets/marketeq_work.webp';
import Resume from '../../Assets/mi_document.webp';
import Certification from '../../Assets/tabler_certificate.webp'

const KeyHighlights = () => {
    // const { course_id } = useParams(); // Extract course_id from URL params
  const { courseName } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  

    useEffect(() => {
      const fetchCourse = async () => {
        try {
          setLoading(true);
          const response = await axios.get('https://api.test.hachion.co/courses/all');
          const courseData = response.data.find(
            (c) => c.courseName.toLowerCase().replace(/\s+/g, '-') === courseName
          );
          setCourse(courseData);
        } catch (error) {
          console.error('Error fetching course details:', error);
        }finally {
                setLoading(false);
      }
    }
  
      fetchCourse();
    }, [courseName]);
  
    
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
  
  return (
    <>
   <div className='key-highlights'>
   <h2 className='qa-heading '>Key Highlights</h2>
   <div className='key-highlights-header'>
    <div className='key-highlights-content'>
        <img src={LiveOnline} alt='teaching-online' className='key-icons' loading="lazy"/>
        <p className='key-highlights-para'>{course.keyHighlights1}</p>
    </div>
    <div className='key-highlights-content'>
        <img src={LiveVideo} alt='video' className='key-icons' loading="lazy"/>
        <p className='key-highlights-para'>{course.keyHighlights2}</p>
    </div>
    <div className='key-highlights-content'>
        <img src={LiveProject} alt='live-projects' className='key-icons' loading="lazy"/>
        <p className='key-highlights-para'>{course.keyHighlights3}</p>
    </div>
    <div className='key-highlights-content'>
        <img src={JobAssistance} alt='job-assistance'  className='key-icons' loading="lazy"/>
        <p className='key-highlights-para'>{course.keyHighlights4} </p>
    </div>
    <div className='key-highlights-content'>
        <img src={Resume} alt='Resume' className='key-icons' loading="lazy"/>
        <p className='key-highlights-para'>{course.keyHighlights5}</p>
    </div>
    <div className='key-highlights-content'>
        <img src={Certification} alt='certification' className='key-icons' loading="lazy"/>
        <p className='key-highlights-para'>{course.keyHighlights6}</p>
    </div>

   </div>
   </div>
    </>
  )
}

export default KeyHighlights