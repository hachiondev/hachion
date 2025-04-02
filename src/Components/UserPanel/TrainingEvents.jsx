// import React, { useEffect, useState } from 'react'; 
// import TrainingCard from './TrainingCard';
// import './Home.css';
// import { useNavigate } from 'react-router-dom';
// import dayjs from 'dayjs';
// import utc from 'dayjs/plugin/utc';
// import timezone from 'dayjs/plugin/timezone';

// dayjs.extend(utc);
// dayjs.extend(timezone);

// const TrainingEvents = () => {
//   const navigate = useNavigate();
//   const [mergedCourses, setMergedCourses] = useState([]);
//   const [viewAll, setViewAll] = useState(false);
//   const [userTimezone, setUserTimezone] = useState('UTC');

//   useEffect(() => {
//     const fetchTimezone = async () => {
//       try {
//         const geoResponse = await fetch('https://ipinfo.io?token=82aafc3ab8d25b');
//         const geoData = await geoResponse.json();
//         const detectedTimezone = geoData.timezone || 'UTC';
//         setUserTimezone(detectedTimezone);
//       } catch (error) {
//         console.error('Error fetching timezone:', error);
//         setUserTimezone('UTC'); // Fallback timezone
//       }
//     };

//     fetchTimezone();
//   }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [scheduleResponse, coursesResponse] = await Promise.all([
//           fetch('https://api.hachion.co/schedulecourse').then((res) => res.json()),
//           fetch('https://api.hachion.co/courses/all').then((res) => res.json()),
//         ]);

//         if (!Array.isArray(scheduleResponse) || !Array.isArray(coursesResponse)) {
//           throw new Error("Invalid API response format");
//         }

//         const mergedData = scheduleResponse.map((scheduleItem) => {
//           const matchingCourse = coursesResponse.find(
//             (course) => course.courseName.toLowerCase() === scheduleItem.schedule_course_name.toLowerCase()
//           );

//           return {
//             ...scheduleItem,
//             course_id: matchingCourse?.id || null,
//             course_image: matchingCourse?.courseImage || '',
//           };
//         });

//         console.log('Merged Courses:', mergedData);
//         setMergedCourses(mergedData);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     fetchData();
//   }, []);

//   // Format Date and Time separately for clear display
//   const formatDate = (dateString) => {
//     if (!dateString) return 'TBA';
//     return dayjs(dateString).tz(dayjs.tz.guess()).format('MMM DD YYYY');
//   };
  
//   // Format Time Only with Timezone Abbreviation (e.g., 02:30 AM IST)
// // Format Time with Proper Timezone Abbreviation
// const timezoneAbbreviationMap = {
//   'Asia/Kolkata': 'IST',
//   'Asia/Dubai': 'GST',
//   'Asia/Tokyo': 'JST',
//   'Asia/Singapore': 'SGT',
//   'Asia/Seoul': 'KST',
//   'Europe/London': 'GMT',
//   'Europe/Paris': 'CET',
//   'Europe/Berlin': 'CET',
//   'America/New_York': 'EST',
//   'America/Chicago': 'CST',
//   'America/Denver': 'MST',
//   'America/Los_Angeles': 'PST',
//   'Australia/Sydney': 'AEST',
//   'Australia/Perth': 'AWST',
//   'Pacific/Honolulu': 'HST',
//   'Pacific/Auckland': 'NZST'
// };

// const formatTime = (timeString) => {
//   if (!timeString) return 'TBA';

//   const dateObj = new Date(`1970-01-01T${timeString}:00`);

//   const formattedTime = new Intl.DateTimeFormat('en-US', {
//     hour: '2-digit',
//     minute: '2-digit',
//     hour12: true,
//     timeZone: userTimezone
//   }).format(dateObj);

//   const abbreviation = timezoneAbbreviationMap[userTimezone] || 'GMT';

//   return `${formattedTime} ${abbreviation}`;
// };




