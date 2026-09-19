import PublicProviders from "./providers";
import Topbar from "@/components/Layout/Topbar";
import NavbarTop from "@/components/Layout/Navbar/NavbarTop";
import ConditionalFooter from "@/components/Layout/ConditionalFooter";
import QueryFormWidgetLoader from "@/components/UserPanel/HomePage/QueryFormWidget/QueryFormWidgetLoader";

// ConditionalFooter plainly imports Footer (not next/dynamic) and hides it
// only on /registerverification, matching CRA's separate AuthLayout there.
// Footer's own 3 API calls (useTopBarApi/useTrendingData/
// useGeoKeywordsByCourse) still fire from useEffect after mount either way —
// code-splitting the component itself only changes whether its JS ships in
// the initial bundle, and that saving isn't worth what it cost: wrapping
// Footer in next/dynamic makes it a real async Suspense/streaming boundary,
// and once the Home page (see app/(public)/page.js) grew enough content
// ahead of it, that boundary intermittently raced with hydration and threw
// a React #418 text-mismatch error — confirmed by isolating it to exactly
// this dynamic() call across repeated production-build runs.

export default function PublicLayout({ children }) {
  return (
    <PublicProviders>
      <div className="layout-wrapper">
        <Topbar />
        <NavbarTop />

        {/* Not a <main> tag - the root layout already provides the page's
            one <main> landmark; nesting a second one here would be invalid
            HTML/an accessibility regression. */}
        <div className="layout-content">{children}</div>

        <ConditionalFooter />
      </div>

      {/* Deferred until idle + code-split — see QueryFormWidgetLoader.
          This layout only wraps routes under (public), so it never mounts
          on any admin route (admindashboardview, admincourse, reports,
          etc.), which live outside this route group entirely. */}
      <QueryFormWidgetLoader />
    </PublicProviders>
  );
}
