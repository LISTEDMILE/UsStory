import React, { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { apiFetch } from "../api/api";
import { useParams } from "react-router-dom";
import { MUSIC_MAP, THEME_MAP } from "../hub/hub";

gsap.registerPlugin(ScrollTrigger);

export default function SeeCreation() {
  const container = useRef(null);
  const audioRef = useRef(null);

  const [creation, setCreation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [musicStarted, setMusicStarted] = useState(false);

  const { creationId } = useParams();

  /* ================= FETCH STORY ================= */
  React.useEffect(() => {
    const fetchCreation = async () => {
      try {
        const data = await apiFetch(`/creator/creation/${creationId}`, {
          method: "POST",
        });


        setCreation(data.creation);
        

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCreation();
  }, [creationId]);

  

  /* ================= GSAP ================= */
  useGSAP(
    () => {
      if (!creation) return;

      

      gsap.to(".progress-bar", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });

      gsap.from(".timeline-line", {
        scaleY: 0,
        transformOrigin: "top center",
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });

      gsap.utils.toArray(".moment").forEach((el) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            end: "top 40%",
            scrub: 1,
          },
          y: 120,
          opacity: 0,
        });
      });

    

      let horizontalTween = gsap.to(".animateTimeline", {
  x: "-100%",
  ease: "none",
  scrollTrigger: {
    trigger: ".triggerAnimateTimeline",
    start: "top 50%",
    end: "bottom 70%",
    scrub: 3,
  }
});

      
     gsap.utils.toArray(".moment").forEach((card) => {
  gsap.fromTo(card,
    { scale: 0.85, opacity: 0.6 },
    {
      scale: 1,
      opacity: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: card,
        containerAnimation: horizontalTween,
        start: "left center",
        end: "right center",
        scrub: 1,
      }
    }
       );
       
        // inner reveal animation
  let innerTl = gsap.timeline({
    scrollTrigger: {
      trigger: card,
      containerAnimation: horizontalTween,
      start: "left center",
      toggleActions: "play reverse play reverse"
    }
  });

  innerTl.from(card.querySelector(".innerTitle"), {
      y: 40,
      opacity: 0,
      duration: 0.6,
      ease: "power3.out"
    })
    .from(card.querySelector(".innerDescription"), {
      y: 30,
      opacity: 0,
      duration: 0.6,
      ease: "power3.out"
    }, "-=0.4")
    innerTl.from(card.querySelector(".innerLine"), {
      y: "-100%",
      opacity: 0,
      duration: 0.6,
      ease: "power3.out"
    }, "-=0.4")
      innerTl.from(card.querySelector(".innerDot"), {
    
      opacity: 0,
      duration: 0.6,
      ease: "power3.out"
    }, "-=0.4")
    .from(card.querySelector(".innerDate"), {
      y: 40,
      opacity: 0,
      duration: 0.6,
      ease: "power3.out"
    }, "-=0.4")
       .from(card.querySelector(".innerImage"), {
      scale: 1.1,
      opacity: 0,
      duration: 0.6,
      ease: "power3.out"
    }, "-=0.4")
});


       gsap.from(".headHeading",{
        scrollTrigger: {
          trigger: ".headTrigger",
           start: "top 0%",
          end: "top -80%",
           scrub: 3,
          markers:true
        },
        
         x: "100vw",
        
       })
      
      
      gsap.to(".headHeading",
  {
    opacity: 0,
    scrollTrigger: {
      trigger: ".headTrigger",
      start: "top -150%",
      end: "top -200%",
      scrub: 3,
      markers: true
    }
  }
);

   let tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".headTrigger",
    start: "top -220%",
    end: "top -350%",
    scrub: 3,
    markers: true
  }
});

tl.from(".headName", {
  y: 50,
  opacity: 0
})

.to({}, { duration: 0.5 })   // 👈 THIS IS THE DELAY (hold)

.to(".headName", {
  opacity: 0
});

      
      
       let tll = gsap.timeline({
  scrollTrigger: {
    trigger: ".headTrigger",
    start: "top -320%",
    end: "top -500%",
    scrub: 3,
    markers: true
  }
});

tll.from(".headMessage", {
  x: -50,
  opacity: 0
})

.to({}, { duration: 0.5 })   // 👈 THIS IS THE DELAY (hold)