//   return (
//     <div className="training-events">
//       <div className="training-events-head">
//         <h1 className="association-head">Upcoming Training Events</h1>
//       </div>

//       <div className="view-btn">
//         <button
//           className="view-all"
//           onClick={() => (viewAll ? navigate('/courseDetails') : setViewAll(true))}
//         >
//           {viewAll ? 'View Courses Page' : 'View All'}
//         </button>
//       </div>



//       <div className="training-card-holder">
//         {(viewAll ? mergedCourses : mergedCourses.slice(0, 4)).map((course, index) => (
//           <TrainingCard
//             key={course.course_id || index}
//             id={course.course_id}
//             heading={course.schedule_course_name}
//             image={course.course_image ? `https://api.hachion.co/${course.course_image}` : ''}
//             date={formatDate(course.schedule_date)}
//             time={formatTime(course.schedule_time)}
//              duration={course.schedule_duration ? `Duration: ${course.schedule_duration}` : 'Duration: TBA'}
//             mode={course.schedule_mode || 'TBA'}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TrainingEvents;
// // import { useState, useEffect } from "react";
// // import { useNavigate } from "react-router-dom";
// // import dayjs from "dayjs";
// // import utc from "dayjs/plugin/utc";
// // import timezone from "dayjs/plugin/timezone";

// // dayjs.extend(utc);
// // dayjs.extend(timezone);

// // const timezoneAbbreviationMap = {
// //   "Asia/Kolkata": "IST",
// //   "Asia/Dubai": "GST",
// //   "Asia/Tokyo": "JST",
// //   "Asia/Singapore": "SGT",
// //   "Asia/Seoul": "KST",
// //   "Europe/London": "GMT",
// //   "Europe/Paris": "CET",
// //   "Europe/Berlin": "CET",
// //   "America/New_York": "EST",
// //   "America/Chicago": "CST",
// //   "America/Denver": "MST",
// //   "America/Los_Angeles": "PST",
// //   "Australia/Sydney": "AEST",
// //   "Australia/Perth": "AWST",
// //   "Pacific/Honolulu": "HST",
// //   "Pacific/Auckland": "NZST"
// // };

// // const TrainingEvents = () => {
// //   const navigate = useNavigate();
// //   const [mergedCourses, setMergedCourses] = useState([]);
// //   const [viewAll, setViewAll] = useState(false);
// //   const [userTimezone, setUserTimezone] = useState("UTC");

// //   useEffect(() => {
// //     const fetchTimezone = async () => {
// //       try {
// //         const geoResponse = await fetch("https://ipinfo.io?token=82aafc3ab8d25b");
// //         const geoData = await geoResponse.json();
// //         console.log(geoData);
// //         const detectedTimezone = geoData.timezone || "UTC";
// //         setUserTimezone(detectedTimezone);
// //       } catch (error) {
// //         console.error("Error fetching timezone:", error);
// //         setUserTimezone("UTC"); // Fallback timezone
// //       }
// //     };

