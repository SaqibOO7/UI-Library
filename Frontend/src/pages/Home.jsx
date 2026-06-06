import React, { useState } from 'react'
import Auth from '../components/Auth'

function Home() {
  const [showAuth, setShowAuth] = useState(false)
  return (
    <div className=''>
      <button 
      onClick={() => setShowAuth(true)}
      className='px-4 py-2 bg-black text-white'>
        open
      </button>


      {showAuth && <Auth onClose={() => setShowAuth(false)} />}
    </div>
  )
}

export default Home
