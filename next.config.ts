import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Clickjacking: don't let the admin login/dashboard be framed by another site.
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // Stop browsers from MIME-sniffing responses away from the declared Content-Type.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Don't leak the full referring URL (which can contain query params) to third-party origins.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Disable APIs this site never uses, even if a compromised script tried to.
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
