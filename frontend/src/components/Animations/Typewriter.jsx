import { useEffect, useMemo, useState } from "react";

const Typewriter = ({
  children,
  speed = 40,
  delay = 0,
  highlightWords = [],
  highlightClass = "text-emerald-600 font-semibold",
  showCursor = false,
}) => {
  const text = useMemo(() => {
    return typeof children === "string" ? children : children?.toString() || "";
  }, [children]);

  const [visibleCount, setVisibleCount] = useState(0);

  // reset saat text berubah
  useEffect(() => {
    setVisibleCount(0);
  }, [text]);

  useEffect(() => {
    if (!text) return;

    let interval;

    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        setVisibleCount((prev) => {
          if (prev >= text.length) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    }, delay);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, speed, delay]);

  const characters = useMemo(() => text.split(""), [text]);

  // highlight multiple occurrence
  const highlightRanges = useMemo(() => {
    const ranges = [];
    highlightWords.forEach((word) => {
      if (!word) return;
      let startIndex = 0;
      while (startIndex < text.length) {
        const foundIndex = text.indexOf(word, startIndex);
        if (foundIndex === -1) break;
        ranges.push({ start: foundIndex, end: foundIndex + word.length });
        startIndex = foundIndex + word.length;
      }
    });
    return ranges;
  }, [text, highlightWords]);

  const isCharHighlighted = (index) =>
    highlightRanges.some((range) => index >= range.start && index < range.end);

  return (
    <span className="whitespace-pre-wrap break-words leading-normal">
      {characters.map((char, index) => {
        const isVisible = index < visibleCount;
        const isHighlighted = isCharHighlighted(index);

        return (
          <span
            key={index}
            className={`
              inline relative
              transform-gpu
              transition-all duration-300
              ease-[cubic-bezier(0.22,1,0.36,1)]
              ${
                isVisible
                  ? "opacity-100 top-0 scale-100 blur-0"
                  : "opacity-0 top-[6px] scale-95 blur-[1px]"
              }
              ${isHighlighted ? highlightClass : ""}
            `}
          >
            {char}
          </span>
        );
      })}

      {/* Cursor */}
      {showCursor && visibleCount < text.length && (
        <span className="inline-block ml-1 animate-pulse text-emerald-600">
          |
        </span>
      )}
    </span>
  );
};

export default Typewriter;
