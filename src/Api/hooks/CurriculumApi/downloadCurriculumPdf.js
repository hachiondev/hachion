import { API_BASE_URL } from "@/lib/apiBase";
const API = `${API_BASE_URL}`;

// Goes through the REST /curriculum/pdfs/... endpoints (CORS-enabled, backed
// by @GetMapping handlers) instead of guessing the static /uploads/<env>/...
// resource path by hand. That static path hardcoded the "test" env segment
// into frontend code and has no CORS headers, so it couldn't be existence-
// checked from the browser before navigating to it.
const HEAD_CHECK_TIMEOUT_MS = 10000;

function buildPdfUrl(relativePath, isBrochure) {
  const filename = relativePath.split("/").pop();
  const segment = isBrochure ? "brochurepdf/" : "";
  return `${API}/curriculum/pdfs/${segment}${encodeURIComponent(filename)}`;
}

// curriculum rows can reference a brochure_pdf and/or a curriculum_pdf, but
// the referenced file isn't guaranteed to actually exist in storage (seen in
// practice: DB rows pointing at brochure PDFs that were never uploaded to
// this environment). This opens a tab synchronously (to survive popup
// blockers, since the existence check below is async) and only navigates it
// once a candidate is confirmed reachable, falling back brochure -> syllabus
// -> "nothing available" instead of leaving the user on a dead tab.
export async function openCurriculumPdf(curriculum) {
  // The course-level syllabus lives on the untitled "header" row(s); titled
  // module rows can carry their own curriculum_pdf too, but those are
  // per-module material (e.g. "QA Automation Assignment 1.pdf" on Selenium's
  // Module 1). Taking simply the first row with a curriculum_pdf handed out a
  // module assignment instead of the syllabus, so header rows go first and
  // module rows are only a fallback. Every distinct file is a candidate, so a
  // missing one doesn't hide a later one that exists. Brochures come first.
  const isHeader = (item) => !(item.title && item.title.trim());
  const pick = (field, isBrochure) => {
    const withFile = curriculum.filter((item) => item[field] && item[field].trim() !== "");
    return [...withFile.filter(isHeader), ...withFile.filter((item) => !isHeader(item))].map((item) =>
      buildPdfUrl(item[field], isBrochure)
    );
  };
  const candidates = [...new Set([...pick("brochure_pdf", true), ...pick("curriculum_pdf", false)])];
  if (!candidates.length) {
    return false;
  }

  const tab = window.open("", "_blank");
  for (const url of candidates) {
    try {
      // Bounded, so a stalled backend/proxy falls through to the next
      // candidate (or the "not available" message) instead of leaving the
      // button on "Preparing..." and a blank tab open indefinitely.
      const res = await fetch(url, { method: "HEAD", signal: AbortSignal.timeout(HEAD_CHECK_TIMEOUT_MS) });
      if (res.ok) {
        if (tab) tab.location.href = url;
        else window.open(url, "_blank");
        return true;
      }
    } catch {
      // network/CORS failure - fall through to the next candidate
    }
  }
  if (tab) tab.close();
  return false;
}
