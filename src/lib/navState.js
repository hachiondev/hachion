// react-router's navigate(path, { state }) has no App Router equivalent —
// this app's course-details payment hooks (useDemoLivePayment,
// useDemoLivePaymentForNewEnroll) already write the handoff data into
// sessionStorage keyed by the destination path before calling router.push;
// this is the matching read-once-and-clear side for the destination pages
// (enroll-now, enroll-self, installments, payment) to consume it with.
export function getNavState(pathname) {
  if (typeof window === "undefined") return null;
  const key = `navState:${pathname}`;
  const raw = sessionStorage.getItem(key);
  if (!raw) return null;
  sessionStorage.removeItem(key);
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setNavState(pathname, state) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(`navState:${pathname}`, JSON.stringify(state));
}
