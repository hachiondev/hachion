import { buildCanonicalUrl } from "@/lib/seo";
import EnrollPayment from "@/components/UserPanel/EnrollPayment";

export async function generateMetadata({ params }) {
  const { courseName } = await params;
  return {
    title: "Enrollment Confirmation | Hachion",
    description: "Your course enrollment payment confirmation.",
    alternates: { canonical: buildCanonicalUrl(`/payment/${courseName}`) },
    robots: { index: false, follow: false },
  };
}

export default function PaymentPage() {
  return <EnrollPayment />;
}
