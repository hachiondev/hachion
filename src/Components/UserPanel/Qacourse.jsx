import React,{useState,useEffect} from 'react'
import './Course.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Qacourse = () => {
const { courseName } = useParams(); // Extract course_id from URL params
   const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
    const [course, setCourse] = useState(null);
  // useEffect(() => {
  //   const fetchCourseData = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await axios.get(`https://api.hachion.co/courses/${course_id}`);
        
  //       if (response.data) {
  //         setCourse(response.data); // Set course details from API response
  //       } else {
  //         setError('Course not found');
  //       }
  //     } catch (err) {
  //       setError('Error fetching course data');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   if (course_id) {
  //     fetchCourseData();
  //   } else {
  //     console.error('Course ID is missing!');
  //   }
  // }, [course_id]);
  // if (loading) return <div>Loading...</div>;
  //   if (error) return <div>{error}</div>;
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://api.hachion.co/courses/all');
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
  return (<>
    <div className='qa-course'>
        <div className='qa-course-heading'>
 <h1 className='qa-heading'> About {course.courseName}</h1>
 <h3 className='qa-subheading'>What is {course.courseName}</h3>
 <p className='qa-sub-content'>{course.courseDescription}</p>
        </div>
    </div>
    </>)
}

export default Qacourse