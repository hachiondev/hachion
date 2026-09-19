import Link from "next/link";
import "../../Home.css";
import "../../Buttons.css";
import { LazyDiscountCards as DiscountCards } from "../LazyHomeSections";

// Server Component: the CRA original's useNavigate() call only ever went
// to /discountdeals, so the button is a next/link <Link> instead — no
// "use client" needed here. <DiscountCards /> (countdowns, pagination,
// live API data) stays its own Client Component.
const LimitedDeals = () => {
  return (
    <div className="limited-component container">
      {/* Left side content */}
      <div className="limited-deal-content">
        <h2 className="association-head">Limited Time Deals on Top Courses!</h2>
        <p className="limited-deals-text">
          Special prices on selected coursefs for a limited period. Countdown to savings starts now!
        </p>
        <div className="button-row">
          <Link className="limited-deal-button" href="/discountdeals">Explore All Deals</Link>
        </div>
        </div>

      {/* Right side image */}
      <DiscountCards  />
    </div>
  );
};

export default LimitedDeals;
