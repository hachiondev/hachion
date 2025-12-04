import axios from "axios";

export const getUserCountry = async () => {
  try {
    const { data } = await axios.get("https://ipinfo.io/json?token=82aafc3ab8d25b");
    return (data && data.country) || "US";
  } catch (e) {
    console.error("geoService.getUserCountry failed", e);
    return "US";
  }
};
