"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type ImageWithSkeletonProps = ImageProps & {
  skeletonClassName?: string;
};

export function ImageWithSkeleton({
  className,
  fill,
  onError,
  onLoad,
  skeletonClassName,
  ...props
}: ImageWithSkeletonProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <span
      className={
        fill
          ? "absolute inset-0 block overflow-hidden"
          : "relative block w-full overflow-hidden"
      }
      style={fill ? undefined : { aspectRatio: `${props.width}/${props.height}` }}
    >
      <span
        aria-hidden="true"
        className={`image-skeleton absolute inset-0 z-10 transition-opacity duration-500 ${
          isLoaded ? "pointer-events-none opacity-0" : "opacity-100"
        } ${skeletonClassName || ""}`}
      />
      <Image
        {...props}
        fill={fill}
        className={`transition-opacity duration-500 ${
          isLoaded ? "opacity-100" : "opacity-0"
        } ${className || ""}`}
        onLoad={(event) => {
          setIsLoaded(true);
          onLoad?.(event);
        }}
        onError={(event) => {
          setIsLoaded(true);
          onError?.(event);
        }}
      />
    </span>
  );
}
