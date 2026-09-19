import Image from "next/image";
import "./Blogs.css";

const KidsCourseCard = ({ CourseName, image, Skills }) => {
  return (
    <div className='kids-course-card'>
      <div className='kids-course-title'>
        {/* Without explicit width/height, next/image falls back to the
            imported source file's own intrinsic size (these course icons
            are 500x500px source files) and generates its responsive
            srcset around THAT box — so the browser downloads a ~500x500
            image even though .kids-course-card img constrains it to a
            60px circle (50px at the <768px breakpoint) via CSS. Passing
            the real display size lets Next.js's image optimizer generate
            correctly-sized variants; CSS still owns the actual rendered
            box (including the 50px mobile breakpoint) via width/aspect-ratio. */}
        <Image src={image} alt='course-img' width={60} height={60} />
        <p className='kids-course-card-content'>{CourseName}</p>
      </div>
      <p className='choose-points'>{Skills}</p>
    </div>
  );
};

export default KidsCourseCard;
