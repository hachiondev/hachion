import { useEffect, useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const DATE_FORMATS = ["MM/DD/YYYY", "YYYY-MM-DD"];

const initialTimeLeft = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

export function useDiscountCountdown(discountRule) {
  const [timeLeft, setTimeLeft] = useState(initialTimeLeft);
  const [isOfferActive, setIsOfferActive] = useState(false);

  useEffect(() => {
    if (!discountRule?.endDate) {
      setIsOfferActive(false);
      return;
    }

    const end = dayjs(discountRule.endDate, DATE_FORMATS, true).endOf("day");
    const start = discountRule.startDate
      ? dayjs(discountRule.startDate, DATE_FORMATS, true).startOf("day")
      : null;

    if (!end.isValid()) {
      setIsOfferActive(false);
      return;
    }

    const tick = () => {
      const now = dayjs();

      
      if ((start && now.isBefore(start)) || !end.isAfter(now)) {
        setIsOfferActive(false);
        return;
      }

      const diffMs = end.diff(now);
      let totalSeconds = Math.floor(diffMs / 1000);

      const days = Math.floor(totalSeconds / (24 * 60 * 60));
      totalSeconds %= 24 * 60 * 60;

      const hours = Math.floor(totalSeconds / (60 * 60));
      totalSeconds %= 60 * 60;

      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;

      setTimeLeft({ days, hours, minutes, seconds });
      setIsOfferActive(true);
    };

    tick(); 
    const intervalId = setInterval(tick, 1000);

    return () => clearInterval(intervalId);
  }, [discountRule]);

  return { timeLeft, isOfferActive };
}
