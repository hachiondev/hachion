// Scope for cookies the backend's OAuth2 success handler reads after the
// top-level navigation to ${API_BASE_URL}/oauth2/authorization/google (e.g.
// "flow", which decides Google signup vs. login).
//
// On hachion.co / test.hachion.co the API is a sibling host, so the cookie
// needs Domain=hachion.co (+ Secure). On http://localhost a browser silently
// rejects both - Domain doesn't match the host and Secure needs HTTPS - so
// the cookie never existed there and every local Google signup was treated
// as a login. Host-only is enough locally: cookies ignore ports, so one set
// by localhost:3000 is sent to the localhost:8080 backend.
export function isHachionHost() {
  const host = window.location.hostname;
  return host === "hachion.co" || host.endsWith(".hachion.co");
}

// Attributes for a Domain-shared cookie; `hachionAttrs` is used unchanged on
// hachion.co hosts so their behavior stays exactly as before.
export function sharedCookieAttrs(hachionAttrs) {
  return isHachionHost() ? hachionAttrs : "Path=/; SameSite=Lax";
}
