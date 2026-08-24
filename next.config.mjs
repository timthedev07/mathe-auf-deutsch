/** @type {import('next').NextConfig} */
const configuredImageBaseUrl =
  process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "images.blog.timthedev07.cc";
const imageBaseUrl = /^[a-z][a-z\d+.-]*:\/\//i.test(configuredImageBaseUrl)
  ? configuredImageBaseUrl
  : `https://${configuredImageBaseUrl}`;
const imageHostname = new URL(imageBaseUrl).hostname;

const nextConfig = {
  pageExtensions: ["ts", "tsx"],
  images: {
    // Images are immutable assets already served by R2/Imgur. Serving them
    // directly avoids Vercel Image Optimization transformations entirely.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: imageHostname,
        pathname: "/content/**",
      },
      {
        protocol: "https",
        hostname: imageHostname,
        pathname: "/thumbnails/**",
      },
      {
        protocol: "https",
        hostname: "i.imgur.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
