"use client";
import SocialMediaLinks from "@/components/utility/SocialMediaLinks";
import React from "react";
import { useEffect, useRef, useState } from "react";
import FlipWordsDemo from "@/components/utility/FlipWords"
import AboutPage from "@/app/about/page"
import Link from "next/link";
import Github from "@/components/utility/Github";

import AboutHero from "@/components/about/herosection";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import FadeUp from "@/animations/fade-up";
import Skill from "@/components/skill/page"
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import {OrbitingCirclesDemo} from "@/components/skill/SpinSkill"
import {LineShadowTextDemo} from "@/components/skill/TextShadow"





export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  let progress = 0;
  const { current: elContainer } = ref;

  if (elContainer) {
    progress = Math.min(1, scrollY / elContainer.clientHeight);
  }

  const handleScroll = () => {
    setScrollY(window.scrollY);
  };

  useEffect(() => {
    document.addEventListener("scroll", handleScroll);

    return () => document.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div 
      className="relative w-full min-h-60 md:min-h-[85vh px-6 sm:px-14">
      <AnimatePresence>
        <div className="div w-full md:flex mt-10 sm:mt-0 ">
        <motion.div animate={{
          transform: `translateY(${progress * 10}vh)`,
        }}
        transition={{ type: "spring", stiffness: 30 }}
        ref={ref} className=" w-full sm:w-1/2 h-[40vh] md:order-2 order-2 sm:h-[80vh] flex flex-col sm:justify-end gap-2 pt-10 sm:pt-0 text-black dark:text-white ">
          <FadeUp key="title" duration={0.6} ><pre className="font-bold"><h1 className="text-[8vw] sm:text-[3vw] sm:text-3xl md:text-6xl font-[MyCustomFont]">Hi, I&apos;m Akash Kumar</h1>
            <span className="font-[MyCustomFont] text-[6vw] sm:text-[2.5vw]" >I'am </span><span className=" text-[6vw] sm:text-[2.5vw] inline " ><FlipWordsDemo /></span></pre>
          </FadeUp>
          <FadeUp key="description" duration={0.6} delay={0.4}>
            <p className="text-[4vw] sm:text-[1.2vw] ">I&apos;m a software developer specializing in high-performance, user-centric web applications. Skilled in <span className="text-[--mainText] dark:text-[--mainText] ">React.js</span>, <span className="text-[--mainText] dark:text-[--mainText]">Next.js</span>, and modern web technologies, I build seamless, scalable, and efficient solutions across the stack.</p>
          </FadeUp>
        </motion.div>
          <div className="div lgogo md:w-1/2 h-[40vh] md:h-[80vh] md:order-2 order-1">
             <DotLottieReact
                  src="https://lottie.host/ccac4c1a-7949-4c3d-a994-a52eb1bbe2c2/6Dw6pLfsWp.lottie"
                  loop
                  autoplay
                  className="w-full h-full"
                />
          </div>
        </div>


        <FadeUp key="about" duration={0.6} whileInView={true} >
          <div className="aboutMe">
            <AboutHero />
          </div>
        </FadeUp>
        <FadeUp key="skills" duration={0.6} whileInView={true} >

          <div className="skill w-full min-h-60  md:mt-28 sm:mt-72 ">
            <LineShadowTextDemo />
            <Skill />
          </div>
          <OrbitingCirclesDemo />
        </FadeUp>
        <FadeUp key="github" duration={0.6} whileInView={true} >
          <div className="github w-full sm:mb-40  flex justify-center md:mt-28 items-center">
            <Github />
          </div>
        </FadeUp>
      </AnimatePresence>




    </div>
  );
}
