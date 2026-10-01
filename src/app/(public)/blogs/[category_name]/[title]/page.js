import { cache } from "react";
import { notFound, permanentRedirect } from "next/navigation";
import { buildCanonicalUrl, SITE_ORIGIN } from "@/lib/seo";
import { getBlogPath } from "@/lib/blogUrl";
import JsonLd from "@/components/common/JsonLd";
import BlogDetails from "@/components/UserPanel/BlogDetails";
import { getBlogBySlug } from "@/components/UserPanel/HomePage/TrendingBlogSection/services/blogsService";
import { extractFaqsFromHtml } from "@/lib/blogFaq";
import { API_BASE_URL } from "@/lib/apiBase";

// The bug this exists to fix: generateMetadata()/the page below used to
// build the canonical URL directly from the raw [category_name]/[title]
// route params - whatever the visitor actually requested - instead of the
// blog's own correct slug. Any URL variant that happened to still resolve
// to a real blog (the backend's shortTitle lookup is lenient) would declare
// *itself* canonical, even a malformed one like a stale/legacy URL with
// literal spaces (rendered as %20) instead of hyphens. That variant then
// has zero incoming internal links (nothing on the site ever generates URLs
// that way) and competes with the real, correctly-slugged page for the same
// content - exactly the "canonical URL has no incoming internal links"
// symptom. Slugging logic itself now lives in the shared getBlogPath() -
// see src/lib/blogUrl.js - so every place that links to a blog (sitemap,
// internal <Link>s, this redirect) agrees on one canonical URL.
const correctBlogPath = getBlogPath;

// Server-side fetch (plain fetch, not the client-side getBlogBySlug call the
// BlogDetails.jsx component makes on its own) — same lookup CRA's
// BlogDetails.jsx used: a purely-numeric last URL segment is treated as an
// id (GET /blog/:id), anything else decodes back into the space-separated
// short title (GET /blog/check/:shortTitle). Moved here per this app's
// generateMetadata()/JsonLd convention so bots get real meta tags without
// running JS — this is exactly what the CRA app's prerender/ bot-doorway
// service (nginx + a standalone Node service) existed to patch around;
// Next.js SSR retires that whole subsystem, it doesn't need porting.
// Wrapped in React's cache() so generateMetadata() and the page component
// below - which both need the same blog for the same request - collapse
// into a single backend call instead of two (Next's official pattern for
// this exact generateMetadata+page dual-fetch situation).
const fetchBlogForMetadata = cache(async (titleSlug) => {
  try {
    return await getBlogBySlug(titleSlug);
  } catch {
    return null;
  }
});

export async function generateMetadata({ params }) {
  const { category_name, title } = await params;
  const blog = await fetchBlogForMetadata(title);
  const canonicalUrl = buildCanonicalUrl(correctBlogPath(blog) || `/blogs/${category_name}/${title}`);

  const metaTitle = blog?.meta_title || "Hachion Blogs";
  const description = blog?.meta_description || "Blogs description";
  const ogImage = blog?.blog_image ? `${API_BASE_URL}/uploads/prod/blogs/${blog.blog_image}` : `${SITE_ORIGIN}/Hachion-logo.png`;
  const twitterImage = blog?.blog_image ? `${API_BASE_URL}/uploads/prod/blogs/${blog.blog_image}` : `${SITE_ORIGIN}/Hachion-logo.png`;

  return {
    title: metaTitle,
    description,
    ...(blog?.meta_keyword ? { keywords: blog.meta_keyword } : {}),
    alternates: { canonical: canonicalUrl },
    robots: { index: true, follow: true },
    openGraph: {
      type: "article",
      siteName: "Hachion",
      url: canonicalUrl,
      title: metaTitle,
      description,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      site: "@hachionofficial",
      title: metaTitle,
      description,
      images: [twitterImage],
    },
  };
}

