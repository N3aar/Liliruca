const { resolve } = require('path')
const { readdirSync } = require('fs')
const ContentParser = require('./ContentParser')
const ArgumentError = require('./ArgumentError')

const func = (fn, ...args) => typeof fn === 'function' ? fn(...args) : fn

class ArgumentRunner {
  static readdirArguments () {
    const typesPath = resolve(__dirname, 'types')
    return readdirSync(typesPath)
      .reduce((args, filename) => {
        const argumentName = filename.replace(/Argument|.js/gi, '').toLowerCase()
        args[argumentName] = require(resolve(typesPath, filename))
        return args
      }, {})
  }

  static getTypes () {
    if (!this.types) {
      this.types = ArgumentRunner.readdirArguments()
    }

    return this.types
  }

  static async runParameter (message, res, arg) {
    if (!res) {
      if (arg.default) {
        return func(arg.default, message)
      }

      if (!arg.otherwise) {
        return res
      }

      const otherwise = await func(arg.otherwise, message)
      throw new ArgumentError(otherwise)
    }

    if (Array.isArray(arg.type)) {
      for (const entry of arg.type) {
        if (Array.isArray(entry)) {
          if (entry.some(t => t.toLowerCase() === res.toLowerCase())) {
            return entry[0]
          }
        } else if (entry.toLowerCase() === res.toLowerCase()) {
          return entry
        }
      }
    }

    const handler = ArgumentRunner.getTypes()[arg.type]

    if (!handler) {
      throw new Error(`${arg.type} is invalid.`)
    }

    return handler.exec(res, message, handler.parseOptions(arg))
  }

  static async runFlags (content, flags, handle) {
    let currentContent = content
    const result = {}

    for (const flag of flags) {
      const res = flag.flagType === 'option'
        ? ContentParser.getFlagOption(currentContent, flag)
        : ContentParser.getFlag(currentContent, flag)

      result[flag.id] = await handle(res?.res ?? res, flag)
      currentContent = res?.newContent ?? currentContent
    }

    return { newContent: currentContent, result }
  }

  static async runArgs (content, args, handle) {
    const contentArgs = content?.trim()?.split(' ') ?? []
    const result = {}

    for (const arg of args) {
      const lastIndex = arg.match === 'rest' ? contentArgs.length : 1
      const text = contentArgs.slice(0, lastIndex)?.join(' ') ?? null
      result[arg.id] = await handle(text, arg)
      contentArgs.splice(0, lastIndex)
    }

    return result
  }

  static async runParameters (contentArgs, message, commandFlags, commandArgs) {
    const exec = (res, arg) => ArgumentRunner.runParameter(message, res, arg)

    const {
      newContent,
      res
    } = await ArgumentRunner.runFlags(contentArgs.join(' '), commandFlags, exec)

    return {
      ...res,
      ...(await ArgumentRunner.runArgs(newContent, commandArgs, exec))
    }
  }
}

module.exports = ArgumentRunner
