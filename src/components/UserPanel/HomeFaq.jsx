import Image from "next/image";
import Link from "next/link";
import Faq from "@/assets/faq.webp";
import "./Home.css";
import "./Buttons.css";
import { LazyHelpFaq as HelpFaq } from "./HomePage/LazyHomeSections";

// Server Component: the CRA original's useNavigate() call only ever went
// to /viewfaqs, so the button is a next/link <Link> instead — no "use
// client" needed here. <HelpFaq /> (the accordion, which does need
// client-side state + a live API call) stays its own Client Component.
const HomeFaq = () => {
  return (
    <div className="home-faq-banner container">
    <div className="home-faq-data container">
      {/* Left side content */}
      <div className="home-faq-content">
        <div>
        <h2 className="association-head">FAQS</h2>
        <hr className="faq-seperater"/>
        </div>
        <HelpFaq />
        </div>

      {/* Right side image - not `priority`, this section (FAQ) is always
          near the bottom of every page that renders it, well below the
          fold (see WhyChoose.jsx for the full explanation). */}
      <Image
        className="faq-image"
        src={Faq}
        alt="Faq banner"
      />
    </div>
    <Link className="home-start-button" href="/viewfaqs">
      View FAQS
      </Link>
    </div>
  );
};

export default HomeFaq;
