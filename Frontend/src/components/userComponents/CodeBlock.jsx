import React from 'react'
import { CopyBtn } from './CopyBtn'

export function CodeBlock({ code, lang = "jsx" }) {
  return (
    <div className="rounded-xl overflow-hidden"
      style={{
        background: "#060f11",
        border: "1px solid rgba(255,255,255,0.06)"
      }}>

      <div className='flex items-center justify-between px-4 py-2 border-b border-white/[0.05]'>
        <span className='text-[10px] text-white/25 font-mono uppercase tracking-widest'>
          {lang}
        </span>
        <CopyBtn text={code} />
      </div>

      <pre className='px-4 py-3.5 text-[12px] font-mono text-green-300 leading-relaxed overflow-x-auto whitespace-pre'>
        {code}
      </pre>
    </div>
  )
}

export default CodeBlock