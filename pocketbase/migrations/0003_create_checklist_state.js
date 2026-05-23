migrate(
  (app) => {
    const collection = new Collection({
      name: 'checklist_state',
      type: 'base',
      listRule: "@request.auth.id != '' && user_id = @request.auth.id",
      viewRule: "@request.auth.id != '' && user_id = @request.auth.id",
      createRule: "@request.auth.id != '' && user_id = @request.auth.id",
      updateRule: "@request.auth.id != '' && user_id = @request.auth.id",
      deleteRule: "@request.auth.id != '' && user_id = @request.auth.id",
      fields: [
        { name: 'item_id', type: 'text', required: true },
        {
          name: 'status',
          type: 'select',
          values: ['pendente', 'em_andamento', 'concluido', 'na'],
          required: true,
        },
        { name: 'responsavel', type: 'text', max: 100 },
        { name: 'anotacao', type: 'text', max: 1000 },
        {
          name: 'user_id',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE UNIQUE INDEX idx_checklist_user_item ON checklist_state (user_id, item_id)',
      ],
    })
    app.save(collection)
  },
  (app) => {
    try {
      const col = app.findCollectionByNameOrId('checklist_state')
      app.delete(col)
    } catch (_) {}
  },
)
