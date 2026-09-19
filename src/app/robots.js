import { SITE_ORIGIN } from "@/lib/seo";

// Ported from the CRA app's public/robots.txt. Next.js's file-convention
// (MetadataRoute.Robots) auto-serves this at /robots.txt — this file didn't
// exist at all in the Next.js app until now, meaning crawlers previously
// got no robots directives whatsoever (a real SEO gap found during audit).
//
// Disallow list matches this app's actual routes (not CRA's 1:1) — CRA's
// separate /confirm-otp and /resetpassword routes were consolidated into
// /forgotpassword here, so those two entries are dropped (nothing at those
// paths to disallow); /phone-number is kept since that route now exists in
// this app too.
export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admincourse",
          "/addtrending",
          "/courseschedule",
          "/corporatecourses",
          "/reports",
          "/userdashboard",
          "/adminlogin",
          "/adminregister",
          "/adminforgot",
          "/admindashboardview",
          "/login",
          "/register",
          "/forgotpassword",
          "/phone-number",
          "/registerverification",
          "/registerhere",
          "/api/",
          "/*?*",
          "/*sort=",
          "/*filter=",
        ],
      },
    ],
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
  };
}
