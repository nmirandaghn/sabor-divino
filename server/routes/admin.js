import { Router } from 'express'
import db from '../db/index.js'
import asyncHandler from '../middleware/asyncHandler.js'
import requireAuth from '../middleware/requireAuth.js'

const router = Router()

// All admin routes require authentication
router.use(requireAuth)

/**
 * GET /api/admin/reservations
 * Get all reservations for admin panel
 */
router.get(
  '/reservations',
  asyncHandler(async (_req, res) => {
    const reservations = db
      .prepare('SELECT * FROM reservations ORDER BY date DESC, time ASC')
      .all()

    res.json({ data: reservations })
  })
)

/**
 * DELETE /api/admin/reservations/:id
 * Delete a reservation (admin only)
 */
router.delete(
  '/reservations/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params

    const existing = db
      .prepare('SELECT * FROM reservations WHERE id = ?')
      .get(id)

    if (!existing) {
      return res.status(404).json({ error: 'Reservation not found' })
    }

    db.prepare('DELETE FROM reservations WHERE id = ?').run(id)

    res.json({ message: 'Reservation cancelled successfully' })
  })
)

export default router
