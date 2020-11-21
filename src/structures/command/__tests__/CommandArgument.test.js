const CommandArgument = require('../CommandArgument')

const handle = arg => arg
describe('CommandArgument#getFlagOptionArgs', () => {
  test('a', async () => {
    expect(await CommandArgument.getFlagOptionArgs(
      [{
        id: 'a',
        flags: ['a'],
        match: 'phrase'
      }],
      'aw dfe --a ww d'.split('--'),
      handle
    )).toEqual({
      args: ['aw dfe ', 'd'],
      result: { a: 'ww' }
    })
  })
})
