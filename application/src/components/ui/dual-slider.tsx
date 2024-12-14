"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

interface DualSliderProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>,
    "value" | "defaultValue"
  > {
  className?: string;
  defaultValue?: [number, number];
  value?: [number, number];
  formatValue?: (value: number) => string;
  onValueChange?: (value: [number, number]) => void;
}

const DualSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  DualSliderProps
>(({ className, formatValue = (v) => `$${v}`, ...props }, ref) => (
  <div className="space-y-4">
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-secondary">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      {/* First Thumb */}
      <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
      {/* Second Thumb */}
      <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
    </SliderPrimitive.Root>
    <div className="flex justify-between px-1">
      <span className="text-sm text-muted-foreground">
        {formatValue(props.value?.[0] ?? props.defaultValue?.[0] ?? 0)}
      </span>
      <span className="text-sm text-muted-foreground">
        {formatValue(props.value?.[1] ?? props.defaultValue?.[1] ?? 100)}
      </span>
    </div>
  </div>
));
DualSlider.displayName = "DualSlider";

export { DualSlider };
