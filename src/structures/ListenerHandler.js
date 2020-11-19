const Collection = require('@discordjs/collection')
const BaseHandler = require('./base/BaseHandler')
const LilirucaListener = require('./LilirucaListener')

class ListenerHandler extends BaseHandler {
  constructor (client, directory, automateCategories = true) {
    super(client, {
      directory,
      classToHandle: LilirucaListener,
      automateCategories
    })

    this.emitters = new Collection()
    this.emitters.set('client', this.client)
  }

  setEmitter (name, emitter) {
    this.emitters.set(name, emitter)
  }

  register (listener, filepath) {
    super.register(listener, filepath)

    const emitter = this.emitters.get(listener.emitter)
    if (!emitter) {
      throw new Error(`${listener.constructor.name} has an invalid emitter.`)
    }

    emitter[listener.type](listener.event, (...args) => listener.exec(...args))
  }
}

module.exports = ListenerHandler
