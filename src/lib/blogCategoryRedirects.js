// Old -> canonical blog CATEGORY slug, for bare category-only URLs like
// /blogs/act or /blogs/data-science-&-business-analytics (no article
// segment). There is no category-index page in the app, so these have
// always 404'd; the closest real, already-working destination is the
// existing /blogs?category=<slug> filter (BlogList.jsx already reads
// `category` from the query string - verified, not guessed).
//
// This is NOT needed for normal /blogs/<category>/<title> URLs - the
// dynamic route (src/app/(public)/blogs/[category_name]/[title]/page.js)
// already looks blogs up by title/id alone and permanently redirects to
// the correct category+slug regardless of what category text was in the
// request (verified live: a wrong/garbled category segment combined with
// a real article slug already 301s to the fully correct URL in one hop).
//
// Every value here is one of the 24 categories the app actually has today
// (see the "Category breakdown" section of the sitemap export this map
// was built from) - old spellings map to the real slug; already-correct
// spellings map to themselves, since even a *correct* bare category slug
// has no index page to land on without this redirect.
export const blogCategoryRedirects = {
  "accounting-and-finance": "accounting-and-finance-test",
  "accounting-and-finance-test": "accounting-and-finance-test",
  "accounting-&-finance": "accounting-and-finance-test",
  "act": "act",
  "artificial-intelligence": "artificial-intelligence",
  "big-data-and-streaming-technologies": "big-data-and-streaming-technologies",
  "big-data-&-streaming-technologies": "big-data-and-streaming-technologies",
  "business-analyst": "business-analyst",
  "business-intelligence": "business-intelligence",
  "career-development-and-professional-skills": "career-development-and-professional-skills",
  "career-development-&-professional-skills": "career-development-and-professional-skills",
  "cloud-courses": "cloud-courses",
  "crm-courses": "crm-courses",
  "cyber-security": "cyber-security",
  "data-science-and-business-analytics": "data-science-and-business-analytics",
  "data-science-&-business-analytics": "data-science-and-business-analytics",
  "data-science--business-analytics": "data-science-and-business-analytics",
  "machine-learning-with-ai": "machine-learning-with-ai",
  "management-courses": "management-courses",
  "marketing-and-business": "marketing-and-business",
  "marketing-&-business": "marketing-and-business",
  "microsoft": "microsoft",
  "mobile-app-development": "mobile-app-development",
  "networking-courses": "networking-courses",
  "programming": "programming",
  "qa-testing": "qa-testing",
  "sat": "sat",
  "summer-training": "summer-training",
  "web-development": "web-development",
  "workday": "workday",
  "workshops": "workshops",
};
