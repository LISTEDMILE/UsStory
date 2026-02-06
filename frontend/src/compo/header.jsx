import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userActions } from "../../store/index";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { apiFetch } from "../api/api";
import { Link } from "react-router-dom";

export default function Header() {
  const { isLoggedIn } = useSelector((state) => state.userInfo);
  const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    
   const logout = async () => {
       try {
         const res = await apiFetch("/auth/logout", {
           method: "POST",
           
         });
   
         if (res.success) {
           window.location.href = "/";
         } else {
             alert("Logout Failed");
             console.error(res.errors);
         }
       } catch (err) {
           console.error(err);
       }
    };
    

  useGSAP(() => {
    gsap.from(".premiumHeader", {
      y: -80,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
    });
  }, []);

  return (
    <header className="premiumHeader fixed top-0 left-0 w-full z-50 backdrop-blur-2xl bg-black/30 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <div className="text-white text-xl tracking-wide font-light">
          <span className="font-semibold">Memoria</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-10 text-sm tracking-wide text-white/70">
          <span className="hover:text-white transition duration-300 cursor-pointer relative group">
            Creations
            <span className="absolute left-0 bottom-[-4px] w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
          </span>

          <span className="hover:text-white transition duration-300 cursor-pointer relative group">
            About
            <span className="absolute left-0 bottom-[-4px] w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
          </span>

          <span className="hover:text-white transition duration-300 cursor-pointer relative group">
            Create
            <span className="absolute left-0 bottom-[-4px] w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
          </span>
        </nav>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-6">
          {isLoggedIn ? (
            <>
              <button
                className="px-5 py-2 text-sm border border-white/20 rounded-full text-white hover:bg-white hover:text-black transition duration-300"
                onClick={() => logout()}
              >
                Logout
              </button>
            </>
          ) : (
                          <Link className="px-5 py-2 text-sm border border-white/20 rounded-full text-white hover:bg-white hover:text-black transition duration-300"
                          to={"/auth/login"}>
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <div
          className="md:hidden text-white text-2xl cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          ☰
        </div>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden bg-black/80 backdrop-blur-xl border-t border-white/10">
          <div className="flex flex-col items-center py-6 gap-6 text-white/70 text-sm">
            <span className="hover:text-white transition">Explore</span>
            <span className="hover:text-white transition">About</span>
            <span className="hover:text-white transition">Create</span>

            {isLoggedIn ? (
              <button
                className="mt-4 px-6 py-2 border border-white/20 rounded-full hover:bg-white hover:text-black transition"
                onClick={() => dispatch(userActions.Logout())}
              >
                Logout
              </button>
            ) : (
                              <Link className="mt-4 px-6 py-2 border border-white/20 rounded-full hover:bg-white hover:text-black transition"
                              to={"/auth/login"}>
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
