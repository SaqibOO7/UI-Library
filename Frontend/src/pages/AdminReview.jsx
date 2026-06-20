import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  FiArrowLeft, FiLoader, FiAlertCircle, FiCheckCircle, FiX,
  FiChevronDown, FiMessageCircle, FiTrendingUp, FiUser
} from "react-icons/fi"
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../App'
import { Toast } from '../components/Toast'

function AdminReview() {
  const { userData } = useSelector((state) => state.user)
  const navigate = useNavigate()
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null)
  const [actionInProgress, setActionInProgress] = useState(null)
  const [toast, setToast] = useState(null)

  // Modal states
  const [approveModal, setApproveModal] = useState({ show: false, id: null })
  const [rejectModal, setRejectModal] = useState({ show: false, id: null, reason: "", notes: "" })

  useEffect(() => {
    // if (!userData || userData.role !== "admin") {
    //   navigate('/')
    //   return
    // }

    const fetchSubmissions = async () => {
      try {
        const { data } = await axios.get(
          serverUrl + '/api/v1/submission/pending-approval',
          { withCredentials: true }
        )
        setSubmissions(data)
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

  const handleApprove = async (submissionId, reviewNotes = "") => {
    setActionInProgress(submissionId)
    try {
      const { data } = await axios.post(
        serverUrl + '/api/v1/submission/approve',
        {
          componentId: submissionId,
          reviewNotes: reviewNotes
        },
        { withCredentials: true }
      )

      // Remove from list
      setSubmissions(submissions.filter(s => s._id !== submissionId))
      setApproveModal({ show: false, id: null })
      showToast(`Component approved! User earned 100 AI Credits`, "success")

    } catch (error) {
      console.error("Approve error:", error)
      const errorMsg = error.response?.data?.message || "Failed to approve component"
      showToast(errorMsg, "error")
    } finally {
      setActionInProgress(null)
    }
  }

  const handleReject = async (submissionId) => {
    if (!rejectModal.reason.trim()) {
      showToast("Please provide a rejection reason", "error")
      return
    }

    setActionInProgress(submissionId)
    try {
      const { data } = await axios.post(
        serverUrl + '/api/v1/submission/reject',
        {
          componentId: submissionId,
          rejectionReason: rejectModal.reason,
          reviewNotes: rejectModal.notes
        },
        { withCredentials: true }
      )

      // Remove from list
      setSubmissions(submissions.filter(s => s._id !== submissionId))
      setRejectModal({ show: false, id: null, reason: "", notes: "" })
      showToast("Component rejected. User notified.", "info")

    } catch (error) {
      console.error("Reject error:", error)
      const errorMsg = error.response?.data?.message || "Failed to reject component"
      showToast(errorMsg, "error")
    } finally {
      setActionInProgress(null)
    }
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

  if (!userData || userData.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <FiAlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-slate-300">Only admins can access this page</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-300">Loading submissions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8">
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
          <h1 className="text-4xl font-bold text-white mb-3">Component Review Dashboard</h1>
          <p className="text-slate-400 text-lg">
            Review user submissions and approve or reject components. Approved components earn users 100 AI Credits.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 flex items-center justify-between"
          >
            <div>
              <p className="text-slate-400 text-sm mb-1">Pending Review</p>
              <p className="text-3xl font-bold text-cyan-400">{submissions.length}</p>
            </div>
            <FiTrendingUp className="w-12 h-12 text-cyan-400/30" />
          </motion.div>
        </div>
      </div>

      {/* Submissions List */}
      <div className="max-w-5xl mx-auto space-y-4">
        {submissions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-12 text-center"
          >
            <FiCheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">All components reviewed! 🎉</p>
            <p className="text-slate-500 text-sm mt-2">No pending submissions at the moment.</p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {submissions.map((submission, index) => (
              <motion.div
                key={submission._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden hover:border-slate-600 transition-colors"
              >
                {/* Main Card */}
                <button
                  onClick={() => setExpandedId(expandedId === submission._id ? null : submission._id)}
                  className="w-full text-left p-6 hover:bg-slate-700/20 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-3">
                        {submission.name}
                      </h3>

                      {/* User Info */}
                      <div className="flex items-center gap-2 mb-4 text-slate-400">
                        <FiUser className="w-4 h-4" />
                        <span className="font-semibold">{submission.owner.name}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-sm">{submission.owner.email}</span>
                      </div>

                      {/* Submitted Info */}
                      <p className="text-slate-400 text-sm mb-3">
                        Submitted: <span className="text-slate-300">{formatDate(submission.submittedAt)}</span>
                      </p>

                      {/* User Description Preview */}
                      {submission.submissionDescription && (
                        <p className="text-slate-400 text-sm line-clamp-2">
                          <span className="font-semibold">Description:</span> {submission.submissionDescription}
                        </p>
                      )}
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
                      className="border-t border-slate-700/50 p-6 space-y-6"
                    >
                      {/* User Info Box */}
                      <div className="bg-slate-700/30 rounded-lg p-4">
                        <h4 className="text-white font-semibold mb-3">User Information</h4>
                        <div className="space-y-2 text-sm text-slate-400">
                          <p>Name: <span className="text-slate-300 font-semibold">{submission.owner.name}</span></p>
                          <p>Email: <span className="text-slate-300 font-semibold">{submission.owner.email}</span></p>
                          <p>Current Credits: <span className="text-cyan-400 font-semibold">{submission.owner.aiCredits}</span></p>
                        </div>
                      </div>

                      {/* User Description */}
                      {submission.submissionDescription && (
                        <div>
                          <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                            <FiMessageCircle className="w-4 h-4 text-cyan-400" />
                            User's Description
                          </h4>
                          <p className="text-slate-400 bg-slate-700/30 rounded-lg p-3">
                            {submission.submissionDescription}
                          </p>
                        </div>
                      )}

                      {/* Code Preview */}
                      <div>
                        <h4 className="text-white font-semibold mb-2">Code Preview</h4>
                        <div className="bg-slate-900/50 rounded-lg p-4 max-h-64 overflow-y-auto border border-slate-700">
                          <pre className="text-slate-400 text-xs font-mono whitespace-pre-wrap break-words">
                            {submission.code || "No code available"}
                          </pre>
                        </div>
                      </div>

                      {/* Component Props */}
                      {submission.props && submission.props.length > 0 && (
                        <div>
                          <h4 className="text-white font-semibold mb-2">Component Props</h4>
                          <div className="bg-slate-700/30 rounded-lg p-3">
                            <div className="flex flex-wrap gap-2">
                              {submission.props.map((prop, i) => (
                                <span
                                  key={i}
                                  className="bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full text-sm font-mono"
                                >
                                  {prop}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-4">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setApproveModal({ show: true, id: submission._id })}
                          disabled={actionInProgress === submission._id}
                          className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-slate-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          {actionInProgress === submission._id ? (
                            <>
                              <FiLoader className="w-5 h-5 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <FiCheckCircle className="w-5 h-5" />
                              Approve
                            </>
                          )}
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setRejectModal({ ...rejectModal, show: true, id: submission._id })}
                          disabled={actionInProgress === submission._id}
                          className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-slate-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          {actionInProgress === submission._id ? (
                            <>
                              <FiLoader className="w-5 h-5 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <FiX className="w-5 h-5" />
                              Reject
                            </>
                          )}
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Approve Modal */}
      <AnimatePresence>
        {approveModal.show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setApproveModal({ show: false, id: null })}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-white mb-4">Approve Component?</h3>
              <p className="text-slate-400 mb-4">
                This will publish the component and award the user 100 AI Credits.
              </p>
              <textarea
                placeholder="Optional: Add review notes for the user..."
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none transition-colors resize-none mb-4"
                rows="3"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setApproveModal({ show: false, id: null })}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleApprove(approveModal.id)}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Approve
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reject Modal */}
      <AnimatePresence>
        {rejectModal.show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setRejectModal({ show: false, id: null, reason: "", notes: "" })}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-white mb-4">Reject Component</h3>

              <div className="space-y-4 mb-4">
                <div>
                  <label className="block text-white font-semibold text-sm mb-2">
                    Rejection Reason (Required)
                  </label>
                  <textarea
                    placeholder="Tell the user why the component was rejected..."
                    value={rejectModal.reason}
                    onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none transition-colors resize-none"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold text-sm mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    placeholder="Any additional feedback..."
                    value={rejectModal.notes}
                    onChange={(e) => setRejectModal({ ...rejectModal, notes: e.target.value })}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none transition-colors resize-none"
                    rows="2"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setRejectModal({ show: false, id: null, reason: "", notes: "" })}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReject(rejectModal.id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Reject
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} />}
      </AnimatePresence>
    </div>
  )
}

export default AdminReview