import React, { useState } from "react";
import styles from "./Banner.module.css";
import { cn } from "../../../../utils";
import heroImage from "../../../../Assets/images/banner-hero.png";
import Medal from "../../../../Assets/icons/medal.svg";
import LoginRequired from "./LoginRequired";
import VideoModal from "./VideoModal";
import { useNavigate, useParams } from "react-router-dom";
import NewEnrollNow from "../../../UserPanel/NewEnrollNow";
import { useCourseByName } from "../../../../Api/hooks/CourseApi/useCourseByName";


import { useCurrency } from "../../../../Api/hooks/CourseApi/useCurrency";
import { useCourseDiscountRule } from "../../../../Api/hooks/CourseApi/useCourseDiscountRule";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";


dayjs.extend(customParseFormat);

function extractYoutubeId(url) {
  if (!url) return "";
  const regExp =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : "";
}


/* --- Tiny inline icons (SVGS) --- */
const Star = ({ filled, ...p }) => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...p}>
    <path
      fill={filled ? "#FFB608" : "#E0E0E0"}
      d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z"
    />
  </svg>
);

const Clock = (p) => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...p}>
    <path
      fill="currentColor"
      d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm1 11h-4V7h2v4h2z"
    />
  </svg>
);

const Certificate = (p) => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...p}>
    <path
      fill="currentColor"
      d="M20 2H4a2 2 0 00-2 2v13a2 2 0 002 2h5l3 3 3-3h5a2 2 0 002-2V4a2 2 0 00-2-2zM6 6h12v2H6zm0 4h12v2H6zm0 4h8v2H6z"
    />
  </svg>
);

const Play = (p) => (
  <svg viewBox="0 0 24 24" width="26" height="26" {...p}>
    <path fill="currentColor" d="M8 5v14l11-7z" />
  </svg>
);

function OfferStrip({ leftText, rightText }) {
  return (
    <div className={styles.bnoffertop}>
      <div className="container">
        <div className={styles.bnoffer}>
          <div className={styles.bnofferleft}>{leftText}</div>
          <div className={styles.bnofferright}>{rightText}</div>
        </div>
      </div>
    </div>
  );
}

const stripHtml = (html) => {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
};

