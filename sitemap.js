const fs = require("fs");
const path = require("path");
const axios = require("axios");

const baseUrl = "https://hachion.co";
const apiUrl = "https://api.test.hachion.co/courses/all";

// Slug generator - keep special characters like (), +, &
// Only lowercase and replace spaces with hyphens
const toSlug = str =>
  str.trim().toLowerCase().replace(/\s+/g, "-");

// Escape characters that break XML
const escapeXml = unsafe => unsafe
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&apos;");

const staticRoutes = [
  "/", "/login", "/register", "/registerverification", "/registerhere",
  "/loginsuccess", "/forgotpassword", "/courseDetails", "/corporate",
  "/haveanyquery", "/workshop", "/blogs", 
  "/aboutus", "/contactus", "/userdashboard", "/review",
  "/addtrending", "/courseschedule", "/corporatecourses", 
  "/reports", "/terms", "/privacy"
];

const generateSitemap = async () => {
  try {
    const response = await axios.get(apiUrl);
    const courses = response.data;

    const courseRoutes = courses.map(course => {
      const slug = toSlug(course.courseName);
      return [`/courseDetails/${slug}`, `/enroll/${slug}`];
    }).flat();

    const allRoutes = [...staticRoutes, ...courseRoutes];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allRoutes
    .map(route => {
      const fullUrl = baseUrl + route;
      return `
  <url>
    <loc>${escapeXml(encodeURI(fullUrl))}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${route === "/" ? "1.0" : "0.9"}</priority>
  </url>`;
    }).join("")}
</urlset>`;

    fs.writeFileSync(path.resolve(__dirname, "public", "sitemap.xml"), sitemap);
    console.log("✅ Sitemap created successfully.");
  } catch (err) {
    console.error("❌ Failed to generate sitemap:", err.message);
  }
};

generateSitemap();
