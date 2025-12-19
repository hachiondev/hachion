
import { useEffect, useCallback, useState } from "react";
import { useRequestBatchForCourse } from "../CourseApi/useRequestBatchForCourse";

export function useDemoBatchRequestLogic({
  activeTab,
  scheduleTimeZoneAbbr,
  displayCourseName,
  browserTz,
  userProfile,
  isProfileLoading,
}) {
  const [showMessage, setShowMessage] = useState(false);

  const {
    mutate: requestBatch,
    data: requestBatchData,
    error: requestBatchError,
    isSuccess: isRequestBatchSuccess,
    isLoading: isRequestBatchLoading,
  } = useRequestBatchForCourse();

  const handleRequestBatch = useCallback(
    ({ preferredTime, notification, selectedDays }) => {
      if (isProfileLoading) return;

      if (!userProfile || !userProfile.email) {
        console.error("Please log in before requesting a batch.");
        return;
      }

      const localUser =
        JSON.parse(localStorage.getItem("loginuserData")) || null;

      const payload = {
        time_zone: scheduleTimeZoneAbbr || "IST",
        country: browserTz,
        email: userProfile.email,
        mobile: userProfile.mobile || "",
        userName:
          userProfile.name ||
          userProfile.fullName ||
          localUser?.userName ||
          localUser?.name ||
          "",
        courseName: displayCourseName,
        mode:
          activeTab === "live"
            ? "Live Training"
            : activeTab === "crash"
            ? "Crash Course"
            : activeTab === "mentoring"
            ? "Mentoring Mode"
            : "Self-Paced Learning",

        preferredTime:
          (activeTab === "mentoring" || activeTab === "self") && preferredTime
            ? preferredTime
            : null,

        notification:
          activeTab === "live"
            ? "Email Only"
            : (activeTab === "mentoring" || activeTab === "self") && notification
            ? notification
            : null,

        preferredDay:
          (activeTab === "mentoring" || activeTab === "self") &&
          selectedDays?.length
            ? selectedDays.join(", ")
            : null,
      };

      requestBatch(payload);
    },
    [
      activeTab,
      scheduleTimeZoneAbbr,
      displayCourseName,
      browserTz,
      userProfile,
      isProfileLoading,
      requestBatch,
    ]
  );

  useEffect(() => {
    if (isRequestBatchSuccess || requestBatchError) {
      setShowMessage(true);
      const t = setTimeout(() => setShowMessage(false), 10000);
      return () => clearTimeout(t);
    }
  }, [isRequestBatchSuccess, requestBatchError]);

  return {
    handleRequestBatch,
    showMessage,
    requestBatchData,
    requestBatchError,
    isRequestBatchSuccess,
    isRequestBatchLoading,
  };
}
