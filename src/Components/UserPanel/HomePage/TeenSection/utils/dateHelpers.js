import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

export const parseMDY = (s) => dayjs(s, ["MM/DD/YYYY", "YYYY-MM-DD"], true);

export const fmtDate = (d, f = "DD MMM YYYY") => {
  if (!d) return "";
  return dayjs(d).format(f);
};
