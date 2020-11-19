const items = require('../utils/constants/Items.json')

describe('Test Items', () => {
  test('test if has an item duplicated', () => {
    const nameIds = Object.keys(items)
    expect(nameIds.filter((v, i, arr) => arr.indexOf(v) !== i)).toEqual([])
  })

  test('test if has a number item duplicated', () => {
    const numIds = Object.values(items).map(item => item.numId)
    expect(numIds.filter((v, i, arr) => arr.indexOf(v) !== i)).toEqual([])
  })
})
