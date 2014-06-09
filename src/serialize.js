'use strict';

var serializeInline = require('./inline').serializeInline,
    mergeAdjacent = require('./adjacent'),
    applyMarkup = require('./applyMarkup'),
    replaceNewlines = require('./replaceNewlines')

/**
 * Serialize(elem) converts the given element to an abstract,
 * stringifiable object.
 *
 * @param {Element} elem
 * @return {Serialize}
 */
function Serialize (elem) {
  if (!(this instanceof Serialize))
    return new Serialize(elem)

  if (!elem || elem.nodeType !== Node.ELEMENT_NODE)
    throw new Error('Serialize can only serialize element nodes.')

  var node = elem.firstChild,
      children = [],
      depth = 0,
      info,
      i

  this.length = 0
  this.markups = []
  this.text = ''
  this.type = elem.nodeName.toLowerCase()

  while (node) {
    if (node.nodeType === Node.ELEMENT_NODE) {

      // <br>s are interpreted as newlines.
      if (node.nodeName === 'BR') {
        this.length += 1
        this.text += '\n'
      }

      // If the element has no children, we just ignore it.
      if (!node.firstChild) {

        // But we still have to account for the possibility it's the
        // last element.
        while (!node.nextSibling) {
          if (!depth) break

          info = children.pop()
          for (i = 0; i < info.length; i += 1)
            info[i].end = this.length

          this.addMarkups(info)

          depth -= 1

          node = node.parentNode
        }

        node = node.nextSibling
        continue
      }

      info = serializeInline(node)
      for (i = 0; i < info.length; i += 1)
        info[i].start = this.length

      children.push(info)

      depth += 1

      node = node.firstChild

      continue
    }

    // Assuming only element and text nodes are present.
    this.length += node.data.length
    this.text += node.data

    while (!node.nextSibling) {
      if (!depth) break

      info = children.pop()
      for (i = 0; i < info.length; i += 1)
        info[i].end = this.length

      this.addMarkups(info)

      depth -= 1

      node = node.parentNode
    }

    node = node.nextSibling
  }

  this.mergeAdjacent()
}

/**
 * Serialize#addMarkups(markups) adds the given markups to the
 * serialization. Markups are ordered by increasing type, then
 * by increasing start index.
 *
 * @param {Array} markups
 * @return {Context}
 */
Serialize.prototype.addMarkups = function (toAdd) {
  var i

  if (!Array.isArray(toAdd))
    toAdd = [toAdd]

  for (i = 0; i < toAdd.length; i += 1)
    this._addMarkup(toAdd[i])

  return this
}

/**
 * Serialize#_addMarkup(toAdd) adds the given markup to the array
 * of markups as described above.
 *
 * @param {Object} toAdd
 * @return {Context}
 * @api Private
 */
Serialize.prototype._addMarkup = function (toAdd) {
  var i = 0

  while (this.markups[i] && toAdd.type > this.markups[i].type)
    i += 1

  while (this.markups[i] &&
         toAdd.type === this.markups[i].type &&
         toAdd.start > this.markups[i].start) {

    i += 1
  }

  while (this.markups[i] &&
         toAdd.type === this.markups[i].type &&
         toAdd.start === this.markups[i].start &&
         toAdd.end > this.markups[i].end) {

    i += 1
  }

  this.markups.splice(i, 0, toAdd)

  return this
}

/**
 * Serialze#mergeAdjacent() merges adjectent markups of the same type.
 *
 * @return {Context}
 */
Serialize.prototype.mergeAdjacent = function () {
  this.markups = mergeAdjacent(this.markups)

  return this
}

/**
 * replace(match, str, index) replaces all occurences of 'match' in a
 * serialization with substr, returning in integer indicating the difference
 * in the length of text before index (positive or negative). For example,
 * suppose a serialization had the text 'It was... red'. Then
 *
 * replace(/\.\.\./g, '…', 9) === 2 // true
 *
 * @param {RegExp} match
 * @param {String} substr
 * @param {Int >= 0} index
 * @return {Int}
 */
Serialize.prototype.replace = require('./replace')

/**
 * Serialize#toElement() converts a serialization back to an element.
 *
 * @return {Element}
 */
Serialize.prototype.toElement = function () {
  var elem = document.createElement(this.type)

  elem.textContent = this.text

  this.markups.forEach(function (markup) {
    applyMarkup(elem, markup)
  })

  replaceNewlines(elem)

  // Remove possible empty text nodes (is this necessary?)
  elem.normalize()

  return elem
}

/**
 * Serialize.fromJSON(json) converts a stringified serialization to
 * a 'live' one.
 *
 * @param {String} json
 * @return {Serialize}
 */
Serialize.fromJSON = function (json) {
  var result = JSON.parse(json),
      serialization = new this(document.createElement('p'))

  // Just overwrite properties with the parsed ones.
  Object.keys(result).forEach(function (key) {
    serialization[key] = result[key]
  })

  return serialization
}

// Expose the type codes.
Serialize.types = require('./types')

module.exports = Serialize