.to(".headMessage", {
  opacity: 0
});
      
      gsap.from(".closingPara", {
        opacity: 0,
        y:30,
        ease: "none",
        scrollTrigger: {
          trigger: ".parentClosingPara",
          start: "top 40%",
          duration: 0.6,
         toggleActions: "play reverse play reverse"
          
        },
      });








    },
    

    { scope: container, dependencies: [creation] },
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

  const selectedTrack = MUSIC_MAP.find(
  (track) => track.id === creation.musicMood
);

  const theme = THEME_MAP[creation.visualMood] || THEME_MAP.warm;

  /* ================= UI ================= */
  return (
    <div
      ref={container}
      className={`min-h-screen bg-gradient-to-b ${theme.bg} ${theme.text}`}
      style={{ "--accent": creation.accentColor }}
    >

      {selectedTrack  && (
  <div
    className={`fixed inset-0 z-[999] flex items-center justify-center bg-black/90 cursor-pointer ${musicStarted && "hidden"}`}
    onClick={() => {
      const audio = audioRef.current;
      if (!audio) return;

      audio.volume = 0;
      audio.play();

      gsap.to(audio, {
        volume: 0.6,
        duration: 2,
      });

      gsap.to(".introOverlay", {
        opacity: 0,
        duration: 1,
        onComplete: () => {
          document.querySelector(".introOverlay")?.remove();
        },
      });

      setMusicStarted(true);
    }}
  >
    <div className="introOverlay text-center text-white">
      <p className="text-2xl mb-4">
        A little story for {creation.recipientName}
      </p>
      <p className="text-sm opacity-60">Tap anywhere to begin</p>
    </div>
  </div>
)}

      

      <div className="fixed top-0 left-0 z-50 h-1 w-full bg-white/10">
        <div
          className="progress-bar origin-left h-full scale-x-0"
          style={{ background: creation.accentColor }}
        />
      </div>

      <div className="pointer-events-none fixed inset-0 -z-10">
        <div
          className="absolute top-1/4 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full blur-3xl opacity-20"
          style={{ background: creation.accentColor }}
        />
      </div>

      {/* ===== MUSIC ===== */}
      {selectedTrack && (
  <audio
    ref={audioRef}
    src={selectedTrack.file}
    loop
  />
)}

     

      {/* ===== HERO ===== */}
      <section className="headTrigger relative h-[600vh] flex justify-center  ">
        <div className="scrollHint absolute flex top-50 flex-col items-center text-sm opacity-70">
  <span className="mb-4 tracking-widest uppercase text-2xl">
    Scroll Down Slowly...
  </span>

  <div className="w-14 h-25 border-2 border-current rounded-full flex justify-center">
    <div className="w-2 h-6 bg-current rounded-full mt-4 animate-bounce" />
  </div>
</div>


        <div className="fixed flex justify-center items-center w-screen h-screen inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_70%)]">
          
        <h1 className="headHeading absolute fade-up text-5xl md:text-7xl font-bold max-w-[90vw] md:max-w-[80vw] mb-10 ">
          {creation.title}
        </h1>

          
          <p className="headName absolute mt-6 opacity-80 
  text-2xl md:text-3xl 
  tracking-[0.3em] uppercase 
  text-white/70">
  For <span className="absolute mt-20 
  text-5xl md:text-7xl 
  font-light 
  text-white 
  tracking-wide">
  {creation.recipientName}
</span>
</p>




        <p className="headMessage absolute fade-up mt-10 max-w-3xl text-xl leading-relaxed">
          {creation.message}
        </p>
       </div>


        <div
          className="fade-up  h-1 w-32 rounded-full"
          style={{ background: creation.accentColor }}
        />
      </section>

      {/* ===== TIMELINE ===== */}

      <section className="triggerAnimateTimeline h-[5000px] ">
        

        <div className="fixed flex w-screen h-screen justify-between items-center inset-0">
          <div className="animateTimeline flex gap-80  translate-x-[100vw]">
          {creation.timeline.map((moment, i) => {
            
            return (
              <div key={i} className=" moment relative">

             

                {/* OUTER CONTAINER */}
                <div
                  className={`w-[95vw] md:w-[80vw] flex flex-col md:flex-row md:flex-row-reverse items-center rounded-[2.5rem] bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.4)] overflow-hidden `}
                >


                  
                     {/* CENTER LINE */}
        <div
          className="innerLine timeline-line absolute left-1/2 top-0 hidden h-[100%] w-[2px] -translate-x-1/2 md:block"
          style={{
            background: `linear-gradient(to bottom, transparent, ${creation.accentColor}, transparent)`,
            opacity: 0.4,
          }}
                />
                

                {/* CENTER DOT */}
                <div
                  className="innerDot absolute left-1/2 top-1/2 hidden h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full md:block"
                  style={{
                    background: creation.accentColor,
                    boxShadow: `0 0 20px ${creation.accentColor}`,
                  }}
                  />
                  


            

                  
                  <div className="w-full md:w-1/2 p-10 flex justify-center">
  {moment.images?.length > 0 ? (
    <div className="w-full h-[500px] overflow-hidden rounded-2xl">
      {moment.images.length === 1 ? (
        <img
          src={moment.images[0].url}
          className="innerImage w-full h-full object-cover rounded-2xl shadow-xl"
        />
      ) : (
        <div className="grid grid-cols-2 gap-2 w-full h-full">
          {moment.images.slice(0, 4).map((img, idx) => (
            <img
              key={idx}
              src={img.url}
              className="innerImage w-full h-full object-cover rounded-xl"
            />
          ))}
          {moment.images.length > 4 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-2xl font-semibold">
              +{moment.images.length - 4}
            </div>
          )}
        </div>
      )}
    </div>
  ) : (
    <div className="w-full h-[500px] flex items-center justify-center rounded-2xl bg-white/5 text-white/40">
      No Image
    </div>
  )}
</div>

                  
                  {/* TEXT SIDE */}
                  <div className="w-full md:w-1/2 p-10">
                    <h2 className="innerTitle text-3xl md:text-4xl font-semibold">
                      {moment.title}
                    </h2>

                    <p className="innerDate mt-2 text-sm uppercase tracking-widest opacity-50">
                      {moment.date}
                    </p>

                    <p className="innerDescription mt-6 text-lg leading-relaxed opacity-90">
                      {moment.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        </div>
      </section>

      {/* ===== CLOSING ===== */}
      {creation.closingNote && (
        <section className=" parentClosingPara flex min-h-[60vh] items-center justify-center px-6 text-center">
          <div className="fade-up max-w-3xl">
            <p className="closingPara text-2xl italic opacity-90">
              “{creation.closingNote}”
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
