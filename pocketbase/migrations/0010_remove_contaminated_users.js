migrate(
  (app) => {
    const emailsToRemove = [
      'hellokids@example.com',
      'hellokids@internal.db',
      'marcusthiago.adv@gmail.com',
    ]

    emailsToRemove.forEach((email) => {
      try {
        const record = app.findAuthRecordByEmail('_pb_users_auth_', email)
        app.delete(record)
      } catch (_) {}
    })

    try {
      const record = app.findFirstRecordByData('_pb_users_auth_', 'username', 'HelloKids')
      app.delete(record)
    } catch (_) {}
  },
  (app) => {
    // Intentional empty down migration as we do not want to restore deprecated, contaminated records
  },
)
