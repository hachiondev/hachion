/**
 * useCountdowns
 * Accepts:
 *  - items: array of objects containing either id or courseName
 *  - getEndsAt(item) => Date | null
 *
 * Returns:
 *  - record { [key]: "1d 02h Left" | "00h Left" ... }
 *
 * Implementation: a single interval that updates labels every second.
 */

import { useEffect, useRef, useState } from "react";

const pad = (n) => n.toString().padStart(2, "0");

export const useCountdowns = (items = [], getEndsAt) => {
  const [labels, setLabels] = useState({});
  const itemsRef = useRef(items);
  const getEndsAtRef = useRef(getEndsAt);

  // Update refs on every render without triggering effect
  useEffect(() => {
    itemsRef.current = items;
    getEndsAtRef.current = getEndsAt;
  });

  useEffect(() => {
    let cancelled = false;

    const compute = () => {
      if (cancelled) return;
      const next = {};
      for (const c of itemsRef.current) {
        const key = c.id ?? c.courseName;
        const endsAt = getEndsAtRef.current(c);
        if (!endsAt) continue;
        const diffMs = endsAt.getTime() - Date.now();
        if (diffMs <= 0) continue;
        const totalSec = Math.floor(diffMs / 1000);
        const days = Math.floor(totalSec / 86400);
        const hours = Math.floor((totalSec % 86400) / 3600);
        if (days > 0) next[key] = `${days}d ${pad(hours)}h Left`;
        else next[key] = `${pad(hours)}h Left`;
      }
      setLabels(next);
    };

    compute();
    const tid = setInterval(compute, 1000);
    return () => {
      cancelled = true;
      clearInterval(tid);
    };
  }, []); // ✅ Empty dependency array - only run once on mount

  return labels;
};