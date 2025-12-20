import axios from "axios";

export const getTrainers = async () => {
  const { data } = await axios.get("https://api.test.hachion.co/trainers");
  return data || [];
};
