import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'sabor-divino-jwt-secret-2026'

/**
 * Middleware to require JWT authentication
 * Attaches decoded user info to req.user if valid
 */
const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

export default requireAuth
