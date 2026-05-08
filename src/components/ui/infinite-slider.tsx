"use client";

import { Children, CSSProperties, useEffect, useMemo, useState } from "react";
import { animate, motion, useMotionValue } from "motion/react";
import useMeasure from "react-use-measure";
import { cn } from "@/lib/cn";

type InfiniteSliderProps = {
  children: React.ReactNode;
  gap?: number;
  speed?: number;
  speedOnHover?: number;
  direction?: "horizontal" | "vertical";
  reverse?: boolean;
  className?: string;
  minCopies?: number;
};

const MIN_SLIDER_COPIES = 2;
const MAX_SLIDER_COPIES = 24;

export function InfiniteSlider({
  children,
  gap = 16,
  speed = 100,
  speedOnHover,
  direction = "horizontal",
  reverse = false,
  className,
  minCopies = MIN_SLIDER_COPIES,
}: InfiniteSliderProps) {
  const [currentSpeed, setCurrentSpeed] = useState(speed);
  const [viewportRef, { width: viewportWidth, height: viewportHeight }] = useMeasure();
  const [cycleRef, { width: cycleWidth, height: cycleHeight }] = useMeasure();
  const translation = useMotionValue(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [key, setKey] = useState(0);
  const childrenArray = useMemo(() => Children.toArray(children), [children]);
  const copyCount = useMemo(() => {
    const viewportSize = direction === "horizontal" ? viewportWidth : viewportHeight;
    const cycleSize = direction === "horizontal" ? cycleWidth : cycleHeight;
    const loopDistance = cycleSize + gap;
    const requestedCopies = Math.max(minCopies, MIN_SLIDER_COPIES);

    if (viewportSize <= 0 || loopDistance <= 0) {
      return Math.min(requestedCopies, MAX_SLIDER_COPIES);
    }

    return Math.min(
      Math.max(requestedCopies, Math.ceil(viewportSize / loopDistance) + 2),
      MAX_SLIDER_COPIES
    );
  }, [cycleHeight, cycleWidth, direction, gap, minCopies, viewportHeight, viewportWidth]);

  useEffect(() => {
    let controls;
    const size = direction === "horizontal" ? cycleWidth : cycleHeight;
    if (size === 0) return;

    const loopDistance = size + gap;
    const from = reverse ? -loopDistance : 0;
    const to = reverse ? 0 : -loopDistance;

    const distanceToTravel = Math.abs(to - from);
    const duration = distanceToTravel / currentSpeed;

    if (isTransitioning) {
      const remainingDistance = Math.abs(translation.get() - to);
      const transitionDuration = remainingDistance / currentSpeed;
      controls = animate(translation, [translation.get(), to], {
        ease: "linear",
        duration: transitionDuration,
        onComplete: () => {
          setIsTransitioning(false);
          setKey((prevKey) => prevKey + 1);
        },
      });
    } else {
      controls = animate(translation, [from, to], {
        ease: "linear",
        duration: duration,
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 0,
        onRepeat: () => {
          translation.set(from);
        },
      });
    }

    return () => controls?.stop();
  }, [
    key,
    translation,
    currentSpeed,
    cycleWidth,
    cycleHeight,
    gap,
    isTransitioning,
    direction,
    reverse,
  ]);

  const hoverProps = speedOnHover
    ? {
        onHoverStart: () => {
          setIsTransitioning(true);
          setCurrentSpeed(speedOnHover);
        },
        onHoverEnd: () => {
          setIsTransitioning(true);
          setCurrentSpeed(speed);
        },
      }
    : {};

  return (
    <div ref={viewportRef} className={cn("overflow-hidden", className)} data-infinite-slider-viewport>
      <motion.div
        className="flex w-max"
        data-infinite-slider-track
        style={{
          ...(direction === "horizontal"
            ? { x: translation }
            : { y: translation }),
          gap: `${gap}px`,
          flexDirection: direction === "horizontal" ? "row" : "column",
        }}
        {...hoverProps}
      >
        {Array.from({ length: copyCount }).map((_, copyIndex) => (
          <div
            key={`slider-copy-${copyIndex}`}
            ref={copyIndex === 0 ? cycleRef : undefined}
            aria-hidden={copyIndex > 0 ? true : undefined}
            className="flex shrink-0"
            data-infinite-slider-copy
            style={{
              gap: `${gap}px`,
              flexDirection: direction === "horizontal" ? "row" : "column",
            }}
          >
            {childrenArray}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export type BlurredInfiniteSliderProps = InfiniteSliderProps & {
  fadeWidth?: number;
  containerClassName?: string;
};

export function BlurredInfiniteSlider({
  children,
  fadeWidth = 80,
  containerClassName,
  ...sliderProps
}: BlurredInfiniteSliderProps) {
  const maskStyle: CSSProperties = {
    maskImage: `linear-gradient(to right, transparent, black ${fadeWidth}px, black calc(100% - ${fadeWidth}px), transparent)`,
    WebkitMaskImage: `linear-gradient(to right, transparent, black ${fadeWidth}px, black calc(100% - ${fadeWidth}px), transparent)`,
  };

  return (
    <div
      className={cn("relative w-full", containerClassName)}
      style={maskStyle}
    >
      <InfiniteSlider {...sliderProps}>{children}</InfiniteSlider>
    </div>
  );
}
