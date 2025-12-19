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
const [lockButtonsUntilBatchChange, setLockButtonsUntilBatchChange] =
  useState(false);

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

const isEnrollmentBlocked =
  couponError === "You are already enrolled for this batch." ||
  couponError ===
    "This enrollment record already exists for Live Class in the database.";

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
             <div
  style={{
    backgroundColor: "#f5f5f5",
    color: "#000",
    fontWeight: 500,
    cursor: "not-allowed",
    padding: "10px 12px",
    borderRadius: "6px",
    border: "1px solid #dcdcdc",
  }}
>
  {course?.courseName}
</div>

            </div>

            <div className={styles.enRow}>
              <div className={styles.enCol}>
                <label className={styles.enLabel}>
                  Select Batch <span style={{ color: "red" }}>*</span>
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
                {/* <Input value={selectedMode} readOnly /> */}
               <Input
  value={selectedMode}
  readOnly
  style={{
    backgroundColor: "#f5f5f5",
    color: "#000",
    fontWeight: 500,
    cursor: "not-allowed",
  }}
/>


              </div>
            </div>

            <div className={styles.enSectionTitle}>Billing Details</div>

            <div className={styles.enRow}>
            <Input
  value={formData.fullName}
  readOnly
  style={{
    backgroundColor: "#f5f5f5",
    color: "#000",      
    fontWeight: 500,
    cursor: "not-allowed",
  }}
/>

<Input
  value={formData.email}
  readOnly
  style={{
    backgroundColor: "#f5f5f5",
    color: "#000",
    fontWeight: 500,
    cursor: "not-allowed",
  }}
/>

            </div>

            <div className={styles.enRow}>
              {/* <Input value={formData.phone} readOnly /> */}
           <Input
  value={formData.phone}
  readOnly
  style={{
    backgroundColor: "#f5f5f5",
    color: "#000",      
    fontWeight: 500,
    cursor: "not-allowed",
  }}
/>

              <Input
                placeholder="Coupon"
                value={formData.coupon}
                onChange={(e) =>
                  setFormData({ ...formData, coupon: e.target.value })
                }
              />
            </div>

            {couponError && (
              <p style={{ color: "red", marginTop: 6 }}>{couponError}</p>
            )}
            {couponSuccess && (
              <p style={{ color: "green", marginTop: 6 }}>
                {couponSuccess}
              </p>
            )}

            <div
  className={styles.enFooter}
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: "24px",
  }}
>
  <div className={styles.enTotalSection}>
    <span>Total Payable:</span>
    <span className={styles.enTotalAmount}>
      {formattedAmount}
    </span>
  </div>

  <div style={{ display: "flex", gap: "12px" }}>
 <button
  className={styles.enPayBtn}
  disabled={
  !selectedBatch ||
  isEnrollmentBlocked ||
  lockButtonsUntilBatchChange
}
  onClick={() =>
    selectedBatch && handleLiveEnrollPayment(selectedBatch.sessions[0])
  }
  style={{
    cursor:
      !selectedBatch || isEnrollmentBlocked
        ? "not-allowed"
        : "pointer",
    opacity:
      !selectedBatch || isEnrollmentBlocked
        ? 0.5
        : 1,
  }}
>
  Pay Now
</button>
<button
  className={styles.enPayBtn}
  disabled={
  !selectedBatch ||
  isEnrollmentBlocked ||
  lockButtonsUntilBatchChange
}
  onClick={() =>
    selectedBatch && handleEnrollPayLater(selectedBatch.sessions[0])
  }
  style={{
    cursor:
      !selectedBatch || isEnrollmentBlocked
        ? "not-allowed"
        : "pointer",
    opacity:
      !selectedBatch || isEnrollmentBlocked
        ? 0.5
        : 1,
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
