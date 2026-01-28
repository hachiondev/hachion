import React, { useState, useEffect } from "react";
import styles from './NewEnrollmentPage/NewEnrollNow.module.css';
import { Input } from "../ui/input";
import { useParams, useLocation } from "react-router-dom";
import { useDemoScheduleLogic } from "../../Api/hooks/DemoClassSectionLogics/useDemoScheduleLogic";
import { useUserProfile } from "../../Api/hooks/CourseApi/useUserProfile";
import { useCourseByName } from "../../Api/hooks/CourseApi/useCourseByName";
import { useCurrency } from "../../Api/hooks/CourseApi/useCurrency";
import { useCourseDiscountRule } from "../../Api/hooks/CourseApi/useCourseDiscountRule";
import { useCouponDiscount } from "../../Api/hooks/CourseApi/useCouponDiscount";
import { useDemoLivePayment } from "../../Api/hooks/CourseApi/useDemoLivePayment";
import { Link } from "react-router-dom";

const generateSelfBatchId = (courseName) => {
  const courseShort = (courseName || "")
    .replace(/[^a-zA-Z]/g, "")
    .substring(0, 4)
    .toUpperCase();

  const now = new Date();
  const month = now
    .toLocaleString("en-US", { month: "short" })
    .toUpperCase();
  const day = String(now.getDate()).padStart(2, "0");
  const year = now.getFullYear();

  return `SELF-${courseShort}-${month}${day}${year}`;
};

export default function NewEnrollSelfPaced() {
    const location = useLocation();
    const preselectedSession = location.state?.selectedSession || null;
const preselectedBatchId = location.state?.selectedBatchId || null;


  const notifyVia = location.state?.notifyVia || {
    email: true,
    whatsapp: true,
  };

  /* ===============================
     State
  =============================== */
  const [selectedBatch, setSelectedBatch] = useState(null);
  const selectedMode = "Self-Paced Learning";

  const [couponCode, setCouponCode] = useState("");
  const [couponData, setCouponData] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  const [lockButtonsUntilBatchChange, setLockButtonsUntilBatchChange] =  useState(false);

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

const isEnrollmentBlocked = false;

const selfBatchId = React.useMemo(
  () => generateSelfBatchId(course?.courseName || courseName),
  [course?.courseName, courseName]
);

const selfSession = {
  batchId: selfBatchId,
  mode: "SELF_PACED",
};


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
          ? Number(course.isamount || 0)
          : Number(course.istotal || 0);

      displayCurrency = "INR";
    } else {
      basePrice =
        discountRule?.status === "Active"
          ? Number(course.samount || 0)
          : Number(course.stotal || 0);

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
  {selfBatchId}
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
                <Link to="/privacy" className={styles.enLink}>
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
  className={`${styles.enPayBtn} ${
    
    !isTermsAccepted ||
    lockButtonsUntilBatchChange ||
    isZeroAmount
      ? styles.disabledBtn
      : ""
  }`}
  disabled={
    
    !isTermsAccepted ||
    lockButtonsUntilBatchChange ||
    isZeroAmount
  }
  onClick={() => {
    setLastAction("PAY_NOW");
    
    handleLiveEnrollPayment(selfSession, {
  isPayNow: true,
  email: notifyVia.email,
  whatsapp: notifyVia.whatsapp,
});

  }}
>
  Pay Now
</button>

               
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}