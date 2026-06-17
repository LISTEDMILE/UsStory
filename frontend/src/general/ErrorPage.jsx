import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";

export default function ErrorPage() {
  const titleRef = useRef();
  const subRef = useRef();
  const emojiRef = useRef();
  const btnRef = useRef();

  const messages = [
    "Bro... what URL are you cooking? 💀",
    "This page ghosted everyone. 👻",
    "Nahhh... you weren't supposed to be here. 🤨",
    "404 rizz not found.",
    "Even Google couldn't find this page.",
    "You really typed that URL with confidence huh? 😭",
    "Task failed successfully.",
    "The developer is pretending this page exists.",
  ];

  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  useEffect(() => {
    gsap.from(titleRef.current, {
      y: -80,
      opacity: 0,
      duration: 1,
      ease: "back.out(1.7)",
    });

    gsap.from(subRef.current, {
      opacity: 0,
      y: 30,
      delay: 0.4,
      duration: 0.8,
    });

    gsap.from(btnRef.current, {
      scale: 0,
      delay: 0.8,
      duration: 0.6,
      ease: "elastic.out",
    });

    gsap.to(emojiRef.current, {
      y: -20,
      rotation: 15,
      repeat: -1,
      yoyo: true,
      duration: 1.5,
      ease: "sine.inOut",
    });

    gsap.to(".floating", {
      y: "random(-25,25)",
      x: "random(-20,20)",
      duration: "random(2,4)",
      repeat: -1,
      yoyo: true,
      stagger: 0.2,
      ease: "sine.inOut",
    });
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#09090B] text-white flex flex-col items-center justify-center px-6">
      {/* Floating Emojis */}
      <span className="floating absolute top-16 left-20 text-4xl">💀</span>
      <span className="floating absolute top-32 right-24 text-4xl">🤡</span>
      <span className="floating absolute bottom-28 left-32 text-4xl">🚪</span>
      <span className="floating absolute bottom-16 right-16 text-5xl">👀</span>
      <span className="floating absolute top-1/2 left-12 text-3xl">😭</span>

      {/* Big Emoji */}
      <div
        ref={emojiRef}
        className="text-[170px] md:text-[220px] leading-none drop-shadow-2xl"
      >
        🗿
      </div>

      <p className="mt-2 text-zinc-500 font-mono tracking-[0.3em] text-sm">
        ERROR • 404
      </p>

      <h1
        ref={titleRef}
        className="mt-6 text-4xl md:text-6xl font-black text-center"
      >
        Bro... what URL are you cooking? 💀
      </h1>

      <p className="mt-6 text-3xl font-bold text-pink-400 text-center">
        {randomMessage}
      </p>

      <p
        ref={subRef}
        className="mt-5 max-w-2xl text-center text-zinc-400 text-lg leading-8"
      >
        Alright... that's enough.
        <br />
        Go back, man. Why are you messing with the URL? 💀
        <br />
        This page doesn't exist, never existed, and probably never will.
        <br />
        Stop exploring like you're the main character and head back home.
      </p>

      {/* Home Button */}
      <Link
        ref={btnRef}
        to="/"
        className="group mt-12 relative overflow-hidden rounded-full bg-white px-8 py-4 text-black font-bold "
      >
        <span className="relative">🚀 Get Me Outta Here</span>

        <div className="absolute inset-0 bg-white  scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100">
          <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 h-full w-full" />
        </div>

        <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition duration-500 z-20">
          Take Me Home →
        </span>
      </Link>

      <p className="absolute bottom-6 text-sm text-zinc-600">
        Error 404 • Skill issue detected.
      </p>
    </div>
  );
}
