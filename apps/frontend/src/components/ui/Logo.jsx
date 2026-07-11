import React from "react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";

/**
 * Deployr Brand Logo Component
 * A sleek, high-precision isometric delta mark designed for modern cloud deployment.
 */
export default function Logo({
  size = "md",
  showText = true,
  showSubtext = false,
  animated = true,
  to = null,
  className,
  iconClassName,
  textClassName,
  onClick,
}) {
  // Size mapping for icon container and text
  const sizeMap = {
    xs: {
      box: "w-5 h-5 rounded-[5px] p-0.5",
      text: "text-[13px] font-semibold tracking-tight",
      subtext: "text-[10px]",
      gap: "gap-1.5",
    },
    sm: {
      box: "w-6 h-6 rounded-md p-1",
      text: "text-[14px] font-semibold tracking-tight",
      subtext: "text-[11px]",
      gap: "gap-2",
    },
    md: {
      box: "w-7 h-7 rounded-lg p-1",
      text: "text-[15px] font-semibold tracking-tight",
      subtext: "text-[12px]",
      gap: "gap-2.5",
    },
    lg: {
      box: "w-9 h-9 rounded-xl p-1.5",
      text: "text-[18px] font-bold tracking-tight",
      subtext: "text-[13px]",
      gap: "gap-3",
    },
    xl: {
      box: "w-12 h-12 rounded-2xl p-2",
      text: "text-[24px] font-bold tracking-tight",
      subtext: "text-[14px]",
      gap: "gap-3.5",
    },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const logoMark = (
    <div
      className={cn(
        "relative flex items-center justify-center shrink-0 overflow-hidden",
        "bg-gradient-to-br from-white/10 via-white/[0.04] to-transparent",
        "border border-white/15 shadow-[0_0_15px_rgba(139,92,246,0.2)]",
        "group-hover:border-white/30 group-hover:shadow-[0_0_22px_rgba(56,189,248,0.35)] transition-all duration-300 ease-out",
        currentSize.box,
        iconClassName
      )}
    >
      {/* Subtle ambient backglow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 via-purple-500/20 to-pink-500/20 opacity-70 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* SVG Vector Mark */}
      <svg
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(
          "w-full h-full relative z-10 transition-transform duration-300 ease-out group-hover:scale-105",
          animated && "group-hover:-translate-y-0.5"
        )}
      >
        <defs>
          <linearGradient id={`deployr-grad-main-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
          <linearGradient id={`deployr-grad-inner-${size}`} x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E2E8F0" stopOpacity="0.85" />
          </linearGradient>
          <filter id={`deployr-glow-${size}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Shield Field */}
        <path
          d="M18 3L33 11.5V24.5L18 33L3 24.5V11.5L18 3Z"
          className="opacity-20 fill-[url(#deployr-grad-main-md)] transition-opacity group-hover:opacity-30"
          fill={`url(#deployr-grad-main-${size})`}
        />

        {/* Outer Folded Delta Wing (Ascending / Deploying) */}
        <path
          d="M18 5L31 28L18 23L5 28L18 5Z"
          fill={`url(#deployr-grad-main-${size})`}
          className="drop-shadow-[0_2px_6px_rgba(139,92,246,0.4)]"
        />

        {/* Inner High-Contrast Thrust Core */}
        <path
          d="M18 10.5L24.5 23.5L18 20.5L11.5 23.5L18 10.5Z"
          fill={`url(#deployr-grad-inner-${size})`}
        />

        {/* Glowing Production Apex Node */}
        <circle
          cx="18"
          cy="8.5"
          r="2.2"
          fill="#38BDF8"
          filter={`url(#deployr-glow-${size})`}
          className="animate-pulse"
        />
        <circle cx="18" cy="8.5" r="1.2" fill="#FFFFFF" />
      </svg>
    </div>
  );

  const content = (
    <>
      {logoMark}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                currentSize.text,
                "text-text-primary group-hover:text-white transition-colors duration-200",
                textClassName
              )}
            >
              Deployr
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 shadow-[0_0_6px_rgba(56,189,248,0.8)]" />
          </div>
          {showSubtext && (
            <span
              className={cn(
                currentSize.subtext,
                "text-text-muted font-normal leading-tight group-hover:text-text-secondary transition-colors"
              )}
            >
              Cloud Platform
            </span>
          )}
        </div>
      )}
    </>
  );

  const containerClasses = cn(
    "group flex items-center select-none transition-opacity duration-200",
    currentSize.gap,
    className
  );

  if (to) {
    return (
      <Link to={to} onClick={onClick} className={containerClasses}>
        {content}
      </Link>
    );
  }

  return (
    <div onClick={onClick} className={cn(containerClasses, onClick && "cursor-pointer")}>
      {content}
    </div>
  );
}
