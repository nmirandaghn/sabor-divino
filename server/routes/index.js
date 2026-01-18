import { Router } from 'express'
import reservationsRouter from './reservations.js'
import menuRouter from './menu.js'
import authRouter from './auth.js'
import adminRouter from './admin.js'

const router = Router()

// API root
router.get('/', (_req, res) => {
  res.json({ message: 'Sabor Divino API' })
})

// Mount route modules
router.use('/auth', authRouter)
router.use('/admin', adminRouter)
router.use('/reservations', reservationsRouter)
router.use('/menu', menuRouter)

export default router
