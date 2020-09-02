const { connect } = require('mongoose')
const GuildModel = require('./models/Guild')
const UserModel = require('./models/User')
const BDCollection = require('./DBCollection')

class MongoDatabase {
  constructor () {
    this.users = new BDCollection(UserModel)
    this.guilds = new BDCollection(GuildModel)
  }

  async connect (uri = process.env.DATABASE_STRING) {
    await connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  }
}

module.exports = new MongoDatabase()
