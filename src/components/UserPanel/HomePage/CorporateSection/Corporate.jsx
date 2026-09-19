import Link from "next/link";
import Image from "next/image";
import "./Corporate.css";
import "../../Buttons.css";
import corporateImage from "@/assets/corporatenew.webp";

// Server Component: the CRA original used useNavigate()+window.scrollTo(0,0)
// purely to go to /corporate, which next/link's <Link> does natively
// (it scrolls to top on navigation by default), so no client-side
// event handler — and no "use client" — is needed here.
export default function Corporate() {
  return (
    <div className="corporate">
      <div className="corporate-data container">
        <Image
          src={corporateImage}
          alt="corporate-image"
          className="corporate-image"
        />
        <div className="corporate-content">
          <h2 className="corporate-banner-text">
            Transform your business with customized corporate programs
          </h2>
          <Link href="/corporate" className="know-more">
            Know More
          </Link>
        </div>
      </div>
    </div>
  );
}
