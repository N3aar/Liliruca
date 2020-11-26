const { resolve } = require('path')
const { readdirSync } = require('fs')
const ContentParser = require('./ContentParser')

const typesPath = resolve(__dirname, 'types')
const Arguments = readdirSync(typesPath)
  .reduce((args, filename) => {
    const argumentName = filename.replace(/Argument|.js/gi, '').toLowerCase()
    args[argumentName] = require(resolve(typesPath, filename))
    return args
  }, {})

class ArgumentRunner {
  // HANDLE PARA BUSCA O HANDLE E OPTIONS DO ARGUMENTO
  static getArgRunner (arg) {
    return Arguments[arg.type]
  }

  // HANDLE PARA EXECUTA UM ARGUMENT INDIVITUAL
  // EXECUÇÃO DIRENTE CASO O ARG.TYPE SEJA UMA ARRAY
  static execArg (res, arg) {
    return null
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
    const contentArgs = content.trim().split(' ')
    const result = {}

    for (const arg of args) {
      const lastIndex = arg.match === 'rest' ? contentArgs.length : 1
      const text = contentArgs.slice(0, lastIndex)?.join(' ') ?? null
      result[arg.id] = await handle(text, arg)
      contentArgs.splice(0, lastIndex)
    }

    return result
  }

  static async runParameters (contentArgs, commandFlags, commandArgs) {
    const exec = ArgumentRunner.execArg
    const {
      newContent,
      res
    } = await ArgumentRunner.runFlags(contentArgs.join(' '), commandFlags, exec)

    return {
      ...res,
      ...ArgumentRunner.runArgs(newContent.split(' '), commandArgs, exec)
    }
  }
}

module.exports = ArgumentRunner
