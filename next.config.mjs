/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx"],
  images: {
    remotePatterns: [
      "i.imgur.com",
      "imgur.com",
      "raw.githubusercontent.com",
    ].map((each) => ({ hostname: each })),
  },
};

export default nextConfig;
