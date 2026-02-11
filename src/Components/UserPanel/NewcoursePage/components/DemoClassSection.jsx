import React, { useState, useEffect, forwardRef, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./DemoClassSection.module.css";
import { cn } from "../../../../utils";
import RequestBatch from "./RequestBatch";
import EnrollNotification from "./EnrollNotification";
import { useCourseDiscountRule } from "../../../../Api/hooks/CourseApi/useCourseDiscountRule";
import { useDiscountCountdown } from "../../../../Api/hooks/CourseApi/useDiscountCountdown";
import { useUserProfile } from "../../../../Api/hooks/CourseApi/useUserProfile";
import { useDemoScheduleLogic } from "../../../../Api/hooks/DemoClassSectionLogics/useDemoScheduleLogic";
import { useDemoBatchRequestLogic } from "../../../../Api/hooks/DemoClassSectionLogics/useDemoBatchRequestLogic";
import DemoClassSectionLiveTab from "./DemoClassSectionLiveTab";
import DemoClassSectionCrashTab from "./DemoClassSectionCrashTab";
import DemoClassSectionMentoringTab from "./DemoClassSectionMentoringTab";
import DemoClassSectionSelfTab from "./DemoClassSectionSelfTab";
import { useCourseByName } from "../../../../Api/hooks/CourseApi/useCourseByName";
import { useDemoLivePayment } from "../../../../Api/hooks/CourseApi/useDemoLivePayment";
import { useCurrency } from "../../../../Api/hooks/CourseApi/useCurrency";
import { saveRedirectUrl } from "../../../../redirectAfterLogin";
import LoginModal from "../../Common/Loginmodal";

const tabs = [
  { key: "live", label: "Live Training" },
  { key: "crash", label: "Crash Course (Fast Track)" },
  { key: "mentoring", label: "Mentoring Mode" },
  { key: "self", label: "Self-Paced Learning" },
];

const DemoClassSection = forwardRef(({ onViewDemoClass }, ref) => {
  // const [activeTab, setActiveTab] = useState("live");
  const [activeTab, setActiveTab] = useState(null);
  const isFirstTabSet = useRef(true);

  const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [tz, setTz] = useState(browserTz);

  const navigate = useNavigate();
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

  const [showMessage, setShowMessage] = useState(false);
  const tabRefs = useRef({});

  const [enrollSuccessMessage, setEnrollSuccessMessage] = useState("");
  const [enrollErrorMessage, setEnrollErrorMessage] = useState("");
  const [showRegisterPrompt, setShowRegisterPrompt] = useState(false);
  const [enrollingSessionId, setEnrollingSessionId] = useState(null);
  const [tabMessage, setTabMessage] = useState({
    live: false,
    crash: false,
    mentoring: false,
    self: false
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

  const {
    data: userProfile,
    isLoading: isProfileLoading,
  } = useUserProfile();

  const onEnroll = () => {
    if (!courseName) return;

    if (isProfileLoading) return;

    if (!userProfile || !userProfile.studentId) {
      setShowRegisterPrompt(true);
      return;
    }

    navigate(`/enroll-now/${courseName}`);
  };

  // const rawSlug = courseName ? decodeURIComponent(courseName) : "";

  // const normalizeCourseSlug = (slug) =>
  //   slug
  //     .replace(/[-_]+/g, " ")
  //     .replace(/\s+/g, " ")
  //     .trim()
  //     .toLowerCase();

  const courseNameForApi = courseName
  ? decodeURIComponent(courseName)
      .replace(/---+/g, " - ")
      .replace(/\b([a-zA-Z]{2,3})-(\d{3})\b/g, "$1@@$2")
      .replace(/[-_]+/g, " ")
      .replace(/@@/g, "-")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase()
  : "";

  // const courseNameForApi = rawSlug ? normalizeCourseSlug(rawSlug) : "";

  // const courseSlug = rawSlug ? rawSlug.toLowerCase() : "";
  const courseSlug = courseNameForApi || "";

  const displayCourseName = courseNameForApi
    ? courseNameForApi.replace(/\w\S*/g, (txt) =>
      txt.charAt(0).toUpperCase() + txt.slice(1)
    )
    : "this course";

  const {
    data: courseData,
    isLoading: isCourseLoading,
    error: courseError,
  } = useCourseByName(courseNameForApi);

  const {
    handleLiveEnrollPayment,
  } = useDemoLivePayment({
    courseData,
    userProfile,
    courseNameForApi,
    setEnrollSuccessMessage,
    setEnrollErrorMessage
  });

  const handleLiveEnrollClick = async (session, notifyVia) => {

    if (session?.mode !== "Live Demo") {
      navigate(`/enroll-now/${courseName}`, {
        state: {
          notifyVia,
          selectedBatchId: session.batchId,
          selectedSession: session,
          requestStatus: "pending",   // 👈 IMPORTANT
        },
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

  const {
    liveGroups,
    crashGroups,
    scheduleTimeZoneAbbr,
    scheduleLoading,
    scheduleError,
  } = useDemoScheduleLogic({
    courseSlug,
    timezone: tz,
  });

  const [selectedGroupKey, setSelectedGroupKey] = useState(null);
  const selectedGroup =
    liveGroups.find((g) => g.key === selectedGroupKey) || null;

  const [selectedCrashDay, setSelectedCrashDay] = useState(null);
  const selectedCrashGroup =
    crashGroups.find((g) => g.day === selectedCrashDay) || null;

  const { data: discountRule } = useCourseDiscountRule(courseNameForApi);
  const hasSpecialDiscount = !!discountRule;
  const discountPct = discountRule?.discountPercentage ?? 0;

  const { timeLeft, isOfferActive } = useDiscountCountdown(discountRule);
  const showOfferStrip = hasSpecialDiscount && isOfferActive;

  const {
    handleRequestBatch,
    requestBatchError,
    isRequestBatchSuccess,
    isRequestBatchLoading,
  } = useDemoBatchRequestLogic({
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
      navigate(`/enroll-self/${courseName}`);
      return;
    }


    const selectedDays = Array.from(
      document.querySelectorAll(".dayCheckbox:checked")
    ).map((cb) => cb.nextSibling?.nextSibling?.textContent?.trim());

    const allowMentoringSelf = activeTab === "mentoring" || activeTab === "self";

    const preferredTimeForTab =
      activeTab === "mentoring"
        ? mentoringPreferredTime
        : activeTab === "self"
          ? selfPreferredTime
          : null;

    const notificationForTab =
      activeTab === "mentoring"
        ? mentoringNotification
        : activeTab === "self"
          ? selfNotification
          : null;

    handleRequestBatch({
      preferredTime: allowMentoringSelf ? preferredTimeForTab : null,
      notification: allowMentoringSelf ? notificationForTab : null,
      selectedDays: allowMentoringSelf ? selectedDays : [],
    });
  };


  const handleEnroll = () => {
    setEnrollNow(false);
  };

  // useEffect(() => {
  //   const el = tabRefs.current[activeTab];
  //   if (el) {
  //     el.scrollIntoView({
  //       behavior: "smooth",
  //       inline: "center",
  //       block: "nearest",
  //     });
  //   }
  // }, [activeTab]);

  useEffect(() => {
    if (isRequestBatchSuccess) {
      document.querySelectorAll(".dayCheckbox").forEach(cb => (cb.checked = false));

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
      setRequestSourceTab(prev => prev ?? activeTab);
      setTabMessage(prev => ({
        ...prev,
        [activeTab]: true
      }));

      const timer = setTimeout(() => {
        setTabMessage(prev => ({
          ...prev,
          [activeTab]: false
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

  // const getTabPrice = (tabKey) => {
  //   if (!courseData) return `${currency} 0`;

  //   let baseAmount = 0;

  //   if (currency === "INR") {
  //     if (tabKey === "live") baseAmount = courseData.itotal ?? courseData.iamount;
  //     if (tabKey === "crash") baseAmount = courseData.ictotal ?? courseData.icamount;
  //     if (tabKey === "mentoring") baseAmount = courseData.isqtotal ?? courseData.isqmamount;
  //     if (tabKey === "self") baseAmount = courseData.istotal ?? courseData.isamount;
  //   }

  //   else {
  //     if (tabKey === "live") baseAmount = courseData.total ?? courseData.amount;
  //     if (tabKey === "crash") baseAmount = courseData.ctotal ?? courseData.camount;
  //     if (tabKey === "mentoring") baseAmount = courseData.sqtotal ?? courseData.sqamount;
  //     if (tabKey === "self") baseAmount = courseData.stotal ?? courseData.samount;

  //     baseAmount = baseAmount * exchangeRate;
  //   }

  //   const safeAmount = Number(baseAmount) || 0;

  //   return `${currency} ${Math.round(safeAmount)}`;
  // };

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

  // const getTabPrice = (tabKey) => {
  //   if (!courseData) {
  //     return { text: "Not Available", disabled: true };
  //   }

  //   let baseAmount = 0;

  //   if (currency === "INR") {
  //     if (tabKey === "live") baseAmount = courseData.itotal ?? courseData.iamount;
  //     if (tabKey === "crash") baseAmount = courseData.ictotal ?? courseData.icamount;
  //     if (tabKey === "mentoring") baseAmount = courseData.isqtotal ?? courseData.isqmamount;
  //     if (tabKey === "self") baseAmount = courseData.istotal ?? courseData.isamount;
  //   } else {
  //     if (tabKey === "live") baseAmount = courseData.total ?? courseData.amount;
  //     if (tabKey === "crash") baseAmount = courseData.ctotal ?? courseData.camount;
  //     if (tabKey === "mentoring") baseAmount = courseData.sqtotal ?? courseData.sqamount;
  //     if (tabKey === "self") baseAmount = courseData.stotal ?? courseData.samount;

  //     baseAmount = baseAmount * exchangeRate;
  //   }

  //   const safeAmount = Number(baseAmount) || 0;

  //   if (safeAmount <= 0) {
  //     return { text: "Not Available", disabled: true };
  //   }

  //   return {
  //     text: `${currency} ${Math.round(safeAmount)}`,
  //     disabled: false,
  //   };
  // };

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

  // ✅ SPECIAL RULE:
  // If all prices are zero → enable LIVE tab only
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

    // Priority order
    const tabOrder = ["live", "crash", "mentoring", "self"];

    const firstAvailableTab = tabOrder.find((tabKey) => {
      const priceInfo = getTabPrice(tabKey);
      return !priceInfo.disabled;
    });

    if (firstAvailableTab) {
      setActiveTab(firstAvailableTab);
    }
  }, [courseData, currency, exchangeRate, activeTab]);

  return (
    <section className={styles.dcwrap} >
      <div className="container">

        {/* Offer strip */}
        {showOfferStrip && (
          <div className={styles.offerBanner}>
            <div className={styles.offerLeft}>
              <div className={styles.offerIcon} aria-hidden="true">
                <img src="/Offer.png" alt="Offer" />
              </div>
              <div className={styles.offerText}>
                <div className={styles.offerTitle}>Happy Hours Offer!</div>
                <div className={styles.offerSubtitle}>
                  {discountPct > 0 ? (
                    <>
                      Get {discountPct}% Discount on{" "}
                      <strong>{displayCourseName}</strong>
                    </>
                  ) : (
                    <>
                      Special Discount on{" "}
                      <strong>{displayCourseName}</strong>
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
                    <strong>
                      {String(timeLeft.days).padStart(2, "0")}
                    </strong>{" "}
                    days{" "}
                  </>
                )}
                <strong>
                  {String(timeLeft.hours).padStart(2, "0")}
                </strong>{" "}
                hr{" "}
                <strong>
                  {String(timeLeft.minutes).padStart(2, "0")}
                </strong>{" "}
                mins{" "}
                <strong>
                  {String(timeLeft.seconds).padStart(2, "0")}
                </strong>{" "}
                sec
              </div>
            </div>
          </div>
        )}

        {/* Heading */}
        <div className={styles.dchead}>

          <div className={styles.dcheadText} >
            <h2>Try Before You Enroll</h2>
            <p>
              Experience our world-class teaching methodology firsthand. Join
              an upcoming demo session or request a custom batch at your
              preferred time.
            </p>
          </div>
          {/* <button
            className={cn(styles.bnbtn, styles.bnbtnprimary)}
            onClick={onEnroll}
          >
            Enroll Now - Start Learning
          </button> */}
        </div>

        {/* Tabs */}
        <div className={styles.dctabs} ref={ref} id="demoClassSection">
          {tabs.map((t) => {
            const priceInfo = getTabPrice(t.key);

            return (
              <button
                key={t.key}
                ref={(el) => (tabRefs.current[t.key] = el)}
                className={cn(
                  styles.dctab,
                  activeTab === t.key && styles.dctabisactive
                )}
                disabled={priceInfo.disabled}
                style={{
                  cursor: priceInfo.disabled ? "not-allowed" : "pointer",
                }}
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

                    /* 🔥 FIX FOR "Not Available" */
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


        {/* Tab contents moved to separate components */}
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
            // onRequestClick={handleClick}
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
            // showMessage={tabMessage[activeTab]}
            showMessage={tabMessage[activeTab] && requestSourceTab === activeTab}

            isRequestBatchSuccess={isRequestBatchSuccess}
            requestBatchError={requestBatchError}
            // onRequestClick={handleClick}
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
            // showMessage={tabMessage[activeTab]}
            showMessage={tabMessage[activeTab] && requestSourceTab === activeTab}
            selectedGroupKey={selectedGroupKey}
            setSelectedGroupKey={setSelectedGroupKey}
            selectedGroup={selectedGroup}
            userProfile={userProfile}
            courseName={courseData?.courseName || courseNameForApi}
            onCloseRegisterPrompt={() => setShowRegisterPrompt(false)}
            // onEnrollClick={handleLiveEnrollClick}
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

      {enrollNow && (
        <EnrollNotification
          open={enrollNow}
          onClose={() => setEnrollNow(false)}
          onEnroll={handleEnroll}
        />
      )}

      {/* Register Prompt Modal */}
      {showRegisterPrompt && (
        // <div
        //   style={{
        //     position: "fixed",
        //     top: 0,
        //     left: 0,
        //     width: "100%",
        //     height: "100%",
        //     background: "rgba(0,0,0,0.55)",
        //     zIndex: 9999,
        //     display: "flex",
        //     justifyContent: "center",
        //     alignItems: "center",
        //   }}
        // >
        //   <div
        //     style={{
        //       width: "520px",
        //       background: "#fff",
        //       borderRadius: "12px",
        //       display: "flex",
        //       padding: "20px",
        //       boxShadow: "0 10px 35px rgba(0,0,0,0.28)",
        //     }}
        //   >
            
        //     <div
        //       style={{
        //         width: "42%",
        //         display: "flex",
        //         justifyContent: "center",
        //         alignItems: "center",
        //       }}
        //     >
        //       <img
        //         src={require("../../../../Assets/loginpopup.webp")}
        //         alt="login popup"
        //         style={{
        //           width: "100%",
        //           borderRadius: "8px",
        //           objectFit: "cover",
        //           transform: "scaleX(-1)",
        //         }}
        //       />
        //     </div>

        //     <div
        //       style={{
        //         width: "58%",
        //         paddingLeft: "14px",
        //         display: "flex",
        //         flexDirection: "column",
        //         justifyContent: "center",
        //       }}
        //     >
        //       <h3 style={{ margin: 0, fontSize: "20px", marginBottom: "6px" }}>
        //         Please Login
        //       </h3>

        //       <p style={{ fontSize: "14px", marginBottom: "20px", color: "#555" }}>
        //         Before proceeding, please login into our Hachion.
        //       </p>

        //       <div style={{ display: "flex", gap: "10px" }}>
        //         <button
        //           style={{
        //             padding: "8px 14px",
        //             borderRadius: "6px",
        //             border: "none",
        //             background: "#2563eb",
        //             color: "#fff",
        //             fontSize: "14px",
        //             cursor: "pointer",
        //           }}
        //           onClick={() => {
        //             // 🔥 Save current URL before redirecting to login
        //             saveRedirectUrl();

        //             navigate("/login");
        //             setShowRegisterPrompt(false);
        //           }}
        //         >
        //           Login
        //         </button>

        //         <button
        //           style={{
        //             padding: "8px 14px",
        //             background: "#f1f5f9",
        //             color: "#333",
        //             borderRadius: "6px",
        //             border: "1px solid #ccc",
        //             fontSize: "14px",
        //             cursor: "pointer",
        //           }}
        //           onClick={() => {
        //             setShowRegisterPrompt(false);
        //             setResetLiveSubmitting(Date.now()); // 🔥 notify child
        //           }}
        //         >
        //           Cancel
        //         </button>
        //       </div>
        //     </div>
        //   </div>
        // </div>
        <LoginModal isOpen={showRegisterPrompt} description="Before proceeding, please login into our Hachion." onLogin={() => {
        // 🔥 Save current URL before redirecting to login
        saveRedirectUrl();
        navigate("/login");
        setShowRegisterPrompt(false);
      }}
        onClose={() => {
          setShowRegisterPrompt(false);
          setResetLiveSubmitting(Date.now()); // 🔥 notify child
        }}
      />
      )}
      
    </section>
  );
});

export default DemoClassSection;