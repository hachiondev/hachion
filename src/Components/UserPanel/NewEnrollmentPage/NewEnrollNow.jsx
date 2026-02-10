import React, { useState, useEffect } from "react";
import styles from "./NewEnrollNow.module.css";
import { Input } from "../../ui/input";
import { useParams, useLocation } from "react-router-dom";
import { useDemoScheduleLogic } from "../../../Api/hooks/DemoClassSectionLogics/useDemoScheduleLogic";
import { useUserProfile } from "../../../Api/hooks/CourseApi/useUserProfile";
import { useCourseByName } from "../../../Api/hooks/CourseApi/useCourseByName";
import { useCurrency } from "../../../Api/hooks/CourseApi/useCurrency";
import { useCourseDiscountRule } from "../../../Api/hooks/CourseApi/useCourseDiscountRule";
import { useCouponDiscount } from "../../../Api/hooks/CourseApi/useCouponDiscount";
import { useDemoLivePayment } from "../../../Api/hooks/CourseApi/useDemoLivePayment";
import { Link } from "react-router-dom";
import RequestInstallment from "../EnrollmentPage/components/RequestInstallment";
import { Dialog, DialogContent } from "@mui/material";


import { useStudentDetails } from "../../../Api/hooks/CourseApi/useStudentDetails";
import { useInstallmentStatus } from "../../../Api/hooks/CourseApi/useInstallmentStatus";

import { useCheckEnrollmentForSessions } 
  from "../../../Api/hooks/CourseApi/useCheckEnrollmentForSessions";
import { useNavigate } from "react-router-dom";


export default function NewEnrollNow() {
  const location = useLocation();
  const preselectedSession = location.state?.selectedSession || null;
  const preselectedBatchId = location.state?.selectedBatchId || null;
  
  const initialRequestStatus = location.state?.requestStatus;

  const notifyVia = location.state?.notifyVia || {
    email: true,
    whatsapp: true,
  };
  

  /* ===============================
     State
  =============================== */
  const [selectedBatch, setSelectedBatch] = useState(null);
  const selectedMode = "Live Class";
  const [couponCode, setCouponCode] = useState("");
  const [couponData, setCouponData] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [openInstallmentPopup, setOpenInstallmentPopup] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [studentDataView, setStudentDataView] = useState(null);
  const { selectedBatchData, enrollText, modeType, sendEmail,
    sendWhatsApp, requestStatus,

    sendText } = location.state || {};
  
  const user = JSON.parse(localStorage.getItem('loginuserData'));
  const email = user?.email;
  const { data: studentData, isLoading, error } = useStudentDetails(email);
  
const navigate = useNavigate();


  const [lockButtonsUntilBatchChange, setLockButtonsUntilBatchChange] = useState(false);
  const [lastAction, setLastAction] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    coupon: "",
  });


  /* ===============================
     Params
  =============================== */
  const { courseName } = useParams();

  const courseSlug = courseName
    ? decodeURIComponent(courseName)
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase())
    : "";

  /* ===============================
     APIs
  =============================== */
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const { liveGroups, scheduleLoading } =
    useDemoScheduleLogic({ courseSlug, timezone });

  const { data: userProfile } = useUserProfile();
  const { data: course } = useCourseByName(courseSlug);

const selectedSessions = selectedBatch?.sessions || [];

const {
  data: enrollmentCheckResults = [],
  isLoading: enrollmentCheckLoading,
} = useCheckEnrollmentForSessions(
  selectedSessions,
  studentData?.studentId,
  course?.courseName
);

const isAlreadyEnrolledForBatch = enrollmentCheckResults.some(
  (s) => s._isEnrolled === true
);
const studentId = studentData?.studentId;
const courseNameForInstallment = course?.courseName;
const selectedBatchIdForEnroll =
  selectedBatch?.sessions?.[0]?.batchId || "";

