const API = `https://api.hachion.co`;

// Goes through the REST /curriculum/pdfs/... endpoints (CORS-enabled, backed
// by @GetMapping handlers) instead of guessing the static /uploads/<env>/...
// resource path by hand. That static path hardcoded the "test" env segment
// into frontend code and has no CORS headers, so it couldn't be existence-
// checked from the browser before navigating to it.
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
  const brochureItem = curriculum.find((item) => item.brochure_pdf && item.brochure_pdf.trim() !== "");
  const curriculumItem = curriculum.find((item) => item.curriculum_pdf && item.curriculum_pdf.trim() !== "");
  if (!brochureItem && !curriculumItem) {
    return false;
  }

  const candidates = [];
  if (brochureItem) candidates.push(buildPdfUrl(brochureItem.brochure_pdf, true));
  if (curriculumItem) candidates.push(buildPdfUrl(curriculumItem.curriculum_pdf, false));

  const tab = window.open("", "_blank");
  for (const url of candidates) {
    try {
      const res = await fetch(url, { method: "HEAD" });
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
