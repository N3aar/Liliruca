const items = require('../Items.json')

function loadTypes () {
  const types = []

  for (const id in items) {
    const { type } = items[id]

    if (type && !types.includes(type)) {
      types.push(type)
    }
  }

  return types
}

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
      return { id: item, item: getItemById(item), tier: i }
    }
  }
  return null
}

function addItemInInventory (data, inventory, itemId, amount = 1) {
  if (!data[inventory][itemId]) {
    data[inventory][itemId] = 0
  }

  data[inventory][itemId] += amount

  data.markModified(inventory)
}

function removeItem (data, inventory, itemId, uses = 1) {
  data.markModified(inventory)

  if ((data[inventory][itemId] - uses) < 1) {
    return delete data[inventory][itemId]
  }

  data[inventory][itemId] -= uses
}

module.exports = {
  loadTypes,
  hasItem,
  getItemById,
  getItemInInventoryByTier,
  addItemInInventory,
  removeItem,
  items
}
