migrate(
  (app) => {
    const collection = new Collection({
      name: 'login_attempts',
      type: 'base',
      listRule: null,
      viewRule: null,
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        { name: 'email', type: 'text', required: true },
        { name: 'attempts', type: 'number', required: true },
        { name: 'locked_until', type: 'date' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_login_email ON login_attempts (email)'],
    })
    app.save(collection)

    // Add privacy_accepted to users
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    users.fields.add(new BoolField({ name: 'privacy_accepted' }))
    app.save(users)
  },
  (app) => {
    try {
      const col = app.findCollectionByNameOrId('login_attempts')
      app.delete(col)
    } catch (_) {}
  },
)
