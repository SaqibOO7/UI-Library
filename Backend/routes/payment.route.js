import {Router} from 'express'
import isAuthenticated from '../middlewares/isAuthenticated.js'
import { verifyPayment, createOrder } from '../controllers/payment.controller.js'

const router = Router()


router.route('/create').post(isAuthenticated, createOrder)
router.route('/verify').post(isAuthenticated, verifyPayment)



export default router