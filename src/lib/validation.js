export function validateFullName(name) {
  const trimmed = name.trim()
  if (!trimmed) return 'Enter your full name.'
  if (trimmed.length < 2) return 'Name must be at least 2 characters.'
  if (/^\d+$/.test(trimmed)) return 'Name cannot be only numbers.'
  return null
}

export function validateEmail(email) {
  const trimmed = email.trim()
  if (!trimmed) return 'Enter your email.'
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!re.test(trimmed)) return 'Enter a valid email address.'
  return null
}

export function normalizeEmail(email) {
  return email.trim().toLowerCase()
}

export function validateMobile(mobile) {
  const trimmed = mobile.trim()
  if (!trimmed) return 'Enter your mobile number.'
  if (!/^[6-9]\d{9}$/.test(trimmed)) {
    return 'Enter a valid 10-digit Indian mobile number starting with 6, 7, 8 or 9.'
  }
  return null
}

export function validatePassword(password) {
  if (!password) return 'Enter a password.'
  if (password.length < 8) return 'Password must be at least 8 characters.'
  if (!/[A-Z]/.test(password)) return 'Password must include an uppercase letter.'
  if (!/[a-z]/.test(password)) return 'Password must include a lowercase letter.'
  if (!/\d/.test(password)) return 'Password must include a number.'
  return null
}

export function validateConfirmPassword(password, confirm) {
  if (!confirm) return 'Confirm your password.'
  if (password !== confirm) return 'Passwords do not match.'
  return null
}
