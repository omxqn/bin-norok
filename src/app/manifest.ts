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
    icons: [
      {
        src: "/logo.jpeg",
        sizes: "512x512",
        type: "image/jpeg",
        purpose: "any",
      },
    ],
  };
}
