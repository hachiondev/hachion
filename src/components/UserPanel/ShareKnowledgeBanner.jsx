import Link from "next/link";
import Image from "next/image";
import Knowledgebanner from "@/assets/instructor.webp";
import "./Home.css";
import "./Buttons.css";

// Server Component: the CRA original's useNavigate() calls only ever went
// to /become-instructor, so both buttons are next/link <Link>s instead.
export default function ShareKnowledgeBanner() {
  return (
    <div className="instructor-banner container">
      {/* Left side content */}
      <div className="home-content">
        <h2 className="instructor-title">Share Your Knowledge. Inspire the Next Generation of Learners</h2>
        <p className="instructor-title-text">
          At Hachion, we believe knowledge grows when it’s shared. Join our global community of expert instructors and transform your expertise into high-quality online IT courses. With our platform, you can reach thousands of learners worldwide, inspire careers, and build your personal brand as a thought leader.
        </p>
        <div className="button-row">
          <Link className="desktop-solid-button" href="/become-instructor">Start Teaching Today</Link>
        </div>
      </div>

      {/* Right side image - not `priority`, this section is below the fold
          (see WhyChoose.jsx for the full explanation). */}
      <Image
        className="corporate-image"
        src={Knowledgebanner}
        alt="Knowledge banner"
      />
      <Link className="mobile-solid-button" href="/become-instructor">Start Teaching Today</Link>
    </div>
  );
}
