import React, { useState, useEffect } from "react";
import styles from "./NewEnrollNow.module.css";
import { Input } from "../ui/input";
import { useParams } from "react-router-dom";
import { useDemoScheduleLogic } from "../../Api/hooks/DemoClassSectionLogics/useDemoScheduleLogic";
import { useUserProfile } from "../../Api/hooks/CourseApi/useUserProfile";
import { useCourseByName } from "../../Api/hooks/CourseApi/useCourseByName";
import { useCurrency } from "../../Api/hooks/CourseApi/useCurrency";
import { useCourseDiscountRule } from "../../Api/hooks/CourseApi/useCourseDiscountRule";
import { useCouponDiscount } from "../../Api/hooks/CourseApi/useCouponDiscount";
import { useDemoLivePayment } from "../../Api/hooks/CourseApi/useDemoLivePayment";

export default function NewEnrollNow() {
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

  // const [lockButtonsUntilBatchChange, setLockButtonsUntilBatchChange] =
  //   useState(false);

  const [lockButtonsUntilBatchChange, setLockButtonsUntilBatchChange] =
  useState(false);

const [lastAction, setLastAction] = useState(null); // "PAY_NOW" | "PAY_LATER"


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
    ? decodeURIComponent(courseName).replace(/[-_]+/g, " ").toLowerCase()
    : "";

  /* ===============================
     APIs
  =============================== */
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const { liveGroups, scheduleLoading } =
    useDemoScheduleLogic({ courseSlug, timezone });

  const { data: userProfile } = useUserProfile();
  const { data: course } = useCourseByName(courseSlug);
  const { currency } = useCurrency();
  const { data: discountRule } = useCourseDiscountRule(courseSlug);

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
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);


const isEnrollmentBlocked =
  false; // Do NOT block Pay Now for already enrolled cases

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

  const formattedAmount = finalPrice
    ? `${displayCurrency} ${Math.round(finalPrice)}`
    : "Price on request";

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
    console.log("DISCOUNT RULE:", discountRule);
  }, [discountRule]);

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
                  Select Batch <span className={styles.requiredStar}>*</span>
                </label>
                <select
                  value={selectedBatch?.key || ""}
                  onChange={(e) => {
                    const selected = batches.find(
                      (b) => b.value.key === e.target.value
                    );

                    setSelectedBatch(selected?.value || null);
                    setCouponError("");
                    setCouponSuccess("");

                    setLockButtonsUntilBatchChange(false);
                  }}
                  className={styles.enSelect}
                >
                  <option value="">Choose Batch</option>
                  {batches.map((b, idx) => (
                    <option key={idx} value={b.value.key}>
                      {b.label}
                    </option>
                  ))}
                </select>
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
                <a href="#" className={styles.enLink}>
                  Terms & Conditions
                </a>{" "}
                and{" "}
                <a href="#" className={styles.enLink}>
                  Refund Policy
                </a>
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
                  className={`${styles.enPayBtn} ${
                    !selectedBatch ||
                    !isTermsAccepted ||
                    // isEnrollmentBlocked ||
                    lockButtonsUntilBatchChange
                      ? styles.disabledBtn
                      : ""
                  }`}
                  disabled={
                    !selectedBatch ||
                    !isTermsAccepted ||
                    // isEnrollmentBlocked ||
                    lockButtonsUntilBatchChange
                  }
              onClick={() => {
  setLastAction("PAY_NOW");
  selectedBatch &&
    handleLiveEnrollPayment(selectedBatch.sessions[0], {
      isPayNow: true,
    });
}}


                >
                  Pay Now
                </button>
                <button
                  className={`${styles.enPayBtn} ${
                    !selectedBatch ||
                    !isTermsAccepted ||
                    isEnrollmentBlocked ||
                    lockButtonsUntilBatchChange
                      ? styles.disabledBtn
                      : ""
                  }`}
                  disabled={
                    !selectedBatch ||
                    !isTermsAccepted ||
                    isEnrollmentBlocked ||
                    lockButtonsUntilBatchChange
                  }
                 onClick={() => {
  setLastAction("PAY_LATER");
  selectedBatch && handleEnrollPayLater(selectedBatch.sessions[0]);
}}

                >
                  Enroll Now, Pay Later
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}