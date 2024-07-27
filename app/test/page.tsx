"use client";
// app/page.tsx
import { useState } from "react";

export default function Home() {
  const [output, setOutput] = useState("");
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const eventSource = new EventSource(
      `/api/text?prompt=${encodeURIComponent(prompt)}`
    );

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.done) {
        console.log("Stream ended");
        eventSource.close();
      } else if (data.error) {
        console.error("Error:", data.error);
        eventSource.close();
      } else {
        setOutput((prevOutput) => prevOutput + data.content);
      }
    };

    eventSource.onerror = (error) => {
      console.error("EventSource failed:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  };

  return (
    <div>
      <h1>SSE Stream</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt"
        />
        <button type="submit">Submit</button>
      </form>
      <div id="output">{output}</div>
    </div>
  );
}
