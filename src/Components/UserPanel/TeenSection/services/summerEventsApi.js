import axios from "axios";

export const fetchSummerEvents = async () => {
  const res = await axios.get("https://api.hachion.co/summerevents");
  return res.data || [];
};
