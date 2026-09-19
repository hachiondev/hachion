#!/usr/bin/env node
// Lightweight smoke test for the course page's critical assets/endpoints.
// Catches "works locally, 404s on test" regressions before they reach users.
//
// Usage:
//   node scripts/verify-course-page-assets.mjs http://localhost:3000
//   node scripts/verify-course-page-assets.mjs https://test.hachion.co
//
// Exits non-zero if any check fails, so it can be wired into a deploy step.

const baseUrl = process.argv[2];

if (!baseUrl) {
  console.error("Usage: node scripts/verify-course-page-assets.mjs <baseUrl>");
  console.error("Example: node scripts/verify-course-page-assets.mjs https://test.hachion.co");
  process.exit(2);
}

// Static/public assets the course page depends on that have historically
// gone missing on test due to deploy lag (see MEMORY.md / final report).
const staticChecks = [
  { label: "Favicon", path: "/favicon.ico", expectType: "image" },
  { label: "Admin logo (Hachion-logo.png)", path: "/Hachion-logo.png", expectType: "image" },
  { label: "Student image (login_pop.png)", path: "/login_pop.png", expectType: "image" },
  { label: "Calendar image", path: "/calendar.png", expectType: "image" },
  { label: "Share icon", path: "/share.png", expectType: "image" },
  { label: "Download icon", path: "/Download.png", expectType: "image" },
  { label: "Certificate image", path: "/Certificate_Of_Hachion.jpg", expectType: "image" },
  { label: "ISO image", path: "/ISO.png", expectType: "image" },
  { label: "PMI/Microsoft Project image", path: "/MicrosoftProject.png", expectType: "image" },
];

// Course-page routes that must render (HTML, not an error page).
const pageChecks = [
  { label: "Course listing page", path: "/courses", expectType: "html" },
  {
    label: "Course detail page (AI/ML reference course)",
    path: "/courses/artificial-intelligence/machine-learning-training",
    expectType: "html",
  },
];

function classify(status, contentType, bodySnippet) {
  if (status >= 500) return "5xx";
  if (status === 404) return "404";
  if (status === 403) return "403";
  if (status >= 400) return "4xx";
  if (contentType?.startsWith("image/")) return "image";
  if (contentType?.includes("application/json") || bodySnippet.trim().startsWith("{")) return "json";
  if (contentType?.includes("text/html") || bodySnippet.trim().startsWith("<!DOCTYPE") || bodySnippet.trim().startsWith("<html")) {
    return "html";
  }
  return "other";
}

async function check(url) {
  try {
    const res = await fetch(url, { redirect: "follow" });
    const contentType = res.headers.get("content-type") || "";
    // Only read a small prefix of the body - enough to classify HTML/JSON,
    // not enough to matter for large images.
    const buf = await res.arrayBuffer();
    const bytes = new Uint8Array(buf).slice(0, 200);
    const bodySnippet = Buffer.from(bytes).toString("utf8");
    return { status: res.status, contentType, kind: classify(res.status, contentType, bodySnippet) };
  } catch (err) {
    return { status: 0, contentType: "", kind: "unreachable", error: err.message };
  }
}

async function run() {
  console.log(`Verifying course-page assets against: ${baseUrl}\n`);
  let failures = 0;

  console.log("-- Static assets --");
  for (const { label, path, expectType } of staticChecks) {
    const result = await check(new URL(path, baseUrl).toString());
    const ok = result.kind === expectType;
    if (!ok) failures++;
    console.log(
      `${ok ? "PASS" : "FAIL"}  ${label.padEnd(38)} ${path.padEnd(32)} status=${result.status} type=${result.contentType || "n/a"} kind=${result.kind}`
    );
  }

  console.log("\n-- Course pages --");
  for (const { label, path, expectType } of pageChecks) {
    const result = await check(new URL(path, baseUrl).toString());
    const ok = result.kind === expectType;
    if (!ok) failures++;
    console.log(
      `${ok ? "PASS" : "FAIL"}  ${label.padEnd(38)} ${path.padEnd(60)} status=${result.status} kind=${result.kind}`
    );
  }

  console.log(`\n${failures === 0 ? "All checks passed." : `${failures} check(s) failed.`}`);
  process.exit(failures === 0 ? 0 : 1);
}

run();
