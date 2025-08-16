import './App.css';
import { Home } from './Components/UserPanel/Home';
import Login from './Components/UserPanel/Login';
import AdminLogin from './Components/AdminPanel/AdminLogin';
import AdminRegister from './Components/AdminPanel/AdminRegister';
import AdminForgot from './Components/AdminPanel/AdminForgot';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Register from './Components/UserPanel/Register';
import HaveAnyQuery from './Components/UserPanel/HaveAnyQuery';
import RegisterNext from './Components/UserPanel/RegisterNext';
import RegisterHere from './Components/UserPanel/RegisterHere';
import LoginSuccess from './Components/UserPanel/LoginSuccess';
import ForgotPassword from './Components/UserPanel/ForgotPassword';
import Course from './Components/UserPanel/Course';
import QaAutomation from './Components/UserPanel/QaAutomation';
import CorporateTraining from './Components/UserPanel/CorporateTraining';
import AdminNavbar from './Components/AdminPanel/AdminNavbar';
import AdminSidebar from './Components/AdminPanel/AdminSidebar';
import Terms from './Components/UserPanel/Terms';
import Privacy from './Components/UserPanel/Privacy';
import Blogs from './Components/UserPanel/Blogs';
import Salesforce from './Components/UserPanel/Salesforce';
import QaTestingBlog from './Components/UserPanel/QaTestingBlog';
import Aboutus from './Components/UserPanel/Aboutus';
import ContactUs from './Components/UserPanel/ContactUs';
import UserProtectedRoute from './UserProtectedRoute';
import UserDashboard from './Components/UserPanel/UserDashboard';
import AdminDashboardView from './Components/AdminPanel/AdminDashboardView';
import CategoryTable from './Components/AdminPanel/CategoryTable';
import Reports from './Components/AdminPanel/Reports';
import Enrollment from './Components/UserPanel/Enrollment';
import UserWriteReview from './Components/UserPanel/UserWriteReview';
import TrendingCourse from './Components/AdminPanel/TrendingCourseTable';
import CourseSchedule from './Components/AdminPanel/CourseSchedule';
import SalWorkshop from './Components/UserPanel/SalWorkshop';
import Workshop from './Components/UserPanel/Workshop';
import ProtectedRoute from './ProtectedRoute';
import CorporateCourses from './Components/AdminPanel/CorporateCourses';
import Unsubscribe from "./Components/UserPanel/Unsubscribe";
import Sitemap from "./Components/UserPanel/Sitemap";
import KidsSummer from "./Components/UserPanel/KidsSummer";
import LeadForm from "./Components/UserPanel/LeadForm";
import HirefromUs from './Components/UserPanel/HirefromUs';
import ApplyHiring from './Components/UserPanel/ApplyHiring';
import JobDetails from './Components/UserPanel/JobDetails';
import EnrollPayment from './Components/UserPanel/EnrollPayment';
import OnlineInstallments from './Components/UserPanel/OnlineInstallments';
const RedirectToLowercase = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const pathName = location.pathname;
    const lowercasePath = pathName.toLowerCase();
    if (pathName !== lowercasePath) {
      navigate(lowercasePath, { replace: true });
    }
  }, [location.pathname, navigate]);

  return null;
};

const TrackPageView = () => {
  const location = useLocation();

  useEffect(() => {
    if (window.gtag) {
      window.gtag('config', 'G-TE1LPJJ75K', {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);

  return null;
};

function AppRoutes() {
  return (
    <>
      <TrackPageView />
      <RedirectToLowercase />
      <Routes>
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/registerverification' element={<RegisterNext/>}/>
      <Route path='/registerhere' element={<RegisterHere/>}/>
      <Route path='/loginsuccess' element={<LoginSuccess/>}/>
      <Route path='/forgotpassword' element={<ForgotPassword/>}/>
      <Route path="/" element={<Home />} />
      <Route path='/coursedetails' element={<Course/>}/>
      <Route path='/coursedetails/:courseName' element={<QaAutomation />} />
      <Route path='/corporate' element={<CorporateTraining/>}/>
      <Route path='/hire-from-us' element={<HirefromUs/>}/>
      <Route path='/career' element={<ApplyHiring/>}/>
      <Route path='/career/apply/:jobTitle' element={<JobDetails/>}/>
      <Route path='/haveanyquery' element={<HaveAnyQuery/>}/>
      <Route path='/adminnav' element={<AdminNavbar/>}/>
      <Route path='/adminsidebar' element={<AdminSidebar/>}/>
      <Route path="adminlogin" element={<AdminLogin />} />
      <Route path="adminregister" element={<AdminRegister />} />
      <Route path="/adminforgot" element={<AdminForgot />} />
      <Route element={<ProtectedRoute />}>
          <Route path="admindashboardview" element={<AdminDashboardView />} />
      </Route>
      <Route element={<UserProtectedRoute />}>
      <Route path="/userdashboard/:section?" element={<UserDashboard />} />
     </Route>
      <Route path='/admincourse' element={<CategoryTable />} />
      <Route path='/workshop' element={<Workshop/>}/>
      <Route path='/workshop/:slug' element={<SalWorkshop/>}/>
      <Route path='/blogs' element={<Blogs/>}/>
      <Route path="/blogs/:category" element={<Salesforce/>}/>
      <Route path='/enroll/:courseName' element={<Enrollment/>}/>
      <Route path='/installments' element={<OnlineInstallments/>}/>
      <Route path='/payment/:courseName' element={<EnrollPayment/>}/>
      <Route path="/blogs/:category_name/:title" element={<QaTestingBlog />} />
      <Route path='/aboutus' element={<Aboutus/>}/>
      <Route path='/contactus' element={<ContactUs/>}/>
      <Route path='/admindashboardview' element={<AdminDashboardView/>}/>
      <Route path='/review' element={<UserWriteReview/>}/>
      <Route path='/addtrending' element={<TrendingCourse/>}/>
      <Route path='/courseschedule' element={<CourseSchedule/>}/>
      <Route path='/corporatecourses' element={<CorporateCourses />} />
      <Route path='/reports' element={<Reports />} />
      <Route path='/terms' element={<Terms/>}/>
      <Route path='/privacy' element={<Privacy/>}/>
      <Route path="/unsubscribe" element={<Unsubscribe />} />
      <Route path="/sitemap" element={<Sitemap />} />
      <Route path="/summer-tech-bootcamp-for-teens" element={<KidsSummer />} />
      <Route path="/lead-form" element={<LeadForm />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;