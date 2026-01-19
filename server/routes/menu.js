import { Router } from 'express'
import db from '../db/index.js'
import asyncHandler from '../middleware/asyncHandler.js'
import { IS_DEMO, DEMO_DATA } from '../config.js'

const router = Router()

/**
 * GET /api/menu
 * Get all available menu items
 */
router.get(
  '/',
  asyncHandler(async (_req, res) => {
    // DEMO MODE: Return hardcoded menu items
    if (IS_DEMO) {
      const menuItems = DEMO_DATA.menuItems
        .filter(item => item.is_available)
        .sort((a, b) => {
          // Sort by category first, then by name
          if (a.category !== b.category) {
            return a.category.localeCompare(b.category)
          }
          return a.name.localeCompare(b.name)
        })

      return res.json({ data: menuItems })
    }

    // NORMAL MODE: SQLite
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

    // DEMO MODE: Filter hardcoded data by category
    if (IS_DEMO) {
      const menuItems = DEMO_DATA.menuItems
        .filter(item => item.category === category && item.is_available)
        .sort((a, b) => a.name.localeCompare(b.name))

      return res.json({ data: menuItems })
    }

    // NORMAL MODE: SQLite
    const menuItems = db
      .prepare(
        'SELECT * FROM menu_items WHERE category = ? AND is_available = 1 ORDER BY name ASC'
      )
      .all(category)

    res.json({ data: menuItems })
  })
)

export default router
