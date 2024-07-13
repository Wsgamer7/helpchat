"use client";

import { useMessage } from "@/lib/store/messages";
import Message from "./Message";
import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";

export default function ListMessgages() {
  const [userScroll, setUserScroll] = useState(false);
  const messages = useMessage((state) => state.messages);
  const scrollRef = useRef() as React.MutableRefObject<HTMLDivElement>;

  const handleOnScroll = () => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      const isScroll =
        scrollContainer.scrollTop <
        scrollContainer.scrollHeight - scrollContainer.clientHeight - 10;
      setUserScroll(isScroll);
    }
  };
  const scrollDown = () => {
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  };
  useEffect(() => {
    scrollDown();
  }, [messages]);
  return (
    <div
      className="flex-1 h-full flex flex-col overflow-y-scroll"
      ref={scrollRef}
      onScroll={handleOnScroll}
    >
      {messages.map((value, index) => (
        <Message message={value} key={index} />
      ))}
      {userScroll && (
        <div
          className="bottom-[6.5rem] md:bottom-[8rem] left-1/2 absolute"
          onClick={scrollDown}
        >
          <div className="w-10 h-10 bg-blue-500 text-white rounded-full transition-all justify-center items-center border cursor-pointer flex hover:scale-110  mx-auto">
            <ArrowDown />
          </div>
        </div>
      )}
    </div>
  );
}
