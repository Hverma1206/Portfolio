import { useEffect, useState, useRef } from "react";
import DisplayCard from "../components/DisplayCard";
import { motion, AnimatePresence } from "framer-motion";
import EyeAnimation from "../animations/EyeAnimation";
import HomeSocials from "../components/HomeSocials";
import { u } from "motion/react-m";


function Home() {
  const containerRef = useRef(null);



  return (
    <DisplayCard className="relative overflow-hidden">
      <div
        className="absolute bottom-14 left-1/2 transform -translate-x-1/2 -translate-y-1/4 z-0"
        ref={containerRef}
      >
        <EyeAnimation scale={3} />
      </div>

      <div className="container text-[var(--text-black-900)] text-center h-screen flex flex-col gap-8 items-center justify-center relative z-10">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-xl font-semibold"
        >
          I am
        </motion.p>

        <motion.h1
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="capitalize text-[var(--text-black-900)] leading-none font-extrabold text-5xl md:text-[6rem]"
          whileHover={{ rotate: 1 }}
        >
          Himanshu{" "}
          <span className='text-[var(--skin-color)] font-["Clicker_Script",_cursive]'>
            Verma
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <p className="text-3xl font-semibold md:text-5xl">
            I am a{" "}
            <span className="text-[var(--skin-color)] cursor-pointer hover:underline hover:text-[var(--skin-color-dark)] transition-colors duration-300 text-[2rem] md:text-5xl inline-block relative group">
              Software Engineer
          
            </span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="w-full md:w-1/2 mx-auto"
          whileInView={{ scale: 1.1 }}
          viewport={{ once: true }}
        >
          <HomeSocials />
        </motion.div>
      </div>
      
    </DisplayCard>
    
  );
}

export default Home;
