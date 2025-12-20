import axios from "axios";

export const getDiscountRules = async () => {
  try {
    const { data } = await axios.get("https://api.hachion.co/discounts-courses");
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.error("discountsService.getDiscountRules failed", e);
    return [];
  }
};
