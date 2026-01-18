import { Router } from 'express'
import db from '../db/index.js'
import asyncHandler from '../middleware/asyncHandler.js'
import validateReservation from '../middleware/validateReservation.js'

const router = Router()

/**
 * GET /api/reservations
 * Get all reservations, optionally filtered by date
 */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { date } = req.query

    let reservations
    if (date) {
      reservations = db
        .prepare('SELECT * FROM reservations WHERE date = ? ORDER BY time ASC')
        .all(date)
    } else {
      reservations = db
        .prepare('SELECT * FROM reservations ORDER BY date ASC, time ASC')
        .all()
    }

    res.json({ data: reservations })
  })
)

/**
 * GET /api/reservations/:id
 * Get a single reservation by ID
 */
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params

    const reservation = db
      .prepare('SELECT * FROM reservations WHERE id = ?')
      .get(id)

    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' })
    }

    res.json({ data: reservation })
  })
)

/**
 * POST /api/reservations
 * Create a new reservation
 */
router.post(
  '/',
  validateReservation,
  asyncHandler(async (req, res) => {
    const { name, email, phone, date, time, party_size, special_requests } =
      req.body

    const result = db
      .prepare(
        `INSERT INTO reservations (name, email, phone, date, time, party_size, special_requests)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .run(name, email, phone, date, time, party_size, special_requests || null)

    const reservation = db
      .prepare('SELECT * FROM reservations WHERE id = ?')
      .get(result.lastInsertRowid)

    res.status(201).json({ data: reservation, message: 'Reservation created successfully' })
  })
)

/**
 * DELETE /api/reservations/:id
 * Delete a reservation by ID
 */
router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params

    const existing = db
      .prepare('SELECT * FROM reservations WHERE id = ?')
      .get(id)

    if (!existing) {
      return res.status(404).json({ error: 'Reservation not found' })
    }

    db.prepare('DELETE FROM reservations WHERE id = ?').run(id)

    res.json({ message: 'Reservation deleted successfully' })
  })
)

export default router
