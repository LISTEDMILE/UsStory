import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import React from "react";

export default function LandingPage() {
  const container = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      tl.from(".glow-core", {
        scale: 0,
        opacity: 0,
        duration: 1.6,
      })
        .from(
          ".hero-title",
          {
            y: 120,
            opacity: 0,
            duration: 1.2,
          },
          "-=1"
        )
        .from(
          ".hero-subtitle",
          {
            y: 60,
            opacity: 0,
            duration: 1,
          },
          "-=0.9"
        )
        .from(
          ".hero-cta a",
          {
            y: 40,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
          },
          "-=0.8"
        )
        .from(
          ".feature-card",
          {
            y: 60,
            opacity: 0,
            stagger: 0.2,
            duration: 0.9,
          },
          "-=0.4"
        );
    },
    { scope: container }
  );

  return (
    <div
      ref={container}
      className="relative min-h-screen overflow-hidden bg-black text-white"
    >
      {/* ================= GLOW BACKGROUND ================= */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
        <div className="glow-core h-[700px] w-[700px] rounded-full bg-gradient-to-r from-violet-600/40 to-cyan-400/40 blur-[160px]" />
      </div>

      {/* ================= HERO ================= */}
      <section className="relative z-20 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <h1 className="hero-title max-w-5xl text-5xl font-bold leading-tight md:text-7xl">
          Turn{" "}
          <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            Bonds
          </span>{" "}
          into Timeless Stories
        </h1>

        <p className="hero-subtitle mt-6 max-w-2xl text-lg text-neutral-300 md:text-xl">
          Create private, emotional, and beautifully animated pages for the
          people who matter the most.
        </p>

        {/* ================= CTA ================= */}
        <div className="hero-cta relative z-30 mt-12 flex flex-wrap items-center justify-center gap-6">
          <a
            href="/signup"
            className="rounded-full bg-gradient-to-r from-violet-400 to-cyan-300 px-10 py-4 text-lg font-semibold text-black shadow-lg shadow-violet-500/40 transition hover:scale-105 hover:shadow-violet-500/70"
          >
            Create Your Story
          </a>

          <a
            href="/login"
            className="rounded-full border border-white/30 bg-black/40 px-10 py-4 text-lg font-semibold text-white backdrop-blur transition hover:bg-white/10"
          >
            Login
          </a>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="relative z-20 mx-auto max-w-6xl px-6 pb-32">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="feature-card rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
            <h3 className="mb-3 text-xl font-semibold">Emotional Timelines</h3>
            <p className="text-neutral-400">
              Tell your journey through moments, memories, and milestones.
            </p>
          </div>

          <div className="feature-card rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
            <h3 className="mb-3 text-xl font-semibold">Private & Secure</h3>
            <p className="text-neutral-400">
              Password-protected stories that stay only between you.
            </p>
          </div>

          <div className="feature-card rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
            <h3 className="mb-3 text-xl font-semibold">
              Cinematic Experience
            </h3>
            <p className="text-neutral-400">
              Smooth animations, music moods, and immersive visuals.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
