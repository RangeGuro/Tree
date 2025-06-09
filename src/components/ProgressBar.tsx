import React from "react";

export function ProgressBar({
  percent,
  color = "#4caf50",
  height = 10,
  animate = true,
  style = {},
}: {
  percent: number;
  color?: string;
  height?: number;
  animate?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        background: "#e0e0e0",
        borderRadius: height / 2,
        height,
        width: "100%",
        overflow: "hidden",
        ...style,
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${Math.max(0, Math.min(100, percent))}%`,
          background: color,
          borderRadius: height / 2,
          transition: animate ? "width 0.45s cubic-bezier(.4,2,.6,1)" : "none",
        }}
      />
    </div>
  );
}