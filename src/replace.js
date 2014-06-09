'use strict';

/**
 * contained(min, max, n) determines if the number n is greater than
 * min and less than max.
 *
 * @param {Int} min
 * @param {Int} max
 * @param {Int} n
 * @return {Boolean}
 */
function contained (min, max, n) {
  return n > min && n < max
}

/**
 * replace(match, str, index) replaces all occurences of 'match' in a
 * serialization with substr, updating markups as appropriate.
 *
 * @param {RegExp} match
 * @param {String} substr
 * @return {Context}
 */
function replace (match, substr) {
  var replaced = 0

  this.text = this.text.replace(match, function (match) {
    var index = arguments[arguments.length - 2],
        difference,
        markup,
        i

    // Account for the fact that the length of the text may have already
    // been changed by a previous replace.
    index -= replaced

    difference = match.length - substr.length
    replaced += difference

    // Update all markups.
    for (i = 0; i < this.markups.length; i += 1) {
      markup = this.markups[i]

      if (contained(index, index + match.length, markup.start))
        markup.start = index + substr.length
      else if (markup.start > index)
        markup.start -= difference

      if (contained(index, index + match.length, markup.end))
        markup.end = index
      else if (markup.end > index)
        markup.end -= difference

      // Remove the markup if it no longer makes sense.
      if (markup.end <= markup.start) {
        this.markups.splice(i, 1)
        i -= 1
      } else
        this.markups[i] = markup
    }

    return substr
  }.bind(this))

  // Just recalculate the new length afterwards.
  this.length = this.text.length

  return this
}

module.exports = replace
