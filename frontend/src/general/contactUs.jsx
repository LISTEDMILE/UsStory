import React, { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function Contact() {
  const container = useRef(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [success, setSuccess] = useState("");

  useGSAP(() => {
    gsap.fromTo(
      ".contactReveal",
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.12,
        duration: 0.9,
        ease: "power3.out",
      }
    );
  }, { scope: container });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess("Message sent successfully ✨");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div
      ref={container}
      className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black text-white px-6 py-24"
    >
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-20 contactReveal">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            Contact Us
          </h1>
          <p className="mt-6 text-white/60 max-w-2xl mx-auto text-lg">
            Let’s build something meaningful together.  
            Whether it’s feedback, collaboration, or just a hello — I’d love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-16">

          {/* Contact Form
          <div className="contactReveal bg-white/5 border border-white/10 backdrop-blur-xl p-10 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
            <h2 className="text-2xl font-semibold mb-8">Send a Message</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
                className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-violet-500 transition"
              />

              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Your Email"
                required
                className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-violet-500 transition"
              />

              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Your Message"
                rows={5}
                required
                className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 resize-none outline-none focus:border-violet-500 transition"
              />

              <button
                type="submit"
                className="w-full py-4 rounded-xl font-semibold text-black bg-gradient-to-r from-violet-500 to-cyan-400 hover:scale-[1.02] transition"
              >
                Send Message
              </button>

              {success && (
                <p className="text-green-400 text-sm mt-4">{success}</p>
              )}
            </form>
          </div> */}

          {/* Social Links */}
          <div className="contactReveal space-y-8">

            <h2 className="text-2xl font-semibold">Connect With Me</h2>

            <div className="space-y-6">

              {/* Instagram */}
              <a
                href="https://instagram.com/listedmile"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition"
              >
                <span>Instagram</span>
                <span className="opacity-50 group-hover:translate-x-2 transition">→</span>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/kunal-sharma-5a3a27295?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition"
              >
                <span>LinkedIn</span>
                <span className="opacity-50 group-hover:translate-x-2 transition">→</span>
              </a>

              {/* GitHub */}
              <a
                href=""
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition"
              >
                <span>GitHub</span>
                <span className="opacity-50 group-hover:translate-x-2 transition">→</span>
              </a>

              {/* Email */}
              <a
                href=""
                className="group flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition"
              >
                <span>Email</span>
                <span className="opacity-50 group-hover:translate-x-2 transition">→</span>
              </a>

            </div>
          </div>

        </div>

       

      </div>
    </div>
  );
}
