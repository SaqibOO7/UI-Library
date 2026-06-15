import React, { useState } from 'react'
import PropsInput from './PropsInput'

function AddComponentForm() {

    const [name, setName] = useState('')
    const [props, setProps] = useState([])
    const [code, setCode] = useState('')

    return (
        <div className='px-4 sm:px-6 lg:px-8 py-5 sm:py-6 max-w-3xl w-full mx-auto'>
            <h2 className='text-base sm:text-lg font-bold mb-1'>
                Add Component
            </h2>
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
                        className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-sm
                         text-white placeholder-white/20 outline-none focus:border-[#3be8ff]/40 transition-colors"
                    />
                </div>

                <div className='p-3.5 sm:p-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] space-y-2'>
                    <label className='text-xs font-semibold text-white/50 uppercase tracking-wider block'>Props</label>
                    <PropsInput props={props} setProps={setProps} />
                </div>
            </div>

        </div>
    )
}

export default AddComponentForm
