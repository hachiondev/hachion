// import axios from "axios";

// export const getTrainers = async () => {
//   const { data } = await axios.get("https://api.test.hachion.co/trainers");
//   return data || [];
// };

import axios from "axios";

export const getTrainers = async () => {
  const { data } = await axios.get("https://api.test.hachion.co/trainers/summary");
  return data || [];
};