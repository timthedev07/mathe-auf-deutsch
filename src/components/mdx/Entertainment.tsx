import { FC } from "react";
import { ImageWithSkeleton } from "../ImageWithSkeleton";
import { resolveImageUrl } from "../../lib/imageUrl";
import { Star } from "lucide-react";

type EntertainmentGenre =
  | "action"
  | "comedy"
  | "drama"
  | "horror"
  | "sci-fi"
  | "fantasy"
  | "romance"
  | "thriller"
  | "mystery"
  | "animation"
  | "documentary"
  | "biography"
  | "crime"
  | "family"
  | "musical"
  | "war"
  | "western";

const translateGenre = (genre: EntertainmentGenre): string => {
  switch (genre) {
    case "action":
      return "Action";
    case "comedy":
      return "Komödie";
    case "drama":
      return "Drama";
    case "horror":
      return "Horror";
    case "sci-fi":
      return "Science-Fiction";
    case "fantasy":
      return "Fantasy";
    case "romance":
      return "Romanze";
    case "thriller":
      return "Thriller";
    case "mystery":
      return "Mystery";
    case "animation":
      return "Animation";
    case "documentary":
      return "Dokumentation";
    case "biography":
      return "Biografie";
    case "crime":
      return "Krimi";
    case "family":
      return "Familie";
    case "musical":
      return "Musical";
    case "war":
      return "Krieg";
    case "western":
      return "Western";
    default:
      return genre;
  }
};

interface EntertainmentProps {
  name: string;
  year: number;
  type: "film" | "series";
  /* under the current cloudflare setup, this is a path to the image */
  /* e.g. content/20261108/cover.jpeg */
  thumbnail: {
    path: string;
    width: number;
    height: number;
  };
  genre: EntertainmentGenre[];
  rating: 1 | 2 | 3 | 4 | 5;
}

export const Entertainment: FC<EntertainmentProps> = ({
  name,
  thumbnail: { height, path, width },
  rating,
  genre,
  type,
  year,
}) => {
  return (
    <div className="glass bg-slate-700/20 border-slate-400/20 border rounded-xl px-12 py-8 w-fit">
      <div className="flex gap-6 md:flex-row flex-col items-center">
        <div className="max-w-[100px]">
          <ImageWithSkeleton
            src={resolveImageUrl(path)}
            alt={name}
            width={width}
            height={height}
            className="rounded-lg"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="font-semibold text-lg">{name}</div>
          <div>
            <span className="text-slate-400/80 text-sm">
              {type === "film" ? "Film | " : "Serie | "}
            </span>
            {genre.map((g, i) => (
              <span className="text-slate-400/80 text-sm" key={g}>
                {translateGenre(g)}
                {i < genre.length - 1 ? ", " : ""}
              </span>
            ))}
          </div>
          <span className="text-slate-400/80 text-sm">Jahr: {year}</span>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) =>
              i < rating ? (
                <Star
                  key={i}
                  className="w-4 h-4 text-yellow-400 fill-yellow-400"
                />
              ) : (
                <Star
                  key={i}
                  className="w-4 h-4 text-slate-400/40  stroke-[1px]"
                />
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
