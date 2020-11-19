const { connect } = require('mongoose')
const GuildModel = require('./models/Guild')
const UserModel = require('./models/User')
const logger = require('@utils/logger')
const Repository = require('./Repository')

class MongoDatabase {
  constructor () {
    this.users = new Repository(UserModel)
    this.guilds = new Repository(GuildModel, true)
  }

  async connect (uri = process.env.MONGO_URI) {
    await connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    logger.success('Database connected successfully!')
  }
}

module.exports = new MongoDatabase()
