import { ReactNode } from "react";

export function AnimatedGradientBadge({ children }: { children: ReactNode }) {
  return (
    <div className="group relative mx-auto flex max-w-fit items-center justify-center rounded-full bg-white/5 px-4 py-1.5 text-xs font-medium shadow-[inset_0_-8px_10px_#6366f11f] backdrop-blur-sm transition-shadow duration-500 hover:shadow-[inset_0_-5px_10px_#6366f13f] [--bg-size:300%]">
      {/* Animated gradient border */}
      <div className="absolute inset-0 block h-full w-full animate-gradient rounded-full bg-[length:var(--bg-size)_100%] p-[1px] ![mask-composite:subtract] [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]"
        style={{ backgroundImage: "linear-gradient(to right, rgba(99,102,241,0.5), rgba(129,140,248,0.5), rgba(99,102,241,0.5))" }}
      />
      {children}
    </div>
  );
}

export function AnimatedGradientHeading({ children }: { children: ReactNode }) {
  return (
    <span
      className="animate-gradient bg-[length:300%_100%] bg-clip-text text-transparent"
      style={{ backgroundImage: "linear-gradient(to right, #ededf5, #a5b4fc, #ededf5)" }}
    >
      {children}
    </span>
  );
}
