const items = require('../Items.json')
const numIds = new Map()

class Items {
  static hasItem (itemId) {
    return (itemId in items) || numIds.has(itemId)
  }

  static getItem (itemId) {
    const id = numIds.get(itemId) || itemId
    const item = items[id]
    return item && { id, ...item }
  }

  static getToolInInventory (data, tool) {
    const toolId = (data.tools[tool] in data.items) && data.tools[tool]
    return toolId && Items.getItem(toolId)
  }

  static getItemsByMaterialId (materialId) {
    return Object.entries(items).filter(([, i]) => i.materials && i.materials[materialId])
  }

  static getItemName (itemId, t) {
    return t && t(`items:${itemId}.name`)
  }

  static getItemDescription (itemId, t) {
    return t && t(`items:${itemId}.description`)
  }

  static getItemSale (item) {
    return item.sale || Math.floor(item.price / item.value / 2) || 1
  }

  static normalizeItemPrice (payment, value, t) {
    return t && t(`commons:moneyTypes.${payment}`, { value })
  }

  static addItemInInventory (data, inventory, itemId, amount = 1) {
    if (!data[inventory][itemId]) {
      data[inventory][itemId] = 0
    }

    data[inventory][itemId] += amount

    if (data.markModified) {
      data.markModified(inventory)
    }
  }

  static addMultipleItemsInInventory (data, inventory, items) {
    for (const item in items) {
      if (!data[inventory][item]) {
        data[inventory][item] = 0
      }

      data[inventory][item] += items[item]
    }

    if (data.markModified) {
      data.markModified(inventory)
    }
  }

  static removeItem (data, inventory, itemId, uses = 1) {
    if (data.markModified) {
      data.markModified(inventory)
    }

    if ((data[inventory][itemId] - uses) < 1) {
      return delete data.items[itemId]
    }

    data[inventory][itemId] -= uses
  }

  static autoEquipItem (data, item) {
    const tool = data.tools[item.tool]
    const current = Items.getItem(tool)

    if (tool && current.tier > item.tier) {
      return
    }

    data.tools[item.tool] = item.id
    data.markModified('tools')
  }

  static loadTypes () {
    const types = []

    for (const id in items) {
      const { type } = items[id]

      if (type && !types.includes(type)) {
        types.push(type)
      }
    }

    return types
  }
}

// Load NumIds
(() => {
  for (const item in items) {
    numIds.set(items[item].numId, item)
  }
})()

module.exports = Items
