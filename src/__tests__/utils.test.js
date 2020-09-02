const Util = require('../utils/util')

describe('Test Season of Months', () => {
  it('should return "spring"', () => {
    expect(Util.getSeasonByMonth(0)).toBe('spring')
    expect(Util.getSeasonByMonth(1)).toBe('spring')
    expect(Util.getSeasonByMonth(5)).toBe('spring')
    expect(Util.getSeasonByMonth(9)).toBe('spring')
  })
  it('should return "summer"', () => {
    expect(Util.getSeasonByMonth(2)).toBe('summer')
    expect(Util.getSeasonByMonth(6)).toBe('summer')
    expect(Util.getSeasonByMonth(10)).toBe('summer')
  })
  it('should return "autumn"', () => {
    expect(Util.getSeasonByMonth(3)).toBe('autumn')
    expect(Util.getSeasonByMonth(7)).toBe('autumn')
    expect(Util.getSeasonByMonth(11)).toBe('autumn')
  })
  it('should return "winter"', () => {
    expect(Util.getSeasonByMonth(4)).toBe('winter')
    expect(Util.getSeasonByMonth(8)).toBe('winter')
    expect(Util.getSeasonByMonth(12)).toBe('winter')
    expect(Util.getSeasonByMonth(13)).toBe('winter')
  })
})

describe('Test getPercentageFromSeason function', () => {
  test('the spring season on all places', () => {
    expect(Util.getPercentageFromSeason(1, 'farm', 1)).toBe(0.9)
    expect(Util.getPercentageFromSeason(1, 'mining', 1)).toBe(1.05)
    expect(Util.getPercentageFromSeason(1, 'fishing', 1)).toBe(0.85)
  })
  test('the summer season on all places', () => {
    expect(Util.getPercentageFromSeason(1, 'farm', 2)).toBe(1.15)
    expect(Util.getPercentageFromSeason(1, 'mining', 2)).toBe(0.8)
    expect(Util.getPercentageFromSeason(1, 'fishing', 2)).toBe(1.2)
  })
  test('the autumn season on all places', () => {
    expect(Util.getPercentageFromSeason(1, 'farm', 3)).toBe(1.2)
    expect(Util.getPercentageFromSeason(1, 'mining', 3)).toBe(0.85)
    expect(Util.getPercentageFromSeason(1, 'fishing', 3)).toBe(1.15)
  })
  test('the winter season on all places', () => {
    expect(Util.getPercentageFromSeason(1, 'farm', 4)).toBe(0.75)
    expect(Util.getPercentageFromSeason(1, 'mining', 4)).toBe(1.3)
    expect(Util.getPercentageFromSeason(1, 'fishing', 4)).toBe(0.8)
  })
})
