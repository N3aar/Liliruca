const items = require('../Items.json')

function hasItem (id) {
  return (id in items)
}

function getItemById (id) {
  return items[id]
}

function getItemInInventoryByTier (inventory, itemName, levelMax = 3) {
  for (let i = levelMax; i > 0; i--) {
    const item = `${itemName}:${i}`
    if (inventory[item]) {
      return { id: item, item: getItemById(item) }
    }
  }
  return null
}

function addItemInInventory (inventory, itemId, amount = 1) {
  if (!inventory[itemId]) {
    inventory[itemId] = 0
  }

  inventory[itemId] += amount
}

function removeUsedItem (data, itemId, uses = 1) {
  const value = data.activeItems[itemId]

  data.markModified('activeItems')

  if (value <= 1) {
    return delete data.activeItems[itemId]
  }

  data.activeItems[itemId] -= uses
}

module.exports = {
  hasItem,
  getItemById,
  getItemInInventoryByTier,
  addItemInInventory,
  removeUsedItem,
  items
}
