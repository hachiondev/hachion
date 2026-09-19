import RegisterNext from "@/components/UserPanel/HomePage/AuthSection/RegisterNext";

export function generateMetadata() {
  return {
    title: "Verify Your Account | Hachion",
    description: "Verify your email to complete your Hachion account registration.",
    robots: { index: false, follow: true },
  };
}

export default function RegisterVerificationPage() {
  return <RegisterNext />;
}
