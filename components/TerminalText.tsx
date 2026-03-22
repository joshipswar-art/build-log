"use client";

import { useEffect, useState } from "react";

export function TerminalText({ text, charDelay = 110 }: { text: string; charDelay?: number }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, charDelay);
    return () => clearInterval(interval);
  }, [text, charDelay]);

  return (
    <>
      <style>{`
        @keyframes blink-cursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .blink-cursor {
          animation: blink-cursor 1s step-end infinite;
        }
      `}</style>
      <span>
        {displayed}
        <span className="blink-cursor">_</span>
      </span>
    </>
  );
}
