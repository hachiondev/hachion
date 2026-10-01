"use client";

import React, { useState, useEffect, forwardRef, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "./DemoClassSection.module.css";
import RequestBatch from "./RequestBatch";
import EnrollNotification from "./EnrollNotification";
import { useCourseDiscountRule } from "@/Api/hooks/CourseApi/useCourseDiscountRule";
import { useDiscountCountdown } from "@/Api/hooks/CourseApi/useDiscountCountdown";
import { useUserProfile } from "@/Api/hooks/CourseApi/useUserProfile";
import { useDemoScheduleLogic } from "@/Api/hooks/DemoClassSectionLogics/useDemoScheduleLogic";
import { useDemoBatchRequestLogic } from "@/Api/hooks/DemoClassSectionLogics/useDemoBatchRequestLogic";
import DemoClassSectionLiveTab from "./DemoClassSectionLiveTab";
import DemoClassSectionCrashTab from "./DemoClassSectionCrashTab";
import DemoClassSectionMentoringTab from "./DemoClassSectionMentoringTab";
import DemoClassSectionSelfTab from "./DemoClassSectionSelfTab";
import { useCourseByName } from "@/Api/hooks/CourseApi/useCourseByName";
import { useCourseApiName } from "@/components/UserPanel/CoursePage/CourseApiNameContext";
import { useDemoLivePayment } from "@/Api/hooks/CourseApi/useDemoLivePayment";
import { useCurrency } from "@/Api/hooks/CourseApi/useCurrency";
import { saveRedirectUrl } from "@/redirectAfterLogin";
import LoginModal from "../../Common/Loginmodal";

const tabs = [
  { key: "live", label: "Live Training" },
  { key: "crash", label: "Crash Course (Fast Track)" },
  { key: "mentoring", label: "Mentoring Mode" },
  { key: "self", label: "Self-Paced Learning" },
];

// Ported from the CRA app's
// src/Components/UserPanel/NewcoursePage/components/DemoClassSection.jsx.
// useNavigate -> useRouter; navigate(path, {state}) for the not-yet-migrated
// /enroll-now, /enroll-self, /installments, /payment routes -> sessionStorage
// keyed by destination path + router.push (matches useDemoLivePayment.js's
// same pattern) — those pages don't exist in this Next.js app yet, so this
// is dead-end navigation either way until they're migrated, but preserves
// the same data-handoff shape for whenever they are.
const DemoClassSection = forwardRef(({ onViewDemoClass }, ref) => {
  const [activeTab, setActiveTab] = useState(null);

  const browserTz = typeof window !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "UTC";
  const [tz] = useState(browserTz);

  const router = useRouter();
  const { courseName } = useParams();

  const [showRequestBatch, setShowRequestBatch] = useState(false);
  const [resetLiveSubmitting, setResetLiveSubmitting] = useState(0);
  const [enrollNow, setEnrollNow] = useState(false);

  const [mentoringPreferredTime, setMentoringPreferredTime] = useState("");
  const [mentoringNotification, setMentoringNotification] = useState("Email Only");
  const [mentoringTimeDropdownOpen, setMentoringTimeDropdownOpen] = useState(false);
  const [mentoringNotificationDropdownOpen, setMentoringNotificationDropdownOpen] = useState(false);

  const [selfPreferredTime, setSelfPreferredTime] = useState("");
  const [selfNotification, setSelfNotification] = useState("Email Only");
  const [selfTimeDropdownOpen, setSelfTimeDropdownOpen] = useState(false);
  const [selfNotificationDropdownOpen, setSelfNotificationDropdownOpen] = useState(false);

  const tabRefs = useRef({});

  const [enrollSuccessMessage, setEnrollSuccessMessage] = useState("");
  const [enrollErrorMessage, setEnrollErrorMessage] = useState("");
  const [showRegisterPrompt, setShowRegisterPrompt] = useState(false);
  const [enrollingSessionId, setEnrollingSessionId] = useState(null);
  const [tabMessage, setTabMessage] = useState({
    live: false,
    crash: false,
    mentoring: false,
    self: false,
  });

  const [requestSourceTab, setRequestSourceTab] = useState(null);

  useEffect(() => {
    if (!enrollSuccessMessage && !enrollErrorMessage) return;

    const timer = setTimeout(() => {
      setEnrollSuccessMessage("");
      setEnrollErrorMessage("");
    }, 6000);

    return () => clearTimeout(timer);
  }, [enrollSuccessMessage, enrollErrorMessage]);

  useEffect(() => {
    setActiveTab(null);
  }, [courseName]);

  const { data: userProfile, isLoading: isProfileLoading } = useUserProfile();

  const navigateWithState = (path, state) => {
    sessionStorage.setItem(`navState:${path}`, JSON.stringify(state));
    router.push(path);
  };

  const courseNameForApi = useCourseApiName();

  const courseSlug = courseNameForApi || "";

  const displayCourseName = courseNameForApi ? courseNameForApi.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1)) : "this course";

  const { data: courseData, isLoading: isCourseLoading, error: courseError } = useCourseByName(courseNameForApi);

  const { handleLiveEnrollPayment } = useDemoLivePayment({
    courseData,
    userProfile,
    courseNameForApi,
    setEnrollSuccessMessage,
    setEnrollErrorMessage,
  });

  const handleLiveEnrollClick = async (session, notifyVia) => {
    if (session?.mode !== "Live Demo") {
      navigateWithState(`/enroll-now/${courseName}`, {
        notifyVia,
        selectedBatchId: session.batchId,
        selectedSession: session,
        requestStatus: "pending",
      });
      return;
    }
    if (!userProfile || !userProfile.studentId) {
      setShowRegisterPrompt(true);
      return;
    }

    setShowRegisterPrompt(false);
    setEnrollingSessionId(session.id);

    try {
      await handleLiveEnrollPayment(session, notifyVia);
      onViewDemoClass && onViewDemoClass();
    } finally {
      setEnrollingSessionId(null);
    }
  };

  const { liveGroups, crashGroups, scheduleTimeZoneAbbr, scheduleLoading, scheduleError } = useDemoScheduleLogic({
    courseSlug,
    timezone: tz,
  });

  const [selectedGroupKey, setSelectedGroupKey] = useState(null);
  const selectedGroup = liveGroups.find((g) => g.key === selectedGroupKey) || null;

  const [selectedCrashDay, setSelectedCrashDay] = useState(null);
  const selectedCrashGroup = crashGroups.find((g) => g.day === selectedCrashDay) || null;

  const { data: discountRule } = useCourseDiscountRule(courseNameForApi);
  const hasSpecialDiscount = !!discountRule;
  const discountPct = discountRule?.discountPercentage ?? 0;

  const { timeLeft, isOfferActive } = useDiscountCountdown(discountRule);
  const showOfferStrip = hasSpecialDiscount && isOfferActive;

  const { handleRequestBatch, requestBatchError, isRequestBatchSuccess, isRequestBatchLoading } = useDemoBatchRequestLogic({
    activeTab,
    scheduleTimeZoneAbbr,
    displayCourseName,
    browserTz,
    userProfile,
    isProfileLoading,
  });

  const handleRequestBatchWithLoginCheck = () => {
    if (isProfileLoading) return "LOADING";

    if (!userProfile || !userProfile.studentId) {
      setShowRegisterPrompt(true);
      return "LOGIN_REQUIRED";
    }

    setShowRequestBatch(true);
    return "OK";
  };

  const handleClick = (action) => {
    if (action === "LOGIN_REQUIRED") {
      setShowRegisterPrompt(true);
      return;
    }

    if (action === "ENROLL_SELF") {
      router.push(`/enroll-self/${courseName}`);
      return;
    }

    const selectedDays = Array.from(document.querySelectorAll(".dayCheckbox:checked")).map((cb) => cb.nextSibling?.nextSibling?.textContent?.trim());

    const allowMentoringSelf = activeTab === "mentoring" || activeTab === "self";

    const preferredTimeForTab = activeTab === "mentoring" ? mentoringPreferredTime : activeTab === "self" ? selfPreferredTime : null;

    const notificationForTab = activeTab === "mentoring" ? mentoringNotification : activeTab === "self" ? selfNotification : null;

    handleRequestBatch({
      preferredTime: allowMentoringSelf ? preferredTimeForTab : null,
      notification: allowMentoringSelf ? notificationForTab : null,
      selectedDays: allowMentoringSelf ? selectedDays : [],
    });
  };

  const handleEnroll = () => {
    setEnrollNow(false);
  };

  useEffect(() => {
    if (isRequestBatchSuccess) {
      document.querySelectorAll(".dayCheckbox").forEach((cb) => (cb.checked = false));

      if (activeTab === "mentoring") {
        setMentoringPreferredTime("");
        setMentoringNotification("");
        setMentoringTimeDropdownOpen(false);
        setMentoringNotificationDropdownOpen(false);
      }

      if (activeTab === "self") {
        setSelfPreferredTime("");
        setSelfNotification("");
        setSelfTimeDropdownOpen(false);
        setSelfNotificationDropdownOpen(false);
      }
    }

    if (isRequestBatchSuccess || requestBatchError) {
      setRequestSourceTab((prev) => prev ?? activeTab);
      setTabMessage((prev) => ({
        ...prev,
        [activeTab]: true,
      }));

      const timer = setTimeout(() => {
        setTabMessage((prev) => ({
          ...prev,
          [activeTab]: false,
        }));
        setRequestSourceTab(null);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [isRequestBatchSuccess, requestBatchError, activeTab]);

  const timeOptions = [
    { value: "09:00 AM - 10:00 AM", label: "09:00 AM - 10:00 AM" },
    { value: "10:00 AM - 11:00 AM", label: "10:00 AM - 11:00 AM" },
    { value: "11:00 AM - 12:00 PM", label: "11:00 AM - 12:00 PM" },
    { value: "12:00 PM - 01:00 PM", label: "12:00 PM - 01:00 PM" },
    { value: "01:00 PM - 02:00 PM", label: "01:00 PM - 02:00 PM" },
    { value: "02:00 PM - 03:00 PM", label: "02:00 PM - 03:00 PM" },
    { value: "03:00 PM - 04:00 PM", label: "03:00 PM - 04:00 PM" },
    { value: "04:00 PM - 05:00 PM", label: "04:00 PM - 05:00 PM" },
    { value: "05:00 PM - 06:00 PM", label: "05:00 PM - 06:00 PM" },
  ];

  const notificationOptions = [
    { value: "WhatsApp / Email", label: "WhatsApp / Email" },
    { value: "Email Only", label: "Email Only" },
    { value: "WhatsApp Only", label: "WhatsApp Only" },
  ];

  const { currency, exchangeRate } = useCurrency();

  const areAllPricesZero = () => {
    if (!courseData) return false;

    const amounts = [
      currency === "INR" ? (courseData.itotal ?? courseData.iamount) : (courseData.total ?? courseData.amount),
      currency === "INR" ? (courseData.ictotal ?? courseData.icamount) : (courseData.ctotal ?? courseData.camount),
      currency === "INR" ? (courseData.isqtotal ?? courseData.isqmamount) : (courseData.sqtotal ?? courseData.sqamount),
      currency === "INR" ? (courseData.istotal ?? courseData.isamount) : (courseData.stotal ?? courseData.samount),
    ];

    return amounts.every((a) => !a || Number(a) <= 0);
  };

  const getTabPrice = (tabKey) => {
    if (!courseData) {
      return { text: "Not Available", disabled: true };
    }

    let baseAmount = 0;

    if (currency === "INR") {
      if (tabKey === "live") baseAmount = courseData.itotal ?? courseData.iamount;
      if (tabKey === "crash") baseAmount = courseData.ictotal ?? courseData.icamount;
      if (tabKey === "mentoring") baseAmount = courseData.isqtotal ?? courseData.isqmamount;
      if (tabKey === "self") baseAmount = courseData.istotal ?? courseData.isamount;
    } else {
      if (tabKey === "live") baseAmount = courseData.total ?? courseData.amount;
      if (tabKey === "crash") baseAmount = courseData.ctotal ?? courseData.camount;
      if (tabKey === "mentoring") baseAmount = courseData.sqtotal ?? courseData.sqamount;
      if (tabKey === "self") baseAmount = courseData.stotal ?? courseData.samount;

      baseAmount = baseAmount * exchangeRate;
    }

    const safeAmount = Number(baseAmount) || 0;

    const allZero = areAllPricesZero();

    if (allZero && tabKey === "live") {
      return {
        text: "Not Available",
        disabled: false,
      };
    }

    if (safeAmount <= 0) {
      return { text: "Not Available", disabled: true };
    }

    return {
      text: `${currency} ${Math.round(safeAmount)}`,
      disabled: false,
    };
  };

  useEffect(() => {
    if (!courseData || activeTab) return;

    const tabOrder = ["live", "crash", "mentoring", "self"];

    const firstAvailableTab = tabOrder.find((tabKey) => {
      const priceInfo = getTabPrice(tabKey);
      return !priceInfo.disabled;
    });

    if (firstAvailableTab) {
      setActiveTab(firstAvailableTab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseData, currency, exchangeRate, activeTab]);

  return (
    <section className={styles.dcwrap}>
      <div className="container">
        {showOfferStrip && (
          <div className={styles.offerBanner}>
            <div className={styles.offerLeft}>
              <div className={styles.offerIcon} aria-hidden="true">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/Offer.png" alt="Offer" />
              </div>
              <div className={styles.offerText}>
                <div className={styles.offerTitle}>Happy Hours Offer!</div>
                <div className={styles.offerSubtitle}>
                  {discountPct > 0 ? (
                    <>
                      Get {discountPct}% Discount on <strong>{displayCourseName}</strong>
                    </>
                  ) : (
                    <>
                      Special Discount on <strong>{displayCourseName}</strong>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.offerCountdown}>
              <div className={styles.countPill}>
                Ends in{" "}
                {timeLeft.days > 0 && (
                  <>
                    <strong>{String(timeLeft.days).padStart(2, "0")}</strong> days{" "}
                  </>
                )}
                <strong>{String(timeLeft.hours).padStart(2, "0")}</strong> hr <strong>{String(timeLeft.minutes).padStart(2, "0")}</strong> mins <strong>{String(timeLeft.seconds).padStart(2, "0")}</strong> sec
              </div>
            </div>
          </div>
        )}

        <div className={styles.dchead}>
          <div className={styles.dcheadText}>
            <h2>Try Before You Enroll</h2>
            <p>Experience our world-class teaching methodology firsthand. Join an upcoming demo session or request a custom batch at your preferred time.</p>
          </div>
        </div>

        <div className={styles.dctabs} ref={ref} id="demoClassSection">
          {tabs.map((t) => {
            const priceInfo = getTabPrice(t.key);

            return (
              <button
                key={t.key}
                ref={(el) => (tabRefs.current[t.key] = el)}
                className={`${styles.dctab} ${activeTab === t.key ? styles.dctabisactive : ""}`}
                disabled={priceInfo.disabled}
                style={{ cursor: priceInfo.disabled ? "not-allowed" : "pointer" }}
                onClick={() => {
                  if (priceInfo.disabled) return;
                  setActiveTab(t.key);
                }}
              >
                <span className={styles.tabLabel}>{t.label}</span>

                <span
                  className={styles.feeAmount}
                  style={{
                    cursor: priceInfo.disabled ? "not-allowed" : "pointer",
                    minWidth: "90px",
                    padding: "4px 10px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    whiteSpace: "nowrap",
                    lineHeight: "1.2",
                    fontSize: "12px",
                  }}
                >
                  {priceInfo.text}
                </span>
              </button>
            );
          })}
        </div>

        {activeTab === "live" && (
          <DemoClassSectionLiveTab
            scheduleLoading={scheduleLoading}
            scheduleError={scheduleError}
            liveGroups={liveGroups}
            selectedGroupKey={selectedGroupKey}
            setSelectedGroupKey={setSelectedGroupKey}
            selectedGroup={selectedGroup}
            isRequestBatchLoading={isRequestBatchLoading}
            isProfileLoading={isProfileLoading}
            showMessage={tabMessage[activeTab] && requestSourceTab === activeTab}
            isRequestBatchSuccess={isRequestBatchSuccess}
            requestBatchError={requestBatchError}
            onRequestClick={handleRequestBatchWithLoginCheck}
            liveTraining={courseData?.liveTraining}
            isCourseLoading={isCourseLoading}
            courseError={courseError}
            onEnrollClick={handleLiveEnrollClick}
            enrollSuccessMessage={enrollSuccessMessage}
            enrollErrorMessage={enrollErrorMessage}
            userProfile={userProfile}
            courseName={courseData?.courseName || courseNameForApi}
            showRegisterPrompt={showRegisterPrompt}
            setShowRegisterPrompt={setShowRegisterPrompt}
            onCloseRegisterPrompt={() => setShowRegisterPrompt(false)}
            enrollingSessionId={enrollingSessionId}
            resetLiveSubmitting={resetLiveSubmitting}
          />
        )}

        {activeTab === "crash" && (
          <DemoClassSectionCrashTab
            scheduleLoading={scheduleLoading}
            scheduleError={scheduleError}
            crashGroups={crashGroups}
            liveGroups={liveGroups}
            selectedCrashDay={selectedCrashDay}
            setSelectedCrashDay={setSelectedCrashDay}
            selectedCrashGroup={selectedCrashGroup}
            isRequestBatchLoading={isRequestBatchLoading}
            isProfileLoading={isProfileLoading}
            showMessage={tabMessage[activeTab] && requestSourceTab === activeTab}
            isRequestBatchSuccess={isRequestBatchSuccess}
            requestBatchError={requestBatchError}
            onRequestClick={handleRequestBatchWithLoginCheck}
            resetLiveSubmitting={resetLiveSubmitting}
            crashCourse={courseData?.crashCourse || ""}
            isCourseLoading={isCourseLoading}
            courseError={courseError}
          />
        )}

        {activeTab === "mentoring" && (
          <DemoClassSectionMentoringTab
            timeOptions={timeOptions}
            notificationOptions={notificationOptions}
            preferredTime={mentoringPreferredTime}
            setPreferredTime={setMentoringPreferredTime}
            notification={mentoringNotification}
            setNotification={setMentoringNotification}
            timeDropdownOpen={mentoringTimeDropdownOpen}
            setTimeDropdownOpen={setMentoringTimeDropdownOpen}
            notificationDropdownOpen={mentoringNotificationDropdownOpen}
            setNotificationDropdownOpen={setMentoringNotificationDropdownOpen}
            isRequestBatchLoading={isRequestBatchLoading}
            isProfileLoading={isProfileLoading}
            showMessage={tabMessage[activeTab] && requestSourceTab === activeTab}
            isRequestBatchSuccess={isRequestBatchSuccess}
            requestBatchError={requestBatchError}
            onRequestClick={handleRequestBatch}
            mentoringMode={courseData?.mentoringMode || ""}
            isCourseLoading={isCourseLoading}
            courseError={courseError}
          />
        )}

        {activeTab === "self" && (
          <DemoClassSectionSelfTab
            timeOptions={timeOptions}
            notificationOptions={notificationOptions}
            preferredTime={selfPreferredTime}
            setPreferredTime={setSelfPreferredTime}
            notification={selfNotification}
            setNotification={setSelfNotification}
            timeDropdownOpen={selfTimeDropdownOpen}
            setTimeDropdownOpen={setSelfTimeDropdownOpen}
            notificationDropdownOpen={selfNotificationDropdownOpen}
            setNotificationDropdownOpen={setSelfNotificationDropdownOpen}
            isRequestBatchLoading={isRequestBatchLoading}
            isProfileLoading={isProfileLoading}
            showMessage={tabMessage[activeTab] && requestSourceTab === activeTab}
            selectedGroupKey={selectedGroupKey}
            setSelectedGroupKey={setSelectedGroupKey}
            selectedGroup={selectedGroup}
            userProfile={userProfile}
            courseName={courseData?.courseName || courseNameForApi}
            onCloseRegisterPrompt={() => setShowRegisterPrompt(false)}
            isRequestBatchSuccess={isRequestBatchSuccess}
            requestBatchError={requestBatchError}
            onRequestClick={handleClick}
            selfPacedLearning={courseData?.selfPacedLearning || ""}
            isCourseLoading={isCourseLoading}
          />
        )}

        {showRequestBatch && (
          <RequestBatch
            closeModal={() => {
              setShowRequestBatch(false);
              setResetLiveSubmitting(Date.now());
            }}
          />
        )}
      </div>

      {enrollNow && <EnrollNotification open={enrollNow} onClose={() => setEnrollNow(false)} onEnroll={handleEnroll} />}

      {showRegisterPrompt && (
        <LoginModal
          isOpen={showRegisterPrompt}
          description="Before proceeding, please login into our Hachion."
          onLogin={() => {
            saveRedirectUrl();
            router.push("/login");
            setShowRegisterPrompt(false);
          }}
          onClose={() => {
            setShowRegisterPrompt(false);
            setResetLiveSubmitting(Date.now());
          }}
        />
      )}
    </section>
  );
});

DemoClassSection.displayName = "DemoClassSection";

export default DemoClassSection;
