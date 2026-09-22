import { Fade } from 'hamburger-react'
import React from 'react'
import FadeUp from '@/animations/fade-up'

const Footer = () => {
  return (
    <FadeUp duration={1.2}  whileInView>
    <div className='h-[7vh]  w-full flex gap-4 justify-center items-center' >
        <div className='w-[20%] md:w-[30%] h-[0.2vh] bg-black dark:bg-white'> </div>
        <h1 className='text-[3vw] md:text-[1vw]' >made with ❤️ <span className='text-[--mainText] dark:text-[--mainText]' >Akash</span></h1>
        <div className=' w-[20%] md:w-[30%] h-[0.2vh] bg-black dark:bg-white'> </div>
    </div>
    </FadeUp>
  )
}

export default Footer