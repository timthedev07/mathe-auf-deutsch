const githubImagesUrl =
  /https:\/\/raw\.githubusercontent\.com\/timthedev07\/mathe-auf-deutsch\/[^/]+\/images\//g;

/**
 * Serve repository images from R2 when NEXT_PUBLIC_IMAGE_BASE_URL is set.
 * The bucket should contain the contents of `images/` at its root, e.g.
 * `content/20260719/IMG_6267.jpg`.
 */
export function resolveImageUrl(url: string) {
  const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL?.replace(/\/+$/, "");

  if (!imageBaseUrl) {
    return url;
  }

  return url.replace(githubImagesUrl, `${imageBaseUrl}/`);
}

export function rewriteImageUrls(content: string) {
  const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL?.replace(/\/+$/, "");

  if (!imageBaseUrl) {
    return content;
  }

  return content.replace(githubImagesUrl, `${imageBaseUrl}/`);
}
