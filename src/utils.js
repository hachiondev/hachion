// Ported from the CRA app's src/utils.js — used by the Course Details page
// components (Banner, DemoClassSection, CourseCurriculum, CertificateSection,
// FAQSection, StudentsSay, InstructorSection) to join conditional classNames.
export function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}
