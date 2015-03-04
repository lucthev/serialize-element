'use strict';

module.exports = Serialize

var mergeAdjacent = require('./mergeAdjacent'),
    applyMarkup = require('./applyMarkup'),
    replaceNewlines = require('./replaceNewlines'),
    assign = require('object-assign'),
    convert = require('./convert')

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
    throw TypeError('Serialize can only serialize element nodes.')

  var text = ''

  this.length = 0
  this.markups = []
  this.type = elem.nodeName.toLowerCase()

  // Automatically update the length when setting the text.
  Object.defineProperty(this, 'text', {
    configurable: true,
    enumerable: true,
    get: function () {
      return text
    },
    set: function (newText) {
      this.length = newText.length
      text = newText
    }
  })

  convert(elem, this)
}

/**
 * Serialize#addMarkups(markups) adds the given markups to the
 * serialization. Markups are ordered by increasing type, then
 * by increasing start index, then increasing end index.
 *
 * @param {Array} markups
 * @return {Context}
 */
Serialize.prototype.addMarkups = function (toAdd) {
  if (!Array.isArray(toAdd))
    return this.addMarkup(toAdd)

  toAdd.forEach(function (markup) {
    this.addMarkup(markup)
  }, this)

  return this
}

/**
 * Serialize#addMarkup(toAdd) adds the given markup to the array
 * of markups as described above.
 *
 * @param {Object} toAdd
 * @return {Context}
 * @api Private
 */
Serialize.prototype.addMarkup =
Serialize.prototype._addMarkup = function (toAdd) {
  var index = 0,
      markup

  // Don’t add invalid markups.
  if (toAdd.start >= toAdd.end)
    return this

  // Nested anchors are invalid according to the HTML spec.
  if (toAdd.type === Serialize.types.link)
    this.removeMarkup(toAdd)

  while (index < this.markups.length) {
    markup = this.markups[index]

    if (toAdd.type < markup.type)
      break
    if (toAdd.type === markup.type && toAdd.start <= markup.start)
      break

    index += 1
  }

  this.markups.splice(index, 0, toAdd)
  mergeAdjacent(this.markups)
  return this
}

/**
 * Serialize#mergeAdjacent() doesn’t do anything. Serialize#addMarkup()
 * used to not merge markups after adding them, but, now that it does,
 * a method to explicitly do so is redundant. It is kept only for
 * backwards compatbility.
 *
 * @return {Context}
 */
Serialize.prototype.mergeAdjacent = function () {
  return this
}

/**
 * Serialize#removeMarkup(markup) removes or truncates a serialization’s
 * markups such that no markups of the same type as the given markup
 * overlap the given markup’s range. NOTE: for the link type, this method
 * does not check the href.
 *
 * @param {Object} toRemove
 * @return {Context}
 */
Serialize.prototype.removeMarkup = function (toRemove) {
  var markup,
      before,
      after,
      i

  for (i = 0; i < this.markups.length; i += 1) {
    markup = this.markups[i]

    if (markup.type > toRemove.type) break
    if (markup.type !== toRemove.type) continue

    if (markup.start <= toRemove.start && markup.end >= toRemove.end) {
      before = assign({}, markup)
      before.end = toRemove.start

      after = assign({}, markup)
      after.start = toRemove.end

      if (after.start !== after.end && before.start !== before.end) {
        this.markups.splice(i, 1, before, after)
        i += 1
      } else if (before.start !== before.end) {
        this.markups[i] = before
      } else if (after.start !== after.end) {
        this.markups[i] = after
      } else {
        this.markups.splice(i, 1)
        i -= 1
      }

      return this
    }

    if (markup.start >= toRemove.start && markup.start < toRemove.end)
      markup.start = toRemove.end
    if (markup.end > toRemove.start && markup.end <= toRemove.end)
      markup.end = toRemove.start

    if (markup.end <= markup.start) {
      this.markups.splice(i, 1)
      i -= 1
    }
  }

  return this
}

/**
 * replace(match, str, index) replaces all occurences of 'match' in a
 * serialization with the string 'substr', updating markups as appropriate.
 * 'substr' can also be a String#replace appropriate function, with a
 * minor difference: if that function returns false, or returns a string
 * identical to the match, however, the markups will not be affected.
 *
 * @param {RegExp} match
 * @param {String || Function} substr
 * @return {Context}
 */
