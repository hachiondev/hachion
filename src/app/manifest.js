// Ported from the CRA app's public/manifest.json. Next.js's file-convention
// (MetadataRoute.Manifest) auto-serves this at /manifest.webmanifest — this
// file didn't exist at all in the Next.js app until now.
export default function manifest() {
  return {
    name: "Hachion: Your Learning Partner",
    short_name: "Hachion",
    icons: [
      { src: "/Hachion-logo.png", sizes: "64x64 32x32 24x24 16x16", type: "image/png" },
      { src: "/Hachion-logo.png", sizes: "192x192", type: "image/png" },
      { src: "/Hachion-logo.png", sizes: "512x512", type: "image/png" },
    ],
    start_url: ".",
    display: "standalone",
    theme_color: "#000000",
    background_color: "#ffffff",
  };
}
