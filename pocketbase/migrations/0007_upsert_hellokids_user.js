migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')

    try {
      app.findAuthRecordByEmail('_pb_users_auth_', 'hellokids@internal.db')
      return // already exists
    } catch (_) {}

    const record = new Record(users)
    record.setEmail('hellokids@internal.db')
    record.set('username', 'HelloKids')
    record.setPassword('EditalAlvorada1892026')
    record.setVerified(true)
    record.set('name', 'HelloKids OSC')
    record.set('privacy_accepted', true)

    app.save(record)
  },
  (app) => {
    try {
      const record = app.findAuthRecordByEmail('_pb_users_auth_', 'hellokids@internal.db')
      app.delete(record)
    } catch (_) {}
  },
)
