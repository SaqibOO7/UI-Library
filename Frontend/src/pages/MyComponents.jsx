import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TbLayoutSidebarLeftExpand, TbX, TbMenu2 } from "react-icons/tb";
import { TbHexagon } from "react-icons/tb";
import { useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'motion/react'

import { GuidePanel } from '../components/userComponents/GuidePanel'
import { DetailPanel } from '../components/userComponents/DetailPanel'
import { SidebarComponent } from '../components/userComponents/SidebarComponent'

function MyComponents() {
  const navigate = useNavigate()
  const { allComponents, userData } = useSelector((s) => s.user)

  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const myComponents = (allComponents || [])
    .filter((c) => c.visibility === "private")
    .filter((c) => c.owner?._id === userData?._id)
    .filter((c) => c.name?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.name?.localeCompare(b.name));

  const handleSelect = (c) => {
    setSelected(c)
    setSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-[#030b0d] text-white flex flex-col overflow-hidden"
      style={{ fontFamily: "'DM Sans', sans-serif" }}>

      <nav className='sticky top-0 z-40 flex items-center justify-between px-4 sm:px-8 py-3.5 sm:py-4 border-b
         border-white/[0.05] bg-[#030b0d]/90 backdrop-blur-md shrink-0'>

        <button
          onClick={() => navigate('/')}
          className='flex items-center gap-2 sm:gap-2.5 bg-transparent border-none cursor-pointer'
        >
          <div className='w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-[#3be8ff] to-[#0ab5d4] flex
           items-center justify-center shadow-[0_0_14px_rgba(59,232,255,0.35)]'>
            <TbHexagon size={13} color="#051c20" />
          </div>
          <span className="text-sm sm:text-base font-bold text-white"
            style={{ fontFamily: "'Syne',sans-serif" }}>Strata</span>
        </button>

        <div className='flex items-center gap-2'>
          <div className='hidden sm:flex items-center gap-2 text-xs text-white/30'>
            <TbLayoutSidebarLeftExpand size={14} />
            <span>Component Explorer</span>
          </div>

          <button
            onClick={() => setSidebarOpen(true)}
            className='sm:hidden flex items-center justify-center w-8 h-8 rounded-xl bg-white/[0.04] border
           border-white/[0.08] text-white/50 hover:text-white/80 transition-colors cursor-pointer'
          >
            <TbMenu2 size={16} />
          </button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden" style={{ height: "calc(100vh - 57px)" }}>

        <aside className='hidden sm:flex w-52 md:w-56 shrink-0 flex-col border-r border-white/[0.06] bg-[#040e11]
         overflow-hidden'
        >
          <SidebarComponent selected={selected} search={search} setSearch={setSearch}
            myComponents={myComponents} onSelect={handleSelect} />
        </aside>

        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSidebarOpen(false)}
                className='sm:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm'
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 320, damping: 32 }}
                className='sm:hidden fixed top-0 left-0 z-60 h-full w-72 flex flex-col bg-[#040e11] border-r
                 border-white/[0.08]'
              >
                <div className='flex items-center justify-between px-4 py-4 border-b border-white/[0.06]'>
                  <span className='text-xs font-bold text-white/40 tracking-widest uppercase'>
                    Components
                  </span>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className='w-7 h-7 rounded-lg flex items-center justify-center text-white/40 
                  hover:text-white/70 hover:bg-white/[0.06] transition-colors cursor-pointer bg-transparent border-none'>
                    <TbX size={14} />
                  </button>
                </div>

                <SidebarComponent selected={selected} search={search} setSearch={setSearch}
                  myComponents={myComponents} onSelect={handleSelect} />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <main className='flex-1 overflow-auto bg-[#030b0d] min-w-0'>
          {
            selected ? (
              <DetailPanel component={selected} onBack={() => setSelected(null)} />
            ) : (
              <GuidePanel />
            )
          }
        </main>
      </div>
    </div>
  )
}

export default MyComponents