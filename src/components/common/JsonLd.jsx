// Server-rendered JSON-LD <script> tag. Plain server component (no
// "use client") so the schema ships in the initial HTML for crawlers,
// matching what react-helmet-async used to inject client-side in the
// CRA app. `<` is escaped so a value can never prematurely close the
// surrounding <script> tag.
//
// Multiple schemas are serialized as a single JSON array in one <script>
// tag (a valid JSON-LD pattern — schema.org/Google both accept an array
// of top-level items in one block) rather than one <script> per schema.
export default function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
