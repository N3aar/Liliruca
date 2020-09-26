const { Schema, model } = require('mongoose')

const GuildSchema = new Schema({
  _id: { type: String, required: true },
  prefix: String,
  hour: String,
  language: { type: String, lowercase: true }
}, {
  timestamps: true,
  minimize: false
})

module.exports = model('guilds', GuildSchema)
