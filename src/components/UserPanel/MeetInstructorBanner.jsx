import Link from "next/link";
import Image from "next/image";
import Instructorbanner from "@/assets/topinstructor.webp";
import "./Home.css";
import "./Buttons.css";

// Server Component: the CRA original's useNavigate() calls only ever went
// to /instructor-profiles, so both buttons are next/link <Link>s instead.
export default function MeetInstructorBanner() {
  return (
    <div className="instructor-banner container">
      {/* Left side content */}
      <div className="home-content">
        <h2 className="instructor-title">Meet Our Industry Expert Trainers </h2>
        <p className="instructor-title-text">
          At Hachion, you’ll learn directly from the best in the IT industry.
          Our instructors are certified professionals and subject-matter experts with years of real-world experience. They bring hands-on knowledge, practical insights, and proven teaching methods to ensure you gain skills that matter in today’s job market.
        </p>
        <div className="button-row">
          <Link className="desktop-border-button" href="/instructor-profiles">Meet All Our Experts</Link>
        </div>
      </div>

      {/* Right side image - not `priority`, this section is below the fold
          (see WhyChoose.jsx for the full explanation). */}
      <Image
        className="corporate-image"
        src={Instructorbanner}
        alt="Instructor banner"
      />
      <Link className="mobile-border-button" href="/instructor-profiles">Meet All Our Experts</Link>
    </div>
  );
}
