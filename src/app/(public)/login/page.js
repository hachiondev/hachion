import { buildCanonicalUrl } from "@/lib/seo";
import Login from "@/components/UserPanel/HomePage/AuthSection/LoginSection/Login";

const CANONICAL_URL = buildCanonicalUrl("/login");

// The CRA original had no <Helmet> on this page — added minimal metadata
// for consistency; noindex since a login form has no search-result value
// and shouldn't be crawled.
export function generateMetadata() {
  return {
    title: "Login | Hachion",
    description: "Log in to your Hachion account to access your courses and dashboard.",
    alternates: { canonical: CANONICAL_URL },
    robots: { index: false, follow: true },
  };
}

export default function LoginPage() {
  return <Login />;
}
