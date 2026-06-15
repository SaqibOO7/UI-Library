import React, { useState } from 'react'

function PropsInput({ props, setProps }) {
    const [input, setInput] = useState("")

    const addProps = () => {
        const trimmed = input.trim()
        if (trimmed && !props.includes(trimmed)) {
            setProps([...props, trimmed])
        }
        setInput("")
    }

    const removeProps = (p) => setProps(props.filter((x) => x !== p))

    return (
        <div>
            <div className='flex flex-wrap gap-1.5 mb-2 min-h-[28px]'>
                {props.map((p) => (
                    <span key={p}
                        className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold"
                        style={{ background: "rgba(167,139,250,0.15)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.25)" }}>
                        {p}
                        <button
                            onClick={() => removeProps(p)}
                            className="ml-0.5 opacity-60 hover:opacity-100 transition-opacity bg-transparent border-none cursor-pointer p-0 leading-none"
                            style={{ color: "#a78bfa" }}>
                            <TbX size={11} />
                        </button>

                    </span>
                ))}

                {props.length === 0 && (
                    <span className="text-xs text-white/20 self-center">No props added yet</span>
                )}

            </div>

            <div className='flex gap-2'>
                <input
                    onChange={(e) => setInput(e.target.value)}
                    value={input}
                    placeholder='e.g. "title", "onClick", "children"'
                    className="flex-1 min-w-0 bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-[#a78bfa]/50 transition-colors"

                />
                <button
                    onClick={addProps}
                    className="px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold border-none cursor-pointer transition-all whitespace-nowrap"
                    style={{
                        background: "rgba(167,139,250,0.15)",
                        color: "#a78bfa", border: "1px solid rgba(167,139,250,0.25)"
                    }}>
                    Add
                </button>
            </div>
            <p className="text-[10px] text-white/20 mt-1.5">
                Press <span className="px-1 py-0.5 rounded bg-white/5 text-white/40 text-[9px]">
                    Enter
                </span> or comma to add a prop
            </p>
        </div>
    )
}

export default PropsInput
