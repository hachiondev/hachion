import "./Blogs.css";
import KidsCourseCard from "./KidsCourseCard";
import java from "@/assets/java.webp";
import mobile from "@/assets/mobile.webp";
import web from "@/assets/web.webp";
import videoedit from "@/assets/videoedit.webp";
import graphic from "@/assets/graphic.webp";
import market from "@/assets/market.webp";
import sql from "@/assets/sql.webp";
import python from "@/assets/python.webp";

const courseCards = [
  { courseName: 'Python Basics', image: python, Skills: 'From games to AI projects ' },
  { courseName: 'Core Java', image: java, Skills: 'App development fundamentals' },
  { courseName: 'SQL + Excel', image: sql, Skills: 'Data analysis, Formulas, Dashboards' },
  { courseName: 'Web Design', image: web, Skills: 'HTML, CSS, JavaScript, (Build a portfolio website!)' },
  { courseName: 'Mobile Apps', image: mobile, Skills: 'Android app development with MIT App Inventor' },
  { courseName: 'Digital Marketing', image: market, Skills: 'Social media, SEO, ads, (Run a mock campaign!)' },
  { courseName: 'Video Editing', image: videoedit, Skills: 'Adobe Premiere Pro basics (Edit TikTok/Youtube videos)' },
  { courseName: 'Graphic Design', image: graphic, Skills: 'Canva & Photoshop (Design logos, posters, memes)' },
];

const KidsCourses = () => {
  return (
    <div>
      <h2 className='summer-title'>Courses Offered</h2>
      <div className='summer-part'>
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
