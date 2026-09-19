"use client";

import dynamic from "next/dynamic";

// react-world-flags ships every country's flag as an inline SVG data-URI.
// Statically importing it (as each of the 6 forms using this component used
// to) pulled the whole ~3.7MB set into the shared/global bundle loaded on
// every page — including ones with no country picker at all (confirmed via
// production bundle inspection: the chunk shipped on "/" and "/login" too).
// Dynamic-importing it here gives it its own on-demand chunk, loaded only
// by the pages that actually render a country picker.
const CountryFlag = dynamic(() => import("react-world-flags"), { ssr: false });

export default CountryFlag;
