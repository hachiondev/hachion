import { API_BASE_URL } from "@/lib/apiBase";
export const getLearnerReviews = async () => {
  const response = await fetch(`${API_BASE_URL}/userreview/active`);
  const data = await response.json();
  return Array.isArray(data) ? data : [];
};
