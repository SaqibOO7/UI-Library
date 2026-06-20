import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  FiUploadCloud, FiLoader, FiCheckCircle, FiAlertCircle,
  FiArrowLeft, FiFileText, FiInfo
} from "react-icons/fi"
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../App'
import { Toast } from '../components/Toast'

function SubmitForApproval() {
  const { userData } = useSelector((state) => state.user)
  const navigate = useNavigate()
  const [userComponents, setUserComponents] = useState([])
  const [selectedComponent, setSelectedComponent] = useState(null)
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [toast, setToast] = useState(null)

  // Fetch user's components that haven't been submitted yet
  useEffect(() => {
    if (!userData) {
      navigate('/')
      return
    }

    const fetchComponents = async () => {
      try {
        const { data } = await axios.get(
          serverUrl + '/api/v1/submission/user-components',
          { withCredentials: true }
        )
        setUserComponents(data)
        setLoading(false)
      } catch (error) {
        console.error("Fetch error:", error)
        showToast("Failed to load your components", "error")
        setLoading(false)
      }
    }

    fetchComponents()
  }, [userData, navigate])

  const showToast = (message, type = "info") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedComponent) {
      showToast("Please select a component", "error")
      return
    }

    setSubmitting(true)

    try {
      const { data } = await axios.post(
        serverUrl + '/api/v1/submission/submit-for-approval',
        {
          componentId: selectedComponent._id,
          description: description.trim() || ""
        },
        { withCredentials: true }
      )

      setSubmitted(true)
      showToast("Component submitted successfully! ✅", "success")

      // Reset form after 2 seconds
      setTimeout(() => {
        setSelectedComponent(null)
        setDescription("")
        setSubmitted(false)
      }, 2000)

    } catch (error) {
      console.error("Submit error:", error)
      const errorMsg = error.response?.data?.message || "Failed to submit component"
      showToast(errorMsg, "error")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-300">Loading your components...</p>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <FiAlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-slate-300">Please log in to submit components</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      {/* Header */}
      <div className="max-w-3xl mx-auto mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-6"
        >
          <FiArrowLeft className="w-5 h-5" />
          Go Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-3">Submit for Approval</h1>
          <p className="text-slate-400 text-lg">
            Submit your components to our admin team for review. Once approved, your component will be published and you'll earn AI Credits! 🎉
          </p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-8"
        >
          {/* Success State */}
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center">
                  <FiCheckCircle className="w-10 h-10 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Submitted Successfully! 🎉</h2>
                <p className="text-slate-400 mb-6">
                  Your component has been submitted for review. Our admin team will review it soon.
                </p>
                <div className="bg-slate-700/50 rounded-lg p-4 text-left">
                  <p className="text-slate-300">
                    <span className="font-semibold">Component:</span> {selectedComponent?.name}
                  </p>
                  {description && (
                    <p className="text-slate-400 text-sm mt-2">
                      <span className="font-semibold">Your note:</span> {description}
                    </p>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Component Selection */}
                <div>
                  <label className="block text-white font-semibold mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <FiFileText className="w-5 h-5 text-cyan-400" />
                      Select Component to Submit
                    </div>
                  </label>

                  {userComponents.length === 0 ? (
                    <div className="bg-slate-700/30 border border-dashed border-slate-600 rounded-lg p-8 text-center">
                      <FiAlertCircle className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                      <p className="text-slate-400">
                        You don't have any components to submit yet.
                      </p>
                      <button
                        type="button"
                        onClick={() => navigate('/generate')}
                        className="text-cyan-400 hover:text-cyan-300 mt-3 font-semibold"
                      >
                        Generate a Component →
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {userComponents.map((component) => (
                        <motion.button
                          key={component._id}
                          type="button"
                          onClick={() => setSelectedComponent(component)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                            selectedComponent?._id === component._id
                              ? 'border-cyan-400 bg-cyan-400/10'
                              : 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-white font-semibold">{component.name}</h3>
                              <p className="text-slate-400 text-sm mt-1">
                                {component.code ? component.code.substring(0, 100) + '...' : 'No code'}
                              </p>
                            </div>
                            {selectedComponent?._id === component._id && (
                              <div className="w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center mt-1">
                                <span className="text-white text-sm font-bold">✓</span>
                              </div>
                            )}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-white font-semibold mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <FiInfo className="w-5 h-5 text-cyan-400" />
                      Description/Notes (Optional)
                    </div>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tell the admin team about your component. What does it do? Any special features?"
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none transition-colors resize-none"
                    rows="4"
                    maxLength="500"
                  />
                  <p className="text-slate-500 text-sm mt-2">
                    {description.length}/500 characters
                  </p>
                </div>

                {/* Info Box */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="text-blue-300 text-sm">
                    <span className="font-semibold">💡 Info:</span> After approval, your component will be published and you'll earn 100 AI Credits!
                  </p>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={!selectedComponent || submitting}
                  whileHover={{ scale: !submitting ? 1.02 : 1 }}
                  whileTap={{ scale: !submitting ? 0.98 : 1 }}
                  className={`w-full py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                    submitting || !selectedComponent
                      ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-lg hover:shadow-cyan-500/50'
                  }`}
                >
                  {submitting ? (
                    <>
                      <FiLoader className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FiUploadCloud className="w-5 h-5" />
                      Submit for Approval
                    </>
                  )}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 bg-slate-800/30 border border-slate-700/50 rounded-xl p-6"
        >
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <FiInfo className="w-5 h-5 text-cyan-400" />
            Tips for Approval
          </h3>
          <ul className="space-y-2 text-slate-400 text-sm">
            <li className="flex gap-3">
              <span className="text-cyan-400 font-bold">•</span>
              <span>Make sure your component is well-tested and functional</span>
            </li>
            <li className="flex gap-3">
              <span className="text-cyan-400 font-bold">•</span>
              <span>Components should be reusable and follow best practices</span>
            </li>
            <li className="flex gap-3">
              <span className="text-cyan-400 font-bold">•</span>
              <span>Provide clear descriptions to help admins understand your component</span>
            </li>
            <li className="flex gap-3">
              <span className="text-cyan-400 font-bold">•</span>
              <span>Check your component's code quality and styling</span>
            </li>
          </ul>
        </motion.div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} />}
      </AnimatePresence>
    </div>
  )
}

export default SubmitForApproval