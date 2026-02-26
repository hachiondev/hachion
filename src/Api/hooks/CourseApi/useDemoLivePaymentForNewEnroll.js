import { useMemo, useEffect } from "react";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://api.test.hachion.co";

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

export function useDemoLivePaymentForNewEnroll({
  courseData,
  userProfile,
  courseNameForApi,
  setEnrollSuccessMessage,
  setEnrollErrorMessage,
}) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();


  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get("status");
    const orderId = urlParams.get("token");

    if (status === "success" && orderId) {
      handleCapturePayPalOrder(orderId);
    } else if (status === "cancel") {
      setEnrollErrorMessage("❌ Payment was cancelled.");
      setEnrollSuccessMessage("");
    }
  }, []);

  const amount = useMemo(() => {
    return (
      courseData?.itotal ??
      courseData?.iamount ??
      courseData?.total ??
      courseData?.amount ??
      0
    );
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
        params: {
          orderId,
          studentId,
          courseName,
          batchId,
          discount: selectedBatchData?.discount ?? 0,
        },
      });

      // cleanup
      localStorage.removeItem("studentId");
      localStorage.removeItem("courseName");
      localStorage.removeItem("batchId");
      localStorage.removeItem("selectedBatchData");

      setEnrollSuccessMessage("✅ Payment successful!");

      const slug = courseName.toLowerCase().replace(/\s+/g, "-");

      navigate(`/payment/${slug}`, {
        state: {
          selectedBatchData,
          modeType: "live",
          sendEmail: true,
          sendWhatsApp: true,
          sendText: false,
          email: userProfile?.email,
        },
      });
    } catch (err) {
      console.error(err);
      setEnrollErrorMessage("❌ Failed to complete PayPal payment.");
    }
  };


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
    const courseName =
      session.course_name || courseData?.courseName || courseNameForApi;

    /* ======================================================
       ✅ ADD-ONLY: SELF-PACED SAFETY (NO LIVE IMPACT)
       - ensures enroll_date + time exist
       - ensures timezone for backend parser
    ====================================================== */
    if (session.batchId?.startsWith("SELF-")) {
      const now = new Date();

      session.schedule_date =
        session.schedule_date || now.toISOString().split("T")[0];

      session.time =
        session.time ||
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

      if (!/\b(IST|UTC|GMT)\b/.test(session.time)) {
        session.time = `${session.time} IST`;
      }
    }
    /* ====================================================== */


    
    if (!notifyVia?.isPayNow) {
      try {
        const check = await axios.get(`${API_BASE}/enroll/is-enrolled`, {
          params: {
            studentId: userProfile.studentId,
            courseName,
            batchId: session.batchId,
          },
        });

        if (check?.data?.enrolled) {
          setEnrollErrorMessage("You are already enrolled for this batch.");
          return;
        }
      } catch {}
    }

    /* ================= LIVE DEMO (UNCHANGED) ================= */
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

    /* ================= RAZORPAY FLOW (UNCHANGED) ================= */
    if (mobile.startsWith("+91")) {
      try {
        const orderRes = await axios.post(
          `${API_BASE}/razorpay/create-razorpay-order`,
          null,
          {
            params: {
              amount,
              studentId: userProfile.studentId,
              courseName,
              batchId: session.batchId,
            },
          }
        );

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
              await axios.post(
                `${API_BASE}/razorpay/capture-razorpay`,
                null,
                {
                  params: {
                    paymentId: response.razorpay_payment_id,
                    orderId: response.razorpay_order_id,
                    signature: response.razorpay_signature,
                    studentId: userProfile.studentId,
                    courseName,
                    batchId: session.batchId,
                  },
                }
              );

              const check = await axios.get(
                `${API_BASE}/enroll/is-enrolled`,
                {
                  params: {
                    studentId: userProfile.studentId,
                    courseName,
                    batchId: session.batchId,
                  },
                }
              );

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
                  sendEmail: true,
                  sendWhatsApp: true,

                  /* ===== ADD-ONLY OVERRIDE FOR SELF-PACED ===== */
                  ...(session.batchId?.startsWith("SELF-") && {
                    mode: "Self-Paced Learning",
                    type: "Self-Paced Learning",
                    trainer: "Not Yet Assigned",
                    meeting_link: "www.hachion.co",
                  }),
                  /* =========================================== */
                });
              }

              setEnrollSuccessMessage("Payment successful!");

              navigate(`/payment/${slug}`, {
                state: {
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
                },
              });
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
  // ================= PAYPAL FLOW (FOR USA / NON-INDIA) =================
  try {
    // Save required info for return capture (same as old Enrollment page)
    localStorage.setItem("studentId", userProfile.studentId);
    localStorage.setItem("courseName", courseName);
    localStorage.setItem("batchId", session.batchId);
    localStorage.setItem(
      "selectedBatchData",
      JSON.stringify({
        ...session,
        schedule_course_name: courseName,
        discount: 0,
      })
    );

    const slug = courseName.toLowerCase().replace(/\s+/g, "-");
    const returnUrl = `https://hachion.co/enroll/${slug}`;

    const paypalRes = await axios.post(`${API_BASE}/create-order`, null, {
      params: {
        amount,
        returnUrl,
      },
    });

    const approvalUrl = paypalRes.data;

    if (typeof approvalUrl === "string" && approvalUrl.startsWith("https://www.paypal.com")) {
      window.location.href = approvalUrl; // 🔁 Redirect to PayPal
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

  const courseName =
    session.course_name || courseData?.courseName || courseNameForApi;

  try {
    // 🔒 FINAL SAFETY CHECK
    const check = await axios.get(`${API_BASE}/enroll/is-enrolled`, {
      params: {
        studentId: userProfile.studentId,
        courseName,
        batchId: session.batchId,
      },
    });

    if (check?.data?.enrolled) {
      setEnrollErrorMessage(
        "This enrollment record already exists for Live Class in the database."
      );
      return;
    }

    // ✅ DIRECT ENROLL (NO RAZORPAY)
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

// 🔥 IMPORTANT: force re-check of enrollment status
queryClient.invalidateQueries({ queryKey: ["enrollmentStatus"] });

    setEnrollSuccessMessage("Enrollment successful. Pay later enabled.");

  } catch (err) {
    console.error(err);
    setEnrollErrorMessage("Failed to enroll. Please try again.");
  }
};
  return {
    handleLiveEnrollPayment,
    handleEnrollPayLater
  };
}
