
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  return <header className="w-full py-6 px-4 md:px-8 flex flex-col items-center bg-gradient-to-r from-[#003158] to-[#00518F] text-white">
      <motion.div initial={{
      opacity: 0,
      y: -20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.5
    }} className="text-center max-w-4xl">
        <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 0.2,
        duration: 0.5
      }} className="flex items-center justify-center">
          <span className="inline-block px-3 py-1 text-xs font-medium bg-white text-[#003158] mb-4">
            Use Case Mapper
          </span>
        </motion.div>
        
        <motion.h1 initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 0.3,
        duration: 0.5
      }} className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4">Data Driven Viking Line</motion.h1>
        
        <motion.p initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 0.4,
        duration: 0.5
      }} className="text-lg md:text-xl text-gray-100 max-w-3xl mx-auto mb-8">Overview of our project towards data driven success</motion.p>
        
        <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 0.5,
        duration: 0.5
      }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button className="px-8 py-6 text-md font-medium transition-all bg-[#E3000F] hover:bg-[#c5000d] text-white hover:shadow-lg border-none">Overview</Button>
          <Button variant="outline" className="px-8 py-6 text-md font-medium transition-all border-white hover:bg-white/10 text-slate-400">About the project</Button>
        </motion.div>
      </motion.div>
      
      <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      delay: 0.9,
      duration: 0.5
    }} className="mt-16 flex justify-center">
        <ChevronDown className="animate-bounce w-8 h-8 text-white" />
      </motion.div>
    </header>;
};

export default Header;
