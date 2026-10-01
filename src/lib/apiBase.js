// Backend API origin for every frontend call to the Spring Boot API. Set
// NEXT_PUBLIC_API_BASE_URL at BUILD time (Next inlines NEXT_PUBLIC_* into
// the client bundle), e.g.
//   local: http://localhost:8080          (next dev only, via .env.development.local;
//                                          backend run with the `dev` Spring profile)
//   test:  https://api.test.hachion.co    (must be set when building for test.hachion.co)
//   prod:  unset (defaults to https://api.hachion.co)
// next.config.mjs reads the same variable so the CSP connect-src allows
// whichever origin is chosen - keep the default in sync with that file.
export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.hachion.co").replace(/\/+$/, "");
