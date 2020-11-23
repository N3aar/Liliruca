const CommandArgument = require('../CommandArgument')

const handle = arg => arg
describe('CommandArgument#getFlagOptionArgs', () => {
  it('should return only "ww"', async () => {
    expect(await CommandArgument.getFlagOptionArgs(
      [{
        id: 'a',
        flags: ['a', 'ate'],
        match: 'phrase'
      }],
      'aw dfe --a ww d',
      handle
    )).toEqual({
      newContent: 'aw dfe d',
      result: { a: 'ww' }
    })
  })

  it('should return "ww a" only', async () => {
    expect(await CommandArgument.getFlagOptionArgs(
      [{
        id: 'a',
        flags: ['a', 'ata'],
        match: 'rest'
      }],
      'aw dfe --a ww d',
      handle
    )).toEqual({
      newContent: 'aw dfe',
      result: { a: 'ww d' }
    })
  })

  it('should return null', async () => {
    expect(await CommandArgument.getFlagOptionArgs(
      [{
        id: 'a',
        flags: ['w', 'word'],
        match: 'rest'
      }],
      'aw dfe --a ww d',
      handle
    )).toEqual({
      newContent: 'aw dfe --a ww d',
      result: { a: null }
    })
  })
})
