import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function Landing() {
  const container = useRef(null);

  const { isLoggedIn } = useSelector((state) => state.userInfo);

  useGSAP(
    () => {
      // HERO intro animation
      gsap.from(".hero-title", {
        y: 80,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
      });

      gsap.from(".hero-sub", {
        y: 50,
        opacity: 0,
        delay: 0.3,
        duration: 1,
        ease: "power3.out",
      });

      gsap.from(".hero-btn", {
        scale: 0.8,
        opacity: 0,
        delay: 0.6,
        duration: 0.8,
        ease: "back.out(1.7)",
      });

      // Reveal sections
      gsap.utils.toArray(".section").forEach((section) => {
        gsap.from(section, {
          opacity: 0,
          y: 100,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
          },
        });
      });
    },
    { scope: container },
  );

  return (
    <div
      ref={container}
      className="min-h-screen bg-gradient-to-b from-black via-[#0f0f1a] to-black text-white overflow-hidden"
    >
      {/* ================= HERO ================= */}
      <section className="relative flex min-h-screen flex-col items-center justify-center text-center px-6">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-3xl" />
        </div>

        <h1 className="hero-title text-5xl md:text-7xl font-bold tracking-tight">
          Create Stories That
          <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            {" "}
            Live Forever
          </span>
        </h1>

        <p className="hero-sub mt-6 max-w-2xl text-lg text-white/70">
          Turn memories into cinematic digital experiences with music, timeline
          moments, animations and emotion.
        </p>

        <div className="hero-btn mt-10 flex gap-6">
          <Link
            to={`${isLoggedIn ? "/creator/create" : "/auth/login"}`}
            className="rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-8 py-3 font-semibold text-black transition hover:scale-105"
          >
            {isLoggedIn ? "Create Now" : "Get Started"}
          </Link>

          <Link
            to={`${isLoggedIn ? "/creator/creations" : "/auth/signUp"}`}
            className="rounded-full border border-white/20 px-8 py-3 transition hover:bg-white/10"
          >
            {isLoggedIn ? "My Creations" : "Create Account"}
          </Link>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="section py-32 px-6 text-center">
        <h2 className="text-4xl font-semibold mb-16">
          Built for Emotional Storytelling
        </h2>

        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          <div className="rounded-2xl bg-white/5 p-8 border border-white/10 backdrop-blur-xl">
            <h3 className="text-xl font-semibold mb-4">Cinematic Timelines</h3>
            <p className="text-white/60">
              Scroll-based animated journey with smooth transitions and
              immersive design.
            </p>
          </div>

          <div className="rounded-2xl bg-white/5 p-8 border border-white/10 backdrop-blur-xl">
            <h3 className="text-xl font-semibold mb-4">
              Real Music Integration
            </h3>
            <p className="text-white/60">
              Choose real background tracks. Preview before publishing.
            </p>
          </div>

          <div className="rounded-2xl bg-white/5 p-8 border border-white/10 backdrop-blur-xl">
            <h3 className="text-xl font-semibold mb-4">Private & Secure</h3>
            <p className="text-white/60">
              Password-protected stories for personal and intimate memories.
            </p>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="section py-32 px-6 bg-black/40 text-center">
        <h2 className="text-4xl font-semibold mb-16">How It Works</h2>

        <div className="max-w-4xl mx-auto space-y-10 text-white/70 text-lg">
          <p>1. Create your story and add meaningful moments.</p>
          <p>2. Upload images for each timeline memory.</p>
          <p>3. Select background music and theme.</p>
          <p>4. Share your emotional cinematic journey.</p>
        </div>
      </section>

      {/* ================= EXPERIENCE ================= */}
      <section className="section py-32 px-6 text-center">
        <h2 className="text-4xl font-semibold mb-10">Designed Like A Movie</h2>

        <p className="max-w-3xl mx-auto text-white/60 text-lg">
          Scroll animations. Smooth transitions. Accent color glow. Your
          memories deserve more than static posts.
        </p>

        <div className="mt-20 h-[400px] rounded-3xl bg-gradient-to-r from-violet-600/20 to-cyan-600/20 blur-xl mx-auto max-w-4xl" />
      </section>

      {/* ================= CTA ================= */}
      <section className="section py-40 px-6 text-center">
        <h2 className="text-5xl font-bold mb-10">
          Ready to Create Something Beautiful?
        </h2>

        <Link
          to={`${isLoggedIn ? "/creator/create" : "/auth/login"}`}
          className="rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-12 py-4 text-lg font-semibold text-black transition hover:scale-110"
        >
          Start Creating
        </Link>
      </section>
    </div>
  );
}
