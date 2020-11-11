const items = require('../Items.json')
const numIds = new Map()

function hasItem (itemId) {
  return (itemId in items) || numIds.has(itemId)
}

function getItem (itemId) {
  const id = numIds.get(itemId) || itemId
  const item = items[id]
  return item && { id, ...item }
}

function getToolInInventory (data, tool) {
  const toolId = (data.tools[tool] in data.items) && data.tools[tool]
  return toolId && getItem(toolId)
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

  data.markModified(inventory)
}

function removeItem (data, inventory, itemId, uses = 1) {
  data.markModified(inventory)

  if ((data[inventory][itemId] - uses) < 1) {
    return delete data.items[itemId]
  }

  data[inventory][itemId] -= uses
}

function autoEquipItem (data, item) {
  const tool = data.tools[item.tool]
  const current = getItem(tool)

  if (tool && current.tier > item.tier) {
    return
  }

  data.tools[item.tool] = item.id
  data.markModified('tools')
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

function loadNumIds () {
  for (const item in items) {
    numIds.set(items[item].numId, item)
  }
}

loadNumIds()

module.exports = {
  items,
  numIds,
  getItem,
  hasItem,
  getToolInInventory,
  getItemsByMaterialId,
  getItemName,
  getItemDescription,
  getItemSale,
  normalizeItemPrice,
  addItemInInventory,
  removeItem,
  autoEquipItem,
  loadTypes
}
