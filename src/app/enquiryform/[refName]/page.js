import EnquiryPage from "@/components/UserPanel/EnquiryPage";

// Deliberately placed outside the (public) route group — this is a
// standalone marketer-referral landing page with no navbar/footer/topbar
// chrome, matching CRA's own EnquiryPage.jsx (no shared layout elements).
// CRA had no <Helmet>/metadata on this page either; marketer-referral link
// pages aren't meant for organic search discovery, so this stays noindex.
export function generateMetadata() {
  return {
    title: "Get Your Free Demo | Hachion",
    description: "Book your free demo and get a personalized career roadmap from Hachion.",
    robots: { index: false, follow: false },
  };
}

export default function EnquiryFormPage() {
  return <EnquiryPage />;
}
