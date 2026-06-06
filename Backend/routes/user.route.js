import {Router} from 'express'
import {getCurrentUser} from '../controllers/user.controller.js'
import isAuthenticated from '../middlewares/isAuthenticated.js'

const router = Router()


router.route('/current-user').get(isAuthenticated, getCurrentUser)



export default router