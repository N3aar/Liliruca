const createOptions = require('@utils/createOptions')
const fs = require('fs')
const Collection = require('@discordjs/collection')
const path = require('path')
const { EventEmitter } = require('events')

class BaseHandler extends EventEmitter {
  constructor (client, opts = {}) {
    super()
    this.client = client

    const options = createOptions('BaseHandler', opts)

    this.directory = options.required('directory')
    this.classToHandle = options.required('classToHandle')
    this.automateCategories = options.required('automateCategories', true)

    this.modules = new Collection()
    this.categories = []
  }

  register (mod, filepath) {
    mod.filepath = filepath
    mod.client = this.client
    mod.handler = this

    this.modules.set(mod.id, mod)

    if (mod.categoryID === 'General' && this.automateCategories) {
      const dirs = path.dirname(filepath).split(path.sep)
      mod.categoryID = dirs[dirs.length - 1]
    }

    if (!this.categories.includes(mod.category)) {
      this.categories.push(mod.category)
    }
  }

  load (filepath) {
    delete require.cache[require.resolve(filepath)]

    let Mod
    try {
      Mod = require(filepath)
    } catch (err) {
      return this.emit('LOAD_ERROR', filepath, err)
    }

    const mod = new Mod()

    if (!(mod instanceof this.classToHandle)) {
      throw new Error(`${mod.constructor.name} not instance ${this.classToHandle.name}.`)
    }

    if (this.modules.has(mod.id)) {
      throw new Error(`The ${mod.id} already is registered on ${this.constructor.name}.`)
    }

    this.register(mod)
    return this.emit('LOAD', mod)
  }

  loadAll (directory = this.directory) {
    const filepaths = this.constructor.readdirRecursive(directory)
    for (let filepath of filepaths) {
      filepath = path.resolve(filepath)
      this.load(filepath)
    }
    return this
  }

  static readdirRecursive (directory) {
    return fs.readdirSync(directory)
      .reduce((p, file) => {
        const filepath = path.join(directory, file)
        if (fs.statSync(filepath).isDirectory()) {
          return [...p, ...BaseHandler.readdirRecursive(filepath)]
        }
        return [...p, filepath]
      }, [])
  }
}

module.exports = BaseHandler
