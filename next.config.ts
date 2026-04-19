import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/se-rate-simulator",
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_TELEMETRY_DISABLED: "1",
  },
};

export default nextConfig;
