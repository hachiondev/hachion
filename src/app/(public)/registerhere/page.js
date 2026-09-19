import RegisterHere from "@/components/UserPanel/HomePage/AuthSection/RegisterHere";

export function generateMetadata() {
  return {
    title: "Set Password & Verify | Hachion",
    description: "Complete your Hachion account setup.",
    robots: { index: false, follow: true },
  };
}

export default function RegisterHerePage() {
  return <RegisterHere />;
}
