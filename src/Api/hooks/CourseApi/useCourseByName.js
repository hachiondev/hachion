import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_BASE = `https://api.hachion.co`;

// `initialData` lets a Server Component's already-fetched course object seed
// this query's cache entry so the FIRST render (including SSR, before any
// client fetch resolves) already has real data instead of `isLoading: true`
// — this is what makes the course-details page's server-rendered HTML
// contain the actual course content rather than a literal "Loading course
// details..." placeholder. Only applied when it matches the query's own
// courseName (checked by the caller), so a stale/mismatched initialData
// can't leak into an unrelated query.
export function useCourseByName(courseName, options = {}) {
  return useQuery({
    queryKey: ["courseByName", courseName],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE}/courses/getByCourseName/${encodeURIComponent(courseName)}`);
      return Array.isArray(res.data) ? res.data[0] : null;
    },
    enabled: !!courseName,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}
