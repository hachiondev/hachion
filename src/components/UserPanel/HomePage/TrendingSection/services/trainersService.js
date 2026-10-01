import axios from "axios";
import { API_BASE_URL } from "@/lib/apiBase";
export const getTrainers = async () => {
  const {
    data
  } = await axios.get(`${API_BASE_URL}/trainers/summary`);
  return data || [];
};
