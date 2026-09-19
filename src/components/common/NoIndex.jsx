import { Helmet } from "react-helmet-async";

// Drop into any internal/admin-only page so it's excluded from Google's
// index even though the route itself isn't behind an auth wall.
const NoIndex = () => (
  <Helmet>
    <meta name="robots" content="noindex, nofollow" />
  </Helmet>
);

export default NoIndex;
