// import React from 'react'
// import './Course.css';
// import image1 from '../../Assets/image 125.png';

// const Qacourse = () => {
//   return (<>
//     <div className='qa-course'>
//         <div className='qa-course-heading'>
//  <h1 className='qa-heading'> About QA Automation Course</h1>
//  <h3 className='qa-subheading'>What is QA Automation</h3>
//  <p className='qa-sub-content'>QA Automation mainly focuses on software tools to execute preset tests on a software program before its release into production. This automated technique improves testing efficiency, lowers manual work, and provides more correctness, consequently speeding up the software development lifecycle.</p>
//      <h3 className='qa-subheading'>Want to Become a QA Automation Engineer?</h3>  
//        <p className='qa-sub-content'>To become a QA Automation Engineer requires a combination of technical expertise, industry understanding, and hands-on expertise. Our thorough education at Hachion provides a clear path to accomplishing your professional goal.</p> 
//         <h3 className='qa-subheading'>Automated QA Testing</h3>
//         <p className='qa-sub-content'>Automated QA testing has become vital in modern development techniques, especially inside continuous integration and continuous deployment (CI/CD) pipelines. Our training emphasizes the value of automated testing for preserving software quality, speeding up regression testing, and lowering the expenses associated with manual testing efforts. You will learn how to create powerful automated test suites that verify new code modifications do not cause faults in current functionalities. QA Automation Engineer Jobs</p>
//         <p className='qa-sub-content'>The need for qualified QA Automation Engineers is increasing, with opportunities in finance, healthcare, technology, and retail. Our training prepares you for a variety of  QA Automation jobs.</p>
//         <img src={image1} alt='key-benefits'/>
//         <h3 className='qa-subheading'>Why Choose Hachion?</h3>
//         <p className='qa-sub-content'>Hachion provides the best QA automation course in the USA, designed to fulfill industry requirements. In Hachion we provide a hands-on training approach that will excel in the field of QA Automation.</p>
//         <h3 className='qa-subheading'>Conclusion</h3>
//         <p className='qa-sub-content'>Enroll in Hachion's QA Automation course today whether you are a beginner or a professional trying to improve your skills, this course will provide you with all the knowledge, tools, and hands-on experience you need to become a skilled QA Automation Engineer.</p>
//         <p className='qa-sub-content'>Join Hachion today and take the first step towards mastering the QA automation course today.</p>
//         <h3 className='qa-subheading'>Related Links:
//         Python</h3>
//         </div>
//     </div>
//     </>)
// }

// export default Qacourse

// import React from 'react';
// import './Course.css';
// import image1 from '../../Assets/image 125.png';

// const Qacourse = () => {
//   return (
//     <div className='qa-course'>
//       <div className='qa-course-heading'>
//         <h1 className='qa-heading'>About QA Automation Course</h1>
        
//         <h3 className='qa-subheading'>What is QA Automation</h3>
//         <p className='qa-sub-content'>
//           QA Automation mainly focuses on software tools to execute preset tests on a software program before its release into production.
//         </p>

//         <h3 className='qa-subheading'>Key Benefits of QA Automation</h3>
//         <ul>
//           <li>Reduces manual testing efforts</li>
//           <li>Increases test efficiency and accuracy</li>
//           <li>Speeds up the software development lifecycle</li>
//           <li>Enhances CI/CD integration</li>
//         </ul>

//         <h3 className='qa-subheading'>Want to Become a QA Automation Engineer?</h3>
//         <p className='qa-sub-content'>
//           To become a QA Automation Engineer requires a combination of technical expertise, industry understanding, and hands-on expertise.
//         </p>

//         <h3 className='qa-subheading'>Automated QA Testing</h3>
//         <ul>
//           <li>Ensures software quality through automated tests</li>
//           <li>Speeds up regression testing</li>
//           <li>Reduces manual testing costs</li>
//         </ul>

//         <img src={image1} alt='key-benefits' />

//         <h3 className='qa-subheading'>Why Choose Hachion?</h3>
//         <p className='qa-sub-content'>
//           Hachion provides the best QA automation course in the USA, designed to fulfill industry requirements.
//         </p>

//         <h3 className='qa-subheading'>Conclusion</h3>
//         <p className='qa-sub-content'>
//           Enroll in Hachion's QA Automation course today whether you are a beginner or a professional trying to improve your skills.
//         </p>

//         <h3 className='qa-subheading'>Related Links: Python</h3>
//       </div>
//     </div>
//   );
// };

// export default Qacourse;

import React,{useState,useEffect} from 'react'
import './Course.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Qacourse = () => {
const { courseName } = useParams(); // Extract course_id from URL params
   const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
    const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8080/courses/all');
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
 {/* <p className='qa-sub-content'>{course.courseDescription}</p> */}
 <div className="qa-sub-content" dangerouslySetInnerHTML={{ __html: course.courseDescription.trim() }} />
        </div>
    </div>
    </>)
}

export default Qacourse