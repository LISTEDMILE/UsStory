// import { useRef } from "react";
// import gsap from "gsap";
// import { useGSAP } from "@gsap/react";
// import React from "react";

// export default function LandingPage() {
//   const container = useRef(null);

//   useGSAP(
//     () => {
//       const tl = gsap.timeline({
//         defaults: { ease: "power3.out" },
//       });

//       tl.from(".glow-core", {
//         scale: 0,
//         opacity: 0,
//         duration: 1.6,
//       })
//         .from(
//           ".hero-title",
//           {
//             y: 120,
//             opacity: 0,
//             duration: 1.2,
//           },
//           "-=1"
//         )
//         .from(
//           ".hero-subtitle",
//           {
//             y: 60,
//             opacity: 0,
//             duration: 1,
//           },
//           "-=0.9"
//         )
//         .from(
//           ".hero-cta a",
//           {
//             y: 40,
//             opacity: 0,
//             duration: 0.8,
//             stagger: 0.15,
//           },
//           "-=0.8"
//         )
//         .from(
//           ".feature-card",
//           {
//             y: 60,
//             opacity: 0,
//             stagger: 0.2,
//             duration: 0.9,
//           },
//           "-=0.4"
//         );
//     },
//     { scope: container }
//   );

//   return (
//     <div
//       ref={container}
//       className="relative min-h-screen overflow-hidden bg-black text-white"
//     >
//       {/* ================= GLOW BACKGROUND ================= */}
//       <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
//         <div className="glow-core h-[700px] w-[700px] rounded-full bg-gradient-to-r from-violet-600/40 to-cyan-400/40 blur-[160px]" />
//       </div>

//       {/* ================= HERO ================= */}
//       <section className="relative z-20 flex min-h-screen flex-col items-center justify-center px-6 text-center">
//         <h1 className="hero-title max-w-5xl text-5xl font-bold leading-tight md:text-7xl">
//           Turn{" "}
//           <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
//             Bonds
//           </span>{" "}
//           into Timeless Stories
//         </h1>

//         <p className="hero-subtitle mt-6 max-w-2xl text-lg text-neutral-300 md:text-xl">
//           Create private, emotional, and beautifully animated pages for the
//           people who matter the most.
//         </p>

//         {/* ================= CTA ================= */}
//         <div className="hero-cta relative z-30 mt-12 flex flex-wrap items-center justify-center gap-6">
//           <a
//             href="/signup"
//             className="rounded-full bg-gradient-to-r from-violet-400 to-cyan-300 px-10 py-4 text-lg font-semibold text-black shadow-lg shadow-violet-500/40 transition hover:scale-105 hover:shadow-violet-500/70"
//           >
//             Create Your Story
//           </a>

//           <a
//             href="/login"
//             className="rounded-full border border-white/30 bg-black/40 px-10 py-4 text-lg font-semibold text-white backdrop-blur transition hover:bg-white/10"
//           >
//             Login
//           </a>
//         </div>
//       </section>

//       {/* ================= FEATURES ================= */}
//       <section className="relative z-20 mx-auto max-w-6xl px-6 pb-32">
//         <div className="grid gap-8 md:grid-cols-3">
//           <div className="feature-card rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
//             <h3 className="mb-3 text-xl font-semibold">Emotional Timelines</h3>
//             <p className="text-neutral-400">
//               Tell your journey through moments, memories, and milestones.
//             </p>
//           </div>

//           <div className="feature-card rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
//             <h3 className="mb-3 text-xl font-semibold">Private & Secure</h3>
//             <p className="text-neutral-400">
//               Password-protected stories that stay only between you.
//             </p>
//           </div>

//           <div className="feature-card rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
//             <h3 className="mb-3 text-xl font-semibold">
//               Cinematic Experience
//             </h3>
//             <p className="text-neutral-400">
//               Smooth animations, music moods, and immersive visuals.
//             </p>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }


import React, { useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function Landing() {
  const container = useRef(null);

  useGSAP(() => {

    // HERO intro animation
    gsap.from(".hero-title", {
      y: 80,
      opacity: 0,
      duration: 1.2,
      ease: "power4.out"
    });

    gsap.from(".hero-sub", {
      y: 50,
      opacity: 0,
      delay: 0.3,
      duration: 1,
      ease: "power3.out"
    });

    gsap.from(".hero-btn", {
      scale: 0.8,
      opacity: 0,
      delay: 0.6,
      duration: 0.8,
      ease: "back.out(1.7)"
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
          start: "top 80%"
        }
      });
    });

  }, { scope: container });

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
            {" "}Live Forever
          </span>
        </h1>

        <p className="hero-sub mt-6 max-w-2xl text-lg text-white/70">
          Turn memories into cinematic digital experiences with music,
          timeline moments, animations and emotion.
        </p>

        <div className="hero-btn mt-10 flex gap-6">
          <Link
            to="/auth/login"
            className="rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-8 py-3 font-semibold text-black transition hover:scale-105"
          >
            Get Started
          </Link>

          <Link
            to="/auth/signUp"
            className="rounded-full border border-white/20 px-8 py-3 transition hover:bg-white/10"
          >
            Create Account
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
              Scroll-based animated journey with smooth transitions and immersive design.
            </p>
          </div>

          <div className="rounded-2xl bg-white/5 p-8 border border-white/10 backdrop-blur-xl">
            <h3 className="text-xl font-semibold mb-4">Real Music Integration</h3>
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
        <h2 className="text-4xl font-semibold mb-16">
          How It Works
        </h2>

        <div className="max-w-4xl mx-auto space-y-10 text-white/70 text-lg">

          <p>1. Create your story and add meaningful moments.</p>
          <p>2. Upload images for each timeline memory.</p>
          <p>3. Select background music and theme.</p>
          <p>4. Share your emotional cinematic journey.</p>

        </div>
      </section>

      {/* ================= EXPERIENCE ================= */}
      <section className="section py-32 px-6 text-center">
        <h2 className="text-4xl font-semibold mb-10">
          Designed Like A Movie
        </h2>

        <p className="max-w-3xl mx-auto text-white/60 text-lg">
          Scroll animations. Smooth transitions. Accent color glow.
          Your memories deserve more than static posts.
        </p>

        <div className="mt-20 h-[400px] rounded-3xl bg-gradient-to-r from-violet-600/20 to-cyan-600/20 blur-xl mx-auto max-w-4xl" />
      </section>

      {/* ================= CTA ================= */}
      <section className="section py-40 px-6 text-center">
        <h2 className="text-5xl font-bold mb-10">
          Ready to Create Something Beautiful?
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