export default function CourseBanner({ onEnroll }) {
  const navigate = useNavigate();
  const { courseName } = useParams();

  const courseNameForApi = courseName
    ? decodeURIComponent(courseName)
      .replace(/[-_]+/g, " ")
      .trim()
      .toLowerCase()
    : "";

  const [showLoginRequired, setShowLoginRequired] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showEnroll, setShowEnroll] = useState(false);
  const [showRegisterPrompt, setShowRegisterPrompt] = useState(false);

  const { data: course, isLoading, isError } = useCourseByName(courseNameForApi);

  const youtubeId = extractYoutubeId(course?.youtubeLink);
  const hasYoutubeDemo = youtubeId && youtubeId.length > 0;

  const { currency, exchangeRate } = useCurrency();

  const { data: discountRule } = useCourseDiscountRule(courseNameForApi);
  const hasSpecialDiscount = !!discountRule;
  const ruleDiscountPct = discountRule?.discountPercentage ?? 0;
  const discountType = discountRule?.discountType || "PERCENTAGE";
  const discountFixedAmount = discountRule?.discountAmount ?? 0;


  const offerRightText = (() => {
    if (!discountRule?.endDate) return "";

    const end = dayjs(discountRule.endDate, ["MM/DD/YYYY", "YYYY-MM-DD"], true).endOf("day");
    if (!end.isValid()) return "";

    const now = dayjs();
    if (!end.isAfter(now)) return "";

    const diffDays = end.diff(now, "day");

    if (diffDays >= 1) {
      return `⏳ Hurry! Offer ends in ${diffDays} day${diffDays > 1 ? "s" : ""}`;
    }

    const diffHours = Math.max(1, end.diff(now, "hour"));
    return `⏳ Hurry! Offer ends in ${diffHours} hour${diffHours > 1 ? "s" : ""}`;
  })();

  const showOfferStrip = hasSpecialDiscount && offerRightText;


  if (isLoading) {
    return (
      <section className={styles.bnwrap}>
        <OfferStrip leftText="Loading..." rightText="" />
        <div className="container py-5">Loading course details...</div>
      </section>
    );
  }

  if (isError || !course) {
    return (
      <section className={styles.bnwrap}>
        <OfferStrip leftText="Error loading course" rightText="" />
        <div className="container py-5 text-danger">
          Course not found. Please check the URL.
        </div>
      </section>
    );
  }

  const level = course.level || "Beginner level";
  const title = course.courseName || "Course";

  const subtitle =
    stripHtml(course.aboutCourse) ||
    "Course overview coming soon.";


  const author =
    course?.defaultTrainer?.trim() || "Hachion Certified Trainer";


  const categories = course.courseCategory
    ? [course.courseCategory]
    : ["Technology"];

  const rating = course.starRating ?? 4.5;
  const maxStars = 5;
  const filledStars = Math.max(
    0,
    Math.min(maxStars, Math.round(Number(rating) || 0))
  );

  const reviews = course.ratingByNumberOfPeople ?? 0;
  const enrolled = course.totalEnrollment
    ? `${course.totalEnrollment}+ Students Enrolled`
    : "Students Enrolled";

  const duration = course.numberOfClasses
    ? `${course.numberOfClasses} Classes`
    : "Duration will be updated soon";

  // const baseDiscount = course.idiscount ?? course.discount ?? 0;
  const baseDiscount =
  currency === "INR"
    ? course.idiscount ?? 0
    : course.discount ?? 0;

  const effectiveDiscountPct = hasSpecialDiscount ? ruleDiscountPct : baseDiscount;

  let convertedTotalFee = 0;
  let convertedOriginalFee = 0;

  if (currency === "INR") {
    const inrPlans = [
      { total: course.itotal, amount: course.iamount },
      { total: course.ictotal, amount: course.icamount },
      { total: course.imtotal, amount: course.imamount },
      { total: course.isqtotal, amount: course.isqamount },
      { total: course.istotal, amount: course.isamount },
    ].filter(
      (p) =>
        (p.total != null && p.total > 0) ||
        (p.amount != null && p.amount > 0)
    );

    if (inrPlans.length > 0) {
      const minTotal = Math.min(
        ...inrPlans.map((p) => (p.total ?? p.amount))
      );
      const bestPlan =
        inrPlans.find((p) => (p.total ?? p.amount) === minTotal) ||
        inrPlans[0];

      const originalAmount = bestPlan.amount ?? 0;

      if (hasSpecialDiscount) {

        let discountedAmount = originalAmount;

        if (discountType === "PERCENTAGE" && ruleDiscountPct && originalAmount) {
          const discountValue = (originalAmount * ruleDiscountPct) / 100;
          discountedAmount = originalAmount - discountValue;
        } else if (discountType === "FIXED" && discountFixedAmount) {
          const discountValue = discountFixedAmount;
          discountedAmount = Math.max(0, originalAmount - discountValue);
        } else {

          discountedAmount = bestPlan.total ?? originalAmount;
        }

        convertedOriginalFee = originalAmount;
        convertedTotalFee = discountedAmount;
      } else {

        convertedTotalFee = bestPlan.total ?? originalAmount;
        convertedOriginalFee = originalAmount;
      }
    }
  } else {
    const usdPlans = [
      { total: course.total, amount: course.amount },
      { total: course.ctotal, amount: course.camount },
      { total: course.mtotal, amount: course.mamount },
      { total: course.sqtotal, amount: course.sqamount },
      { total: course.stotal, amount: course.samount },
    ].filter(
      (p) =>
        (p.total != null && p.total > 0) ||
        (p.amount != null && p.amount > 0)
    );

    if (usdPlans.length > 0) {
      const minTotal = Math.min(
        ...usdPlans.map((p) => (p.total ?? p.amount))
      );
      const bestPlan =
        usdPlans.find((p) => (p.total ?? p.amount) === minTotal) ||
        usdPlans[0];

      const originalAmount = bestPlan.amount ?? 0;

      if (hasSpecialDiscount) {

        let discountedAmount = originalAmount;

        if (discountType === "PERCENTAGE" && ruleDiscountPct && originalAmount) {
          const discountValue = (originalAmount * ruleDiscountPct) / 100;
          discountedAmount = originalAmount - discountValue;
        } else if (discountType === "FIXED" && discountFixedAmount) {
          const discountValue = discountFixedAmount;
          discountedAmount = Math.max(0, originalAmount - discountValue);
        } else {
          discountedAmount = bestPlan.total ?? originalAmount;
        }

        convertedOriginalFee = originalAmount * exchangeRate;
        convertedTotalFee = discountedAmount * exchangeRate;
      } else {

        convertedTotalFee = (bestPlan.total ?? originalAmount) * exchangeRate;
        convertedOriginalFee = originalAmount * exchangeRate;
      }
    }
  }

  let offerSaving = 0;
  let offerLeftText = "";


  if (hasSpecialDiscount && convertedOriginalFee && convertedTotalFee) {
    offerSaving = convertedOriginalFee - convertedTotalFee;

    if (offerSaving > 0) {
      const roundedSaving = Math.round(offerSaving);


      const savingText =
        currency === "INR"
          ? `${currency} ${roundedSaving}/-`
          : `${currency} ${roundedSaving}`;

      if (discountType === "PERCENTAGE" && ruleDiscountPct) {
        offerLeftText = `Flash Sale! Get ${ruleDiscountPct}% OFF & Save ${savingText}`;
      } else {
        offerLeftText = `Flash Sale! Save ${savingText}`;
      }
    }
  }

  let finalPrice = 0;
  let originalPrice = 0;


  if (convertedTotalFee && convertedOriginalFee) {
    finalPrice = convertedTotalFee;
    originalPrice = convertedOriginalFee;
  }
