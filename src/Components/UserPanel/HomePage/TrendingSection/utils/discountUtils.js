    // utilities for discount rules / date windows / normalization
    import dayjs from "dayjs";
    import customParseFormat from "dayjs/plugin/customParseFormat";
    dayjs.extend(customParseFormat);

    const normalizeStr = (s) => (s || "").toString().trim().toLowerCase();

    export const parseMDY = (s) => dayjs(s, ["MM/DD/YYYY", "YYYY-MM-DD"], true);

    export const inWindow = (start, end, strict = true) => {
    const today = dayjs();
    const s = parseMDY(start);
    const e = parseMDY(end);

    if (strict) {
        const okS = s.isValid() ? !today.isBefore(s, "day") : true;
        const okE = e.isValid() ? !today.isAfter(e, "day") : true;
        return okS && okE;
    } else {
        const okE = e.isValid() ? !today.isAfter(e, "day") : true;
        return okE;
    }
    };

    export const expandRuleCountry = (token, regionNames) => {
    const t = (token || "").toString().trim();
    if (!t) return [];
    if (/^[A-Za-z]{2}$/.test(t)) {
        const code = t.toUpperCase();
        const name = regionNames.of(code) || "";
        return [normalizeStr(code), normalizeStr(name)];
    }
    return [normalizeStr(t)];
    };

    export const expandUserCountry = (cc, regionNames) => {
    const code = (cc || "").toUpperCase();
    const name = regionNames.of(code) || "";
    return new Set([normalizeStr(code), normalizeStr(name)]);
    };

    export const getActiveRuleFor = (courseName, countryCode, discountRules, regionNames, strict = true) => {
    if (!Array.isArray(discountRules) || discountRules.length === 0) return null;
    const userCountryTokens = expandUserCountry(countryCode, regionNames);
    const courseKey = normalizeStr(courseName);

    for (const r of discountRules) {
        if ((r.status || "").toLowerCase() !== "active") continue;
        if (!inWindow(r.startDate, r.endDate, strict)) continue;

        const courses = Array.isArray(r.courseNames) ? r.courseNames : [];
        const countries = Array.isArray(r.countryNames) ? r.countryNames : [];

        const courseOk =
        courses.some(c => normalizeStr(c) === courseKey) ||
        courses.some(c => normalizeStr(c) === "all");

        const countryOk =
        countries.some(c => {
            const tokens = expandRuleCountry(c, regionNames);
            return tokens.some(t => userCountryTokens.has(t));
        }) ||
        countries.some(c => normalizeStr(c) === "all");

        if (courseOk && countryOk) return r;
    }
    return null;
    };

    export const getRuleDiscountPct = (courseName, countryCode, discountRules, regionNames) => {
    if (!Array.isArray(discountRules) || discountRules.length === 0) return 0;
    let best = 0;
    for (const r of discountRules) {
        if ((r.status || "").toLowerCase() !== "active") continue;
        if (!inWindow(r.startDate, r.endDate, true)) continue;

        const courses = Array.isArray(r.courseNames) ? r.courseNames : [];
        const countries = Array.isArray(r.countryNames) ? r.countryNames : [];

        const courseOk =
        courses.some(c => normalizeStr(c) === normalizeStr(courseName)) ||
        courses.some(c => normalizeStr(c) === "all");

        const countryOk =
        countries.some(c => {
            const tokens = expandRuleCountry(c, regionNames);
            return tokens.some(t => expandUserCountry(countryCode, regionNames).has(t));
        }) ||
        countries.some(c => normalizeStr(c) === "all");

        if (courseOk && countryOk) {
        const pct = Number(r.discountPercentage || 0);
        if (pct > best) best = pct;
        }
    }
    return best;
    };
