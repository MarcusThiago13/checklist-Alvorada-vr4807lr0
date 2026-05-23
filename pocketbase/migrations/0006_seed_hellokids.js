migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')

    try {
      app.findFirstRecordByData('_pb_users_auth_', 'username', 'HelloKids')
      return // already seeded
    } catch (_) {}

    const record = new Record(users)
    record.set('username', 'HelloKids')
    record.setPassword('EditalAlvorada1892026')
    record.setVerified(true)
    record.set('name', 'HelloKids OSC')
    record.set('privacy_accepted', true)
    app.save(record)
  },
  (app) => {
    try {
      const record = app.findFirstRecordByData('_pb_users_auth_', 'username', 'HelloKids')
      app.delete(record)
    } catch (_) {}
  },
)