const hasValidPrice =
  finalPrice !== null &&
  finalPrice !== undefined &&
  !isNaN(finalPrice);

const price = hasValidPrice
  ? `${currency} ${Math.round(finalPrice)}`
  : `${currency} 0`;


  // Strike-through price
  const oldPrice =
    hasSpecialDiscount && originalPrice > finalPrice
      ? `${currency} ${Math.round(originalPrice)}`
      : "";


  const startsFromPrice =
    convertedTotalFee && convertedTotalFee > 0
      ? `${currency} ${Math.round(convertedTotalFee)}`
      : "Price on request";

  return (
    <section className={styles.bnwrap}>
      {showOfferStrip && (
        <OfferStrip
          leftText={offerLeftText}
          rightText={offerRightText}
        />
      )}

      <div className={styles.bncardmain}>
        <div className={`container ${styles.bncard}`}>
          {/* Left */}
          <div className={styles.bnleft}>
            <span className={styles.bnchip}>{level}</span>

            <div className={styles.titleGroup}>
              <h1 className={styles.bntitle}>{title}</h1>
            </div>


            <p className={styles.bnsub}>{subtitle}</p>

            <p className={styles.bnby}>
              By <strong>{author}</strong> in <strong>{categories.join(", ")}</strong>
            </p>

            <div className={styles.bnmetrics}>
              <span className={styles.bnmetric}>
                <span className={styles.bnmetricnogap}>
                  {Array.from({ length: maxStars }).map((_, i) => (
                    <Star key={i} filled={i < filledStars} />
                  ))}
                </span>{" "}
                <b>{rating}</b> ({reviews} reviews)
              </span>

              <span className={styles.bnsep}></span>

              <span className={styles.bnmetric}>
                <img src={Medal} alt="icon" /> {enrolled}
              </span>
            </div>

            <div className={styles.bnbullets}>
              <span className={styles.bnbullet}>
                <Clock /> {duration}
              </span>
              <span className={styles.bnbullet}>
                <Certificate /> Certificate included
              </span>
            </div>

            <div className={styles.bnpriceRow}>
              <div className={styles.bnprice}>
                <p className={styles.feeGroup}>
                  <span className={styles.fee}>Fee:</span>
                  <span className={styles.start}>Starts from </span>
                  <span className={styles.bnpricenow}>{price}</span>
                </p>

                <div className={styles.groupdis}>
                  {oldPrice && (
                    <span className={styles.bnpriceold}>{oldPrice}</span>
                  )}
                  {/* <span className={styles.bntag}>{discount}% OFF</span> */}
                  <span className={styles.bntag}>{effectiveDiscountPct}% OFF</span>
                </div>

              </div>

              <div className={styles.bnctaRow}>
                <button
                  className={cn(styles.bnbtn, styles.bnbtnprimary)}
                  onClick={onEnroll}
                >
                  Enroll Now - Start Learning
                </button>

                {/* <button
                  className={styles.bnlink}
                  onClick={() => setShowLoginRequired(true)}
                >
                  Add to Cart
                </button> */}
              </div>

              {/* <div className={styles.bnnote}>
                • Lifetime access • EMI starting at $29/month
              </div> */}
            </div>
          </div>

          {/* Right */}
          <div className={styles.bnright}>
            <div className={styles.bnhero}>
              <img
                src={
                  hasYoutubeDemo
                    ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
                    : heroImage
                }
                alt="Course preview"
              />

              {hasYoutubeDemo && (
                <button
                  className={styles.bnplay}
                  aria-label="Watch demo video"
                  onClick={() => setShowVideo(true)}
                >
                  <Play />
                </button>
              )}

              <div className={styles.bnherotext}>
                {hasYoutubeDemo ? "Watch Demo Video" : "Demo video coming soon"}
              </div>

              <div className={styles.bnstats}>
                <div className={styles.bnstat}>
                  <div
                    className={cn(styles.bnstatval, styles.bnstatvalBlue)}
                  >
                    {course.numberOfClasses || 12}
                  </div>
                  <div className={styles.bnstatlabel}>Classes</div>
                </div>
                <div className={styles.bnstat}>
                  <div
                    className={cn(styles.bnstatval, styles.bnstatvalGreen)}
                  >
                    {course.numberOfProjects || 3}

                  </div>
                  <div className={styles.bnstatlabel}>Projects</div>
                </div>
                <div className={styles.bnstat}>
                  <div
                    className={cn(styles.bnstatval, styles.bnstatvalPurple)}
                  >
                    24/7
                  </div>
                  <div className={styles.bnstatlabel}>Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showLoginRequired && (
        <LoginRequired
          title="Login Required"
          subtitle="To add items to cart please Login"
          onCancel={() => setShowLoginRequired(false)}
          onLogin={() => setShowLoginRequired(false)}
        />
      )}

      {showEnroll && (
        <NewEnrollNow
          courseName={course.courseName}
          totalAmount={price}
          onClose={() => setShowEnroll(false)}
          onPayNow={() => setShowEnroll(false)}
        />
      )}

      {showVideo && (
        <VideoModal
          videoSrc={
            hasYoutubeDemo
              ? `https://www.youtube.com/embed/${youtubeId}?autoplay=1`
              : "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          }
          isYoutube={hasYoutubeDemo}
          onClose={() => setShowVideo(false)}
        />
      )}
      {showRegisterPrompt && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.55)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "520px",
              background: "#fff",
              borderRadius: "12px",
              display: "flex",
              padding: "20px",
              boxShadow: "0 10px 35px rgba(0,0,0,0.28)",
            }}
          >
            {/* LEFT IMAGE */}
            <div
              style={{
                width: "42%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src={require("../../../../Assets/loginpopup.webp")}
                alt="login popup"
                style={{
                  width: "100%",
                  borderRadius: "8px",
                  objectFit: "cover",
                  transform: "scaleX(-1)",
                }}
              />
            </div>

            {/* RIGHT CONTENT */}
            <div
              style={{
                width: "58%",
                paddingLeft: "14px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "20px", marginBottom: "6px" }}>
                Please Login
              </h3>

              <p style={{ fontSize: "14px", marginBottom: "20px", color: "#555" }}>
                Before proceeding, please login into our Hachion.
              </p>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  style={{
                    padding: "8px 14px",
                    borderRadius: "6px",
                    border: "none",
                    background: "#2563eb",
                    color: "#fff",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    navigate("/login");
                    setShowRegisterPrompt(false);
                  }}
                >
                  Login
                </button>

                <button
                  style={{
                    padding: "8px 14px",
                    background: "#f1f5f9",
                    color: "#333",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                  onClick={() => setShowRegisterPrompt(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
