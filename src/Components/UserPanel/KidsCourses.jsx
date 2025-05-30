import React, { useState } from "react";
import "./Blogs.css";
import KidsCourseCard from "./KidsCourseCard";
import java from "../../Assets/java.png";
import mobile from "../../Assets/mobile.png";
import web from "../../Assets/web.png";
import videoedit from "../../Assets/videoedit.png";
import graphic from "../../Assets/graphic.png";
import market from "../../Assets/market.png";
import sql from "../../Assets/sql.png";
import python from "../../Assets/python.png";

const KidsCourses = () => {
  const [courseCards] = useState([
    {
      courseName: "Python Basics",
      image: python,
      Skills: "From games to AI projects ",
    },
    {
      courseName: "Core Java",
      image: java,
      Skills: "App development fundamentals",
    },
    {
      courseName: "SQL + Excel",
      image: sql,
      Skills: "Data analysis, Formulas, Dashboards",
    },
    {
      courseName: "Web Design",
      image: web,
      Skills: "HTML, CSS, JavaScript, (Build a portfolio website!)",
    },
    {
      courseName: "Mobile Apps",
      image: mobile,
      Skills: "Android app development with MIT App Inventor",
    },
    {
      courseName: "Digital Marketing",
      image: market,
      Skills: "Social media, SEO, ads, (Run a mock campaign!)",
    },
    {
      courseName: "Video Editing",
      image: videoedit,
      Skills: "Adobe Premiere Pro basics (Edit TikTok/Youtube videos)",
    },
    {
      courseName: "Graphic Design",
      image: graphic,
      Skills: "Canva & Photoshop (Design logos, posters, memes)",
    },
  ]);

  return (
    <div>
      <h2 className="summer-title">Courses Offered</h2>
      <div className="summer-part">
        {courseCards.map((course, index) => (
          <KidsCourseCard
            key={course.courseName + index}
            CourseName={course.courseName}
            image={course.image}
            Skills={course.Skills}
          />
        ))}
      </div>
    </div>
  );
};

export default KidsCourses;
