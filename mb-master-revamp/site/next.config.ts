import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: produces a plain out/ folder of HTML, CSS and JS that any
  // Apache or LiteSpeed host serves directly. No Node runtime on the server.
  output: "export",

  // Apache serves /path/ -> /path/index.html cleanly with this on.
  trailingSlash: true,

  // The export target has no image optimiser. Nothing here uses next/image
  // yet, but this keeps the door open without breaking the build.
  images: { unoptimized: true },
};

export default nextConfig;
