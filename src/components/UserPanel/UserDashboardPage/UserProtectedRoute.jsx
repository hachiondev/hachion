"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "../Common/Loader/Loader";

// Client-side auth guard for /userdashboard, mirroring the CRA app's
// UserProtectedRoute.js: no server-side session exists for this app, so
// authorization is decided by the presence of localStorage.loginuserData.
export default function UserProtectedRoute({ children }) {
  const router = useRouter();
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    const loginUserData = localStorage.getItem("loginuserData");
    if (loginUserData) {
      setStatus("authorized");
    } else {
      setStatus("redirecting");
      router.replace("/login");
    }
  }, [router]);

  if (status !== "authorized") {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
        <Loader />
      </div>
    );
  }

  return children;
}
