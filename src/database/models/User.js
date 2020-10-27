const { Schema, model } = require('mongoose')
const { PLACE_START_LEVEL, PLACE_MAX_LEVEL, PLACE_MIN_LEVEL } = require('@constants')

const UserSchema = new Schema({
  _id: { type: String, required: true },
  money: { type: Number, default: 0 },
  energy: { type: Number, default: 100, min: 0, max: 100 },
  energizedAt: Number,
  collectedAt: Number,
  givedAt: Number,
  dailyAt: Number,
  dailyStreak: { type: Number, default: 0, min: 0 },
  lilistars: { type: Number, default: 0, min: 0 },
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
    amount: { type: Number, default: 0 },
    rares: { type: Object, default: { total: 0 } }
  },
  mining: {
    level: { type: Number, default: 0, min: 0, max: PLACE_MAX_LEVEL },
    storage: { type: Number, default: 1 },
    amount: { type: Number, default: 0 }
  },
  activeItems: { type: Object, default: {} },
  items: { type: Object, default: {} }
}, {
  timestamps: true,
  minimize: false
})

module.exports = model('users', UserSchema)
