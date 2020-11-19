const { EMBED_COLORS } = require('@constants/constant')
/**
 * Represents an embed
 */
class LilirucaEmbed {
  /**
   * @name MessageEmbed
   * @kind constructor
   * @memberof MessageEmbed
   */

  constructor () {
    this.fields = []
    this.color = EMBED_COLORS.default
  }

  /**
   * The accumulated length for the embed title, description, fields and footer text
   * @type {number}
   * @readonly
   */
  get length () {
    return (
      (this.title?.length ?? 0) +
      (this.description?.length ?? 0) +
      (this.fields.length >= 1
        ? this.fields.reduce((prev, curr) => prev + curr.name.length + curr.value.length, 0)
        : 0) +
      (this.footer ? this.footer.text.length : 0)
    )
  }

  /**
   * Adds a field to the embed (max 25).
   * @param {StringResolvable} name The name of this field
   * @param {StringResolvable} value The value of this field
   * @param {boolean} [inline=false] If this field will be displayed inline
   * @returns {MessageEmbed}
   */
  addField (name, value, inline) {
    return this.addFields({ name, value, inline })
  }

  /**
   * Adds fields to the embed (max 25).
   * @param {...EmbedFieldData|EmbedFieldData[]} fields The fields to add
   * @returns {MessageEmbed}
   */
  addFields (...fields) {
    this.fields.push(...this.constructor.normalizeFields(fields))
    return this
  }

  /**
   * Sets the author of this embed.
   * @param {StringResolvable} name The name of the author
   * @param {string} [iconURL] The icon URL of the author
   * @param {string} [url] The URL of the author
   * @returns {MessageEmbed}
   */
  setAuthor (name, iconURL, url) {
    this.author = { name, iconURL, url }
    return this
  }

  /**
   * Sets the color of this embed.
   * @param {ColorResolvable} color The color of the embed
   * @returns {MessageEmbed}
   */
  setColor (color) {
    this.color = color
    return this
  }

  /**
   * Sets the description of this embed.
   * @param {StringResolvable} description The description
   * @returns {MessageEmbed}
   */
  setDescription (description) {
    this.description = description
    return this
  }

  /**
   * Sets the footer of this embed.
   * @param {StringResolvable} text The text of the footer
   * @param {string} [iconURL] The icon URL of the footer
   * @returns {MessageEmbed}
   */
  setFooter (text, iconURL) {
    this.footer = { text, iconURL }
    return this
  }

  /**
   * Sets the image of this embed.
   * @param {string} url The URL of the image
   * @returns {MessageEmbed}
   */
  setImage (url) {
    this.image = { url }
    return this
  }

  /**
   * Sets the thumbnail of this embed.
   * @param {string} url The URL of the thumbnail
   * @returns {MessageEmbed}
   */
  setThumbnail (url) {
    this.thumbnail = { url }
    return this
  }

  /**
   * Sets the timestamp of this embed.
   * @param {Date|number} [timestamp=Date.now()] The timestamp or date
   * @returns {MessageEmbed}
   */
  setTimestamp (timestamp = Date.now()) {
    if (timestamp instanceof Date) timestamp = timestamp.getTime()
    this.timestamp = timestamp
    return this
  }

  /**
   * Sets the title of this embed.
   * @param {StringResolvable} title The title
   * @returns {MessageEmbed}
   */
  setTitle (title) {
    this.title = title
    return this
  }

  /**
   * Transforms the embed to a plain object.
   * @returns {Object} The raw data of this embed
   */
  toJSON () {
    return {
      title: this.title,
      type: 'rich',
      description: this.description,
      url: this.url,
      timestamp: this.timestamp ? new Date(this.timestamp) : null,
      color: this.color,
      fields: this.fields,
      thumbnail: this.thumbnail,
      image: this.image,
      author: this.author
        ? {
            name: this.author.name,
            url: this.author.url,
            icon_url: this.author.iconURL
          }
        : null,
      footer: this.footer
        ? {
            text: this.footer.text,
            icon_url: this.footer.iconURL
          }
        : null
    }
  }

  /**
   * Normalizes field input and resolves strings.
   * @param {StringResolvable} name The name of the field
   * @param {StringResolvable} value The value of the field
   * @param {boolean} [inline=false] Set the field to display inline
   * @returns {EmbedField}
   */
  static normalizeField (name, value, inline = false) {
    return { name, value, inline }
  }

  /**
   * @typedef {Object} EmbedFieldData
   * @property {StringResolvable} name The name of this field
   * @property {StringResolvable} value The value of this field
   * @property {boolean} [inline] If this field will be displayed inline
   */

  /**
   * Normalizes field input and resolves strings.
   * @param  {...EmbedFieldData|EmbedFieldData[]} fields Fields to normalize
   * @returns {EmbedField[]}
   */
  static normalizeFields (...fields) {
    return fields
      .flat(2)
      .map(field =>
        this.normalizeField(
          field && field.name,
          field && field.value,
          field && typeof field.inline === 'boolean' ? field.inline : false
        )
      )
  }
}

module.exports = LilirucaEmbed
