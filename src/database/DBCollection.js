const LilirucaCollection = require('@structures/LilirucaCollection')

class DBCollection extends LilirucaCollection {
  constructor (model, maxSize) {
    super(maxSize)
    this.model = model
  }

  async get (_id, projection) {
    if (this.items.has(_id)) {
      return this.items.get(_id)
    }

    let data = await this.model.findById(_id, projection)
    if (!data) data = await this.model.create({ _id })

    this.items.set(_id, data)
    return data
  }

  async setValues (data, newData) {
    if (typeof data === 'string') data = await this.get(data)

    for (const index in newData) {
      data[index] = newData[index]
    }

    data.save()
  }

  async delete (id) {
    await this.items.delete(id)
    await this.model.deleteOne({ id })
  }
}

module.exports = DBCollection
