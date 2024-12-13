"use client";

import { useMemo } from "react";

interface PriceDistributionProps {
  prices: number[];
  width?: number;
  height?: number;
  className?: string;
}

export function PriceDistribution({
  prices,
  width = 300,
  height = 40,
  className,
}: PriceDistributionProps) {
  const distribution = useMemo(() => {
    if (!prices.length) return [];

    // Create bins for the distribution
    const binCount = 30;
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const binSize = (max - min) / binCount;
    const bins = new Array(binCount).fill(0);

    // Fill the bins
    prices.forEach((price) => {
      const binIndex = Math.min(
        Math.floor((price - min) / binSize),
        binCount - 1
      );
      bins[binIndex]++;
    });

    // Smooth the distribution using a simple moving average
    const smoothedBins = bins.map((_, i) => {
      const start = Math.max(0, i - 2);
      const end = Math.min(bins.length, i + 3);
      const values = bins.slice(start, end);
      return values.reduce((sum, val) => sum + val, 0) / values.length;
    });

    // Normalize to fit in the height
    const maxBin = Math.max(...smoothedBins);
    return smoothedBins.map((bin) => (bin / maxBin) * height);
  }, [prices, height]);

  // Create the SVG path
  const path = useMemo(() => {
    if (!distribution.length) return "";

    const points = distribution.map((y, i) => {
      const x = (i / (distribution.length - 1)) * width;
      return `${x},${height - y}`;
    });

    return `
      M 0,${height}
      L ${points.join(" L ")}
      L ${width},${height}
      Z
    `;
  }, [distribution, width, height]);

  return (
    <svg
      width={width}
      height={height}
      className={className}
      preserveAspectRatio="none"
    >
      <path d={path} fill="url(#gradient)" className="opacity-80" />
      <defs>
        <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#4B2E83" stopOpacity={0.4} />
          <stop offset="100%" stopColor="#4B2E83" stopOpacity={0.15} />
        </linearGradient>
      </defs>
    </svg>
  );
}
