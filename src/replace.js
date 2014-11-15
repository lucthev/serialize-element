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
 * serialization with the string 'substr', updating markups as appropriate.
 * 'substr' can also be a String#replace appropriate function, with a
 * minor difference: if that function returns false, or returns a string
 * identical to the match, however, the markups will not be affected.
 *
 * @param {RegExp} match
 * @param {String || Function} substr
 * @return {Context}
 */
function replace (match, substr) {
  var replaced = 0

  this.text = this.text.replace(match, function (match) {
    var original = arguments[arguments.length - 1],
        index = arguments[arguments.length - 2],
        difference,
        markup,
        letter,
        paren,
        str,
        i

    if (typeof substr === 'function') {
      str = substr.apply(null, arguments)

      // If the function returns false or a string identical to match,
      // we take no action.
      if (str === false || str === match)
        return match

    } else {

      // Account for special replacement patterns; see
      // https://github.com/lucthev/serialize/issues/2
      // for more details.

      str = ''
      for (i = 0; i < substr.length; i += 1) {
        letter = substr[i]

        if (letter !== '$') {
          str += letter
          continue
        }

        letter = substr[i + 1]
        switch (letter) {
          case '$':
            str += '$'
            break
          case '&':
            str += match
            break
          case '`':
            str += original.substr(0, index)
            break
          case '\'':
            str += original.substr(index + match.length)
            break

          default:
            paren = parseInt(letter)

            if (paren && paren <= arguments.length - 3)
              str += arguments[paren]
            else
              str += ('$' + letter)
        }

        i += 1
      }
    }

    // Account for the fact that the length of the text may have already
    // been changed by a previous replace.
    index -= replaced

    difference = match.length - str.length
    replaced += difference

    // Update all markups.
    for (i = 0; i < this.markups.length; i += 1) {
      markup = this.markups[i]

      if (contained(index, index + match.length, markup.start))
        markup.start = index + str.length
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

    return str
  }.bind(this))

  // Just recalculate the new length afterwards.
  this.length = this.text.length

  return this
}

module.exports = replace
