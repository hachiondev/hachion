import { Link } from 'react-router-dom';
import { IoIosMail } from "react-icons/io";
import { FaPhone } from "react-icons/fa6";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../Components/UserPanel/Style.css';
import { useTopBarApi } from '../../Api/hooks/useTopBarApi';

const Topbar = () => {
  const { whatsappNumber, whatsappLink } = useTopBarApi();

  return (
    <div
      className="topbar-wrapper w-100"
      style={{ background: "#0C8EBF", height: "45px" }}
    >
      <div className="container d-flex justify-content-between align-items-center text-white px-3 h-100">

        {/* Left Section */}
        <div className="d-flex align-items-center">

          {/* WhatsApp Link */}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="d-flex align-items-center text-decoration-underline text-white me-3 touch-target"
            aria-label={`Chat with us on WhatsApp at ${whatsappNumber}`}
          >
            <FaPhone className="me-1 topbar-icon text-white" />
            <span className="fw-normal topbar-text">{whatsappNumber}</span>
          </a>

          {/* Email Link */}
          <a
            href="https://mail.google.com/mail/?view=cm&to=trainings@hachion.co"
            target="_blank"
            rel="noopener noreferrer"
            className="d-flex align-items-center text-decoration-underline text-white touch-target"
            aria-label="Send an email to trainings@hachion.co using Gmail"
          >
            <IoIosMail className="me-1 topbar-icon text-white" />
            <span className="fw-normal topbar-text">trainings@hachion.co</span>
          </a>
        </div>

        {/* Right Section */}
        <div className="d-none d-md-block">
          <Link
            to="/corporate"
            className="btn btn-md text-white text-decoration-underline text-nowrap"
          >
            Corporate Training
          </Link>
        </div>
      </div>
    </div>
  );
};


export default Topbar;
