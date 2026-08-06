/** @type {import('next').NextConfig} */
const configuredImageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "images.timthedev07.cc";
const imageBaseUrl = /^[a-z][a-z\d+.-]*:\/\//i.test(configuredImageBaseUrl)
  ? configuredImageBaseUrl
  : `https://${configuredImageBaseUrl}`;
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
