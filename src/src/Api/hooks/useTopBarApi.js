import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchCountry = async () => {
  const res = await axios.get("https://api.country.is");
  return res.data;
};

export const useTopBarApi = () => {
  const { data, error } = useQuery({
    queryKey: ["userCountry"],
    queryFn: fetchCountry,
    staleTime: 5 * 60 * 1000,
  });

  const isIndia = data?.country?.toUpperCase() === "IN";

  const whatsappNumber = isIndia ? "+91-949-032-3388" : "+1 (732) 485-2499";
  const whatsappLink = isIndia
    ? "https://wa.me/919490323388"
    : "https://wa.me/17324852499";

  return {
    whatsappNumber,
    whatsappLink,
    isLoading: !data && !error,
    error,
  };
};
