migrate(
  (app) => {
    try {
      const record = app.findAuthRecordByEmail('_pb_users_auth_', 'marcusthiago.adv@gmail.com')
      record.set('username', 'HelloKids')
      record.setPassword('EditalAlvorada1892026')
      app.save(record)
    } catch (_) {
      const users = app.findCollectionByNameOrId('_pb_users_auth_')
      const newRecord = new Record(users)
      newRecord.setEmail('marcusthiago.adv@gmail.com')
      newRecord.set('username', 'HelloKids')
      newRecord.setPassword('EditalAlvorada1892026')
      newRecord.setVerified(true)
      newRecord.set('name', 'HelloKids')
      app.save(newRecord)
    }
  },
  (app) => {
    try {
      const record = app.findAuthRecordByEmail('_pb_users_auth_', 'marcusthiago.adv@gmail.com')
      record.set('username', 'admin_old_' + $security.randomString(5))
      app.save(record)
    } catch (_) {}
  },
)
