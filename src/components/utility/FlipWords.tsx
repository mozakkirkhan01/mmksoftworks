"use client";
import React from "react";
import { FlipWords } from "../ui/flip-words";

const FlipWordsDemo=()=> {
  const words = ["Web Developer", "UI Designer", "Creator"];

  return (
    <>
        <FlipWords words={words} /> 
    </>
      
  );
}
export default FlipWordsDemo