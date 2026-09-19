import { SITE_ORIGIN } from "./seo";

// Shared BreadcrumbList JSON-LD builder — the CRA source hand-rolled this
// same shape separately in Terms/Privacy/RefundPolicy/AboutUs/ContactUs,
// each just swapping the label/path. `items` is [{ name, path }], "Home"
// is added automatically as position 1.
export function buildBreadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_ORIGIN}/` },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: item.name,
        item: `${SITE_ORIGIN}${item.path}`,
      })),
    ],
  };
}
