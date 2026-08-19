"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type ImageWithSkeletonProps = ImageProps & {
  skeletonClassName?: string;
  rotate?: number;
};

export function ImageWithSkeleton({
  className,
  fill,
  onError,
  onLoad,
  onLoadingComplete,
  skeletonClassName,
  rotate,
  style,
  ...props
}: ImageWithSkeletonProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const width = Number(props.width);
  const height = Number(props.height);
  const isQuarterTurn =
    rotate !== undefined && Math.abs(Math.round(rotate / 90)) % 2 === 1;
  const canTransposeFrame = isQuarterTurn && width > 0 && height > 0;
  const imageStyle = canTransposeFrame
    ? {
        ...style,
        position: "absolute" as const,
        top: "50%",
        left: "50%",
        width: `${(width / height) * 100}%`,
        height: "auto",
        maxWidth: "none",
        transform: `translate(-50%, -50%)${style?.transform ? ` ${style.transform}` : ""} rotate(${rotate}deg)`,
      }
    : rotate === undefined
      ? style
      : {
          ...style,
          transform: `${style?.transform ? `${style.transform} ` : ""}rotate(${rotate}deg)`,
        };

  return (
    <span
      className={
        fill
          ? "absolute inset-0 block overflow-hidden"
          : "relative block w-full overflow-hidden"
      }
      style={
        fill
          ? undefined
          : {
              aspectRatio: canTransposeFrame
                ? `${height}/${width}`
                : `${width}/${height}`,
            }
      }
    >
      <span
        aria-hidden="true"
        className={`image-skeleton absolute inset-0 rounded-lg transition-opacity duration-500 ${
          isLoaded ? "pointer-events-none opacity-0" : "opacity-100"
        } ${skeletonClassName || ""}`}
      />
      <Image
        {...props}
        fill={fill}
        style={imageStyle}
        className={`relative ${className || ""}`}
        onLoad={(event) => {
          setIsLoaded(true);
          onLoad?.(event);
        }}
        onLoadingComplete={(image) => {
          setIsLoaded(true);
          onLoadingComplete?.(image);
        }}
        onError={(event) => {
          setIsLoaded(true);
          onError?.(event);
        }}
      />
    </span>
  );
}
