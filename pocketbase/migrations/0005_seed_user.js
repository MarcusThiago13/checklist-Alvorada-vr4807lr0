migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')

    try {
      app.findAuthRecordByEmail('_pb_users_auth_', 'hellokids@example.com')
      return // already seeded
    } catch (_) {}

    const record = new Record(users)
    record.setEmail('hellokids@example.com')
    record.set('username', 'HelloKids')
    record.setPassword('EditalAlvorada1892026')
    record.setVerified(true)
    record.set('name', 'HelloKids')
    app.save(record)
  },
  (app) => {
    try {
      const record = app.findAuthRecordByEmail('_pb_users_auth_', 'hellokids@example.com')
      app.delete(record)
    } catch (_) {}
  },
)
