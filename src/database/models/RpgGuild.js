// const { Schema, model } = require('mongoose')
// const { ObjectId } = Schema.Types

// const MemberSchema = new Schema({
//   user: { type: ObjectId, ref: 'users', required: true },
//   userId: { type: String, required: true }
// }, {
//   _id: false,
//   timestamps: true
// })

// const BlacklistSchema = new Schema({
//   user: { type: ObjectId, ref: 'users', required: true },
//   reason: String
// }, {
//   _id: false,
//   timestamps: true
// })

// const RpgGuildSchema = new Schema({
//   name: String,
//   owner: MemberSchema,
//   members: [MemberSchema],
//   blacklist: [BlacklistSchema],
//   webhook: { token: String, id: String, enabled: Boolean }
// })

// RpgGuildSchema.virtual('membersCount').get(function () {
//   return this.members.length + 1
// })

// module.exports = model('rpgGuilds', RpgGuildSchema)