Serialize.prototype.replace = require('./replace')

/**
 * substr(start, length) works like String#substr, returning a new
 * serialization with the appropriate markups.
 *
 * @param {Int} start
 * @param {Int} length
 * @return {Serialize}
 */
Serialize.prototype.substr = function (start, length) {
  var s = new this.constructor(document.createElement(this.type)),
      end

  if (!this.length || length <= 0)
    return s

  while (start < 0)
    start = this.length + start

  if (length === undefined || start + length > this.length)
    length = this.length - start

  end = start + length

  s.text = this.text.substr(start, length)
  this.markups.forEach(function (markup) {
    markup = assign({}, markup)
    markup.start = markup.start > start ? markup.start - start : 0
    markup.end = markup.end < end ? markup.end - start : end - start

    s.addMarkup(markup)
  })

  return s
}

/**
 * substring(start, end) works like String#substring, returning a new
 * serialization with the appropriate markups.
 *
 * @param {Int} start
 * @param {Int} end
 * @return {Serialize}
 */
Serialize.prototype.substring = function (start, end) {
  if (end < start)
    return this.substring(end, start)

  if (start < 0) start = 0
  if (end < 0) end = 0

  if (end === undefined)
    end = this.length

  return this.substr(start, end - start)
}

/**
 * append(serialization) concatenates two serializations. It's like the
 * '+' operator for strings. Returns a new serialization. If toAdd is a
 * string, markups that terminate at the end of the serialization are
 * extended so as to still terminate at the end of the returned
 * serialization.
 *
 * @param {Serialize} serialization
 * @param {Serialize || String} toAdd
 * @return {Serialize}
 */
Serialize.prototype.append = function (toAdd) {
  var s = this.substr(0)

  if (!toAdd)
    return s

  if (typeof toAdd === 'string') {
    s.markups.forEach(function (markup) {
      if (markup.end === s.length)
        markup.end += toAdd.length
    })

    s.text += toAdd
    return s
  }

  s.text += toAdd.text

  this.markups.forEach(function (markup) {
    s.addMarkup(assign({}, markup))
  })

  toAdd.markups.forEach(function (markup) {
    markup = assign({}, markup)
    markup.start += this.length
    markup.end += this.length
    s.addMarkup(markup)
  }, this)

  return s
}

/**
 * Serialize#equals(other) determines if two instances of Serialize
 * are equivalent. Continuing with the comparison to strings, it’s
 * like the equality operator.
 *
 * @param {Serialize} other
 * @return {Boolean}
 */
Serialize.prototype.equals = function (other) {
  return (
    this.type === other.type &&
    this.text === other.text &&
    this.markups.length === other.markups.length &&
    this.markups.every(function compareMarkups (markup, index) {
      var otherMarkup = other.markups[index]

      return (
        markup.type === otherMarkup.type &&
        markup.href === otherMarkup.href &&
        markup.start === otherMarkup.start &&
        markup.end === otherMarkup.end
      )
    })
  )
}

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
 * toString() overrides the default toString to return the HTML of the
 * element this Serialization represents.
 *
 * @return {String}
 */
Serialize.prototype.toString = function () {
  return this.toElement().outerHTML
}

/**
 * Serialize.fromText(text [, tag]) creates a serialization with the
 * given text, optionally with a type 'tag'. 'tag' defaults to 'p'.
 * Returns a serialization with no markups.
 *
 * @param {String} text
 * @param {String} tag
 * @return {Serialize}
 */
Serialize.fromText = function (text, tag) {
  var s = new this(document.createElement(tag || 'p'))

  s.text = text
  return s
}

/**
 * Serialize.fromJSON(json) converts a stringified serialization to
 * a 'live' one. The only mandatory properties are text and type.
 * Markups will default to empty.
 *
 * @param {String} json
 * @return {Serialize}
 */
Serialize.fromJSON = function (json) {
  var s = new this(document.createElement('p')),
      result = JSON.parse(json)

  if (typeof result.text !== 'string' || !result.type)
    throw TypeError('Required properties: "type" and "text"')

  s.type = result.type
  s.text = result.text
  s.markups = result.markups || []

  return s
}

// Expose the type identifiers.
Serialize.types = require('./types')
