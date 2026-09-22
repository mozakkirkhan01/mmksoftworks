"use client";
import React from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import Image from "next/image";
import Link from "next/link";
import favicon from "@/assets/favicon.ico"
import Github from "@/assets/github.png"
import Linkedin from "@/assets/linkedin.png"
import Youtube from "@/assets/youtube.png"
import { WobbleCard } from "@/components/ui/wobble-card";
import { WobbleCardYoutube } from "@/components/ui/wobble-card-youtube";

const HeroScrollDemo = () => {
  return (

    <div className="flex flex-col ">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-[2rem] md:text-4xl font-semibold text-black dark:text-white">
              This is all  <br />
              <span className="text-[3.5rem] text-[--mainText] dark:text-[--mainText] md:text-[5rem] font-bold mt-1 leading-none">
                ABOUT ME
              </span>
            </h1>
          </>
        }
      >
        <div
          className="w-full rounded-2xl object-cover h-full object-left-top flex flex-col gap-2 ">
          <div className="linkdin-github gap-2 md:h-1/2 h-full  w-full  flex md:flex-row flex-col">
            <WobbleCard>

              <div className="github-page-div rounded-2xl md:w-full h-full">
                <Link href="https://github.com/Akashkumar9508">
                  <Image src={Github} className="h-full w-full relative z-50" title="visit on Github" alt="GitHub Logo" />
                </Link>
              </div>

            </WobbleCard>
            <WobbleCard>
              <div className="w-full md:w-full h-full  rounded-2xl overflow-hidden ">
                <Link href={"https://www.linkedin.com/in/akashkkumar9508/"}>
                  <Image src={Linkedin} alt="logo" className="h-full w-full relative z-50 " title="visit on Linkedin"></Image>
                </Link>
              </div>
            </WobbleCard>
          </div>
          <WobbleCardYoutube>
            <div className="youtube h-full w-full rounded-2xl overflow-hidden hidden md:block">
              <Link href="https://www.youtube.com/@codeon-9508">
                <Image src={Youtube} alt="logo" className="h-full w-full relative z-50" title="visit on Youtube" ></Image>
              </Link>
            </div>
          </WobbleCardYoutube>
        </div>
      </ContainerScroll>
    </div>

  );
}

export default HeroScrollDemo