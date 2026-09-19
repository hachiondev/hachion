import PublicProviders from "../(public)/providers";

// This route is deliberately outside the (public) group (no navbar/footer
// chrome, matching CRA's own EnquiryPage.jsx which renders standalone) —
// but it still needs react-query (useTopBarApi, getCoursesSummary), which
// (public)/layout.js normally supplies via PublicProviders. Reusing that
// same provider directly (it renders no navbar/footer JSX itself, that's
// all in (public)/layout.js) gives this route react-query without pulling
// in any of the public site's chrome.
export default function EnquiryFormLayout({ children }) {
  return <PublicProviders>{children}</PublicProviders>;
}
