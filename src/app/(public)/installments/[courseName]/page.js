import { buildCanonicalUrl } from "@/lib/seo";
import OnlineInstallments from "@/components/UserPanel/OnlineInstallments";

export async function generateMetadata({ params }) {
  const { courseName } = await params;
  return {
    title: "Installments | Hachion",
    description: "Choose an installment plan for your course enrollment.",
    alternates: { canonical: buildCanonicalUrl(`/installments/${courseName}`) },
    robots: { index: false, follow: false },
  };
}

export default function InstallmentsPage() {
  return <OnlineInstallments />;
}
