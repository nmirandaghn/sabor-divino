/**
 * Validation middleware for reservation requests
 */

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phoneRegex = /^[\d\s\-+()]{7,20}$/
const dateRegex = /^\d{4}-\d{2}-\d{2}$/
const timeRegex = /^\d{2}:\d{2}$/

/**
 * Validates reservation data
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 */
const validateReservation = (req, res, next) => {
  const { name, email, phone, date, time, party_size } = req.body
  const errors = []

  // Name validation
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters')
  }

  // Email validation
  if (!email || !emailRegex.test(email)) {
    errors.push('Valid email is required')
  }

  // Phone validation
  if (!phone || !phoneRegex.test(phone)) {
    errors.push('Valid phone number is required')
  }

  // Date validation (YYYY-MM-DD format)
  if (!date || !dateRegex.test(date)) {
    errors.push('Date must be in YYYY-MM-DD format')
  } else {
    const reservationDate = new Date(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (reservationDate < today) {
      errors.push('Reservation date cannot be in the past')
    }
  }

  // Time validation (HH:MM format)
  if (!time || !timeRegex.test(time)) {
    errors.push('Time must be in HH:MM format')
  }

  // Party size validation
  const size = parseInt(party_size, 10)
  if (isNaN(size) || size < 1 || size > 20) {
    errors.push('Party size must be between 1 and 20')
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(', ') })
  }

  // Sanitize and normalize the data
  req.body.name = name.trim()
  req.body.email = email.trim().toLowerCase()
  req.body.phone = phone.trim()
  req.body.party_size = size

  next()
}

export default validateReservation
