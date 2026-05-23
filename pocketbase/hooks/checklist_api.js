routerAdd(
  'POST',
  '/backend/v1/checklist-state',
  (e) => {
    const body = e.requestInfo().body
    const user = e.auth
    if (!user) throw new UnauthorizedError('Authentication required')

    const { item_id, status, responsavel, anotacao } = body
    if (!item_id) throw new BadRequestError('item_id is required')

    const stateCol = $app.findCollectionByNameOrId('checklist_state')

    let record
    try {
      record = $app.findFirstRecordByFilter(
        'checklist_state',
        'user_id = {:userId} && item_id = {:itemId}',
        {
          userId: user.id,
          itemId: item_id,
        },
      )
    } catch (_) {
      record = new Record(stateCol)
      record.set('user_id', user.id)
      record.set('item_id', item_id)
    }

    if (status !== undefined) record.set('status', status)
    if (responsavel !== undefined) record.set('responsavel', responsavel)
    if (anotacao !== undefined) record.set('anotacao', anotacao)

    $app.save(record)

    return e.json(200, record)
  },
  $apis.requireAuth(),
)

routerAdd(
  'POST',
  '/backend/v1/checklist-state/reset',
  (e) => {
    const user = e.auth
    if (!user) throw new UnauthorizedError('Authentication required')

    const records = $app.findRecordsByFilter(
      'checklist_state',
      'user_id = {:userId}',
      '',
      1000,
      0,
      {
        userId: user.id,
      },
    )

    records.forEach((record) => {
      $app.delete(record)
    })

    return e.json(200, { deleted: records.length })
  },
  $apis.requireAuth(),
)
