import { buildCanonicalUrl } from "@/lib/seo";
import Register from "@/components/UserPanel/HomePage/AuthSection/RegisterSection/Register";

const CANONICAL_URL = buildCanonicalUrl("/register");

export function generateMetadata() {
  return {
    title: "Sign Up | Hachion",
    description: "Create a free Hachion account to enroll in IT certification courses.",
    alternates: { canonical: CANONICAL_URL },
    robots: { index: false, follow: true },
  };
}

export default function RegisterPage() {
  return <Register />;
}
