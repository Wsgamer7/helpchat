"use client";

import { useMessage } from "@/lib/store/messages";
import Message from "./Message";
import { useEffect, useRef } from "react";

export default function ListMessgages() {
  const messages = useMessage((state) => state.messages);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages]);
  return (
    <div className="flex-1 h-full flex flex-col  overflow-y-scroll ">
      {messages.map((value, index) => (
        <Message message={value} key={index} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
