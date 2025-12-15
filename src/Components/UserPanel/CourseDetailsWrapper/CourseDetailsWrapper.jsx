import { useParams } from "react-router-dom";
import CourseDetails from "../CourseDetails";

const CourseDetailsWrapper = () => {
  const { courseName } = useParams();
  return <CourseDetails key={courseName} />;
};

export default CourseDetailsWrapper;
