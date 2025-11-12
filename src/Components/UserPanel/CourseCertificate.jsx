import React,{useState,useEffect} from 'react'
import './Course.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Certificate from '../../Assets/newcertificate.png';
import { FaRegHandPointRight } from "react-icons/fa";

const CourseCertificate = () => {
const { courseName } = useParams();
   const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
    const [course, setCourse] = useState(null);

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
  if (!course) return <div>Course not found</div>;

  return (
    <div>
    <div className='qa-course'>
    <div className='qa-course-heading'>
    <h2 className='qa-heading'>{course.courseName} Certification</h2>
            <div className='cert-content'>
            <p>
                Hachion's Course online training program is designed to make you proficient in all aspects of Course. This course not only enhances your expertise in the field but also prepares you for Course Certification, ensuring you stand out as a skilled professional.
            </p>
            <div className='points'>
            <p><strong>Benefits of Course Certification from Hachion :</strong></p>
            <ol>
          <li className='cert-content-points'><span className='point-icon'><FaRegHandPointRight  /></span> <div><strong>Industry Recognition : </strong>Hachion certificates are valued by employers and help validate your expertise in trending technologies.</div></li>
          <li className='cert-content-points'><span className='point-icon'><FaRegHandPointRight  /></span> <div><strong>Hands-On Skill Development : </strong>Courses focus on practical, real-world projects to build job-ready skills and boost technical confidence.</div></li>
          <li className='cert-content-points'><span className='point-icon'><FaRegHandPointRight  /></span> <div><strong>Enhanced Job Opportunities : </strong>Certified learners often see increased chances of getting shortlisted for interviews and securing better job roles.</div></li>
          <li className='cert-content-points'><span className='point-icon'><FaRegHandPointRight  /></span> <div><strong>Expert Mentorship : </strong>Learn directly from industry professionals who provide insights, best practices, and personalized guidance.</div></li>
          <li className='cert-content-points'><span className='point-icon'><FaRegHandPointRight  /></span> <div><strong>Interview Preparation Support : </strong>Includes mock interviews and soft skill training to help you perform confidently in real hiring scenarios.</div></li>
          <li className='cert-content-points'><span className='point-icon'><FaRegHandPointRight  /></span> <div><strong>Lifelong Learning Access : </strong>Stay updated with evolving technology trends through access to course updates, alumni networks, and support channels.</div></li>
          </ol>
          </div>
          <img className='course-cert-img' src={Certificate} alt='Certificate Img' loading="lazy"/>
          </div>

    </div>
    </div>
    </div>
  )
}

export default CourseCertificate
