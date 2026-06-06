import {Router} from 'express'
import {googleAuth, logOut} from '../controllers/auth.controller.js'

const router = Router()


router.route('/google').post(googleAuth)
router.route('/logout').get(logOut)


export default router