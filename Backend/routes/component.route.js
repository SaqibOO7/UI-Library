import {Router} from 'express'
import {generateComponent} from '../controllers/aiComponent.controller.js'
import isAuthenticated from '../middlewares/isAuthenticated.js'
import { getAllComponents, publishComponent, saveComponents } from '../controllers/component.controller.js'

const router = Router()

router.route('/generate').post(isAuthenticated, generateComponent)
router.route('/save').post(isAuthenticated, saveComponents)
router.route('/publish').post(isAuthenticated, publishComponent)

router.route('/all-components').get(getAllComponents)


export default router