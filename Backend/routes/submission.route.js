import express from 'express'
import {
  getUserComponents,
  submitForApproval,
  getPendingSubmissions,
  approveComponent,
  rejectComponent
} from '../controllers/submission.controller.js'
import isAuthenticated from '../middlewares/isAuthenticated.js'

const router = express.Router()

// User Routes 
router.get('/user-components', isAuthenticated, getUserComponents)
router.post('/submit-for-approval', isAuthenticated, submitForApproval)

// Admin Routes 
router.get('/pending-approval', isAuthenticated, getPendingSubmissions)
router.post('/approve', isAuthenticated, approveComponent)
router.post('/reject', isAuthenticated, rejectComponent)

export default router