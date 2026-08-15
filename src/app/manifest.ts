import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bin Norouk Museum | متحف بن نوروك",
    short_name: "Bin Norouk",
    description:
      "Memory of Sohar and Omani Heritage | ذاكرة صحار وتراث البيت العماني",
    start_url: "/ar",
    display: "standalone",
    background_color: "#f7f2e8",
    theme_color: "#453723",
    lang: "ar",
    dir: "rtl",
    // logo.jpeg was declared 512x512 but is actually a 768x1364 photo, so
    // installed-app icons were stretched. These are square PNGs generated
    // from the logo mark.
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
