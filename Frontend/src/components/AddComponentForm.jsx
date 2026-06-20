import React, { useState } from 'react'
import PropsInput from './PropsInput'
import { TbCodeDots, TbEye, TbX, TbDeviceFloppy, TbLoader, TbTrash } from 'react-icons/tb'
import { AnimatePresence, motion } from 'motion/react'           // ✅ added motion
import { LiveComponentPreview } from './LiveComponentPreview'
import axios from 'axios'
import { serverUrl } from '../App'
import {Toast} from './Toast'

function AddComponentForm() {
    const [name, setName] = useState('')
    const [props, setProps] = useState([])
    const [code, setCode] = useState('')
    const [codeTab, setCodeTab] = useState('code')
    const [saving, setSaving] = useState(false)
    const [publishing, setPublishing] = useState(false)
    const [savedId, setSavedId] = useState(null)
    const [isPublished, setIsPublished] = useState(false)
    const [toast, setToast] = useState(null)

    const showToast = (message, type = "info") => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3500)
    }

    const handleSave = async () => {
        if (!name.trim() || !code.trim()) {
            showToast("Component name and code are required.", "error")
            return
        }
        setSaving(true)
        try {
            const res = await axios.post(serverUrl + "/api/v1/component/save",
                { name: name.trim(), code, props }, { withCredentials: true })
            setSavedId(res.data._id)
            showToast("Component saved successfully!", "success")
        } catch (error) {
            console.log(error)
            showToast("Component save failed!", "error")
        } finally {
            setSaving(false)
        }
    }

    const handlePublished = async () => {
        if (!savedId) return;
        setPublishing(true)
        try {
            await axios.post(serverUrl + "/api/v1/component/publish",
                { componentId: savedId }, { withCredentials: true })
            setIsPublished(true)
            showToast("Published to npm successfully!", "success")
        } catch (error) {
            console.log(error)
            showToast("Publish failed!", "error")
        } finally {
            setPublishing(false)
        }
    }

    return (
        <div className='px-4 sm:px-6 lg:px-8 py-5 sm:py-6 max-w-3xl w-full mx-auto'>
            <h2 className='text-base sm:text-lg font-bold mb-1'>Add Component</h2>
            <p className='text-white/35 text-xs mb-5 sm:mb-6'>
                Manually add a component — give it a name, define props, paste the code and preview it.
            </p>

            <div className='space-y-4 sm:space-y-5'>
                <div className='p-3.5 sm:p-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] space-y-2'>
                    <label htmlFor="name" className='text-xs font-semibold text-white/50 uppercase tracking-wider block'>
                        Component Name
                    </label>
                    <input
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        type="text"
                        id='name'
                        placeholder='e.g. "PricingCard", "HeroSection"'
                        className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5
                         text-sm text-white placeholder-white/20 outline-none focus:border-[#3be8ff]/40 transition-colors"
                    />
                </div>

                <div className='p-3.5 sm:p-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] space-y-2'>
                    <label className='text-xs font-semibold text-white/50 uppercase tracking-wider block'>Props</label>
                    <PropsInput props={props} setProps={setProps} />
                </div>

                <div className='rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden'>
                    <div className='flex items-center justify-between px-3.5 sm:px-4 py-3 border-b border-white/[0.06]'>
                        <label className='text-xs font-semibold text-white/50 uppercase tracking-wider'>
                            Component Code
                        </label>
                        <div className="flex gap-1 rounded-xl p-1" style={{ background: "rgba(0,0,0,0.3)" }}>
                            {["code", "preview"].map((tab) => (
                                <button
                                    onClick={() => setCodeTab(tab)}
                                    key={tab}
                                    className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5
                                     rounded-lg text-xs font-medium transition-all capitalize border-none cursor-pointer"
                                    style={{
                                        background: codeTab === tab ? "rgba(59,232,255,0.2)" : "transparent",
                                        color: codeTab === tab ? "#3be8ff" : "rgba(255,255,255,0.4)",
                                    }}>
                                    {tab === 'code' ? <TbCodeDots size={12} /> : <TbEye size={12} />}
                                    <span className='hidden xs:inline'>{tab}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <AnimatePresence mode='wait'>
                        {codeTab === "code" ? (
                            <motion.div key="code" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <textarea
                                    onChange={(e) => setCode(e.target.value)}
                                    value={code}
                                    rows={12}
                                    placeholder={`export default function MyComponent({ title }) {\n  return (\n    <div>\n      <h1>{title}</h1>\n    </div>\n  );\n}`}
                                    className="w-full bg-[#0d1117] px-4 sm:px-5 py-4 text-xs leading-relaxed
                                     text-green-300 font-mono resize-none outline-none placeholder-white/10"
                                    style={{ minHeight: 220 }}
                                />
                            </motion.div>
                        ) : (
                            <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="p-3.5 sm:p-4">
                                {code.trim() ? (
                                    <LiveComponentPreview code={code} />
                                ) : (
                                    <div className="h-36 sm:h-40 flex items-center justify-center text-white/20
                                     text-sm rounded-xl"
                                        style={{ border: "1px dashed rgba(255,255,255,0.08)" }}>
                                        Paste some code first to see the preview
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className='flex items-center gap-2 sm:gap-3 flex-wrap pt-1'>
                    <motion.button
                        onClick={handleSave}
                        whileTap={{ scale: 0.97 }}
                        disabled={saving || !!savedId}
                        className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold
                         disabled:opacity-40 disabled:cursor-not-allowed transition-all border-none cursor-pointer"
                        style={{
                            background: savedId ? "rgba(16,185,129,0.12)" : "rgba(59,232,255,0.12)",
                            color: savedId ? "#34d399" : "#3be8ff",
                            border: `1px solid ${savedId ? "rgba(16,185,129,0.3)" : "rgba(59,232,255,0.25)"}`,
                        }}>
                        {saving ? (
                            <motion.span animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                                <TbDeviceFloppy size={15} />
                            </motion.span>
                        ) : (
                            <TbDeviceFloppy size={15} />
                        )}
                        {saving ? "Saving..." : savedId ? "Saved ✓" : "Save Component"}
                    </motion.button>

                    <AnimatePresence>
                        {savedId && !isPublished && (
                            <motion.button
                                onClick={handlePublished}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -8 }}
                                whileTap={{ scale: 0.97 }}
                                disabled={publishing}
                                className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-sm
                                 font-semibold disabled:opacity-40 transition-all border-none cursor-pointer"
                                style={{
                                    background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
                                    boxShadow: publishing ? "none" : "0 0 20px rgba(6,182,212,0.25)",
                                    color: "#fff",
                                }}>
                                {publishing ? (
                                    <motion.span animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                                        <TbLoader size={15} />
                                    </motion.span>
                                ) : (
                                    <TbLoader size={15} />
                                )}
                                {publishing ? "Publishing..." : "Publish to npm"}
                            </motion.button>
                        )}

                        {isPublished && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
                                style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", color: "#34d399" }}>
                                ✓ Published
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {(savedId || name || code) && (
                        <button
                            onClick={() => {
                                setName(""); setProps([]); setCode("");
                                setSavedId(null); setIsPublished(false); setCodeTab("code");
                            }}
                            className="ml-auto flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs
                             text-white/30 hover:text-white/60 transition-all bg-transparent border-none cursor-pointer">
                            <TbTrash size={13} /> Reset
                        </button>
                    )}
                </div>

                <AnimatePresence>
                    {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default AddComponentForm