import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { apiFetch } from "../api/api";
import { Link } from "react-router-dom";

export default function Header() {
  const { isLoggedIn } = useSelector((state) => state.userInfo);
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
    <header className="premiumHeader sticky top-0 left-0 w-full z-50 backdrop-blur-2xl bg-black/30 border-b border-white/10">
      <div className="w-full h-15 py-4 md:py-3 px-8 md:px-16 flex justify-between items-center">
        {/* Logo */}
        <Link to={"/"} className="h-full w-auto">
          <img src={"/logo.png"} className="h-full" />
        </Link>

        {/* Desktop Nav */}
        <nav className="flex gap-10 text-md tracking-wide text-white/70">
          <Link
            className="hidden md:inline hover:text-white transition duration-300 cursor-pointer relative group"
            to={"/"}
          >
            Home
            <span className="absolute left-0 bottom-[-4px] w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
          </Link>
          {isLoggedIn ? (
            <>
              <Link
                className="hidden md:inline hover:text-white transition duration-300 cursor-pointer relative group "
                to={"/creator/create"}
              >
                Create Story
                <span className="absolute left-0 bottom-[-4px] w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                className="hover:text-white transition duration-300 cursor-pointer relative group "
                to={"/creator/creations"}
              >
                My Stories
                <span className="absolute left-0 bottom-[-4px] w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </>
          ) : (
            <>
              <Link
                className="hidden md:inline hover:text-white transition duration-300 cursor-pointer relative group"
                to={"/aboutUs"}
              >
                About Us
                <span className="absolute left-0 bottom-[-4px] w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                className="hidden md:inline hover:text-white transition duration-300 cursor-pointer relative group"
                to={"/help"}
              >
                Help
                <span className="absolute left-0 bottom-[-4px] w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                className="hidden md:inline hover:text-white transition duration-300 cursor-pointer relative group"
                to={"/contactUs"}
              >
                Contact Us
                <span className="absolute left-0 bottom-[-4px] w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Icon */}
        <div
          className=" text-white text-2xl cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          {open ? "X" : "☰"}
        </div>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className=" bg-black/80 backdrop-blur-xl border-t border-white/10">
          <div
            className="fixed h-screen w-screen bg-black/80 inset-0 z-0"
            onClick={() => setOpen(false)}
          />
          <div className="fixed min-h-screen right-0 top-0 w-screen md:w-fit min-w-[300px] flex flex-col py-12 px-8 gap-6 text-white/70 text-md z-10 bg-gradient-to-b from-[#0f0f14] via-[#151524] to-[#1c1c2e] ">
            <Link
              className="hover:text-white transition hover:underline mb-4"
              onClick={() => setOpen(false)}
              to={"/"}
            >
              Home
            </Link>
            {isLoggedIn ? (
              <>
                <Link
                  className="hover:text-white transition hover:underline"
                  onClick={() => setOpen(false)}
                  to={"/creator/create"}
                >
                  Create Story
                </Link>
                <Link
                  className="hover:text-white transition hover:underline"
                  onClick={() => setOpen(false)}
                  to={"/creator/creations"}
                >
                  My Stories
                </Link>
              </>
            ) : (
              <></>
            )}

            <Link
              className="hover:text-white transition hover:underline mt-4"
              onClick={() => setOpen(false)}
              to={"/aboutUs"}
            >
              About Us
            </Link>
            <Link
              className="hover:text-white transition hover:underline"
              onClick={() => setOpen(false)}
              to={"/contactUs"}
            >
              Contact Us
            </Link>

            <Link
              className="hover:text-white transition hover:underline"
              onClick={() => setOpen(false)}
              to={"/help"}
            >
              Help
            </Link>

            <div
              className={`flex items-center gap-6 ${isLoggedIn ? "self-end" : "self-start"} mt-12`}
            >
              {isLoggedIn ? (
                <>
                  <button
                    className="px-5 py-2 text-sm border border-white/20 rounded-full text-white hover:bg-white hover:text-black transition duration-300"
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  className="px-5 py-2 text-sm border border-white/20 rounded-full text-white hover:bg-white hover:text-black transition duration-300"
                  onClick={() => setOpen(false)}
                  to={"/auth/login"}
                >
                  Login/Register
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
