"use client";
import React from 'react'
import AboutHero from "@/components/about/herosection";
import TimelineDemo from "@/components/about/TimeLine"
import { TerminalDemo } from '@/components/about/Terminal';
import { Form } from "@/components/utility/Form"
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const page = () => {
  return (
    <>
      <div className="div px-4 ">
        <div className="div w-full sm:h-[90vh] gap-4 h-[80vh] flex md:flex-row flex-col jc items-center">

          <div className="aboutHero w-full md:w-1/2 h-full ">
            <DotLottieReact
              src="https://lottie.host/45a49eb4-59f3-493e-ad68-00c1d52e08d5/axSgYW87xb.lottie"
              loop
              autoplay
            />


          </div>
          <div className="abouterminal w-full md:w-1/2 h-full flex items-center justify-left  ">
            <TerminalDemo />
          </div>

        </div>
        <TimelineDemo />

      </div>
      <div className="main" id='email'>
        <Form />
      </div>
    </>
  )
}

export default page