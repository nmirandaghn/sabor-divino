import { Router } from 'express'
import reservationsRouter from './reservations.js'
import menuRouter from './menu.js'

const router = Router()

// API root
router.get('/', (req, res) => {
  res.json({ message: 'Sabor Divino API' })
})

// Mount route modules
router.use('/reservations', reservationsRouter)
router.use('/menu', menuRouter)

export default router
