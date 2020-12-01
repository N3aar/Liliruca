const ArgumentRunner = require('../ArgumentRunner')
test('ArgumentRunner#runArgs', async () => {
  const handle = arg => arg.length ? arg : null

  const args = [{ id: 'a' }, { id: 'b' }]
  expect(await ArgumentRunner.runArgs('aw dfe a ww d', args, handle)).toEqual({ a: 'aw', b: 'dfe' })
  const arg2 = [{ id: 'a' }, { id: 'b', match: 'rest' }]
  expect(await ArgumentRunner.runArgs(' aw a dfe  ww d', arg2, handle)).toEqual({ a: 'aw', b: 'a dfe  ww d' })
  const arg3 = [{ id: 'a', match: 'rest' }, { id: 'b' }]
  expect(await ArgumentRunner.runArgs('aw dfe  ww d a', arg3, handle)).toEqual({ a: 'aw dfe  ww d a', b: null })
})
