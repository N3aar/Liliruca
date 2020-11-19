class Repository {
  constructor (model, cache = false) {
    this.model = model
    this.items = cache && new Map()
  }

  async ensure (id, projection) {
    return await this.get(id, projection) ?? await this.create(id)
  }

  async get (id) {
    if (this.items && this.items.has(id)) {
      return this.items.get(id)
    }

    const data = await this.model.findById(id)

    if (data && this.items) {
      this.items.set(id, data)
    }

    return data
  }

  async create (id) {
    const data = await this.model.create({ _id: id })
    if (data && this.items) {
      this.items.set(id, data)
    }

    return data
  }

  async updateOne (id, value, key) {
    const data = await this.get(id)

    data[key] = value
    data.markModified(key)

    if (this.items) {
      this.items.set(id, data)
    }

    return data.save()
  }

  update (data, values) {
    for (const key in values) {
      data[key] = values[key]
      data.markModified(key)
    }

    if (this.items) {
      this.items.set(data.id, data)
    }

    return data.save()
  }

  async delete (id) {
    if (this.items) {
      this.items.delete(id)
    }
    return this.model.deleteOne({ _id: id })
  }

  async ranking (field, ids, limit = 5, skip = 0) {
    const find = ids && { _id: { $in: ids } }
    return this.model.find(find || {}, null, { limit, skip, sort: { [field]: -1 } })
  }
}

module.exports = Repository
