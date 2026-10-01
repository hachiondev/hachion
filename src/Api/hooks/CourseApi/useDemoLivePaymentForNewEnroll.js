import { useMemo, useEffect } from "react";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { setNavState } from "@/lib/navState";
import { API_BASE_URL } from "@/lib/apiBase";

const API_BASE = `${API_BASE_URL}`;

let razorpayScriptPromise = null;
function loadRazorpayScript() {
  if (window.Razorpay) return Promise.resolve(true);
  if (!razorpayScriptPromise) {
    razorpayScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => reject("Failed to load Razorpay SDK");
      document.body.appendChild(script);
    });
  }
  return razorpayScriptPromise;
}

// Ported from the CRA app's
// src/Api/hooks/CourseApi/useDemoLivePaymentForNewEnroll.js — used by
// /enroll-now (NewEnrollNow.jsx). Nearly identical to useDemoLivePayment.js
// (used by the course-details page and /enroll-self); the one CRA-original
// difference is this version's PayPal-return capture navigates with
// `replace: true`, preserved here via router.replace.
export function useDemoLivePaymentForNewEnroll({ courseData, userProfile, courseNameForApi, setEnrollSuccessMessage, setEnrollErrorMessage }) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const amount = useMemo(() => {
    return courseData?.itotal ?? courseData?.iamount ?? courseData?.total ?? courseData?.amount ?? 0;
  }, [courseData]);

  const handleCapturePayPalOrder = async (orderId) => {
    try {
      const studentId = localStorage.getItem("studentId");
      const courseName = localStorage.getItem("courseName");
      const batchId = localStorage.getItem("batchId");
      const selectedBatchData = JSON.parse(localStorage.getItem("selectedBatchData") || "{}");
      if (!studentId || !courseName || !batchId) {
        setEnrollErrorMessage("❌ Missing payment info. Please try again.");
        return;
      }
      await axios.post(`${API_BASE}/capture-order`, null, {
        params: { orderId, studentId, courseName, batchId, discount: selectedBatchData?.discount ?? 0 },
      });

      localStorage.removeItem("studentId");
      localStorage.removeItem("courseName");
      localStorage.removeItem("batchId");
      localStorage.removeItem("selectedBatchData");
      const slug = courseName.toLowerCase().replace(/\s+/g, "-");

      setNavState(`/payment/${slug}`, {
        selectedBatchData,
        modeType: "live",
        sendEmail: true,
        sendWhatsApp: true,
        sendText: false,
        email: userProfile?.email,
      });
      router.replace(`/payment/${slug}`);
    } catch (err) {
      console.error(err);
      setEnrollErrorMessage("❌ Failed to complete PayPal payment.");
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get("status");
    const orderId = urlParams.get("token");

    if (status) {
      document.body.style.display = "none";
    }
    if (status === "success" && orderId) {
      (async () => {
        await handleCapturePayPalOrder(orderId);
      })();
    }
    if (status === "cancel") {
      setEnrollErrorMessage("❌ Payment was cancelled.");
      setEnrollSuccessMessage("");

      const slug = window.location.pathname.split("/").pop();
      window.location.replace(`/enroll/${slug}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLiveEnrollPayment = async (session, notifyVia) => {
    setEnrollSuccessMessage("");
    setEnrollErrorMessage("");
    if (!session) {
      setEnrollErrorMessage("No session selected.");
      return;
    }
    if (!userProfile?.email) {
      setEnrollErrorMessage("Please login to continue.");
      return;
    }
    const mobile = userProfile?.mobile || "";
    const courseName = session.course_name || courseData?.courseName || courseNameForApi;

    if (session.batchId?.startsWith("SELF-")) {
      const now = new Date();
      session.schedule_date = session.schedule_date || now.toISOString().split("T")[0];
      session.time = session.time || now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
      if (!/\b(IST|UTC|GMT)\b/.test(session.time)) {
        session.time = `${session.time} IST`;
      }
    }

    if (!notifyVia?.isPayNow) {
      try {
        const check = await axios.get(`${API_BASE}/enroll/is-enrolled`, {
          params: { studentId: userProfile.studentId, courseName, batchId: session.batchId },
        });
        if (check?.data?.enrolled) {
          setEnrollErrorMessage("You are already enrolled for this batch.");
          return;
        }
      } catch {
        // best-effort pre-check
      }
    }

    if (session.mode === "Live Demo") {
      try {
        await axios.post(`${API_BASE}/enroll/add`, {
          name: userProfile.userName || userProfile.name || "",
          studentId: userProfile.studentId,
          email: userProfile.email,
          mobile,
          course_name: courseName,
          enroll_date: session.schedule_date,
          week: session.week,
          time: session.time,
          amount: 0,
          mode: "Live Demo",
          type: "Live Demo",
          trainer: session.trainer || "",
          meeting_link: session.meeting_link || "",
          batchId: session.batchId,
          resendCount: 0,
          sendEmail: !!notifyVia?.email,
          sendWhatsApp: !!notifyVia?.whatsapp,
        });
        queryClient.invalidateQueries(["check-enrollment", courseName]);
        setEnrollSuccessMessage("Demo enrollment successful!");
      } catch {
        setEnrollErrorMessage("Failed to enroll for demo.");
      }
      return;
    }
    const slug = courseName.toLowerCase().replace(/\s+/g, "-");

    if (mobile.startsWith("+91")) {
      try {
        const orderRes = await axios.post(`${API_BASE}/razorpay/create-razorpay-order`, null, {
          params: { amount, studentId: userProfile.studentId, courseName, batchId: session.batchId },
        });
        const order = orderRes.data;
        if (typeof order === "string") {
          setEnrollErrorMessage(order);
          return;
        }
        await loadRazorpayScript();
        const options = {
          key: "rzp_live_1g4Axfq4KHi3kl",
          amount: order.amount,
          currency: order.currency,
          name: "Hachion",
          description: `Payment for ${courseName}`,
          order_id: order.id,
          handler: async (response) => {
            try {
              await axios.post(`${API_BASE}/razorpay/capture-razorpay`, null, {
                params: {
                  paymentId: response.razorpay_payment_id,
                  orderId: response.razorpay_order_id,
                  signature: response.razorpay_signature,
                  studentId: userProfile.studentId,
                  courseName,
                  couponCode: courseData?.couponCode || null,
                  batchId: session.batchId,
                },
              });
              const check = await axios.get(`${API_BASE}/enroll/is-enrolled`, {
                params: { studentId: userProfile.studentId, courseName, batchId: session.batchId },
              });
              if (check?.data?.enrolled) {
                await axios.put(`${API_BASE}/enroll/update-payment`, {
                  studentId: userProfile.studentId,
                  courseName,
                  batchId: session.batchId,
                  amount,
                });
              } else {
                await axios.post(`${API_BASE}/enroll/add`, {
                  name: userProfile.userName || userProfile.name || "",
                  studentId: userProfile.studentId,
                  email: userProfile.email,
                  mobile,
                  course_name: courseName,
                  enroll_date: session.schedule_date,
                  week: session.week,
                  time: session.time,
                  amount,
                  mode: "Live Class",
                  type: "Live Class",
                  trainer: session.trainer || "",
                  meeting_link: session.meeting_link || "",
                  batchId: session.batchId,
                  paymentType: "PAY_NOW",
                  paymentStatus: "PAID",
                  sendEmail: !!notifyVia?.email,
                  sendWhatsApp: !!notifyVia?.whatsapp,
                  ...(session.batchId?.startsWith("SELF-") && {
                    mode: "Self-Paced Learning",
                    type: "Self-Paced Learning",
                    trainer: "Not Yet Assigned",
                    meeting_link: "www.hachion.co",
                  }),
                });
              }
              setEnrollSuccessMessage("Payment successful!");
              setNavState(`/payment/${slug}`, {
                selectedBatchData: {
                  schedule_course_name: courseName,
                  trainer_name: session.trainer || "",
                  schedule_date: session.schedule_date || "",
                  schedule_time: session.time || "",
                  schedule_mode: session.mode || "Live Training",
                  duration: session.duration || "60 min",
                  batchId: session.batchId,
                },
                modeType: "live",
                sendEmail: true,
                sendWhatsApp: true,
                sendText: false,
                email: userProfile.email,
              });
              router.push(`/payment/${slug}`);
            } catch (err) {
              console.error(err);
              setEnrollErrorMessage("❌ Payment verification failed.");
            }
          },
          prefill: {
            name: userProfile.userName,
            email: userProfile.email,
            contact: mobile.replace("+91", ""),
          },
          theme: { color: "#3399cc" },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (err) {
        console.error(err);
        setEnrollErrorMessage("Razorpay initialization failed.");
      }
    } else {
      try {
        localStorage.setItem("studentId", userProfile.studentId);
        localStorage.setItem("courseName", courseName);
        localStorage.setItem("batchId", session.batchId);
        localStorage.setItem("selectedBatchData", JSON.stringify({ ...session, schedule_course_name: courseName, discount: 0 }));
        const returnUrl = `https://hachion.co/enroll/${slug}`;
        const paypalRes = await axios.post(`${API_BASE}/create-order`, null, { params: { amount, returnUrl } });
        const approvalUrl = paypalRes.data;
        if (typeof approvalUrl === "string" && approvalUrl.startsWith("https://www.paypal.com")) {
          window.location.href = approvalUrl;
        } else {
          setEnrollErrorMessage("❌ Unexpected PayPal response.");
        }
      } catch (err) {
        console.error(err);
        setEnrollErrorMessage("❌ Failed to start PayPal payment.");
      }
    }
  };

  const handleEnrollPayLater = async (sessionWithNotify) => {
    setEnrollSuccessMessage("");
    setEnrollErrorMessage("");
    const { notifyVia, ...session } = sessionWithNotify;
    if (!session) {
      setEnrollErrorMessage("No session selected.");
      return;
    }
    if (!userProfile?.email) {
      setEnrollErrorMessage("Please login to continue.");
      return;
    }
    const courseName = session.course_name || courseData?.courseName || courseNameForApi;
    try {
      const check = await axios.get(`${API_BASE}/enroll/is-enrolled`, {
        params: { studentId: userProfile.studentId, courseName, batchId: session.batchId },
      });
      if (check?.data?.enrolled) {
        setEnrollErrorMessage("This enrollment record already exists for Live Class in the database.");
        return;
      }

      await axios.post(`${API_BASE}/enroll/add`, {
        name: userProfile.userName || userProfile.name || "",
        studentId: userProfile.studentId,
        email: userProfile.email,
        mobile: userProfile.mobile || "",
        course_name: courseName,
        enroll_date: session.schedule_date,
        week: session.week,
        time: session.time,
        amount: 0,
        mode: "Live Class",
        type: "Live Class",
        trainer: session.trainer || "",
        meeting_link: session.meeting_link || "",
        batchId: session.batchId,
        paymentType: "PAY_LATER",
        paymentStatus: "PENDING",
        sendEmail: !!notifyVia?.email,
        sendWhatsApp: !!notifyVia?.whatsapp,
      });

      queryClient.invalidateQueries({ queryKey: ["enrollmentStatus"] });
      setEnrollSuccessMessage("Enrollment successful. Pay later enabled.");
    } catch (err) {
      console.error(err);
      setEnrollErrorMessage("Failed to enroll. Please try again.");
    }
  };

  return { handleLiveEnrollPayment, handleEnrollPayLater };
}
