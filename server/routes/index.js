import { Router } from 'express'

const router = Router()

// Placeholder route
router.get('/', (req, res) => {
  res.json({ message: 'Sabor Divino API' })
})

export default router
