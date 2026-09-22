"use client";
import React from "react";
import {ThreeDMarqueeDemo} from "@/components/project/ProejctHero"
import { TextHoverEffectDemo } from "@/components/project/HoverText";
import Decrepttext from "@/components/project/Decrepttext";

const UnderConstruction = () => {
  return (
    <div>
      <Decrepttext />
      <TextHoverEffectDemo />
      <ThreeDMarqueeDemo />
      <div className="min-h-[80vh] flex items-center justify-center bg-[--Background] text-[--mainText] px-4 sm:px-8">
      <div className="text-center relative p-6 sm:p-10 border-2 border-dotted rounded-lg border-[--mainText] dark:border-[--mainText] w-full max-w-lg">
        <h1 className="text-2xl sm:text-4xl font-light text-[--mainText]">Project page in Under Construction</h1>
        <div className="relative w-24 h-24 mx-auto my-6">
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            className="animate-spin-slow w-full h-full"
          >
            <g stroke="currentColor" fill="none">
              <circle cx="50" cy="50" r="40" strokeWidth="4" className="opacity-50" />
              <path d="M50 15 L60 50 L50 85 L40 50 Z" strokeWidth="4" />
            </g>
          </svg>
        </div>
        <p className="font-light text-sm sm:text-base">Please forgive the inconvenience.</p>
        <p className="font-light text-sm sm:text-base">I am currently initializing my project page.</p>
        <p className="font-medium mt-2 text-sm sm:text-base">It's okay, I am excited too!</p>
      </div>
    </div>
    </div>
  );
};

export default UnderConstruction;
