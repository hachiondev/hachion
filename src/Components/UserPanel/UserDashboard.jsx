import { React, useState } from 'react';
import Topbar from './Topbar';
import NavbarTop from './NavbarTop';
import './Dashboard.css';
import { AiFillDashboard } from "react-icons/ai";
import { PiNotePencilBold } from "react-icons/pi";
import { PiTrolleySuitcaseFill } from "react-icons/pi";
import { FaIdCard } from "react-icons/fa6";
import { PiCertificateBold } from "react-icons/pi";
import { MdOutlineVideoCameraFront } from "react-icons/md";
import { BsFillEnvelopeFill } from "react-icons/bs";
import { MdRateReview } from "react-icons/md";
import { TbSettingsBolt } from "react-icons/tb";
import UserDashboardCard from './UserDashboardCard';
import Footer from './Footer';
import StickyBar from './StickyBar';
import UserCategoryTable from './UserCategoryTable';
import UserOrders from './UserOrders';
import Certificate from './Certificate';
import UserMessages from './UserMessages';
import UserReviews from './UserReviews';
import UserVideos from './UserVideos';
import UserResume from './UserResume';
import UserProfile from './UserProfile';

const UserDashboard = () => {
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [activeIndex, setActiveIndex] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Dashboard');

  const toggleDropdown = (index) => {
    setDropdownOpen((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const menuItems = [
    { title: 'Dashboard', icon: <AiFillDashboard /> },
    { title: 'Enrolls', icon: <PiNotePencilBold /> },
    { title: 'Orders', icon: <PiTrolleySuitcaseFill /> },
    { title: 'Resume', icon: <FaIdCard /> },
    { title: 'Certificate', icon: <PiCertificateBold/> },
    { title: 'Videos', icon: <MdOutlineVideoCameraFront /> },
    { title: 'Messages', icon: <BsFillEnvelopeFill /> },
    { title: 'Review', icon: <MdRateReview /> },
    { title: 'Settings', icon: <TbSettingsBolt /> },
  ];

  const handleMenuItemClick = (index, title) => {
    setActiveIndex(index);
    setSelectedCategory(title); // Set the selected category here
    toggleDropdown(index);
  };

  // Function to render the selected component
  const renderSelectedComponent = () => {
    switch (selectedCategory) {
      case 'Dashboard':
        return <UserDashboardCard />;
      case 'Orders':
        return <UserOrders />;
      case 'Certificate':
        return <Certificate />;
      case 'Enrolls':
        return <UserCategoryTable />;
     case 'Messages':
      return <UserMessages/>;
      case 'Review':
        return <UserReviews/>;
        case 'Videos':
          return <UserVideos/>
          case 'Resume':
            return <UserResume/>
            case 'Settings':
              return <UserProfile/>
      default:
        return <UserDashboardCard />; // Default to Dashboard
    }
  };

  return (
    <>
      <Topbar />
      <NavbarTop />

      <div className="user-dashboard-heading">
        <h3>Welcome Hachion</h3>
      </div>
      <div className="user-dashboard">
        <div className="sidebar-user">
          <ul className="menu-list-user">
            {menuItems.map((item, index) => (
              <li key={index} className="menu-item-container">
                <button
                  onClick={() => handleMenuItemClick(index, item.title)}
                  className={`menu-item-user ${activeIndex === index ? 'active' : ''}`}
                >
                  <span className="menu-icon">{item.icon}</span>
                  <span>{item.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="user-dashboard-content">
          
          {renderSelectedComponent()}
        </div>
      </div>

      <Footer />
      <StickyBar />
    </>
  );
};

export default UserDashboard;
