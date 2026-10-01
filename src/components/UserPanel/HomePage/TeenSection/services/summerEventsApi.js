import axios from "axios";
import { API_BASE_URL } from "@/lib/apiBase";
export const fetchSummerEvents = async () => {
  const res = await axios.get(`${API_BASE_URL}/summerevents`);
  return res.data || [];
};
