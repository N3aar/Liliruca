const { Schema, model } = require('mongoose')
const { PLACE_START_LEVEL, PLACE_MAX_LEVEL, PLACE_MIN_LEVEL } = require('@constants')

const UserSchema = new Schema({
  _id: { type: String, required: true },
  money: { type: Number, default: 0 },
  collectedAt: Number,
  dailyAt: Number,
  givedAt: Number,
  lilistars: Number,
  images: {
    farm: Array,
    fishing: Array,
    mining: Array
  },
  farm: {
    level: { type: Number, default: PLACE_START_LEVEL, min: PLACE_MIN_LEVEL, max: PLACE_MAX_LEVEL },
    storage: { type: Number, default: 1 },
    amount: { type: Number, default: 0 }
  },
  fishing: {
    level: { type: Number, default: 0, min: 0, max: PLACE_MAX_LEVEL },
    storage: { type: Number, default: 1 },
    amount: { type: Number, default: 0 }
  },
  mining: {
    level: { type: Number, default: 0, min: 0, max: PLACE_MAX_LEVEL },
    storage: { type: Number, default: 1 },
    amount: { type: Number, default: 0 }
  },
  items: { type: Object, default: {} }
}, {
  timestamps: true
})

module.exports = model('users', UserSchema)
