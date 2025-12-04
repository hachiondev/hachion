import { useQuery } from "@tanstack/react-query";
import { fetchSummerEvents } from "../../../Components/UserPanel/TeenSection/services/summerEventsApi";

export const useSummerEvents = () =>
  useQuery({
    queryKey: ["summer-events"],
    queryFn: fetchSummerEvents,
  });
