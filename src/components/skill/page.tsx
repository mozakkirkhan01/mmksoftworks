import React from 'react'
import SVG from "@/assets/svg/svg"
import Image from 'next/image'
import Fadeup from "@/animations/fade-up"

const page = () => {
  return (
    <div className="skill w-full flex items-center justify-center flex-wrap gap-8">
      {SVG.map((item, index) => (
        <Fadeup key={index} duration={0.6} whileInView>
        <div
          key={index}
          className="hoverdiv h-24 sm:h-28 w-28 sm:w-36 relative flex flex-col justify-center items-center bg-gray-200 dark:bg-gray-700 rounded-lg">
          <div className="skillborder  border-2 border-dotted rounded-lg border-[--mainText] dark:border-[--mainText]">
          </div>
          <Image src={item.src} alt="C++" width={60} height={60} className="iamgeskill relative z-20" />
          <p className="textSkill relative z-20 text-[3vw] sm:text-[1.1vw] mt-1 ">{item.name}</p>
        </div>
        </Fadeup>
      ))}
    </div>
  )
}
export default page