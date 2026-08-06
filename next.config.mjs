/** @type {import('next').NextConfig} */
const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "https://images.timthedev07.cc";
const imageHostname = new URL(imageBaseUrl).hostname;

const nextConfig = {
  pageExtensions: ["ts", "tsx"],
  images: {
    remotePatterns: [
      "i.imgur.com",
      "imgur.com",
      "raw.githubusercontent.com",
      imageHostname,
    ].map((each) => ({ hostname: each })),
  },
};

export default nextConfig;
