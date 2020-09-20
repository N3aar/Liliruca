const LilirucaCollection = require('@structures/LilirucaCollection')

class DBCollection extends LilirucaCollection {
  constructor (model, maxSize) {
    super(maxSize)
    this.model = model
  }

  async get (id, projection) {
    if (this.items.has(id)) {
      return this.items.get(id)
    }

    const data = await this.model.findById(id, projection) || await this.model.create({ id })
    this.items.set(id, data)

    return data
  }

  async set (id, value, key) {
    const data = await this.get(id)

    data[key] = value
    data.markModified(key)
    this.items.set(id, data)

    return data.save()
  }

  sets (data, values) {
    for (const key in values) {
      data[key] = values[key]
      data.markModified(key)
    }

    this.items.set(data.id, data)

    return data.save()
  }

  async delete (id) {
    await this.items.delete(id)
    await this.model.deleteOne({ id })
  }
}

module.exports = DBCollection
