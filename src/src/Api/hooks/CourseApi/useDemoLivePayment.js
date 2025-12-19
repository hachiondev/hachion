import { useMemo } from "react";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";

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

export function useDemoLivePayment({
  courseData,
  userProfile,
  courseNameForApi,
  setEnrollSuccessMessage,
  setEnrollErrorMessage,
}) {
  const queryClient = useQueryClient();

  const amount = useMemo(() => {
    return (
      courseData?.itotal ??
      courseData?.iamount ??
      courseData?.total ??
      courseData?.amount ??
      0
    );
  }, [courseData]);

  const handleLiveEnrollPayment = async (session) => {
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
          sendEmail: true,
          sendWhatsApp: true,
        });

        queryClient.invalidateQueries([
          "check-enrollment",
          courseName,
        ]);

        setEnrollSuccessMessage("Demo enrollment successful!");
      } catch {
        setEnrollErrorMessage("Failed to enroll for demo.");
      }
      return;
    }


    const slug = courseName.toLowerCase().replace(/\s+/g, "-");
    const returnUrl = `https://hachion.co/enroll/${slug}`;

    
    if (mobile.startsWith("+91")) {
      try {
        
        const orderRes = await axios.post(
          `${API_BASE}/razorpay/create-razorpay-order`,
          null,
          {
            params: { amount },
          }
        );

        const order = orderRes.data;

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

              setEnrollSuccessMessage("Payment successful!");
            } catch (err) {
              setEnrollErrorMessage(
                "❌ Payment verification failed."
              );
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

      return;
    }


    try {
      const paypal = await axios.post(
        `${API_BASE}/create-order`,
        null,
        { params: { amount, returnUrl } }
      );

      if (paypal.data.startsWith("https://www.paypal.com")) {
        window.location.href = paypal.data;
      } else {
        setEnrollErrorMessage("Unexpected PayPal response.");
      }
    } catch (err) {
      console.error(err);
      setEnrollErrorMessage("Paypal order creation failed.");
    }
  };
  const handleEnrollPayLater = async (session) => {
  try {
    const payload = {
      
      studentId: userProfile.studentId,
      name: userProfile.userName || userProfile.name || "",
      email: userProfile.email,
      mobile: userProfile.mobile || "",

      course_name: courseNameForApi,
      enroll_date: session.schedule_date,
      time: session.time,
      mode: "Live Class",
      amount: 0,

      trainer: session.trainer || "",
      meeting_link: session.meeting_link || "",
      batchId: session.batchId,
      sendEmail: true,
      sendWhatsApp: true,
      sendText: false,
      paymentType: "PAY_LATER",
      paymentStatus: "PENDING",
    };

    await axios.post(`${API_BASE}/enroll/add`, payload);

    setEnrollSuccessMessage(
      "Enrollment successful. You can complete the payment later."
    );
  } catch (error) {
    setEnrollErrorMessage(
      error?.response?.data || "Enrollment failed"
    );
  }
};



  return {
    handleLiveEnrollPayment,
    handleEnrollPayLater
  };
}
