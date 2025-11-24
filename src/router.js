import { createBrowserRouter } from "react-router-dom";
import App from "./App";

import {Home} from "./Components/UserPanel/Home";
import Login from "./Components/UserPanel/Login";
import Register from "./Components/UserPanel/Register";
import RegisterNext from "./Components/UserPanel/RegisterNext";
import RegisterHere from "./Components/UserPanel/RegisterHere";
import ForgotPassword from "./Components/UserPanel/ForgotPassword";
import ConfirmOtp from "./Components/UserPanel/ConfirmOtp";
import ResetPassword from "./Components/UserPanel/ResetPassword";
import GoogleMobileNumber from "./Components/UserPanel/GoogleMobileNumber";
import Layout from "./Components/Layout/Layout";
import Course from "./Components/UserPanel/Course";
import CourseDetails from "./Components/UserPanel/CourseDetails";
import NewCourseDetails from "./Components/UserPanel/NewCourseDetails";
import CorporateTraining from "./Components/UserPanel/CorporateTraining";
import Blogs from "./Components/UserPanel/Blogs";
import BlogDetails from "./Components/UserPanel/BlogDetails";
import Aboutus from "./Components/UserPanel/Aboutus";
import ContactUs from "./Components/UserPanel/ContactUs";
import Terms from "./Components/UserPanel/Terms";
import Privacy from "./Components/UserPanel/Privacy";
import Workshop from "./Components/UserPanel/Workshop";
import WorkshopDetails from "./Components/UserPanel/WorkshopDetails";
import DiscountDeals from "./Components/UserPanel/DiscountDeals";
import Instructors from "./Components/UserPanel/Instructors";
import InstructorDetails from "./Components/UserPanel/InstructorDetails";
import UserDashboard from "./Components/UserPanel/UserDashboard";
import Enrollment from "./Components/UserPanel/Enrollment";
import UserWriteReview from "./Components/UserPanel/UserWriteReview";
import ViewReviews from "./Components/UserPanel/ViewReviews";
import BecomeInstructor from "./Components/UserPanel/BecomeInstructor";
import NotFound from "./Components/UserPanel/NotFound";
import UserProtectedRoute from "./routes/UserProtectedRoute";

// Admin
import AdminLogin from "./Components/AdminPanel/AdminLogin";
import AdminRegister from "./Components/AdminPanel/AdminRegister";
import AdminForgot from "./Components/AdminPanel/AdminForgot";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminDashboardView from "./Components/AdminPanel/AdminDashboardView";
import CategoryTable from "./Components/AdminPanel/CategoryTable";
import TrendingCourse from "./Components/AdminPanel/TrendingCourseTable";
import CourseSchedule from "./Components/AdminPanel/CourseSchedule";
import CorporateCourses from "./Components/AdminPanel/CorporateCourses";
import Reports from "./Components/AdminPanel/Reports";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <Layout />,
        children: [
          { index: true, element: <Home /> },
          { path: "login", element: <Login /> },
          { path: "register", element: <Register /> },
          { path: "registerverification", element: <RegisterNext /> },
          { path: "registerhere", element: <RegisterHere /> },
          { path: "confirm-otp", element: <ConfirmOtp /> },
          { path: "resetpassword", element: <ResetPassword /> },
          { path: "forgotpassword", element: <ForgotPassword /> },
          { path: "phone-number", element: <GoogleMobileNumber /> },
          { path: "coursedetails", element: <Course /> },
          { path: "newcoursedetails", element: <NewCourseDetails /> },
          { path: "coursedetails/:courseName", element: <CourseDetails /> },
          { path: "corporate", element: <CorporateTraining /> },
          { path: "blogs", element: <Blogs /> },
          { path: "blogs/:category_name/:title", element: <BlogDetails /> },
          { path: "aboutus", element: <Aboutus /> },
          { path: "contactus", element: <ContactUs /> },
          { path: "terms", element: <Terms /> },
          { path: "privacy", element: <Privacy /> },
          { path: "workshop", element: <Workshop /> },
          { path: "workshop/:slug", element: <WorkshopDetails /> },
          { path: "discountdeals", element: <DiscountDeals /> },
          { path: "instructor-profiles", element: <Instructors /> },
          { path: ":trainer_name-instructor-details", element: <InstructorDetails /> },
          { path: "view-all-reviews", element: <ViewReviews /> },
          { path: "become-instructor", element: <BecomeInstructor /> },

          // ✅ USER PROTECTED ROUTES
          {
            element: <UserProtectedRoute />,
            children: [
              { path: "userdashboard/:section?", element: <UserDashboard /> },
              { path: "enroll/:courseName", element: <Enrollment /> },
              { path: "review", element: <UserWriteReview /> },
            ],
          },

          // ✅ 404
          { path: "*", element: <NotFound /> },
        ],
      },

      // ✅ ADMIN WITHOUT LAYOUT
      { path: "adminlogin", element: <AdminLogin /> },
      { path: "adminregister", element: <AdminRegister /> },
      { path: "adminforgot", element: <AdminForgot /> },

      // ✅ ADMIN PROTECTED ROUTES
      {
        element: <ProtectedRoute />,
        children: [
          { path: "admindashboardview", element: <AdminDashboardView /> },
          { path: "admincourse", element: <CategoryTable /> },
          { path: "addtrending", element: <TrendingCourse /> },
          { path: "courseschedule", element: <CourseSchedule /> },
          { path: "corporatecourses", element: <CorporateCourses /> },
          { path: "reports", element: <Reports /> },
        ],
      },
    ],
  },
]);

export default router;
