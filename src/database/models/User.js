const { Schema, model } = require('mongoose')
const { PLACE_START_LEVEL, PLACE_MAX_LEVEL, PLACE_MIN_LEVEL } = require('@constants/constant')

const UserSchema = new Schema({
  _id: { type: String, required: true },
  money: { type: Number, default: 0, min: 0 },
  lilistars: { type: Number, default: 0, min: 0 },
  energy: { type: Number, default: 100, min: 0, max: 100 },
  background: { type: Number },
  dailyStreak: { type: Number, default: 0, min: 0 },

  // [ITEM_NAME]: ITEM_COUNT
  items: { type: Object, default: {} },
  tools: { type: Object, default: { autoequip: true } },
  statistics: { type: Object, default: {} },

  // COOLDOWN'S
  collectedAt: Number,
  energizedAt: Number,
  dailyAt: Number,
  givedAt: Number,

  // PLACES
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
  }
}, {
  timestamps: true,
  minimize: false
})

module.exports = model('users', UserSchema)
