"use client";
import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";


pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs"; 

const Resume: React.FC = () => {
  const [width, setWidth] = useState<number>(1200);

  useEffect(() => {
    setWidth(window.innerWidth);

    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="py-16 px-8 bg-transparent dark:bg-transparent">
      <div className="flex justify-center my-4">
      </div>
      {/* PDF viewer */}
      <div className="flex justify-center">
        <Document
          file="/resume.pdf" 
          className="shadow-lg rounded-lg"
        >
          <Page pageNumber={1} scale={width > 786 ? 1.7 : 0.6} />
        </Document>
      </div>
    </div>
  );
};

export default Resume;
