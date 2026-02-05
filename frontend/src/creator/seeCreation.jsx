import React, { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { apiFetch } from "../api/api";
import { useParams } from "react-router-dom";


gsap.registerPlugin(ScrollTrigger);

const MUSIC_MAP = {
  romantic: "/music/romantic.mp3",
  calm: "/music/calm.mp3",
  nostalgic: "/music/nostalgic.mp3",
  happy: "/music/happy.mp3",
};

const THEME_MAP = {
  warm: {
    bg: "from-rose-950 via-black to-orange-950",
    text: "text-rose-100",
  },
  dark: {
    bg: "from-black via-zinc-900 to-black",
    text: "text-white",
  },
  pastel: {
    bg: "from-pink-200 via-purple-200 to-blue-200",
    text: "text-zinc-900",
  },
  light: {
    bg: "from-white via-neutral-100 to-white",
    text: "text-zinc-900",
  },
};

export default function SeeCreation() {
  const container = useRef(null);
  const audioRef = useRef(null);

  const [creation, setCreation] = useState(null);
  const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
     const  { creationId } = useParams();

  /* ================= FETCH STORY ================= */
  React.useEffect(() => {
    const fetchCreation = async () => {
        try {
         
        const data = await apiFetch(
          `/creator/creation/${creationId}`,
          { method:"POST" }
        );

       
            console.log(data);
        // if (!data.ok) {
        //   throw new Error(data?.errors?.[0] || "Failed to load creation");
        // }

        setCreation(data.creation);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCreation();
  }, [creationId]);

  /* ================= MUSIC ================= */
  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
    }
  }, [creation]);

  /* ================= GSAP ================= */
  useGSAP(
    () => {
      if (!creation) return;

      gsap.from(".fade-up", {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
      });

      gsap.utils.toArray(".moment").forEach((el) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
          },
          y: 80,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        });
      });
    },
    { scope: container, dependencies: [creation] }
  );

  /* ================= STATES ================= */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center space-y-4">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
          <p className="text-neutral-400">Preparing something beautiful…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-red-400">
        {error}
      </div>
    );
  }

  if (!creation) return null;

  const theme = THEME_MAP[creation.visualMood] || THEME_MAP.warm;

  /* ================= UI ================= */
  return (
    <div
      ref={container}
      className={`min-h-screen bg-gradient-to-b ${theme.bg} ${theme.text}`}
      style={{ "--accent": creation.accentColor }}
    >
      {/* ===== MUSIC ===== */}
      {creation.musicMood && (
        <audio
          ref={audioRef}
          src={MUSIC_MAP[creation.musicMood]}
          autoPlay
          loop
        />
      )}

      {/* ===== HERO ===== */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_70%)]" />

        <h1 className="fade-up text-5xl md:text-7xl font-bold">
          {creation.title}
        </h1>

        <p className="fade-up mt-6 text-lg opacity-80">
          For {creation.recipientName}
        </p>

        <p className="fade-up mt-10 max-w-3xl text-xl leading-relaxed">
          {creation.message}
        </p>

        <div
          className="fade-up mt-16 h-1 w-32 rounded-full"
          style={{ background: creation.accentColor }}
        />
      </section>

      {/* ===== TIMELINE ===== */}
      <section className="mx-auto max-w-6xl space-y-32 px-6 py-32">
        {creation.timeline.map((moment, i) => (
          <div
            key={i}
            className="moment grid gap-12 md:grid-cols-2 items-center"
          >
            <div>
              <h2 className="text-3xl font-semibold">{moment.title}</h2>
              <p className="mt-2 text-sm opacity-60">{moment.date}</p>
              <p className="mt-6 text-lg opacity-90">
                {moment.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {moment.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img.url}
                  className="rounded-2xl object-cover shadow-xl transition hover:scale-105"
                />
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* ===== CLOSING ===== */}
      {creation.closingNote && (
        <section className="flex min-h-[60vh] items-center justify-center px-6 text-center">
          <div className="fade-up max-w-3xl">
            <p className="text-2xl italic opacity-90">
              “{creation.closingNote}”
            </p>
            <div
              className="mx-auto mt-10 h-1 w-24 rounded-full"
              style={{ background: creation.accentColor }}
            />
          </div>
        </section>
      )}
    </div>
  );
}
