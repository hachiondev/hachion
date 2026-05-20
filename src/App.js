import "./App.css";
import { Home } from "./Components/UserPanel/Home";
import Login from "./Components/UserPanel/HomePage/AuthSection/LoginSection/Login";
import AdminLogin from "./Components/AdminPanel/AdminLogin";
import AdminRegister from "./Components/AdminPanel/AdminRegister";
import AdminForgot from "./Components/AdminPanel/AdminForgot";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useEffect } from "react";

import Register from "./Components/UserPanel/HomePage/AuthSection/RegisterSection/Register";
import RegisterNext from "./Components/UserPanel/HomePage/AuthSection//RegisterNext";
import RegisterHere from "./Components/UserPanel/HomePage/AuthSection//RegisterHere";
import ForgotPassword from "./Components/UserPanel/HomePage/AuthSection/ForgotPassword";
import Course from "./Components/UserPanel/CoursePage/Course";
// import CourseDetails from './Components/UserPanel/courses';
import CorporateTraining from "./Components/UserPanel/CorporateTraining";
import Terms from "./Components/UserPanel/LegalFooterSection/Terms";
import Privacy from "./Components/UserPanel/LegalFooterSection/Privacy";
import Blogs from "./Components/UserPanel/Blogs";
import BlogDetails from "./Components/UserPanel/BlogDetails";
import Aboutus from "./Components/UserPanel/AboutusPage/Aboutus";
import ContactUs from "./Components/UserPanel/ContactUs";
import UserProtectedRoute from "./UserProtectedRoute";
import UserDashboard from "./Components/UserPanel/UserDashboardPage/UserDashboard";
import AdminDashboardView from "./Components/AdminPanel/AdminDashboardView";
import CategoryTable from "./Components/AdminPanel/CategoryTable";
import Reports from "./Components/AdminPanel/Reports";
import Enrollment from "./Components/UserPanel/EnrollmentPage/Enrollment";
import UserWriteReview from "./Components/UserPanel/UserWriteReview";
import TrendingCourse from "./Components/AdminPanel/TrendingCourseTable";
import CourseSchedule from "./Components/AdminPanel/CourseSchedule";
import Workshop from "./Components/UserPanel/Workshop";
import ProtectedRoute from "./ProtectedRoute";
import CorporateCourses from "./Components/AdminPanel/CorporateCourses";
import Unsubscribe from "./Components/UserPanel/LegalFooterSection/Unsubscribe";
import Sitemap from "./Components/UserPanel/SitemapPage/Sitemap";
import KidsSummer from "./Components/UserPanel/KidsSummer";
import LeadForm from "./Components/UserPanel/LeadForm";
import HirefromUs from "./Components/UserPanel/HirefromUs";
import ApplyHiring from "./Components/UserPanel/ApplyHiring";
import JobDetails from "./Components/UserPanel/JobDetails";
import EnrollPayment from "./Components/UserPanel/EnrollPayment";
import OnlineInstallments from "./Components/UserPanel/OnlineInstallments";
import ConfirmOtp from "./Components/UserPanel/HomePage/AuthSection/ConfirmOtp";
import ResetPassword from "./Components/UserPanel/HomePage/AuthSection/ResetPassword";
import ViewFaq from "./Components/UserPanel/ViewFaq";
import DiscountDeals from "./Components/UserPanel/DiscountDeals";
import Instructors from "./Components/UserPanel/InstructorsPage/Instructors";
import InstructorDetails from "./Components/UserPanel/InstructorsPage/InstructorDetails";
import ViewReviews from "./Components/UserPanel/ViewReviews";
import BecomeInstructor from "./Components/UserPanel/BecomeInstructor";
import UserEnrolledAssignment from "./Components/UserPanel/UserEnrolledAssignment";
import QueryGuard from "./Components/UserPanel/QueryGuard";
import NotFound from "./Components/UserPanel/NotFound";
import NewCourseDetails from "./Components/UserPanel/NewcoursePage/NewCourseDetails";

// import CourseDetails from './Components/UserPanel/OldcoursePage/courses';
import NewEnrollNow from "./Components/UserPanel/NewEnrollmentPage/NewEnrollNow";
// import NewEnrollNow from './Components/UserPanel/NewEnrollNow';
import NewEnrollSelfPaced from "./Components/UserPanel/NewEnrollSelfPaced";
import GoogleMobileNumber from "./Components/UserPanel/HomePage/AuthSection/GoogleMobileNumber";
import Layout from "./Components/Layout/Layout";
import WorkshopDetails from "./Components/UserPanel/WorkshopDetails";
import AuthLayout from "./Components/Layout/AuthLayout";
import RefundPolicy from "./Components/UserPanel/LegalFooterSection/RefundPolicy";
import EnquiryPage from "./Components/UserPanel/EnquiryPage";

