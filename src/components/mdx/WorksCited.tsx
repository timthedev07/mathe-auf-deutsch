import Link from "next/link";
import { FC } from "react";

interface WorksCitedProps {
  worksCited: string[];
}

export const WorksCited: FC<WorksCitedProps> = ({ worksCited }) => {
  return (
    <ol className="pl-4">
      {worksCited.map((each, ind) => (
        <li className="flex" key={each}>
          <div className="w-8 font-sans">[{ind + 1}]</div>
          <Link className="text-cyan-600" href={each}>
            {each}
          </Link>
        </li>
      ))}
    </ol>
  );
};

export const InTextRef: FC<{ id: number }> = ({ id }) => {
  return <sup className="text-blue-400">[{id}]</sup>;
};
