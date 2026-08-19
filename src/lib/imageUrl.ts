const repositoryImagePath = /^\/?(?:content|thumbnails)\//;
const defaultImageBaseUrl = "https://images.blog.timthedev07.cc";

function getImageBaseUrl() {
  const configuredImageBaseUrl =
    process.env.NEXT_PUBLIC_IMAGE_BASE_URL?.trim() || defaultImageBaseUrl;

  const imageBaseUrl = /^[a-z][a-z\d+.-]*:\/\//i.test(configuredImageBaseUrl)
    ? configuredImageBaseUrl
    : `https://${configuredImageBaseUrl}`;

  return imageBaseUrl.replace(/\/+$/, "");
}

/**
 * Serve repository images from the configured image bucket.
 * The bucket should contain the contents of `images/` at its root, e.g.
 * `content/20260719/IMG_6267.jpg`.
 */
export function resolveImageUrl(url: string) {
  const imageBaseUrl = getImageBaseUrl();

  if (!imageBaseUrl || !url) {
    return url;
  }

  return repositoryImagePath.test(url)
    ? `${imageBaseUrl}/${url.replace(/^\/+/, "")}`
    : url;
}

export function rewriteImageUrls(content: string) {
  const imageBaseUrl = getImageBaseUrl();

  if (!imageBaseUrl) {
    return content;
  }

  return content.replace(
    /(\bsrc=["'])(\/?(?:content|thumbnails)\/)/g,
    `$1${imageBaseUrl}/$2`,
  );
}
