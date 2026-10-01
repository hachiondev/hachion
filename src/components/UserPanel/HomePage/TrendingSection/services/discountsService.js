import axios from "axios";
import { API_BASE_URL } from "@/lib/apiBase";
export const getDiscountRules = async () => {
  try {
    const {
      data
    } = await axios.get(`${API_BASE_URL}/discounts-courses`);
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.error("discountsService.getDiscountRules failed", e);
    return [];
  }
};
