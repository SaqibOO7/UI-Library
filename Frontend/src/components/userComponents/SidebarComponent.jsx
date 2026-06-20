import React from 'react'
import { TbSearch, TbChevronRight } from "react-icons/tb";

export function SidebarComponent({ myComponents, selected, onSelect, search, setSearch }) {
  return (
    <>
      <div className='px-3 py-3 border-b border-white/[0.05]'>
        <div className='flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06]'>
          <TbSearch size={13} className="text-white/25 shrink-0" />
          <input
            placeholder="Search..."
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            className="bg-transparent text-xs text-white/70 placeholder-white/20 outline-none w-full" />
        </div>
      </div>

      <div className='px-4 pt-3 pb-1.5'>
        <p className='text-[9px] font-bold tracking-[2.5px] uppercase text-white/20'>My Components . {myComponents.length}</p>
      </div>

      <div className='flex-1 overflow-y-auto py-1 px-2'>
        {myComponents.length === 0 ? (
          <p className="text-white/20 text-xs text-center py-8 px-3">No components yet</p>
        ) : (
          myComponents.map((c) => (
            <button key={c._id}
              onClick={() => onSelect(c)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all cursor-pointer border text-left mb-0.5"
              style={{
                background: selected?._id === c._id ? "rgba(59,232,255,0.07)" : "transparent",
                borderColor: selected?._id === c._id ? "rgba(59,232,255,0.18)" : "transparent",
                color: selected?._id === c._id ? "#3be8ff" : "rgba(255,255,255,0.5)",
              }}>
              <span className="truncate font-medium text-xs">{c.name}</span>
              {selected?._id === c._id && <TbChevronRight size={13} className="shrink-0 ml-1" />}
            </button>
          ))
        )}
      </div>
    </>
  )
}

export default SidebarComponent