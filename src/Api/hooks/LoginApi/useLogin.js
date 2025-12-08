import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const loginUser = async (payload) => {
  const res = await axios.post("https://api.test.hachion.co/api/v1/user/login", payload);
  return res.data;
};

export function useLoginMutation() {
  return useMutation({
    mutationFn: loginUser,
  });
}
