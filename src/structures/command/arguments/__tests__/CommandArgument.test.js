const CommandArgument = require('../CommandArgument')

describe('CommandArgument#getFlagOption', () => {
  it('should return only "ww"', () => {
    expect(CommandArgument.getFlagOption(
      'aw dfe --a ww d',
      {
        id: 'a',
        flags: ['a', 'ate']
      }
    )).toEqual({
      newContent: 'aw dfe d',
      res: 'ww'
    })
  })

  it('should return "ww a" only', () => {
    expect(CommandArgument.getFlagOption(
      'aw dfe --a ww d',
      {
        id: 'a',
        flags: ['a', 'ata'],
        match: 'rest'
      }
    )).toEqual({
      newContent: 'aw dfe',
      res: 'ww d'
    })
  })

  it('should return null', () => {
    expect(CommandArgument.getFlagOption(
      'aw dfe --a ww d',
      {
        id: 'a',
        flags: ['w', 'word'],
        match: 'rest'
      }
    )).toEqual(null)
  })
})

describe('CommandArgument#getFlag', () => {
  const flag = {
    id: 'a',
    flags: ['a', 'ate']
  }

  it('should return true', () => {
    expect(CommandArgument.getFlag('aw dfe --a ww d', flag))
      .toEqual({ newContent: 'aw dfe ww d', res: true })
    expect(CommandArgument.getFlag('--a aw dfe ww d', flag))
      .toEqual({ newContent: ' aw dfe ww d', res: true })
    expect(CommandArgument.getFlag('aw dfe ww d --a', flag))
      .toEqual({ newContent: 'aw dfe ww d', res: true })
  })

  it('should return false', () => {
    expect(CommandArgument.getFlag('aw dfe a ww d', flag)).toBe(false)
    expect(CommandArgument.getFlag(' aw a dfe  ww d', flag)).toBe(false)
    expect(CommandArgument.getFlag('aw dfe  ww d a', flag)).toBe(false)
  })
})

test('CommandArgument#runArgs', async () => {
  const handle = arg => arg.length ? arg : null

  const args = [{ id: 'a' }, { id: 'b' }]
  expect(await CommandArgument.runArgs('aw dfe a ww d', args, handle)).toEqual({ a: 'aw', b: 'dfe' })
  const arg2 = [{ id: 'a' }, { id: 'b', match: 'rest' }]
  expect(await CommandArgument.runArgs(' aw a dfe  ww d', arg2, handle)).toEqual({ a: 'aw', b: 'a dfe  ww d' })
  const arg3 = [{ id: 'a', match: 'rest' }, { id: 'b' }]
  expect(await CommandArgument.runArgs('aw dfe  ww d a', arg3, handle)).toEqual({ a: 'aw dfe  ww d a', b: null })
})
