import Link from "next/link";
import Image from "next/image";
import "./Home.css";
import KeyBenifit from "@/assets/key.webp";
import key1 from "@/assets/key1.webp";
import key2 from "@/assets/key2.webp";
import key3 from "@/assets/key3.webp";
import key4 from "@/assets/key4.webp";
import key5 from "@/assets/key5.webp";

export default function WhyChoose() {
  return (
    <div className="instructor-banner container">
      {/* Left side content */}
      <div className="home-content">
        <h2 className="instructor-title">Why choose our certification courses?</h2>
        <p className="home-title-text">
          Advance your career with Hachion’s expert-led IT training, trusted by learners worldwide for its unique features.
        </p>
        <div className="button-row">
          <Link className="border-button" href="/courses" prefetch={false}>Start Learning Today</Link>
        </div>
        <hr className="seperater" />
        {/* Not `priority` - this section renders well below the fold
            (after Banner/Trending/etc.), and was competing for network
            priority against the actual hero LCP image (confirmed via
            Lighthouse: 4 below-the-fold sections all had `priority` set,
            diluting what "priority" actually means for the page). */}
        <Image
          src={KeyBenifit}
          alt="Key Benefit banner"
          className="key-image"
        />
      </div>

      {/* Right side content */}
      <div className="home-content">
        <div>
          <h3 className="key-title-text">
            <Image src={key1} alt="knowledge" className="icon" />  Learn from Industry Experts
          </h3>
          <p className="instructor-title-text">
            Gain knowledge from professionals with real-world experience. Learn insights, tips, and strategies used by industry leaders.
          </p>
        </div>
        <hr className="seperater" />
        <div>
          <h3 className="key-title-text">
            <Image src={key2} alt="Flexible" className="icon" />  Flexible Learning Options
          </h3>
          <p className="instructor-title-text">
            Learn at your own pace with self-paced modules or live interactive classes that fit your schedule.
          </p>
        </div>
        <hr className="seperater" />
        <div>
          <h3 className="key-title-text">
            <Image src={key3} alt="Learning" className="icon" />  Interactive Learning Experience
          </h3>
          <p className="instructor-title-text">
            Practice through real projects, assignments, and peer discussions for stronger skill retention.
          </p>
        </div>
        <hr className="seperater" />
        <div>
          <h3 className="key-title-text">
            <Image src={key4} alt="Certified" className="icon" />  Get Certified & Boost Your Career
          </h3>
          <p className="instructor-title-text">
            Earn globally recognized certifications that showcase your expertise to top employers.
          </p>
        </div>
        <hr className="seperater" />
        <div>
          <h3 className="key-title-text">
            <Image src={key5} alt="Range" className="icon" />  Wide Range of Courses
          </h3>
          <p className="instructor-title-text">
            Choose from Cloud, DevOps, Data Science, Cybersecurity, Full Stack, and other in-demand fields.
          </p>
        </div>
        <hr className="seperater" />
      </div>
    </div>
  );
}
