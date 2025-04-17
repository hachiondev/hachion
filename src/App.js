import "./App.css";
import { Home } from "./Components/UserPanel/Home";
import Login from "./Components/UserPanel/Login";
import AdminLogin from "./Components/AdminPanel/AdminLogin";
import AdminRegister from "./Components/AdminPanel/AdminRegister";
import AdminForgot from "./Components/AdminPanel/AdminForgot";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./Components/UserPanel/Register";
import HaveAnyQuery from "./Components/UserPanel/HaveAnyQuery";
import RegisterNext from "./Components/UserPanel/RegisterNext";
import RegisterHere from "./Components/UserPanel/RegisterHere";
import LoginSuccess from "./Components/UserPanel/LoginSuccess";
import ForgotPassword from "./Components/UserPanel/ForgotPassword";
import Course from "./Components/UserPanel/Course";
import QaAutomation from "./Components/UserPanel/QaAutomation";
import CorporateTraining from "./Components/UserPanel/CorporateTraining";
import AdminNavbar from "./Components/AdminPanel/AdminNavbar";
import AdminSidebar from "./Components/AdminPanel/AdminSidebar";
import Terms from "./Components/UserPanel/Terms";
import Privacy from "./Components/UserPanel/Privacy";
import AdminDashboard from "./Components/AdminPanel/AdminDashboard";
import Blogs from "./Components/UserPanel/Blogs";
import QaTesting from "./Components/UserPanel/QaTesting";
import Salesforce from "./Components/UserPanel/Salesforce";
import SalesforceBlog from "./Components/UserPanel/SalesforceBlog";
import QaTestingBlog from "./Components/UserPanel/QaTestingBlog";
import Aboutus from "./Components/UserPanel/Aboutus";
import ContactUs from "./Components/UserPanel/ContactUs";
import UserDashboard from "./Components/UserPanel/UserDashboard";
import AdminDashboardView from "./Components/AdminPanel/AdminDashboardView";
import CategoryTable from "./Components/AdminPanel/CategoryTable";
import Reports from "./Components/AdminPanel/Reports";
import Enrollment from "./Components/UserPanel/Enrollment";
import UserWriteReview from "./Components/UserPanel/UserWriteReview";
import TrendingCourse from "./Components/AdminPanel/TrendingCourseTable";
import CourseSchedule from "./Components/AdminPanel/CourseSchedule";
import SalWorkshop from "./Components/UserPanel/SalWorkshop";
import ProtectedRoute from "./ProtectedRoute";
import CorporateCourses from "./Components/AdminPanel/CorporateCourses";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/registerverification" element={<RegisterNext />} />
          <Route path="/registerhere" element={<RegisterHere />} />
          <Route path="/loginsuccess" element={<LoginSuccess />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />

          <Route path="/" element={<Home />} />
          <Route path="/CourseDetails" element={<Course />} />
          <Route path="/CourseDetails/:courseName" element={<QaAutomation />} />

          {/* <Route path='/Courses/:courseName' element={<QaAutomation/>}/> */}
          {/* <Route path='/CourseDetails/CourseDetailsData?.courseCategory' element={<QaAutomation/>}/> */}
          <Route path="/corporate" element={<CorporateTraining />} />
          <Route path="/haveanyquery" element={<HaveAnyQuery />} />

          <Route path="/adminnav" element={<AdminNavbar />} />
          <Route path="/adminsidebar" element={<AdminSidebar />} />
          {/* <Route path='/admin'> */}
          <Route path="adminlogin" element={<AdminLogin />} />
          <Route path="adminregister" element={<AdminRegister />} />
          <Route path="/adminforgot" element={<AdminForgot />} />

          {/* Protected Admin Dashboard Route */}
          <Route element={<ProtectedRoute />}>
            <Route path="admindashboardview" element={<AdminDashboardView />} />
          </Route>
          <Route path="/admincourse" element={<CategoryTable />} />

          {/* </Route> */}
          <Route path="/workshop" element={<SalWorkshop />} />

          <Route path="/blogs" element={<Blogs />} />
          <Route path="/qatesting" element={<QaTesting />} />
          <Route path="/blogs/:category" element={<Salesforce />} />
          <Route path="/enroll/:courseName" element={<Enrollment />} />
          <Route path="/salesforceblog" element={<SalesforceBlog />} />
          <Route
            path="/blogs/:category_name/content"
            element={<QaTestingBlog />}
          />
          <Route path="/aboutus" element={<Aboutus />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/userdashboard" element={<UserDashboard />} />
          <Route path="/admindashboardview" element={<AdminDashboardView />} />
          <Route path="/review" element={<UserWriteReview />} />
          <Route path="/addtrending" element={<TrendingCourse />} />
          <Route path="/Courseschedule" element={<CourseSchedule />} />
          <Route path="/corporatecourses" element={<CorporateCourses />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
