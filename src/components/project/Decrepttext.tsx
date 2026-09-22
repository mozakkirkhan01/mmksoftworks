import DecryptedText from '@/components/ui/DecryptedText';

export default function Decrepttext() {
  return (
    <div>
      <div className='w-full text-center mt-[4rem] md:hidden'>
        <DecryptedText
        className='text-[3rem] md:text-4xl font-semibold text-black dark:text-white text-center'
          text="PROJRECTS"
          animateOn="view"
          revealDirection="center"
        />
      </div>
    </div>
  );
}