const {
  data: installmentStatusData,
  isLoading: installmentStatusLoading,
} = useInstallmentStatus(
  studentId,
  courseNameForInstallment,
  selectedBatchIdForEnroll
);

  //   const selectedBatchIdForEnroll =
  // selectedBatch?.sessions?.[0]?.batchId || "";


  const hasInstallmentRequest =
  installmentStatusData?.numSelectedInstallments === 2 ||
  installmentStatusData?.numSelectedInstallments === 3;

  const currentRequestStatus = installmentStatusLoading
  ? "loading"
  : installmentStatusData?.requestStatus === "approved"
    ? "approved"
    : installmentStatusData?.requestStatus === "rejected"
      ? "rejected"
      : hasInstallmentRequest
        ? "pending"
        : "none";
const isInstallmentDisabled =
  installmentStatusLoading ||
  currentRequestStatus !== "none" ||
  !isTermsAccepted;

  const { currency } = useCurrency();
  const { data: discountRule } = useCourseDiscountRule(courseSlug);
  useEffect(() => {
  if (
    installmentStatusLoading ||
    !installmentStatusData ||
    installmentStatusData.requestStatus !== "approved"
  ) {
    return;
  }

  const slug = course?.courseName
    ?.toLowerCase()
    .replace(/\s+/g, "-");

  if (!slug || !selectedBatch?.sessions?.[0] || !course) return;

  navigate(`/installments/${slug}`, {
    state: {
      // 🔑 IMPORTANT: send what OnlineInstallments EXPECTS
      selectedBatchData: {
        ...selectedBatch.sessions[0],

        // required for pricing fetch
        schedule_course_name: course.courseName,

        // optional but safe
        courseName: course.courseName,
      },

      // already approved value (2 or 3)
      numSelectedInstallments:
        installmentStatusData.numSelectedInstallments,
    },
  });
}, [
  installmentStatusLoading,
  installmentStatusData,
  selectedBatch,
  course,
  navigate,
]);


  useEffect(() => {
    if (!couponSuccess) return;

    setSelectedBatch(null);
    setIsTermsAccepted(false);
    setFormData((prev) => ({
      ...prev,
      coupon: "",
    }));
    setCouponData(null);
    setCouponError("");

    const timer = setTimeout(() => {
      setCouponSuccess("");
    }, 4000);

    return () => clearTimeout(timer);
  }, [couponSuccess]);

  useEffect(() => {
    if (!preselectedSession || !liveGroups?.length) return;

    const matchedGroup = liveGroups.find(
      (group) =>
        group.type === "live" &&
        group.sessions?.some(
          (s) => s.batchId === preselectedBatchId
        )
    );

    if (matchedGroup) {
      setSelectedBatch(matchedGroup);
    } else {
      
      const firstLive = liveGroups.find(g => g.type === "live");
      if (firstLive) {
        setSelectedBatch(firstLive);
      }
    }

  }, [preselectedSession, liveGroups, preselectedBatchId]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    if (studentData) {
      setStudentDataView(studentData);
      setMobileNumber(studentData.mobile || '');
    }
  }, [studentData]);

  const isEnrollmentBlocked = false;

  const {
    data: couponApiData,
    error: couponApiError,
  } = useCouponDiscount({
    couponCode,
    enabled: couponCode?.length >= 4,
  });

  /* ===============================
     Auto-fill user data
  =============================== */
  useEffect(() => {
    if (!userProfile) return;

    setFormData((prev) => ({
      ...prev,
      fullName: userProfile.fullName || userProfile.name || "",
      email: userProfile.email || "",
      phone: userProfile.mobile || userProfile.phone || "",
    }));
  }, [userProfile]);

  /* ===============================
     Sync coupon input
  =============================== */
  useEffect(() => {
    const trimmed = formData.coupon?.trim();
    setCouponCode(trimmed);

    if (!trimmed) {
      setCouponData(null);
      setCouponError("");
      setCouponSuccess("");
    }
  }, [formData.coupon]);

  /* ===============================
     Coupon Logic
  =============================== */
  useEffect(() => {
    if (!couponApiData) return;

    setCouponError("");
    setCouponSuccess("");
    setCouponData(null);

    if (Object.keys(couponApiData).length === 0) {
      setCouponError("Invalid coupon code");
      return;
    }

    const {
      discountType,
      discountValue,
      courses,
      countries,
      endDate,
      usageLimit,
      numberOfHits,
    } = couponApiData;

    if (endDate && new Date() > new Date(endDate)) {
      setCouponError("Coupon code is expired");
      return;
    }

    const userCountry =
      formData.phone?.startsWith("+91") ? "India" : "United States";

    if (countries && !countries.includes(userCountry)) {
      setCouponError("Coupon not valid for your country");
      return;
    }

    if (usageLimit != null && numberOfHits >= usageLimit) {
      setCouponError("Coupon usage limit exceeded");
      return;
    }

    if (courses && !courses.includes(course?.courseName)) {
      setCouponError("Coupon not applicable for this course");
      return;
    }

    setCouponData({
      discountType: discountType?.toLowerCase(),
      discountValue: Number(discountValue),
    });

    setCouponSuccess("Coupon applied successfully");
  }, [couponApiData, course?.courseName, formData.phone]);

  useEffect(() => {
    if (!couponApiError) return;

    const status = couponApiError?.response?.status;

    if (status === 400 || status === 404) {
      setCouponError("Invalid coupon code");
    } else {
      setCouponError("Invalid coupon code");
    }
    setCouponData(null);
    setCouponSuccess("");
  }, [couponApiError]);



  /* ===============================
     Schedules
  =============================== */
  const batches = (liveGroups || [])
    .filter((group) => group.type === "live")
    .map((group) => ({
      label: group.day,
      value: group,
    }));

  /* ===============================
     ✅ PRICE LOGIC (MATCH BANNER EXACTLY)
  =============================== */

  let basePrice = 0;
  let discountedPrice = 0;
  let finalPrice = 0;
  let displayCurrency = currency;

  const { exchangeRate } = useCurrency();
  const isIndiaUser =
    formData.phone?.startsWith("+91") || currency === "INR";

  if (course) {
    if (isIndiaUser) {
      basePrice =
        discountRule?.status === "Active"
          ? Number(course.iamount || 0)
          : Number(course.itotal || 0);

      displayCurrency = "INR";
    } else {
      basePrice =
        discountRule?.status === "Active"
          ? Number(course.amount || 0)
          : Number(course.total || 0);

      displayCurrency = currency;
    }
  }
  discountedPrice = basePrice;

  if (
    discountRule &&
    discountRule.status === "Active" &&
    discountRule.discountPercentage > 0
  ) {
    discountedPrice =
      basePrice -
      (basePrice * discountRule.discountPercentage) / 100;
  }
  if (!isIndiaUser && discountedPrice > 0) {
    discountedPrice = discountedPrice * exchangeRate;
  }

  finalPrice = discountedPrice;

  if (couponData && finalPrice > 0) {
    if (couponData.discountType === "percentage") {
      finalPrice =
        finalPrice -
        (finalPrice * couponData.discountValue) / 100;
    } else {
      finalPrice =
        finalPrice - couponData.discountValue;
    }

    finalPrice = Math.max(0, finalPrice);
  }
  const formattedAmount =
    finalPrice === 0
      ? `${displayCurrency} 0`
      : finalPrice > 0
        ? `${displayCurrency} ${Math.round(finalPrice)}`
        : `${displayCurrency} 0`;
  const isZeroAmount = Number(finalPrice) === 0;

  const {
    handleLiveEnrollPayment,
    handleEnrollPayLater,
  } = useDemoLivePayment({
    courseData: {
      itotal: Math.round(finalPrice),
      originalAmount: Math.round(basePrice),
      discountApplied: Math.round(basePrice - discountedPrice),
      couponCode,
      couponDiscount: couponData?.discountValue || 0,
    },
    userProfile,
    courseNameForApi: course?.courseName,
    setEnrollSuccessMessage: setCouponSuccess,
    setEnrollErrorMessage: setCouponError,
  });

  useEffect(() => {

  }, [discountRule]);

  const isPayLaterDisabled =
  !selectedBatch ||
  !isTermsAccepted ||
  isEnrollmentBlocked ||
  lockButtonsUntilBatchChange ||
  isAlreadyEnrolledForBatch;
