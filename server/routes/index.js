import { Router } from 'express'
import reservationsRouter from './reservations.js'

const router = Router()

// API root
router.get('/', (req, res) => {
  res.json({ message: 'Sabor Divino API' })
})

// Mount route modules
router.use('/reservations', reservationsRouter)

export default router
