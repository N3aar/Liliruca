const items = require('../Items.json')

function hasItem (itemId) {
  return (itemId in items)
}

function getItemById (itemId) {
  return items[itemId]
}

function getToolInInventory (data, tool) {
  const toolId = (data.tools[tool] in data.items) && data.tools[tool]
  return toolId && { id: toolId, item: getItemById(toolId) }
}

function getItemsByMaterialId (materialId) {
  return Object.entries(items).filter(([, i]) => i.materials && i.materials[materialId])
}

function getItemName (itemId, t) {
  return t(`items:${itemId}.name`)
}

function getItemDescription (itemId, t) {
  return t(`items:${itemId}.description`)
}

function getItemSale (item) {
  return item.sale || Math.floor(item.price / item.value / 2) || 1
}

function normalizeItemPrice (payment, value, t) {
  return t(`commons:moneyTypes.${payment}`, { value })
}

function addItemInInventory (data, inventory, itemId, amount = 1) {
  if (!data[inventory][itemId]) {
    data[inventory][itemId] = 0
  }

  data[inventory][itemId] += amount

  data.markModified('items')
}

function removeItem (data, inventory, itemId, uses = 1) {
  data.markModified('items')

  if ((data[inventory][itemId] - uses) < 1) {
    return delete data.items[itemId]
  }

  data[inventory][itemId] -= uses
}

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

module.exports = {
  items,
  hasItem,
  getItemById,
  getToolInInventory,
  getItemsByMaterialId,
  getItemName,
  getItemDescription,
  getItemSale,
  normalizeItemPrice,
  addItemInInventory,
  removeItem,
  loadTypes
}
