import { useEffect, useRef, useState } from "react";

const FadeSlide = ({ children, direction = "left", delay = 0 }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 },
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  const directionClass = {
    left: "-translate-x-10",
    right: "translate-x-10",
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out
        ${isVisible ? "opacity-100 translate-x-0" : `opacity-0 ${directionClass[direction]}`}
      `}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default FadeSlide;
