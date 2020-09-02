const { Schema, model } = require('mongoose')

const GuildSchema = new Schema({
  _id: { type: String, required: true },
  prefix: String,
  hour: { type: Number, default: 0 },
  language: { type: String, lowercase: true }
}, {
  timestamps: true
})

module.exports = model('guilds', GuildSchema)
