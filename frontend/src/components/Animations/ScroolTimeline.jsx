import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { cn } from "../../lib/utils";
import { Card, CardContent } from "./card";
import { Calendar } from "lucide-react";

const DEFAULT_EVENTS = [
  {
    year: "2023",
    title: "Major Achievement",
    subtitle: "Organization Name",
    description:
      "Description of the achievement or milestone reached during this time period.",
  },
  {
    year: "2022",
    title: "Important Milestone",
    subtitle: "Organization Name",
    description: "Details about this significant milestone and its impact.",
  },
  {
    year: "2021",
    title: "Key Event",
    subtitle: "Organization Name",
    description: "Information about this key event in the timeline.",
  },
];

export const ScrollTimeline = ({
  events = DEFAULT_EVENTS,
  title = "Timeline",
  subtitle = "Scroll to explore the journey",
  animationOrder = "sequential",
  cardAlignment = "alternating",
  lineColor = "bg-primary/30",
  progressIndicator = true,
  cardVariant = "default",
  cardEffect = "none",
  parallaxIntensity = 0.2,
  progressLineWidth = 2,
  progressLineCap = "round",
  dateFormat = "badge",
  revealAnimation = "fade",
  className = "",
  connectorStyle = "line",
  perspective = false,
  darkMode = false,
}) => {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const timelineRefs = useRef([]);

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  const progressHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((v) => {
      const newIndex = Math.floor(v * events.length);

      if (
        newIndex !== activeIndex &&
        newIndex >= 0 &&
        newIndex < events.length
      ) {
        setActiveIndex(newIndex);
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress, events.length, activeIndex]);

  const getCardVariants = (index) => {
    const baseDelay =
      animationOrder === "simultaneous"
        ? 0
        : animationOrder === "staggered"
          ? index * 0.2
          : index * 0.3;

    const initialStates = {
      fade: { opacity: 0, y: 20 },
      slide: {
        x:
          cardAlignment === "left"
            ? -100
            : cardAlignment === "right"
              ? 100
              : index % 2 === 0
                ? -100
                : 100,
        opacity: 0,
      },
      scale: { scale: 0.8, opacity: 0 },
      flip: { rotateY: 90, opacity: 0 },
      none: { opacity: 1 },
    };

    return {
      initial: initialStates[revealAnimation],
      whileInView: {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        rotateY: 0,
        transition: {
          duration: 0.7,
          delay: baseDelay,
        },
      },
    };
  };

  const getConnectorClasses = () => {
    const baseClasses = cn(
      "absolute left-1/2 transform -translate-x-1/2",
      lineColor,
    );

    switch (connectorStyle) {
      case "dots":
        return cn(baseClasses, "w-1 rounded-full");
      case "dashed":
        return cn(baseClasses, "w-[2px] border-l-2 border-dashed");
      default:
        return cn(baseClasses, "bg-gray-300");
    }
  };

  const getCardClasses = (index) => {
    const baseClasses = "relative z-30 rounded-lg transition-all duration-300";

    const variantClasses = {
      default: "bg-emerald-100 border shadow-sm",
      elevated: "bg-card border shadow-md",
      outlined: "bg-card/50 backdrop-blur border-2 border-primary/20",
      filled: "bg-primary/10 border border-primary/30",
    };

    const effectClasses = {
      none: "",
      glow: "hover:shadow-[0_0_15px_rgba(99,102,241,0.5)]",
      shadow: "hover:shadow-lg hover:-translate-y-1",
      bounce: "hover:scale-[1.03] hover:shadow-md active:scale-[0.97]",
    };

    const alignmentClasses =
      cardAlignment === "alternating"
        ? index % 2 === 0
          ? "lg:mr-[calc(50%+20px)]"
          : "lg:ml-[calc(50%+20px)]"
        : cardAlignment === "left"
          ? "lg:mr-auto"
          : "lg:ml-auto";

    return cn(
      baseClasses,
      variantClasses[cardVariant],
      effectClasses[cardEffect],
      alignmentClasses,
      "w-full lg:w-[calc(50%-40px)]",
    );
  };

  return (
    <div
      ref={scrollRef}
      className={cn(
        "relative min-h-screen w-full overflow-hidden",
        darkMode ? "bg-background text-foreground" : "",
        className,
      )}
    >
      <div className="text-center py-16 px-4">
        <h2 className="text-3xl md:text-5xl font-extrabold mb-4">{title}</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-gray-600">
          {subtitle}
        </p>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 ">
        <div className="relative mx-auto">
          {/* Timeline line */}
          <div
            className={cn(getConnectorClasses(), "h-full absolute top-0")}
            style={{ width: progressLineWidth }}
          />

          {/* Progress line */}
          {progressIndicator && (
            <>
              <motion.div
                className="absolute top-0 z-10"
                style={{
                  height: progressHeight,
                  width: progressLineWidth,
                  left: "50%",
                  transform: "translateX(-50%)",
                  borderRadius: progressLineCap === "round" ? "9999px" : "0px",
                  background:
                    "linear-gradient(to bottom,#22d3ee,#6366f1,#a855f7)",
                }}
              />

              {/* Moving glow */}
              <motion.div
                className="absolute z-20"
                style={{
                  top: progressHeight,
                  left: "50%",
                  translateX: "-50%",
                  translateY: "-50%",
                }}
              >
               
              </motion.div>
            </>
          )}

          <div className="relative z-20">
            {events.map((event, index) => {
              const yOffset = useTransform(
                smoothProgress,
                [0, 1],
                [parallaxIntensity * 100, -parallaxIntensity * 100],
              );

              return (
                <div
                  key={index}
                  ref={(el) => (timelineRefs.current[index] = el)}
                  className="relative flex flex-col lg:flex-row items-center mb-20 py-4"
                >
                  {/* Dot */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
                    <motion.div
                      className={`w-6 h-6 rounded-full border-4 ${
                        index <= activeIndex
                          ? "border-primary bg-background"
                          : "border-gray-300 bg-card"
                      }`}
                      animate={
                        index <= activeIndex
                          ? {
                              scale: [1, 1.3, 1],
                            }
                          : {}
                      }
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        repeatDelay: 4,
                      }}
                    />
                  </div>

                  <motion.div
                    className={cn(getCardClasses(index), "mt-12 lg:mt-0")}
                    variants={getCardVariants(index)}
                    initial="initial"
                    whileInView="whileInView"
                    style={parallaxIntensity > 0 ? { y: yOffset } : undefined}
                  >
                    <Card className="bg-background border">
                      <CardContent className="p-6">
                        <div className="flex items-center mb-2">
                          <Calendar className="h-4 w-4 mr-2 text-primary" />
                          <span className="text-sm font-bold text-primary ">
                            {event.year}
                          </span>
                        </div>

                        <h3 className="text-xl font-bold mb-1">
                          {event.title}
                        </h3>

                        {event.subtitle && (
                          <p className="text-muted-foreground font-medium mb-2">
                            {event.subtitle}
                          </p>
                        )}

                        <p className="text-muted-foreground text-gray-600">
                          {event.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
