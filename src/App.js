import React, { Suspense, lazy, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import "./App.css";

// Layouts, Guards & Contexts (Kept synchronous as they are light/structural)
import Layout from "./Components/Layout/Layout";
import AuthLayout from "./Components/Layout/AuthLayout";
import UserProtectedRoute from "./UserProtectedRoute";
import ProtectedRoute from "./ProtectedRoute";
import QueryGuard from "./Components/UserPanel/QueryGuard";

// --- LAZY LOADED COMPONENTS ---
const Home = lazy(() => import("./Components/UserPanel/Home").then(module => ({ default: module.Home })));
const Login = lazy(() => import("./Components/UserPanel/HomePage/AuthSection/LoginSection/Login"));
const AdminLogin = lazy(() => import("./Components/AdminPanel/AdminLogin"));
const AdminRegister = lazy(() => import("./Components/AdminPanel/AdminRegister"));
const AdminForgot = lazy(() => import("./Components/AdminPanel/AdminForgot"));
const Register = lazy(() => import("./Components/UserPanel/HomePage/AuthSection/RegisterSection/Register"));
const RegisterNext = lazy(() => import("./Components/UserPanel/HomePage/AuthSection/RegisterNext"));
const RegisterHere = lazy(() => import("./Components/UserPanel/HomePage/AuthSection/RegisterHere"));
const ForgotPassword = lazy(() => import("./Components/UserPanel/HomePage/AuthSection/ForgotPassword"));
const Course = lazy(() => import("./Components/UserPanel/CoursePage/Course"));
const CorporateTraining = lazy(() => import("./Components/UserPanel/CorporateTraining"));
const Terms = lazy(() => import("./Components/UserPanel/LegalFooterSection/Terms"));
const Privacy = lazy(() => import("./Components/UserPanel/LegalFooterSection/Privacy"));
const Blogs = lazy(() => import("./Components/UserPanel/Blogs"));
const BlogDetails = lazy(() => import("./Components/UserPanel/BlogDetails"));
const Aboutus = lazy(() => import("./Components/UserPanel/AboutusPage/Aboutus"));
const ContactUs = lazy(() => import("./Components/UserPanel/ContactUs"));
const UserDashboard = lazy(() => import("./Components/UserPanel/UserDashboardPage/UserDashboard"));
const AdminDashboardView = lazy(() => import("./Components/AdminPanel/AdminDashboardView"));
const CategoryTable = lazy(() => import("./Components/AdminPanel/CategoryTable"));
const Reports = lazy(() => import("./Components/AdminPanel/Reports"));
const Enrollment = lazy(() => import("./Components/UserPanel/EnrollmentPage/Enrollment"));
const UserWriteReview = lazy(() => import("./Components/UserPanel/UserWriteReview"));
const TrendingCourse = lazy(() => import("./Components/AdminPanel/TrendingCourseTable"));
const CourseSchedule = lazy(() => import("./Components/AdminPanel/CourseSchedule"));
const Workshop = lazy(() => import("./Components/UserPanel/Workshop"));
const CorporateCourses = lazy(() => import("./Components/AdminPanel/CorporateCourses"));
const Unsubscribe = lazy(() => import("./Components/UserPanel/LegalFooterSection/Unsubscribe"));
const Sitemap = lazy(() => import("./Components/UserPanel/SitemapPage/Sitemap"));
const KidsSummer = lazy(() => import("./Components/UserPanel/KidsSummer"));
const LeadForm = lazy(() => import("./Components/UserPanel/LeadForm"));
const HirefromUs = lazy(() => import("./Components/UserPanel/HirefromUs"));
const ApplyHiring = lazy(() => import("./Components/UserPanel/ApplyHiring"));
const JobDetails = lazy(() => import("./Components/UserPanel/JobDetails"));
const EnrollPayment = lazy(() => import("./Components/UserPanel/EnrollPayment"));
const OnlineInstallments = lazy(() => import("./Components/UserPanel/OnlineInstallments"));
const ConfirmOtp = lazy(() => import("./Components/UserPanel/HomePage/AuthSection/ConfirmOtp"));
const ResetPassword = lazy(() => import("./Components/UserPanel/HomePage/AuthSection/ResetPassword"));
const ViewFaq = lazy(() => import("./Components/UserPanel/ViewFaq"));
const DiscountDeals = lazy(() => import("./Components/UserPanel/DiscountDeals"));
const Instructors = lazy(() => import("./Components/UserPanel/InstructorsPage/Instructors"));
const InstructorDetails = lazy(() => import("./Components/UserPanel/InstructorsPage/InstructorDetails"));
const ViewReviews = lazy(() => import("./Components/UserPanel/ViewReviews"));
const BecomeInstructor = lazy(() => import("./Components/UserPanel/BecomeInstructor"));
const UserEnrolledAssignment = lazy(() => import("./Components/UserPanel/UserEnrolledAssignment"));
const NotFound = lazy(() => import("./Components/UserPanel/NotFound"));
const NewCourseDetails = lazy(() => import("./Components/UserPanel/NewcoursePage/NewCourseDetails"));
const NewEnrollNow = lazy(() => import("./Components/UserPanel/NewEnrollmentPage/NewEnrollNow"));
const NewEnrollSelfPaced = lazy(() => import("./Components/UserPanel/NewEnrollSelfPaced"));
const GoogleMobileNumber = lazy(() => import("./Components/UserPanel/HomePage/AuthSection/GoogleMobileNumber"));
const WorkshopDetails = lazy(() => import("./Components/UserPanel/WorkshopDetails"));
const RefundPolicy = lazy(() => import("./Components/UserPanel/LegalFooterSection/RefundPolicy"));
const EnquiryPage = lazy(() => import("./Components/UserPanel/EnquiryPage"));

// Static Imports for commented references (if needed by your build tool to resolve comments)
// import CourseDetails from './Components/UserPanel/courses';
// import CourseDetails from './Components/UserPanel/OldcoursePage/courses';
// import NewEnrollNow from './Components/UserPanel/NewEnrollNow';

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

const CourseDetailsRedirect = () => {
  const { courseName } = useParams();

  return (
    <Navigate
      to={`/courses/${courseName}`}
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

      {/* Suspense is required for lazy loading to work */}
      <Suspense fallback={<div className="loading-screen">Loading...</div>}>
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
            <Route path="/courses" element={<Course />} />
            <Route
              path="/coursedetails/:courseName"
              element={<CourseDetailsRedirect />}
            />

            <Route
              path="/courses/:courseName"
              element={<NewCourseDetails />}
            />
            <Route path="/enroll-now/:courseName" element={<NewEnrollNow />} />
            <Route
              path="/enroll-self/:courseName"
              element={<NewEnrollSelfPaced />}
            />

            {/* <Route
              path="/courses/:courseName"
              element={<NewCourseDetails />}
            /> */}
            {/* <Route
              path="/courses/:courseName"
              element={<CourseDetails />}
            /> */}
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
      </Suspense>
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