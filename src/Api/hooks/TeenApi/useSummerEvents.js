import { useQuery } from "@tanstack/react-query";
import { fetchSummerEvents } from "../../../../src/Components/UserPanel/HomePage/TeenSection/services/summerEventsApi";

export const useSummerEvents = () =>
  useQuery({
    queryKey: ["summer-events"],
    queryFn: fetchSummerEvents,
  });
