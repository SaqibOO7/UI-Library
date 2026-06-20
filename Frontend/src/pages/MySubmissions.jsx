import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  FiArrowLeft, FiLoader, FiAlertCircle, FiCheckCircle,
  FiClock, FiX, FiChevronDown, FiMessageCircle
} from "react-icons/fi"
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../App'
import { Toast } from '../components/Toast'

function MySubmissions() {
  const { userData } = useSelector((state) => state.user)
  const navigate = useNavigate()
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (!userData) {
      navigate('/')
      return
    }

    const fetchSubmissions = async () => {
      try {
        // Fetch all user components (which will include submitted ones)
        const { data } = await axios.get(
          serverUrl + '/api/v1/submission/user-components',
          { withCredentials: true }
        )

        // Filter to show only submitted, approved, or rejected components
        const filteredSubmissions = data.filter(
          comp => comp.status === 'submitted' || comp.status === 'approved' || comp.status === 'rejected'
        )

        setSubmissions(filteredSubmissions)
        setLoading(false)
      } catch (error) {
        console.error("Fetch error:", error)
        showToast("Failed to load submissions", "error")
        setLoading(false)
      }
    }

    fetchSubmissions()
  }, [userData, navigate])

  const showToast = (message, type = "info") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }

  const getStatusConfig = (status) => {
    const configs = {
      submitted: {
        icon: FiClock,
        color: "text-blue-400",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-500/30",
        label: "Pending Review",
        badge: "Waiting for Admin"
      },
      approved: {
        icon: FiCheckCircle,
        color: "text-green-400",
        bgColor: "bg-green-500/10",
        borderColor: "border-green-500/30",
        label: "Approved ✅",
        badge: "Published"
      },
      rejected: {
        icon: FiX,
        color: "text-red-400",
        bgColor: "bg-red-500/10",
        borderColor: "border-red-500/30",
        label: "Rejected ❌",
        badge: "Changes Needed"
      }
    }
    return configs[status] || configs.submitted
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-300">Loading your submissions...</p>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <FiAlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-slate-300">Please log in to view submissions</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
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
          <h1 className="text-4xl font-bold text-white mb-3">My Submissions</h1>
          <p className="text-slate-400 text-lg">
            Track the status of your submitted components. Admin will review and approve/reject them.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4"
          >
            <p className="text-slate-400 text-sm mb-1">Pending</p>
            <p className="text-2xl font-bold text-blue-400">
              {submissions.filter(s => s.status === 'submitted').length}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4"
          >
            <p className="text-slate-400 text-sm mb-1">Approved</p>
            <p className="text-2xl font-bold text-green-400">
              {submissions.filter(s => s.status === 'approved').length}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4"
          >
            <p className="text-slate-400 text-sm mb-1">Rejected</p>
            <p className="text-2xl font-bold text-red-400">
              {submissions.filter(s => s.status === 'rejected').length}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Submissions List */}
      <div className="max-w-4xl mx-auto space-y-4">
        {submissions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-12 text-center"
          >
            <FiAlertCircle className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400 text-lg mb-4">No submissions yet</p>
            <button
              onClick={() => navigate('/submit-for-approval')}
              className="text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              Submit a component →
            </button>
          </motion.div>
        ) : (
          <AnimatePresence>
            {submissions.map((submission, index) => {
              const config = getStatusConfig(submission.status)
              const StatusIcon = config.icon

              return (
                <motion.div
                  key={submission._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`${config.bgColor} border ${config.borderColor} rounded-xl overflow-hidden`}
                >
                  {/* Main Card */}
                  <button
                    onClick={() => setExpandedId(expandedId === submission._id ? null : submission._id)}
                    className="w-full text-left p-6 hover:bg-slate-700/20 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <StatusIcon className={`w-6 h-6 ${config.color}`} />
                          <h3 className="text-xl font-bold text-white">
                            {submission.name}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bgColor} ${config.color} border ${config.borderColor}`}>
                            {config.badge}
                          </span>
                        </div>
                        <p className="text-slate-400 text-sm mb-3">
                          Status: <span className="font-semibold">{config.label}</span>
                        </p>

                        {/* Dates */}
                        <div className="space-y-2 text-sm text-slate-400">
                          {submission.submittedAt && (
                            <p>Submitted: <span className="text-slate-300">{formatDate(submission.submittedAt)}</span></p>
                          )}
                          {submission.reviewedAt && (
                            <p>Reviewed: <span className="text-slate-300">{formatDate(submission.reviewedAt)}</span></p>
                          )}
                        </div>
                      </div>

                      <motion.div
                        animate={{ rotate: expandedId === submission._id ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <FiChevronDown className="w-6 h-6 text-slate-400" />
                      </motion.div>
                    </div>
                  </button>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {expandedId === submission._id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-slate-700/50 p-6 space-y-4"
                      >
                        {/* Your Description */}
                        {submission.submissionDescription && (
                          <div>
                            <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                              <FiMessageCircle className="w-4 h-4 text-cyan-400" />
                              Your Description
                            </h4>
                            <p className="text-slate-400 bg-slate-700/30 rounded-lg p-3">
                              {submission.submissionDescription}
                            </p>
                          </div>
                        )}

                        {/* Admin Feedback */}
                        {submission.reviewNotes && (
                          <div>
                            <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                              <FiMessageCircle className="w-4 h-4 text-blue-400" />
                              Admin Feedback
                            </h4>
                            <p className="text-slate-400 bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                              {submission.reviewNotes}
                            </p>
                          </div>
                        )}

                        {/* Rejection Reason */}
                        {submission.rejectionReason && (
                          <div>
                            <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                              <FiAlertCircle className="w-4 h-4 text-red-400" />
                              Rejection Reason
                            </h4>
                            <p className="text-slate-400 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                              {submission.rejectionReason}
                            </p>
                          </div>
                        )}

                        {/* Code Preview */}
                        <div>
                          <h4 className="text-white font-semibold mb-2">Code Preview</h4>
                          <div className="bg-slate-900/50 rounded-lg p-3 max-h-48 overflow-y-auto">
                            <pre className="text-slate-400 text-xs font-mono whitespace-pre-wrap break-words">
                              {submission.code ? submission.code.substring(0, 300) + "..." : "No code"}
                            </pre>
                          </div>
                        </div>

                        {/* Actions */}
                        {submission.status === 'rejected' && (
                          <button
                            onClick={() => navigate('/submit-for-approval')}
                            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                          >
                            Resubmit Component
                          </button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </AnimatePresence>
        )}
      </div>

      {/* Info Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="max-w-4xl mx-auto mt-8 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4"
      >
        <p className="text-blue-300 text-sm">
          <span className="font-semibold">💡 Info:</span> When your component is approved, you'll automatically earn 100 AI Credits! Check back regularly for updates.
        </p>
      </motion.div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} />}
      </AnimatePresence>
    </div>
  )
}

export default MySubmissions