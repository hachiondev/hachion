const fs = require("fs");
const path = require("path");
const axios = require("axios");

const baseUrl = "https://hachion.co";
const coursesApi = "https://api.test.hachion.co/courses/all";
const workshopsApi = "https://api.test.hachion.co/workshopschedule";

// Slug generator — lowercase and replace spaces with hyphens
const toSlug = str => str.trim().toLowerCase().replace(/\s+/g, "-");

// Escape special XML characters
const escapeXml = unsafe => unsafe
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&apos;");

const staticRoutes = [
  "/", "/login", "/register", "/registerverification", "/registerhere",
  "/loginsuccess", "/forgotpassword", "/coursedetails", "/corporate",
  "/haveanyquery", "/workshop", "/blogs",
  "/aboutus", "/contactus", "/userdashboard", "/review",
  "/addtrending", "/courseschedule", "/corporatecourses",
   "/terms", "/privacy", "/summer-tech-bootcamp-for-teens"
];

const generateSitemap = async () => {
  try {
    // Fetch both APIs in parallel
    const [coursesResponse, workshopsResponse] = await Promise.all([
      axios.get(coursesApi),
      axios.get(workshopsApi)
    ]);

    const courses = coursesResponse.data || [];
    const workshops = workshopsResponse.data || [];

    // Generate course routes
    const courseRoutes = courses.flatMap(course => {
      const slug = toSlug(course.courseName || "");
      return [`/coursedetails/${slug}`, `/enroll/${slug}`];
    });

    // Generate workshop routes
    const workshopRoutes = workshops
      .filter(workshop => workshop.title)
      .map(workshop => {
        const slug = toSlug(workshop.title);
        return `/workshop/${slug}`;
      });

    const allRoutes = [...staticRoutes, ...courseRoutes, ...workshopRoutes];

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

    // Ensure the public directory exists
    const publicDir = path.resolve(__dirname, "public");
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemap);
    console.log("✅ Sitemap created successfully.");
  } catch (err) {
    console.error("❌ Failed to generate sitemap:", err.message);
  }
};

generateSitemap();