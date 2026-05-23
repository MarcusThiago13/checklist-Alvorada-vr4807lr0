migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('checklist_state')

    col.listRule = ''
    col.viewRule = ''
    col.createRule = ''
    col.updateRule = ''
    col.deleteRule = ''

    const userIdField = col.fields.getByName('user_id')
    if (userIdField) {
      userIdField.required = false
    }

    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('checklist_state')

    col.listRule = "@request.auth.id != '' && user_id = @request.auth.id"
    col.viewRule = "@request.auth.id != '' && user_id = @request.auth.id"
    col.createRule = "@request.auth.id != '' && user_id = @request.auth.id"
    col.updateRule = "@request.auth.id != '' && user_id = @request.auth.id"
    col.deleteRule = "@request.auth.id != '' && user_id = @request.auth.id"

    const userIdField = col.fields.getByName('user_id')
    if (userIdField) {
      userIdField.required = true
    }

    app.save(col)
  },
)
