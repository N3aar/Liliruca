const LilirucaCollection = require('@structures/LilirucaCollection')

class DBCollection extends LilirucaCollection {
  constructor (model) {
    super()
    this.model = model
  }

  async get (id, projection) {
    return await this.model.findById(id, projection) || await this.model.create({ _id: id })
  }

  async ranking (field, limit = 5, skip = 0) {
    return this.model.find({}, null, { limit, skip, sort: { [field]: -1 } })
  }

  async updateOne (id, value, key) {
    const data = await this.get(id)

    data[key] = value
    data.markModified(key)

    return data.save()
  }

  update (data, values) {
    for (const key in values) {
      data[key] = values[key]
      data.markModified(key)
    }

    return data.save()
  }

  async delete (id) {
    await this.model.deleteOne({ _id: id })
  }
}

module.exports = DBCollection