// //     fetchTimezone();
// //   }, []);

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         const [scheduleResponse, coursesResponse] = await Promise.all([
// //           fetch("https://api.hachion.co/schedulecourse").then((res) => res.json()),
// //           fetch("https://api.hachion.co/courseDetails/all").then((res) => res.json()),
// //         ]);

// //         if (!Array.isArray(scheduleResponse) || !Array.isArray(coursesResponse)) {
// //           throw new Error("Invalid API response format");
// //         }

// //         const mergedData = scheduleResponse.map((scheduleItem) => {
// //           const matchingCourse = coursesResponse.find(
// //             (course) => course.courseName.toLowerCase() === scheduleItem.schedule_course_name.toLowerCase()
// //           );

// //           return {
// //             ...scheduleItem,
// //             course_id: matchingCourse?.id ?? null, // Use ?? for null-safe assignment
// //             course_image: matchingCourse?.courseImage ?? "",
// //           };
// //         });

// //         console.log("Merged Courses:", mergedData);
// //         setMergedCourses(mergedData);
// //       } catch (error) {
// //         console.error("Error fetching data:", error);
// //       }
// //     };

// //     fetchData();
// //   }, []);

// //   const formatDate = (dateString) => {
// //     if (!dateString) return "TBA";
// //     return dayjs(dateString).tz(userTimezone).format("MMM DD YYYY");
// //   };

// //   const formatTime = (timeString) => {
// //     if (!timeString) return "TBA";
// //     const formattedTimeString = timeString.length === 5 ? `${timeString}:00` : timeString;
// //     // const formattedTime = dayjs`(1970-01-01T${timeString}:00)`.tz(userTimezone).format("hh:mm A")
// //     // const formattedTime = time.format("hh:mm A");
// //     const time = dayjs`(1970-01-01 ${formattedTimeString})`.tz(userTimezone);
// //     if (!time.isValid()) {
// //       return "Invalid Time"; // Handle invalid dates
// //     }
// //     const formattedTime = time.format("hh:mm A");
// //     const abbreviation = timezoneAbbreviationMap[userTimezone] || "GMT";

// //     return `${formattedTime} ${abbreviation}`;
// //   };

// //   return (
// //     <div>
// //       <h2>Timezone: {userTimezone}</h2>
// //       <p>Formatted Date: {formatDate("2025-03-12")}</p>
// //       <p>Formatted Time: {formatTime("08:30 AM")}</p>
// //     </div>
// //   );
// // };

// // export default TrainingEvents;
import React, { useEffect, useState } from 'react';
import TrainingCard from './TrainingCard';
import './Home.css';
import { useNavigate } from 'react-router-dom';

const TrainingEvents = () => {
  const navigate = useNavigate();
  const [mergedCourses, setMergedCourses] = useState([]);
  const [viewAll, setViewAll] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [scheduleResponse, coursesResponse] = await Promise.all([
          fetch('https://api.hachion.co/schedulecourse').then((res) => res.json()),
          fetch('https://api.hachion.co/courses/all').then((res) => res.json()),
        ]);

        if (!Array.isArray(scheduleResponse) || !Array.isArray(coursesResponse)) {
          throw new Error("Invalid API response format");
        }

        const mergedData = scheduleResponse.map((scheduleItem) => {
          const matchingCourse = coursesResponse.find(
            (course) => course.courseName.toLowerCase() === scheduleItem.schedule_course_name.toLowerCase()
          );

          return {
            ...scheduleItem,
            course_id: matchingCourse?.id || null,
            course_image: matchingCourse?.courseImage || '', // Ensure a default empty string
          };
        });

        console.log('Merged Courses:', mergedData);
        setMergedCourses(mergedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(dateString));
  };

  return (
    <div className="training-events">
      <div className="training-events-head-upcoming">
        <h1 className="association-head">Upcoming Training Events</h1>
      </div>

      <div className="view-btn">
        <button
          className="view-all"
          onClick={() => (viewAll ? navigate('/CourseDetails') : setViewAll(true))}
        >
          {viewAll ? 'View Courses Page' : 'View All'}
        </button>
      </div>

      <div className="training-card-holder">
        {(viewAll ? mergedCourses : mergedCourses.slice(0, 4)).map((course, index) => (
          <TrainingCard
            key={course.course_id || index}
            id={course.course_id}
            heading={course.schedule_course_name}
            image={course.course_image ? `https://api.hachion.co/${course.course_image}` : ''}
            date={formatDate(course.schedule_date)}
            time={course.schedule_time || 'TBA'}
            duration={course.schedule_duration ? `Duration: ${course.schedule_duration}` : 'Duration: TBA'}
            mode={course.schedule_mode || 'TBA'}
          />
        ))}
      </div>
    </div>
  );
};

export default TrainingEvents;