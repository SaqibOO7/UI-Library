import React from 'react'
import { motion } from 'motion/react'
import { TbPackage } from "react-icons/tb";

export function GuidePanel() {
  return (
    <div className='flex flex-col items-center justify-center h-full px-6 sm:px-8 text-center py-10 sm:py-16'>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='w-full'>

        <div className='w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#3be8ff]/[07] border border-[#3be8ff]/15 
        flex items-center justify-center mx-auto mb-5 sm:mb-6'>
          <TbPackage size={24} className="text-[#3be8ff]/60" />
        </div>

        <h2 className="text-base sm:text-lg font-bold mb-2 text-white/80">Select a component</h2>
        <p className="text-white/35 text-xs sm:text-sm mb-8 sm:mb-10 max-w-sm mx-auto leading-relaxed">
          Click any component from the sidebar to see its preview,
          code, and usage guide.
        </p>

        <p className="text-white/20 text-xs">
          ← Select a component from the sidebar to get started
        </p>
      </motion.div>
    </div>
  )
}

export default GuidePanel