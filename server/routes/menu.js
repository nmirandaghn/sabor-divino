import { Router } from 'express'
import db from '../db/index.js'
import asyncHandler from '../middleware/asyncHandler.js'

const router = Router()

/**
 * GET /api/menu
 * Get all available menu items
 */
router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const menuItems = db
      .prepare(
        'SELECT * FROM menu_items WHERE is_available = 1 ORDER BY category ASC, name ASC'
      )
      .all()

    res.json({ data: menuItems })
  })
)

/**
 * GET /api/menu/:category
 * Get menu items filtered by category
 */
router.get(
  '/:category',
  asyncHandler(async (req, res) => {
    const { category } = req.params

    const menuItems = db
      .prepare(
        'SELECT * FROM menu_items WHERE category = ? AND is_available = 1 ORDER BY name ASC'
      )
      .all(category)

    res.json({ data: menuItems })
  })
)

export default router
