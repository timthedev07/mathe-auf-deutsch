import { FC } from "react";
import Image from "next/image";

interface ImgProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  width: number;
  height: number;
}

export const Img: FC<ImgProps> = ({ alt, src, height, width, ...props }) => {
  return (
    <div className="relative max-w-[600px] mx-auto my-4">
      <Image
        width={width}
        height={height}
        className="rounded-lg"
        src={src || ""}
        alt={alt || ""}
        {...props}
      />
    </div>
  );
};