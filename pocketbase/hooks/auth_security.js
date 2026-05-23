// Enforce password complexity rules on users collection
onRecordValidate((e) => {
  const isNew = !e.record.id
  const password = e.requestInfo().body.password

  if (isNew && !password) {
    throw new BadRequestError('Password is required.', {
      password: new ValidationError('validation_required', 'Password is required.'),
    })
  }

  if (password) {
    if (password.length < 10) {
      throw new BadRequestError('Password must be at least 10 characters long.', {
        password: new ValidationError(
          'validation_invalid',
          'Password must be at least 10 characters long.',
        ),
      })
    }
    if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      throw new BadRequestError('Password must contain at least one letter and one number.', {
        password: new ValidationError(
          'validation_invalid',
          'Password must contain at least one letter and one number.',
        ),
      })
    }
  }

  e.next()
}, 'users')

// Custom routes to handle login lockouts
routerAdd('POST', '/backend/v1/auth/check-lockout', (e) => {
  const body = e.requestInfo().body
  const email = body.email
  if (!email) return e.json(200, { locked: false })

  try {
    const record = $app.findFirstRecordByData('login_attempts', 'email', email)
    const lockedUntil = record.getString('locked_until')
    if (lockedUntil) {
      const lockDate = new Date(lockedUntil)
      if (new Date() < lockDate) {
        throw new BadRequestError(
          'Account temporarily locked due to too many failed attempts. Try again in 30 minutes.',
        )
      } else {
        // Lock expired, reset silently
        record.set('attempts', 0)
        record.set('locked_until', '')
        $app.save(record)
      }
    }
  } catch (_) {
    // No record found, not locked
  }
  return e.json(200, { locked: false })
})

routerAdd('POST', '/backend/v1/auth/report-fail', (e) => {
  const body = e.requestInfo().body
  const email = body.email
  if (!email) return e.json(200, { ok: true })

  const col = $app.findCollectionByNameOrId('login_attempts')
  let record
  try {
    record = $app.findFirstRecordByData('login_attempts', 'email', email)
  } catch (_) {
    record = new Record(col)
    record.set('email', email)
    record.set('attempts', 0)
  }

  const now = new Date()

  const updatedStr = record.getString('updated')
  if (updatedStr) {
    const updated = new Date(updatedStr.replace(' ', 'T'))
    const diffMins = (now.getTime() - updated.getTime()) / (1000 * 60)
    if (diffMins > 15) {
      record.set('attempts', 0)
    }
  }

  let attempts = record.getInt('attempts') + 1
  record.set('attempts', attempts)

  if (attempts >= 5) {
    const lockTime = new Date(now)
    lockTime.setMinutes(lockTime.getMinutes() + 30)
    record.set('locked_until', lockTime.toISOString())
  }

  $app.save(record)
  return e.json(200, { attempts, locked: attempts >= 5 })
})

routerAdd('POST', '/backend/v1/auth/reset-lockout', (e) => {
  const body = e.requestInfo().body
  const email = body.email
  if (!email) return e.json(200, { ok: true })

  try {
    const record = $app.findFirstRecordByData('login_attempts', 'email', email)
    record.set('attempts', 0)
    record.set('locked_until', '')
    $app.save(record)
  } catch (_) {}

  return e.json(200, { ok: true })
})
