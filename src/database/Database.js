const { connect } = require('mongoose')
const GuildModel = require('./models/Guild')
const UserModel = require('./models/User')
const BDCollection = require('./DBCollection')
const logger = require('@utils/logger')

class MongoDatabase {
  constructor () {
    this.users = new BDCollection(UserModel)
    this.guilds = new BDCollection(GuildModel)
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
