import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_BASE = "https://api.test.hachion.co";
const GEO_URL = "https://ipinfo.io?token=9da91c409ab4b2";

export function useCourseDiscountRule(courseName) {
  return useQuery({
    queryKey: ["courseDiscountRule", courseName],
    enabled: !!courseName,
    staleTime: 5 * 60 * 1000, 

    queryFn: async () => {
      
      let userCountry = "US";
      try {
        const geo = await axios.get(GEO_URL);
        userCountry = geo.data?.country?.toUpperCase() || "US";
      } catch (_) {}

      const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

      const normalize = (s) =>
        (s || "").toString().trim().toLowerCase();

      const expandUserCountry = () => {
        const fullName = regionNames.of(userCountry) || "";
        return new Set([normalize(userCountry), normalize(fullName)]);
      };

      const expandRuleCountry = (token) => {
        if (!token) return [];
        const t = token.toString().trim();
        
        if (/^[A-Za-z]{2}$/.test(t)) {
          const code = t.toUpperCase();
          const name = regionNames.of(code) || "";
          return [normalize(code), normalize(name)];
        }
        
        return [normalize(t)];
      };

      const userCountryTokens = expandUserCountry();

      
      const res = await axios.get(`${API_BASE}/discounts-courses`);
      const rules = Array.isArray(res.data) ? res.data : [];
      const now = new Date();

      
      const parseDate = (str) => {
        if (!str) return null;
        if (str.includes("/")) {
          const [m, d, y] = str.split("/");
          if (y && m && d) return new Date(`${y}-${m}-${d}T23:59:59`);
        }
        return new Date(str);
      };

      const inWindow = (rule) => {
        const s = parseDate(rule.startDate);
        const e = parseDate(rule.endDate);
        if (s && now < s) return false;
        if (e && now > e) return false;
        return true;
      };

      
      const courseKey = normalize(courseName);

      const rule =
        rules.find((r) => {
          if ((r.status || "").toLowerCase() !== "active") return false;
          if (!inWindow(r)) return false;

          const rawCourses = Array.isArray(r.courseNames)
            ? r.courseNames
            : (r.courseNames || "").split(",");

          const courseNames = rawCourses
            .map((c) => c && c.toString().trim())
            .filter(Boolean);

          const courseOk = courseNames.some(
            (c) => normalize(c) === courseKey || normalize(c) === "all"
          );

          if (!courseOk) return false;
          const rawCountries = Array.isArray(r.countryNames)
            ? r.countryNames
            : (r.countryNames || "").split(",");

          const countryNames = rawCountries
            .map((c) => c && c.toString().trim())
            .filter(Boolean);

          const countryOk =
            countryNames.some((c) => {
              const tokens = expandRuleCountry(c);
              return tokens.some((t) => userCountryTokens.has(t));
            }) ||
            countryNames.some((c) => normalize(c) === "all");

          return countryOk;
        }) || null;

      return rule;
    },
  });
}
