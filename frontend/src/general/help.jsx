import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Help() {
  const container = useRef(null);
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do I create a story?",
      answer:
        "After signing in, go to Create Story, fill in details, add timeline moments, choose music, and publish.",
    },
    {
      question: "Can I make my story private?",
      answer:
        "Yes. You can choose Private visibility and set a password to protect your story.",
    },
    {
      question: "How does background music work?",
      answer:
        "You can select from curated tracks while creating your story. The selected track will play when viewers start the experience.",
    },
    {
      question: "Can I edit my story later?",
      answer:
        "Absolutely. Go to My Creations → Edit to update content, images, or music.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Yes. We respect privacy. Private stories remain protected and are never publicly indexed.",
    },
  ];


  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div
      ref={container}
      className="min-h-screen bg-gradient-to-b from-black via-[#0f0f18] to-black text-white px-6 py-24"
    >
      {/* HERO */}
      <div className="helpReveal text-center mb-20">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          How Can We Help?
        </h1>
        <p className="text-white/60 max-w-2xl mx-auto">
          Everything you need to know about creating, editing, and sharing
          beautiful story experiences.
        </p>
      </div>

      {/* FAQ SECTION */}
      <div className="max-w-4xl mx-auto space-y-6">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="helpReveal rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 transition-all duration-300"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center text-left"
            >
              <span className="text-lg font-medium">
                {faq.question}
              </span>
              <span className="text-xl">
                {openIndex === index ? "−" : "+"}
              </span>
            </button>

            <div
              className={`overflow-hidden transition-all duration-500 ${
                openIndex === index ? "max-h-40 mt-4 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <p className="text-white/60">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CONTACT SECTION */}
      <div className="helpReveal mt-32 text-center">
        <h2 className="text-4xl font-semibold mb-6">
          Still Need Help?
        </h2>

        <p className="text-white/60 mb-10">
          If you can't find your answer here, feel free to reach out.
        </p>

        <div className="flex flex-wrap justify-center gap-6">
          <Link
            to="/aboutUs"
            className="rounded-full border border-white/20 px-8 py-3 hover:bg-white hover:text-black transition"
          >
            About Us
          </Link>

          <Link
            to="/contactUs"
            className="rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-8 py-3 text-black font-semibold hover:scale-105 transition"
          >
            Contact Support
          </Link>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="mt-32 text-center text-white/40 text-sm">
        Need urgent assistance? We’re here to help you create something beautiful.
      </footer>
    </div>
  );
}
