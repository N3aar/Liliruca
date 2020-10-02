/* eslint-env jest */

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
    expect(Util.getPercentageFromSeason(10, 'farm', 1)).toBe(9)
    expect(Util.getPercentageFromSeason(10, 'mining', 1)).toBe(10)
    expect(Util.getPercentageFromSeason(10, 'fishing', 1)).toBe(8)
  })
  test('the summer season on all places', () => {
    expect(Util.getPercentageFromSeason(10, 'farm', 2)).toBe(11)
    expect(Util.getPercentageFromSeason(10, 'mining', 2)).toBe(8)
    expect(Util.getPercentageFromSeason(10, 'fishing', 2)).toBe(12)
  })
  test('the autumn season on all places', () => {
    expect(Util.getPercentageFromSeason(10, 'farm', 3)).toBe(12)
    expect(Util.getPercentageFromSeason(10, 'mining', 3)).toBe(8)
    expect(Util.getPercentageFromSeason(10, 'fishing', 3)).toBe(11)
  })
  test('the winter season on all places', () => {
    expect(Util.getPercentageFromSeason(10, 'farm', 4)).toBe(7)
    expect(Util.getPercentageFromSeason(10, 'mining', 4)).toBe(13)
    expect(Util.getPercentageFromSeason(10, 'fishing', 4)).toBe(8)
  })
})
