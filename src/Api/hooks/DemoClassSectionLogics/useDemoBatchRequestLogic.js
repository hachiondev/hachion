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
  const [showMessageByTab, setShowMessageByTab] = useState({});

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
    if (!isRequestBatchSuccess && !requestBatchError) return;

    setShowMessageByTab(prev => ({
      ...prev,
      [activeTab]: true,
    }));

    const t = setTimeout(() => {
      setShowMessageByTab(prev => ({
        ...prev,
        [activeTab]: false,
      }));
    }, 15000);

    return () => clearTimeout(t);
  }, [isRequestBatchSuccess, requestBatchError, activeTab]);

  return {
    handleRequestBatch,
    showMessage: Boolean(showMessageByTab[activeTab]),
    requestBatchData,
    requestBatchError,
    isRequestBatchSuccess,
    isRequestBatchLoading,
  };
}
