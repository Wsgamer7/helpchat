import Image from "next/image";
import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <div className="flex flex-col h-screen mx-5 my-2">
      <div className="flex-initial">
        <Navbar />
      </div>
      <div className="flex-1 overflow-hidden h-full">meg input</div>
    </div>
  );
}
