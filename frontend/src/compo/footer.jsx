import React from "react";

export default function Footer() {
  return (
    <footer className="relative mt-40 overflow-hidden border-t border-white/10 bg-black/80 backdrop-blur-3xl">

      {/* Soft Background Glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/3 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-white/5 blur-3xl animate-pulse" />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-28 flex flex-col items-center text-center space-y-10">

        {/* Accent Line */}
        <div className="h-[2px] w-28 rounded-full bg-gradient-to-r from-transparent via-white/60 to-transparent" />

        {/* Main Message */}
        <p className="text-xl md:text-2xl text-white/80 font-light max-w-2xl leading-relaxed tracking-wide">
          Every memory deserves to be felt,
          <br />
          <span className="text-white font-medium">
            not just seen.
          </span>
        </p>

        {/* Divider */}
        <div className="h-[1px] w-20 bg-white/10" />

        {/* Subtle Tagline */}
        <p className="text-sm text-white/50 tracking-[0.2em] uppercase">
          Crafted with intention
        </p>

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row justify-between items-center w-full pt-12 border-t border-white/10 text-xs text-white/40">
          
          <span className="mb-4 md:mb-0">
             {new Date().getFullYear()}
          </span>

          <div className="flex gap-8">
            <span className="hover:text-white transition duration-300 cursor-pointer">
              Privacy
            </span>
            <span className="hover:text-white transition duration-300 cursor-pointer">
              Terms
            </span>
            <span className="hover:text-white transition duration-300 cursor-pointer">
              Contact
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
