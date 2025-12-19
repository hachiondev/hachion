// src/Api/hooks/CourseApi/useDemoScheduleLogic.js
import { useMemo } from "react";
import { useCourseScheduleSlots } from "../CourseApi/useCourseScheduleSlots";

export function useDemoScheduleLogic({ courseSlug, timezone }) {
  const {
    liveSlots,
    crashSlots,
    loading: scheduleLoading,
    error: scheduleError,
  } = useCourseScheduleSlots({
    courseSlug,
    timezone,
  });

  const scheduleTimeZoneAbbr = useMemo(() => {
    const primarySlot =
      (liveSlots && liveSlots.length > 0 && liveSlots[0]) ||
      (crashSlots && crashSlots.length > 0 && crashSlots[0]) ||
      null;

    if (!primarySlot) return null;

    const rawTz =
      primarySlot.schedule_timezone ||
      primarySlot.scheduleTimeZone ||
      primarySlot.schedule_time ||
      primarySlot.time ||
      "";

    if (!rawTz) return null;
    const parts = String(rawTz).trim().split(/\s+/);
    if (parts.length > 1) {
      return parts[parts.length - 1];
    }
    return rawTz;
  }, [liveSlots, crashSlots]);

  const liveGroups = useMemo(() => {
    const map = new Map();

    (liveSlots || []).forEach((s) => {
      const typeKey = s.mode === "Live Demo" ? "demo" : "live";
      const key = `${s.day}__${typeKey}`;

      if (!map.has(key)) {
        map.set(key, {
          key,
          day: s.day,
          type: typeKey,
          totalSlots: 0,
          sessions: [],
        });
      }

      const group = map.get(key);
      group.totalSlots += Number(s.slots) || 1;
      group.sessions.push(s);
    });

    return Array.from(map.values());
  }, [liveSlots]);

  const crashGroups = useMemo(() => {
    const map = new Map();

    (crashSlots || []).forEach((s) => {
      const key = s.day;

      if (!map.has(key)) {
        map.set(key, {
          day: s.day,
          totalSlots: 0,
          sessions: [],
        });
      }

      const group = map.get(key);
      group.totalSlots += Number(s.slots) || 1;
      group.sessions.push(s);
    });

    return Array.from(map.values());
  }, [crashSlots]);

  return {
    liveSlots,
    crashSlots,
    liveGroups,
    crashGroups,
    scheduleTimeZoneAbbr,
    scheduleLoading,
    scheduleError,
  };
}
