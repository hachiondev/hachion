import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import dayjs from "dayjs";

export function useCourseScheduleSlots({ courseSlug, timezone }) {
  const enabled = !!courseSlug && !!timezone;

  const {
    data = [],
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ["courseSchedule", courseSlug, timezone],
    queryFn: async () => {
      const res = await axios.get("https://api.test.hachion.co/schedulecourse", {
        params: { timezone },
      });

      return Array.isArray(res.data) ? res.data : [];
    },
    enabled,                     
    staleTime: 5 * 60 * 1000,    
    refetchOnWindowFocus: false, 
    refetchOnReconnect: false,   
    refetchInterval: false,      
  });

  
  const filtered = data.filter((item) => {
    const nameSlug = (item.schedule_course_name || "")
      .toLowerCase()
      .replace(/\s+/g, "-");

    return nameSlug === courseSlug;
  });

  
  const mapped = filtered.map((item) => {
    const dt = dayjs(item.schedule_date);

    const dayLabel = dt.isValid()
      ? dt.format("ddd, MMM DD")
      : `${item.schedule_week}, ${item.schedule_date}`;

    const isLiveType =
      item.schedule_mode &&
      item.schedule_mode.toLowerCase().includes("live");

    return {
      id: item.course_schedule_id,
      day: dayLabel,
      slots: 1,
      badge: item.schedule_mode || "Session",
      type: isLiveType ? "live" : "demo",
      time: item.schedule_time,
      duration: item.schedule_duration,
      mode: item.schedule_mode,
      trainer: item.trainer_name,
      batchId: item.batchId,
      meeting_link: item.meeting_link,

      schduleTitleCourseName: item.schedule_course_name,
  categoryName: item.schedule_category_name,
  schedule_date: item.schedule_date,
  scheduleWeek: item.schedule_week,
  isActive: item.isActive,
    };
  });

  
  const grouped = {
    live: mapped.filter(
      (s) => s.mode === "Live Class" || s.mode === "Live Demo"
    ),
    crash: mapped.filter((s) => s.mode === "Crash Course"),
    mentoring: mapped.filter((s) => s.mode === "Mentoring Mode"),
    self: mapped.filter((s) => s.mode === "Self-Paced"),
  };

  return {
    liveSlots: grouped.live,
    crashSlots: grouped.crash,
    mentoringSlots: grouped.mentoring,
    selfSlots: grouped.self,
    loading: isLoading || isFetching,
    error,
    refetch, 
  };
}
