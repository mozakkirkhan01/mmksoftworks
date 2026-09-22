"use client";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { cursorTrail } from "@/components/ui/cursor-trail";

export interface CursorTrailCanvasProps {
  color?: string;
  className?: string;
  style?: CSSProperties;
}

export default function CursorTrailCanvas(props: CursorTrailCanvasProps) {
  const refCanvas = useRef<HTMLCanvasElement>(null!);
  const [mainTextColor, setMainTextColor] = useState("#A294F9");
  

  useEffect(() => {
    // Ensure this runs only in the browser
    if (typeof window !== "undefined") {
      const rootStyle = getComputedStyle(document.documentElement);
      const color = rootStyle.getPropertyValue("--mainText").trim();
      setMainTextColor(color || "#A294F9");
    }

    const { cleanUp, renderTrailCursor } = cursorTrail({
      ref: refCanvas,
      color: props.color || mainTextColor, 
    });

    renderTrailCursor();

    return () => {
      cleanUp();
    };
  }, [props.color, mainTextColor]); 

  return <canvas ref={refCanvas} className={props.className} style={props.style}></canvas>;
}
