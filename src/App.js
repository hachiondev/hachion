
import './App.css';
import { Home } from './Components/UserPanel/Home';
import Login from './Components/UserPanel/Login';
import AdminLogin from './Components/AdminPanel/AdminLogin';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
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
import AdminDashboard from './Components/AdminPanel/AdminDashboard';
import CourseCategory from './Components/AdminPanel/CourseCategory';
import Blogs from './Components/UserPanel/Blogs';
import QaTesting from './Components/UserPanel/QaTesting';
import Salesforce from './Components/UserPanel/Salesforce';
import SalesforceBlog from './Components/UserPanel/SalesforceBlog';
import QaTestingBlog from './Components/UserPanel/QaTestingBlog';
import Aboutus from './Components/UserPanel/Aboutus';
import ContactUs from './Components/UserPanel/ContactUs';
import UserDashboard from './Components/UserPanel/UserDashboard';
import AdminDashboardView from './Components/AdminPanel/AdminDashboardView';
import AddCourseCategory from './Components/AdminPanel/AddCourseCategory';
import CategoryTable from './Components/AdminPanel/CategoryTable';
import Enrollment from './Components/UserPanel/Enrollment';
import UserWriteReview from './Components/UserPanel/UserWriteReview';
import AddTrendingCourse from './Components/AdminPanel/AddTrendingCourse';
import AddTrainer from './Components/AdminPanel/AddTrainer';
import AddCertificate from './Components/AdminPanel/AddCertificate';
import AddStudent from './Components/AdminPanel/AddStudent';

function App() {
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/registerverification' element={<RegisterNext/>}/>
      <Route path='/registerhere' element={<RegisterHere/>}/>
      <Route path='/loginsuccess' element={<LoginSuccess/>}/>
      <Route path='/forgotpassword' element={<ForgotPassword/>}/>
      <Route path='/course' element={<Course/>}/>
      <Route path='/qaautomation' element={<QaAutomation/>}/>
      <Route path='/corporate' element={<CorporateTraining/>}/>
      <Route path='/haveanyquery' element={<HaveAnyQuery/>}/>
      <Route path='/adminlogin' element={<AdminLogin/>}/>
      <Route path='/adminnav' element={<AdminNavbar/>}/>
      <Route path='/adminsidebar' element={<AdminSidebar/>}/>
      <Route path='/admindashboard' element={<AdminDashboard/>}/>
      <Route path='/admincourse' element={<CategoryTable/>}/>
      <Route path='/blogs' element={<Blogs/>}/>
      <Route path='/qatesting' element={<QaTesting/>}/>
      <Route path='/salesforce' element={<Salesforce/>}/>
      <Route path='/enroll' element={<Enrollment/>}/>
      <Route path='/salesforceblog' element={<SalesforceBlog/>}/>
      <Route path='/qatestingblog' element={<QaTestingBlog/>}/>
      <Route path='/aboutus' element={<Aboutus/>}/>
      <Route path='/contactus' element={<ContactUs/>}/>
      <Route path='/userdashboard' element={<UserDashboard/>}/>
      <Route path='/admindashboardview' element={<AdminDashboardView/>}/>
      <Route path='/addcourse' element={<AddCourseCategory/>}/>
      <Route path='/review' element={<UserWriteReview/>}/>
      <Route path='/addtrending' element={<AddTrendingCourse/>}/>
      <Route path='/addtrainer' element={<AddTrainer/>}/>
      <Route path='/addcertificate' element={<AddCertificate/>}/>
      <Route path='/addstudent' element={<AddStudent/>}/>
      </Routes></BrowserRouter>
    </>
  );
}

export default App;