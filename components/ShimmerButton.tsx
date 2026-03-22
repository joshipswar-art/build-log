"use client";

import React, { CSSProperties } from "react";

export interface ShimmerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  children?: React.ReactNode;
}

const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    {
      shimmerColor = "#ffffff",
      shimmerSize = "0.05em",
      shimmerDuration = "3s",
      borderRadius = "8px",
      background = "rgba(99, 102, 241, 1)",
      className = "",
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        style={
          {
            "--spread": "90deg",
            "--shimmer-color": shimmerColor,
            "--radius": borderRadius,
            "--speed": shimmerDuration,
            "--cut": shimmerSize,
            "--bg": background,
          } as CSSProperties
        }
        className={[
          "group relative z-0 flex w-full cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap",
          "border border-white/10 px-6 py-3 font-semibold text-white",
          "[background:var(--bg)] [border-radius:var(--radius)]",
          "transform-gpu transition-transform duration-300 ease-in-out active:scale-[0.98]",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className,
        ].join(" ")}
        ref={ref}
        {...props}
      >
        {/* Spinning conic shimmer */}
        <div className="absolute inset-0 overflow-visible -z-30 blur-[2px] [container-type:size]">
          <div className="absolute inset-0 h-[100cqh] animate-shimmer-slide [aspect-ratio:1] [border-radius:0] [mask:none]">
            <div className="animate-spin-around absolute -inset-full w-auto rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))] [translate:0_0]" />
          </div>
        </div>

        {children}

        {/* Inner highlight */}
        <div className="absolute inset-0 rounded-[8px] shadow-[inset_0_-8px_10px_#ffffff1f] transition-all duration-300 ease-in-out group-hover:shadow-[inset_0_-6px_10px_#ffffff3f] group-active:shadow-[inset_0_-10px_10px_#ffffff3f]" />

        {/* Background fill */}
        <div className="absolute -z-20 [background:var(--bg)] [border-radius:var(--radius)] [inset:var(--cut)]" />
      </button>
    );
  },
);

ShimmerButton.displayName = "ShimmerButton";
export { ShimmerButton };
