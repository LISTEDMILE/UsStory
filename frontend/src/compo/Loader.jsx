import React from "react";

export default function PageLoader({
  text = "Preparing something beautiful…",
}) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      {/* Content */}
      <div className="relative text-center space-y-6">
        {/* Animated Ring */}
        <div className="relative w-14 h-14 mx-auto">
          <div className="absolute inset-0 rounded-full border border-white/20" />
          <div className="absolute inset-0 rounded-full border-t-2 border-violet-400 animate-spin" />
        </div>

        {/* Text */}
        <p className="text-white/70 text-xs tracking-[0.3em] uppercase">
          {text}
        </p>
      </div>
    </div>
  );
}
