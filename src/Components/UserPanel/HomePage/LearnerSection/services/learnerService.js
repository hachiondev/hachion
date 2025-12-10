export const getLearnerReviews = async () => {
  const response = await fetch("https://api.hachion.co/userreview/active");
  const data = await response.json();
  return Array.isArray(data) ? data : [];
};
