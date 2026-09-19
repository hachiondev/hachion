// Word/Google Docs paste artifact: their clipboard HTML represents plain
// inter-word spaces as &nbsp; (U+00A0), and the admin blog editor (Quill)
// carries that straight through into the saved HTML with no cleanup. A
// paragraph where nearly every space is non-breaking has no real wrap
// points left, so the browser is forced to break mid-word to avoid
// overflowing instead of wrapping between words.
//
// Only a LONE U+00A0 - one that isn't part of a run of 2+, which is left
// alone as probably-intentional indentation/spacing - is converted back to
// a normal breakable space. This runs on text-node values only (via
// DOMParser), so tag structure, attributes (hrefs, image src), and
// <pre>/<code> contents are never touched. Using the \u00A0 escape (rather
// than a literal non-breaking-space character) keeps this source file
// unambiguous or byte-for-byte on any editor/OS.
const NBSP = "\u00A0";
const LONE_NBSP = new RegExp(`(?<!${NBSP})${NBSP}(?!${NBSP})`, "g");

export function normalizeRichText(html) {
  if (!html || typeof window === "undefined" || typeof DOMParser === "undefined") {
    return html;
  }

  const doc = new DOMParser().parseFromString(html, "text/html");
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  let node;
  while ((node = walker.nextNode())) {
    if (node.parentElement?.closest("pre, code")) continue;
    if (node.nodeValue.indexOf(NBSP) === -1) continue;
    textNodes.push(node);
  }
  textNodes.forEach((n) => {
    n.nodeValue = n.nodeValue.replace(LONE_NBSP, " ");
  });

  return doc.body.innerHTML;
}

export default normalizeRichText;