export default async function BlogDetailsPage({ params }) {
  const { category_name, title } = await params;
  const blog = await fetchBlogForMetadata(title);

  // No blog matched this id/title at all (deleted, or a slug that never
  // existed - garbage historical URLs like "/blogs/x/hachion.co"). Without
  // this, BlogDetails.jsx's client-side "Blog post not found" fallback was
  // the only thing shown, but the page itself still returned 200 - a soft
  // 404 that tells crawlers this dead URL is real, indexable content.
  if (!blog) {
    notFound();
  }

  // The blog was found, but not at its correct URL (e.g. a stale/legacy
  // variant with literal spaces instead of hyphens) - send it to the one
  // true clean URL rather than letting this variant render and canonicalize
  // itself. Guarded so a blog whose title/shortTitle genuinely can't
  // produce a slug doesn't redirect to itself in a loop.
  const correctPath = correctBlogPath(blog);
  if (correctPath && correctPath !== `/blogs/${category_name}/${title}`) {
    permanentRedirect(correctPath);
  }

  const canonicalUrl = buildCanonicalUrl(correctPath || `/blogs/${category_name}/${title}`);
  const categoryUrl = buildCanonicalUrl(`/blogs/${category_name}`);
  const blogImage = blog?.blog_image
    ? `${API_BASE_URL}/uploads/prod/blogs/${blog.blog_image}`
    : `${SITE_ORIGIN}/Hachion-logo.png`;

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "@id": `${canonicalUrl}#blogposting`,
      headline: blog?.title || "",
      description: blog?.meta_description || "",
      image: blogImage,
      url: canonicalUrl,
      datePublished: blog?.date || "",
      dateModified: blog?.date || "",
      inLanguage: "en",
      author: { "@type": "Organization", "@id": `${SITE_ORIGIN}/#organization`, name: "Hachion" },
      publisher: {
        "@type": "EducationalOrganization",
        "@id": `${SITE_ORIGIN}/#organization`,
        name: "Hachion",
        logo: { "@type": "ImageObject", url: `${SITE_ORIGIN}/Hachion-logo.png` },
      },
      mainEntityOfPage: { "@type": "WebPage", "@id": `${canonicalUrl}#webpage` },
    },
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": `${canonicalUrl}#author`,
      name: "Hachion",
      url: `${SITE_ORIGIN}/`,
      sameAs: ["https://www.linkedin.com/company/hachion", "https://x.com/hachionofficial"],
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": `${canonicalUrl}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_ORIGIN },
        { "@type": "ListItem", position: 2, name: "Blogs", item: `${SITE_ORIGIN}/blogs` },
        { "@type": "ListItem", position: 3, name: blog?.category_name || "Blogs", item: categoryUrl },
        { "@type": "ListItem", position: 4, name: blog?.title || "Blog", item: canonicalUrl },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: blog?.title || "",
      description: blog?.meta_description || "",
      inLanguage: "en",
      breadcrumb: { "@id": `${canonicalUrl}#breadcrumb` },
      publisher: { "@id": `${SITE_ORIGIN}/#organization` },
      primaryImageOfPage: { "@type": "ImageObject", url: blogImage },
    },
    {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "@id": `${SITE_ORIGIN}/#organization`,
      name: "Hachion",
      url: `${SITE_ORIGIN}/`,
      logo: `${SITE_ORIGIN}/Hachion-logo.png`,
      image: `${SITE_ORIGIN}/industry-recognized-it-certifications.webp`,
      description: "Hachion offers professional certification online training courses authored by industry experts.",
      telephone: "+1 732-485-2499",
      email: "info@hachion.co",
      address: {
        "@type": "PostalAddress",
        streetAddress: "601 Voyage Trace",
        addressLocality: "Leander",
        addressRegion: "Texas",
        postalCode: "78641",
        addressCountry: "USA",
      },
      sameAs: [
        "https://www.facebook.com/hachion.official/",
        "https://www.instagram.com/hachion.official/",
        "https://www.linkedin.com/company/hachion",
        "https://www.youtube.com/@hachion.official",
        "https://x.com/hachionofficial",
      ],
    },
  ];

  const faqs = extractFaqsFromHtml(blog?.description);
  if (faqs.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${canonicalUrl}#faq`,
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question || "",
        acceptedAnswer: { "@type": "Answer", text: faq.answer || "" },
      })),
    });
  }

  return (
    <>
      <JsonLd data={schemas} />
      <BlogDetails initialBlog={blog} />
    </>
  );
}
