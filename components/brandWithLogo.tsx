import { ReactNode } from "react";

interface BrandWithLogoProps {
  name: string;
  child: ReactNode;
}
export default function BrandWithLogo(props: BrandWithLogoProps) {
  return (
    <div className="w-full flex justify-between items-center gap-2 cursor-pointer bg-white rounded-md border py-2 px-3 hover:bg-gary-200">
      <span className=" font-semibold">{props.name}</span>
      {props.child}
    </div>
  );
}
