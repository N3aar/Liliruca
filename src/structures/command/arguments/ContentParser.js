
const FLAG_REGEX = flags => new RegExp(`\\s?--(${flags})`, 'i')
const REST_FLAG_OPTION_REGEX = flags => new RegExp(`\\s?--(?:${flags})\\s(.{1,})`, 'i')
const PHRASE_FLAG_OPTION_REGEX = flags => new RegExp(`\\s?--(?:${flags})\\s(\\w{1,})`, 'i')

class ContentParser {
  static getFlagOption (content, flagOptionArg) {
    const regex = flagOptionArg.match === 'rest' ? REST_FLAG_OPTION_REGEX : PHRASE_FLAG_OPTION_REGEX
    const result = content.match(regex(flagOptionArg.flags.join('|')))

    if (!result || !result.length) {
      return null
    }

    const [full, res] = result
    const newContent = content.replace(full, '')
    return { newContent, res }
  }

  static getFlag (content, flagArg) {
    const regex = FLAG_REGEX(flagArg.flags.join('|'))

    if (!regex.test(content)) {
      return false
    }

    const newContent = content.replace(regex, '')
    return { newContent, res: true }
  }
}

module.exports = ContentParser
