import React from 'react'
import { motion } from 'motion/react'
import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi'
import { TbX } from 'react-icons/tb'

export const Toast = ({ message, type, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      className='fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl'
      style={{
        background: type === "success" ? "#0d9f6e" : type === "error" ?
          "#e02424" : "#1c1c2e",
        color: "#fff",
        minWidth: "220px",
      }}
    >
      {type === "success" ? <FiCheckCircle size={18} /> : <FiAlertCircle size={18} />}
      <p className='text-sm font-medium'>{message}</p>
      <button onClick={onClose} className='ml-auto text-white/60 hover:text-white text-xs'>
        <TbX size={18} />
      </button>
    </motion.div>
  )
}

export default Toast