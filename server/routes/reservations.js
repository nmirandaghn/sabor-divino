import { Router } from 'express'
import db from '../db/index.js'
import asyncHandler from '../middleware/asyncHandler.js'
import validateReservation from '../middleware/validateReservation.js'
import { IS_DEMO, DEMO_DATA } from '../config.js'

const router = Router()

/**
 * GET /api/reservations
 * Get all reservations, optionally filtered by date
 */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    // DEMO MODE: Return hardcoded data
    if (IS_DEMO) {
      const { date } = req.query
      let reservations = DEMO_DATA.reservations

      if (date) {
        reservations = reservations.filter(r => r.date === date)
      }

      return res.json({ data: reservations })
    }

    // NORMAL MODE: SQLite
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

    // DEMO MODE: Search in hardcoded data
    if (IS_DEMO) {
      const reservation = DEMO_DATA.reservations.find(r => r.id === parseInt(id))

      if (!reservation) {
        return res.status(404).json({ error: 'Reservation not found' })
      }

      return res.json({ data: reservation })
    }

    // NORMAL MODE: SQLite
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
    const { name, email, phone, date, time, party_size, special_requests } = req.body

    // DEMO MODE: Simulate creation (don't persist)
    if (IS_DEMO) {
      const newReservation = {
        id: Date.now(),
        name,
        email,
        phone,
        date,
        time,
        party_size,
        table_num: Math.floor(Math.random() * 20) + 1, // Random table
        special_requests: special_requests || null,
        created_at: new Date().toISOString()
      }

      return res.status(201).json({
        data: newReservation,
        message: '🎭 Demo mode: Reservation simulated (not persisted)'
      })
    }

    // NORMAL MODE: SQLite
    const result = db
      .prepare(
        `INSERT INTO reservations (name, email, phone, date, time, party_size, special_requests)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .run(name, email, phone, date, time, party_size, special_requests || null)

    const reservation = db
      .prepare('SELECT * FROM reservations WHERE id = ?')
      .get(result.lastInsertRowid)

    res.status(201).json({
      data: reservation,
      message: 'Reservation created successfully'
    })
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

    // DEMO MODE: Simulate deletion
    if (IS_DEMO) {
      const existing = DEMO_DATA.reservations.find(r => r.id === parseInt(id))

      if (!existing) {
        return res.status(404).json({ error: 'Reservation not found' })
      }

      return res.json({ message: '🎭 Demo mode: Deletion simulated' })
    }

    // NORMAL MODE: SQLite
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
