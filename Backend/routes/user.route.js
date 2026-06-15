import { Router } from 'express'
import { getAllUsers, getCurrentUser } from '../controllers/user.controller.js'
import isAuthenticated from '../middlewares/isAuthenticated.js'

const router = Router()


router.route('/current-user').get(isAuthenticated, getCurrentUser)

router.route('/all-users').get(getAllUsers)



export default router