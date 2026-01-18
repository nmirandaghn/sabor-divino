import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db/index.js'
import asyncHandler from '../middleware/asyncHandler.js'

const router = Router()

// JWT secret - in production, use a strong secret from environment
const JWT_SECRET = process.env.JWT_SECRET || 'sabor-divino-jwt-secret-2026'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h'

/**
 * POST /api/auth/login
 * Authenticate admin user and return JWT token
 */
router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { username, password } = req.body

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' })
    }

    // Find user by username
    const user = db
      .prepare('SELECT * FROM users WHERE username = ?')
      .get(username)

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash)

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid username or password' })
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    )

    res.json({
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      },
      message: 'Login successful'
    })
  })
)

/**
 * GET /api/auth/verify
 * Verify JWT token is valid
 */
router.get(
  '/verify',
  asyncHandler(async (req, res) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const token = authHeader.split(' ')[1]

    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      res.json({
        data: {
          valid: true,
          user: {
            id: decoded.id,
            username: decoded.username,
            role: decoded.role
          }
        }
      })
    } catch {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }
  })
)

export default router
export { JWT_SECRET }
