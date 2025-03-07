import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Baaki",
    short_name: "Baaki",
    description: "Revolutionizing digital credit systems",
    start_url: "/home",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/android/android-launchericon-48-48.png",
        sizes: "48x48",
      },
      {
        src: "/android/android-launchericon-72-72.png",
        sizes: "72x72",
      },
      {
        src: "/android/android-launchericon-96-96.png",
        sizes: "96x96",
      },
      {
        src: "/android/android-launchericon-144-144.png",
        sizes: "144x144",
      },
      {
        src: "/android/android-launchericon-192-192.png",
        sizes: "192x192",
      },
      {
        src: "/android/android-launchericon-512-512.png",
        sizes: "512x512",
      },
    ],
  };
}
