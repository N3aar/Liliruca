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

  static async runOtherwise (message, arg) {
    if (!arg.otherwise) {
      return null
    }

    const otherwise = await func(arg.otherwise, message)
    throw new ArgumentError(otherwise)
  }

  static runParameterType (type, message, res, arg) {
    const parameter = ArgumentRunner.getTypes()[type]
    if (!parameter) {
      throw new Error(`${type} is invalid.`)
    }

    return parameter.exec(res, message, parameter.parseOptions(arg))
  }

  static async runParameterTypes (message, res, arg) {
    if (Array.isArray(arg.type)) {
      for (const type of arg.type) {
        const result = await ArgumentRunner.runParameterType(type, message, res, arg)
        if (result) return result
      }
      return null
    }
    return ArgumentRunner.runParameterType(arg.tpe, message, res, arg)
  }

  static async runParameter (message, res, arg) {
    if (!res) {
      if (arg.default) {
        return func(arg.default, message)
      }
      return ArgumentRunner.runOtherwise(arg, message)
    }

    const parsed = await ArgumentRunner.runParameterTypes(message, res, arg)
    return parsed || ArgumentRunner.runOtherwise(message, arg)
  }

  static async runFlags (content, flags, handle) {
    let currentContent = content
    const result = {}

    for (const flag of flags) {
      const res = flag.flagType === 'option'
        ? ContentParser.getFlagOption(currentContent, flag)
        : ContentParser.getFlag(currentContent, flag)

      result[flag.id] = flag.flagType === 'option' ? await handle(res?.res ?? res, flag) : res
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
      result
    } = await ArgumentRunner.runFlags(contentArgs.join(' '), commandFlags, exec)

    return {
      ...result,
      ...(await ArgumentRunner.runArgs(newContent, commandArgs, exec))
    }
  }
}

module.exports = ArgumentRunner
