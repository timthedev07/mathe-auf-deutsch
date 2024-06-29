import { FC } from "react";
import Image from "next/image";
import { Tooltip } from "antd";
import Link from "next/link";
import { getBlurDataURL } from "../../lib/blur";

interface ImgProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  width: number;
  height: number;
  src: string;
  originalSource?: {
    url: string;
    author: string;
  };
}

export const Img: FC<ImgProps> = ({
  alt,
  src,
  height,
  width,
  originalSource,
  ...props
}) => {
  const I = (
    <Image
      width={width}
      height={height}
      loading="lazy"
      className="rounded-lg shadow-2xl"
      src={src || ""}
      alt={alt || ""}
      placeholder="blur"
      blurDataURL={getBlurDataURL(width, height)}
      {...props}
    />
  );
  return (
    <div className="relative lg:max-w-[500px] xl:max-w-[600px] sm:max-w-[400px] max-w-[320px] mx-auto my-4">
      {!!originalSource ? (
        <Tooltip
          title={`Klicken, um die Fundstellen zu sehen; (${originalSource.author})`}
          color="geekblue"
        >
          <Link href={originalSource.url}>{I}</Link>
        </Tooltip>
      ) : (
        I
      )}
      <div className="w-60 mx-auto md:w-72 lg:w-[600px] mt-4 italic text-white/90 text-center">
        {alt}
      </div>
    </div>
  );
};
