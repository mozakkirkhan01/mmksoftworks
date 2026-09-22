"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AnimatedLogo from "@/components/utility/animated-logo";
import navLinks from "@/data/navLinks"
import ThemeSwitch from "@/components/ui/ThemeSwitch";
import FadeDown from "@/animations/fade-down";

const Navbar = () => {
  const pathname = usePathname(); 

  return (
    <FadeDown key="navbar" duration={0.6}>
    <motion.div
      className="hidden nav bg-transparent h-[10vh] sm:h-[12vh]  w-full sm:flex  justify-between items-center px-2 sm:px-16 z-[999]">
      {/* main logo of the site  */}
      <div className="logo h-12 w-12 ml-3 sm:ml-0 z-50 flex">
        <Link href={"/"}>
        <AnimatedLogo />
        </Link>
      </div>

      {/* nav links  */}

      <div className="navlinks hidden sm:flex justify-center items-center text-[5vw] sm:text-[1.2vw] md:text-[0.9vw] gap-10 font-semibold ">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`linkMobileNav relative hover:text-[--mainText] dark:hover:text-[--mainText] hover:decoration-2 hover:decoration-[--mainText] hover:scale-[1.1]  dark:hover:decoration-[--mainText] hover:transition-ease-in hover:duration-300  
           ${pathname === link.href
            ? "text-[--mainText] dark:hover:text-[--mainText] decoration-2 decoration-black"
            : ""
            }`}
          >
            {link.name}
          </Link>
        ))}


        <Link
          href="/resume"
          className="relative ml-10 inline-flex items-center justify-center p-2 px-5 py-2 overflow-hidden font-medium text-[--mainText] dark:text-[--mainText] transition duration-300 ease-out border-2 border-[--mainText] dark:border-[--mainText] rounded-sm shadow-md group"
        >
          <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-[--mainText] dark:bg-[--mainText] group-hover:translate-x-0 ease">
            <svg
              className="w-5 h-5 rotate-[90deg] "
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              ></path>
            </svg>
          </span>
          <span className="absolute flex items-center justify-center w-full h-full text-[--mainText] dark:text-[--mainText] transition-all duration-300 transform group-hover:translate-x-full ease">
            Resume
          </span>
          <span className="relative invisible">Resume</span>
        </Link>

        <ThemeSwitch />
      </div>
    </motion.div>
      </FadeDown>
  );
};

export default Navbar;
