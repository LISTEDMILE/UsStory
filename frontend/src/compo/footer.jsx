import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (<>
    {/* ================= FOOTER ================= */}
      <footer className="border-t border-white/10 py-10 text-center text-white/40">
      <div className="flex justify-center gap-8 mb-8 ">
        <Link to="/" className="hover:text-white">Home</Link>
          <Link to="/aboutUs" className="hover:text-white">About</Link>
        <Link to="/help" className="hover:text-white">Help</Link>
        <Link to="/contactUs" className="hover:text-white">Contact Us</Link>
          <Link to="/auth/login" className="hover:text-white">Login</Link>
          <Link to="/auth/signUp" className="hover:text-white">Sign Up</Link>
        </div>

        <p>UsStory. Crafted with emotion.</p>
      </footer>
    <footer className="relative mt-10 overflow-hidden border-t border-white/10 bg-white/30 backdrop-blur-3xl">
     

     

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
    
    </footer></>
  );
}
