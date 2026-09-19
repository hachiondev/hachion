import Link from "next/link";
import "../Home.css";
import PopupCourseCards from "./PopupCourseCards";

const BannerDeals = () => {

  return (
    <div className="discount-popup-component container">
      {/* Left side content */}
      <div className="limited-deal-content">
        <h4 className="popup-title-text">Top Courses in Your Area</h4>
        <p className="popup-content popup-learner-text"><span>🎓 200+ learners</span> from your city are already certified!</p>
        <div className="button-row">
          <Link className="limited-deal-button" href="/discountdeals">Explore Courses</Link>
        </div>
        </div>

      {/* Right side image */}
      <PopupCourseCards  />
    </div>
  );
};

export default BannerDeals;
