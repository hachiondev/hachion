"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

// CRA wraps the entire auth flow in a separate AuthLayout with no Footer at
// all (src/App.js: <Route element={<AuthLayout />}> covers exactly these
// paths). This app shares one layout for every (public) route, so we hide
// Footer on this same path list rather than changing Footer visibility
// anywhere else. (/confirm-otp and /resetpassword exist in CRA but have no
// equivalent route here — that flow is handled as state within
// /forgotpassword — so they're omitted.)
const HIDDEN_ON = [
  "/login",
  "/register",
  "/registerhere",
  "/registerverification",
  "/forgotpassword",
  "/phone-number",
];

export default function ConditionalFooter() {
  const pathname = usePathname();
  if (HIDDEN_ON.includes(pathname)) return null;
  return <Footer />;
}
