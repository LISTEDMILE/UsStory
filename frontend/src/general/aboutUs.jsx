import React, { useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function AboutUs() {
  const container = useRef(null);

  useGSAP(() => {

    // Section reveal
    gsap.utils.toArray(".reveal").forEach((el) => {
      gsap.from(el, {
        y: 80,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%"
        }
      });
    });

    // Floating glow animation
    gsap.to(".floatingGlow", {
      y: 40,
      repeat: -1,
      yoyo: true,
      duration: 6,
      ease: "sine.inOut"
    });

  }, { scope: container });

  return (
    <div
      ref={container}
      className="min-h-screen bg-gradient-to-b from-black via-[#0f0f18] to-black text-white overflow-hidden"
    >

      {/* ========== HERO ========== */}
      <section className="relative flex min-h-screen flex-col items-center justify-center text-center px-6">

        <div className="absolute inset-0 -z-10">
          <div className="floatingGlow absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-3xl" />
        </div>

        <h1 className="reveal text-5xl md:text-7xl font-bold tracking-tight">
          We Believe Memories
          <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            {" "}Deserve More
          </span>
        </h1>

        <p className="reveal mt-8 max-w-3xl text-lg text-white/70">
          In a world of fast scrolling and temporary stories,
          we wanted to build something timeless.
        </p>
      </section>

      {/* ========== STORY SECTION ========== */}
      <section className="reveal py-32 px-6 text-center">
        <div className="max-w-4xl mx-auto text-xl text-white/70 leading-relaxed space-y-8">

          <p>
            This platform was born from a simple idea:
            What if memories felt like movies?
          </p>

          <p>
            What if you could tell someone how much they mean to you —
            not with a post, but with a journey.
          </p>

          <p>
            Smooth transitions. Background music.  
            Scroll-driven storytelling.  
            Emotional design.
          </p>

        </div>
      </section>

      {/* ========== VALUES ========== */}
      <section className="reveal py-32 px-6 bg-black/40 text-center">
        <h2 className="text-4xl font-semibold mb-16">
          What Drives Us
        </h2>

        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">

          <div className="rounded-3xl bg-white/5 p-10 border border-white/10 backdrop-blur-xl">
            <h3 className="text-xl font-semibold mb-4">Emotion First</h3>
            <p className="text-white/60">
              Every animation, every transition is crafted to enhance feeling.
            </p>
          </div>

          <div className="rounded-3xl bg-white/5 p-10 border border-white/10 backdrop-blur-xl">
            <h3 className="text-xl font-semibold mb-4">Design Matters</h3>
            <p className="text-white/60">
              Clean typography, elegant gradients, immersive scroll effects.
            </p>
          </div>

          <div className="rounded-3xl bg-white/5 p-10 border border-white/10 backdrop-blur-xl">
            <h3 className="text-xl font-semibold mb-4">Privacy & Trust</h3>
            <p className="text-white/60">
              Your stories can be public or deeply personal.
            </p>
          </div>

        </div>
      </section>

      {/* ========== VISION SECTION ========== */}
      <section className="reveal py-40 px-6 text-center">
        <h2 className="text-5xl font-bold mb-10">
          This Is Just The Beginning
        </h2>

        <p className="max-w-3xl mx-auto text-white/60 text-lg">
          We're building a new way to experience digital emotion —
          where storytelling feels cinematic, personal and alive.
        </p>
      </section>

      {/* ========== CTA ========== */}
      <section className="reveal py-32 px-6 text-center">
        <h2 className="text-4xl font-semibold mb-10">
          Ready to create your own story?
        </h2>

        <Link
          to="/auth/login"
          className="rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-12 py-4 text-lg font-semibold text-black transition hover:scale-110"
        >
          Start Creating
        </Link>
      </section>

     

    </div>
  );
}