const isInstallmentEnabled =
  isTermsAccepted &&          // ✅ condition 1: checkbox checked
  isPayLaterDisabled &&       // ✅ condition 2: pay-later button is disabled
  currentRequestStatus === "none" &&
  !installmentStatusLoading;


  /* ===============================
     Early Return (NOW SAFE)
  =============================== */
  if (!scheduleLoading && batches.length === 0) {
    return (
      <div className={styles.noScheduleWrapper}>
        <p className={styles.noScheduleText}>
          No live class course schedules available right now.
        </p>
      </div>
    );
  }


  /* ===============================
     Render
  =============================== */
  return (
    <div className="container">
      <div className={styles.enContainer}>
        <div className={styles.enWrapper}>
          <div className={styles.enHeader}>
            <h1 className={styles.enTitle}>Enroll & Pay</h1>
            <p className={styles.enSubtitle}>
              Confirm your course details and proceed with payment.
            </p>
          </div>

          <div className={styles.enContent}>
            <div className={styles.enSection}>
              <label className={styles.enLabel}>Course Name</label>
              <div className={styles.enCourseDisplay}>
                {course?.courseName}
              </div>
            </div>

            <div className={styles.enRow}>
              <div className={styles.enCol}>
                <label className={styles.enLabel}>
                  Batch Schedule
                </label>

                <div className={styles.enCourseDisplay}>
                  {selectedBatch?.day || "—"}
                </div>

              </div>

              <div className={styles.enCol}>
                <label className={styles.enLabel}>Learning Mode</label>
                <Input
                  value={selectedMode}
                  readOnly
                  className={styles.readOnlyInput}
                />
              </div>
            </div>

            <div className={styles.enSectionTitle}>Billing Details</div>

            <div className={styles.enRow}>
              <Input
                value={formData.fullName}
                readOnly
                className={styles.readOnlyInput}
              />
              <Input
                value={formData.email}
                readOnly
                className={styles.readOnlyInput}
              />
            </div>

            <div className={styles.enRow}>
              <Input
                value={formData.phone}
                readOnly
                className={styles.readOnlyInput}
              />
              <Input
                placeholder="Coupon"
                value={formData.coupon}
                onChange={(e) =>
                  setFormData({ ...formData, coupon: e.target.value })
                }
                className={styles.couponInput}
              />
            </div>


            {couponError && (
              lastAction === "PAY_LATER" ||
              !(
                couponError === "You are already enrolled for this batch." ||
                couponError ===
                "This enrollment record already exists for Live Class in the database."
              )
            ) && (
                <p className={styles.errorMessage}>{couponError}</p>
              )}


            {couponSuccess && (
              <p className={styles.successMessage}>
                {couponSuccess}
              </p>
            )}

            {/* Terms & Conditions */}
            <div className={styles.enTerms}>
              <input
                type="checkbox"
                id="terms"
                className={styles.enCheckbox}
                checked={isTermsAccepted}
                onChange={(e) => setIsTermsAccepted(e.target.checked)}
              />
              <label htmlFor="terms" className={styles.enTermsLabel}>
                I agree to the{" "}
                <Link to="/terms" className={styles.enLink}>
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link to="/refundpolicy" className={styles.enLink}>
                  Refund Policy
                </Link>
                <span className={styles.requiredStarInline}>*</span>
              </label>
            </div>

            <div className={styles.enFooter}>
              <div className={styles.enTotalSection}>
                <span className={styles.enTotalLabel}>Total Payable:</span>
                <span className={styles.enTotalAmount}>
                  {formattedAmount}
                </span>
              </div>

              <div className={styles.buttonGroup}>
                <button
                  className={`${styles.enPayBtn} ${!selectedBatch ||
                    !isTermsAccepted ||
                    lockButtonsUntilBatchChange ||
                    isZeroAmount
                    ? styles.disabledBtn
                    : ""
                    }`}
                  disabled={
                    !selectedBatch ||
                    !isTermsAccepted ||
                    lockButtonsUntilBatchChange ||
                    isZeroAmount
                  }
                  onClick={() => {
                    setLastAction("PAY_NOW");
                    selectedBatch &&
                      handleLiveEnrollPayment(selectedBatch.sessions[0], {
                        isPayNow: true,
                        email: notifyVia.email,
                        whatsapp: notifyVia.whatsapp,
                      });
                  }}
                >
                  Pay Now
                </button>
             <button
  className={`${styles.enPayBtn} ${!selectedBatch ||
    !isTermsAccepted ||
    isEnrollmentBlocked ||
    lockButtonsUntilBatchChange ||
    isAlreadyEnrolledForBatch
      ? styles.disabledBtn
      : ""
  }`}
  disabled={
    !selectedBatch ||
    !isTermsAccepted ||
    isEnrollmentBlocked ||
    lockButtonsUntilBatchChange ||
    isAlreadyEnrolledForBatch
  }
  onClick={() => {
    setLastAction("PAY_LATER");
    selectedBatch &&
      handleEnrollPayLater({
        ...selectedBatch.sessions[0],
        notifyVia,
      });
  }}
>
  Enroll Now, Pay Later
</button>

{/* 

                <div className={styles.installmentBtnContainer}>
            <button
  className={styles.paymentBtn}
  onClick={() => setOpenInstallmentPopup(true)}
  disabled={!isInstallmentEnabled}
  style={{
    opacity: !isInstallmentEnabled ? 0.6 : 1,
    cursor: !isInstallmentEnabled ? "not-allowed" : "pointer",
  }}
>
  Request for Installments
</button>

 {isInstallmentEnabled && (
    <p style={{ color: "#b45309", fontSize: "13px", marginTop: "6px" }}>
      ℹ️ Additional charges will be applicable for Request Installments
    </p>
  )}
                  {currentRequestStatus === "pending" && (
                    <p className={styles.pendingStatus}>
                      Your installment request is pending admin approval
                    </p>
                  )}

                  {currentRequestStatus === "approved" && (
                    <p className={styles.approvedStatus}>
                      ✅ Installment request is approved for this course.
                    </p>
                  )}

                  {currentRequestStatus === "rejected" && (
                    <p className={styles.rejectedStatus}>
                      ❌ Installment request rejected for this course, please contact with Hachion team
                    </p>
                  )}
                </div> */}
                {/* ===== BUTTON ROW (NO MESSAGES HERE) ===== */}
<div className={styles.installmentBtnContainer}>
  <button
    className={styles.paymentBtn}
    onClick={() => setOpenInstallmentPopup(true)}
    disabled={!isInstallmentEnabled}
    style={{
      opacity: !isInstallmentEnabled ? 0.6 : 1,
      cursor: !isInstallmentEnabled ? "not-allowed" : "pointer",
    }}
  >
    Request for Installments
  </button>
</div>

{/* ===== MESSAGE ROW (ALWAYS BELOW ALL 3 BUTTONS) ===== */}
<div style={{ marginTop: "8px" }}>
  {isInstallmentEnabled && (
    <p style={{ color: "#b45309", fontSize: "17px", margin: 0 }}>
      ℹ️ Installments are offered with applicable additional fees.
    </p>
  )}

  {currentRequestStatus === "pending" && (
    <p className={styles.pendingStatus} style={{ margin: "4px 0 0 0" }}>
      Your installment request is pending admin approval
    </p>
  )}

  {currentRequestStatus === "approved" && (
    <p className={styles.approvedStatus} style={{ margin: "4px 0 0 0" }}>
      ✅ Installment request is approved for this course.
    </p>
  )}

  {currentRequestStatus === "rejected" && (
    <p className={styles.rejectedStatus} style={{ margin: "4px 0 0 0" }}>
      ❌ Installment request rejected for this course, please contact with Hachion team
    </p>
  )}
</div>


              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog
        open={openInstallmentPopup}
        onClose={() => setOpenInstallmentPopup(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <RequestInstallment
            selectedBatchData={selectedBatch?.sessions?.[0]}
            closeModal={() => setOpenInstallmentPopup(false)}
            
            courseFee={Math.round(finalPrice)}
            email={studentData?.email || ''}
            studentId={studentData?.studentId || ''}
            studentName={studentData?.userName || ''}
            courseData={course}
            mobile={mobileNumber}
            currencyLabel={displayCurrency}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}