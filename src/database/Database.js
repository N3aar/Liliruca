const { connect } = require('mongoose')
const GuildModel = require('./models/Guild')
const UserModel = require('./models/User')
const DBCollection = require('./DBCollection')
const DBCacheCollection = require('./DBCacheCollection')
const logger = require('@utils/logger')

class MongoDatabase {
  constructor () {
    this.users = new DBCollection(UserModel)
    this.guilds = new DBCacheCollection(GuildModel)
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