const RedirectToLowercase = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const lower = location.pathname.toLowerCase();
    if (location.pathname !== lower) {
      navigate(lower, { replace: true });
    }
  }, [location.pathname, navigate]);

  return null;
};

const TrackPageView = () => {
  const location = useLocation();
  useEffect(() => {
    if (window.gtag) {
      window.gtag("config", "G-TE1LPJJ75K", {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);
  return null;
};
const slugify = (text = "") =>
  text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "");

const CourseDetailsRedirect = () => {
  const { courseName } = useParams();

  // Example mapping
  const categoryMap = {
    "java-full-stack": "full-stack-development",
    "aws-devops": "cloud-computing",
  };

  const categoryName =
    categoryMap[slugify(courseName)] || "courses";

  return (
    <Navigate
      to={`/courses/${categoryName}/${courseName}`}
      replace
    />
  );
};
function AppRoutes() {
  return (
    <>
      <TrackPageView />
      <RedirectToLowercase />
      <QueryGuard />

      <Routes>
        {/* AUTH ROUTES */}

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/registerverification" element={<RegisterNext />} />
          <Route path="/registerhere" element={<RegisterHere />} />
          <Route path="/confirm-otp" element={<ConfirmOtp />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/phone-number" element={<GoogleMobileNumber />} />
        </Route>

        {/* USER ROUTES WITH LAYOUT */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/viewfaqs" element={<ViewFaq />} />
          <Route path="/discountdeals" element={<DiscountDeals />} />
          <Route path="/instructor-profiles" element={<Instructors />} />
          <Route
            path="/:trainer_name-instructor-details"
            element={<InstructorDetails />}
          />
          <Route path="/become-instructor" element={<BecomeInstructor />} />
          <Route path="/view-all-reviews" element={<ViewReviews />} />
          <Route path="/courses/:categoryName" element={<Course />} />
          <Route path="/courses" element={<Course />} />
          <Route
  path="/coursedetails/:courseName"
  element={<CourseDetailsRedirect />}
/>

{/* <Route
  path="/courses/:courseName"
  element={<NewCourseDetails />}
/> */}
<Route
  path="/courses/:categoryName/:courseName"
  element={<NewCourseDetails />}
/>
          <Route path="/enroll-now/:courseName" element={<NewEnrollNow />} />
          <Route
            path="/enroll-self/:courseName"
            element={<NewEnrollSelfPaced />}
          />

          <Route path="/corporate" element={<CorporateTraining />} />
          <Route path="/hire-from-us" element={<HirefromUs />} />
          <Route path="/career" element={<ApplyHiring />} />
          <Route path="/career/apply/:jobTitle" element={<JobDetails />} />
          <Route path="/workshop" element={<Workshop />} />
          <Route path="/workshop/:slug" element={<WorkshopDetails />} />
          <Route path="/blogs" element={<Blogs />} />
  <Route
  path="/blogs/:category_name/:title"
  element={<BlogDetails />}
/>
          <Route path="/aboutus" element={<Aboutus />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/enroll/:courseName" element={<Enrollment />} />
          <Route
            path="/installments/:courseName"
            element={<OnlineInstallments />}
          />
          <Route path="/payment/:courseName" element={<EnrollPayment />} />
          <Route path="/review" element={<UserWriteReview />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/refundpolicy" element={<RefundPolicy />} />
          <Route path="/unsubscribe" element={<Unsubscribe />} />
          {/* <Route path="/enquiryform" element={<EnquiryPage />} /> */}
          {/* <Route path="/enquiryform/:refName" element={<EnquiryPage />} /> */}
{/* <Route path="/enquiryform" element={<EnquiryPage />} /> */}
          <Route path="/sitemap" element={<Sitemap />} />
          <Route
            path="/summer-tech-bootcamp-for-teens"
            element={<KidsSummer />}
          />
          <Route path="/lead-form" element={<LeadForm />} />

          {/* USER PROTECTED */}
          <Route element={<UserProtectedRoute />}>
            <Route
              path="/userdashboard/:section?"
              element={<UserDashboard />}
            />
            <Route
              path="/userenrolledassignment/:coursename"
              element={<UserEnrolledAssignment />}
            />
          </Route>
        </Route>

  <Route path="/enquiryform/:refName" element={<EnquiryPage />} />

        {/* ADMIN ROUTES — NO LAYOUT */}
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/adminregister" element={<AdminRegister />} />
        <Route path="/adminforgot" element={<AdminForgot />} />

        {/* ADMIN PROTECTED */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admindashboardview" element={<AdminDashboardView />} />
        </Route>

        {/* ADMIN TABLES */}
        <Route path="/admincourse" element={<CategoryTable />} />
        <Route path="/addtrending" element={<TrendingCourse />} />
        <Route path="/courseschedule" element={<CourseSchedule />} />
        <Route path="/corporatecourses" element={<CorporateCourses />} />
        <Route path="/reports" element={<Reports />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
