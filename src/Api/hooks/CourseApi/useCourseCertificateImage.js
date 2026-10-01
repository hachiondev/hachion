import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "@/lib/apiBase";

function resolveCertificateImageUrl(path) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

// Admin-managed certificate templates are uploaded via Student Admin ->
// Certificate -> Course Certificate (CourseCertificate.jsx, backed by the
// `Certificate` entity and the /certificate + /certificate/add endpoints).
// This looks up the template configured for a given course by name so the
// Course Page's certificate preview reflects whatever the admin last
// uploaded instead of a hardcoded image.
export function useCourseCertificateImage(courseName) {
  return useQuery({
    queryKey: ["courseCertificateImage", courseName],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/certificate`);
      const list = Array.isArray(res.data) ? res.data : [];
      const normalized = String(courseName).trim().toLowerCase();
      const match = list.find((c) => (c.course_name || "").trim().toLowerCase() === normalized && c.certificate_image);
      return match ? resolveCertificateImageUrl(match.certificate_image) : null;
    },
    enabled: !!courseName,
    // Intentionally short: an admin swapping the template in Student Admin
    // must show up on the Course Page promptly, not up to 5 minutes later.
    // This is a lightweight GET with no meaningful request-volume cost.
    staleTime: 30 * 1000,
    refetchOnMount: "always",
  });
}
