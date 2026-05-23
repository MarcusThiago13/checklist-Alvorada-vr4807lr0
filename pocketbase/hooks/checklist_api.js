routerAdd('POST', '/backend/v1/checklist-state', (e) => {
  const body = e.requestInfo().body
  const user = e.auth

  const { item_id, status, responsavel, anotacao } = body
  if (!item_id) throw new BadRequestError('item_id is required')

  const stateCol = $app.findCollectionByNameOrId('checklist_state')

  let record
  try {
    if (user) {
      record = $app.findFirstRecordByFilter(
        'checklist_state',
        'user_id = {:userId} && item_id = {:itemId}',
        { userId: user.id, itemId: item_id },
      )
    } else {
      record = $app.findFirstRecordByFilter(
        'checklist_state',
        'user_id = "" && item_id = {:itemId}',
        { itemId: item_id },
      )
    }
  } catch (_) {
    record = new Record(stateCol)
    if (user) record.set('user_id', user.id)
    record.set('item_id', item_id)
  }

  if (status !== undefined) record.set('status', status)
  if (responsavel !== undefined) record.set('responsavel', responsavel)
  if (anotacao !== undefined) record.set('anotacao', anotacao)

  $app.save(record)

  return e.json(200, record)
})

routerAdd('POST', '/backend/v1/checklist-state/reset', (e) => {
  const user = e.auth

  let filter = 'user_id = ""'
  let params = {}

  if (user) {
    filter = 'user_id = {:userId}'
    params = { userId: user.id }
  }

  const records = $app.findRecordsByFilter('checklist_state', filter, '', 1000, 0, params)

  records.forEach((record) => {
    $app.delete(record)
  })

  return e.json(200, { deleted: records.length })
})
