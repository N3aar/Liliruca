const ContentParser = require('../ContentParser')

describe('ContentParser#getFlagOption', () => {
  it('should return only "ww"', () => {
    expect(ContentParser.getFlagOption(
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
    expect(ContentParser.getFlagOption(
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
    expect(ContentParser.getFlagOption(
      'aw dfe --a ww d',
      {
        id: 'a',
        flags: ['w', 'word'],
        match: 'rest'
      }
    )).toEqual(null)
  })
})

describe('ContentParser#getFlag', () => {
  const flag = {
    id: 'a',
    flags: ['a', 'ate']
  }

  it('should return true', () => {
    expect(ContentParser.getFlag('aw dfe --a ww d', flag))
      .toEqual({ newContent: 'aw dfe ww d', res: true })
    expect(ContentParser.getFlag('--a', flag))
      .toEqual({ newContent: '', res: true })
    expect(ContentParser.getFlag('--a aw dfe ww d', flag))
      .toEqual({ newContent: ' aw dfe ww d', res: true })
    expect(ContentParser.getFlag('aw dfe ww d --a', flag))
      .toEqual({ newContent: 'aw dfe ww d', res: true })
  })

  it('should return false', () => {
    expect(ContentParser.getFlag('aw dfe a ww d', flag)).toBe(false)
    expect(ContentParser.getFlag(' aw a dfe  ww d', flag)).toBe(false)
    expect(ContentParser.getFlag('aw dfe  ww d a', flag)).toBe(false)
  })
})
