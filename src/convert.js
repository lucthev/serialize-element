'use strict';

module.exports = convert

var serializeInline = require('./inline').serializeInline

/**
 * convert(elem, s) performs the actual work of converting an element
 * into its abstract representation.
 *
 * @param {Element} elem
 * @param {Serialize} s
 */
function convert (elem, s) {
  var allMarkups = [],
      node = elem,
      markups,
      i

  while (node) {
    if (node.nodeType === Node.ELEMENT_NODE && node.firstChild) {
      markups = serializeInline(node)
      for (i = 0; i < markups.length; i += 1)
        markups[i].start = s.length

      allMarkups.push(markups)

      node = node.firstChild
      continue
    }

    if (node.nodeType === Node.TEXT_NODE)
      s.text += node.data
    else if (node.nodeName === 'BR')
      s.text += '\n'

    while (!node.nextSibling && node !== elem) {
      markups = allMarkups.pop()
      for (i = 0; i < markups.length; i += 1)
        markups[i].end = s.length

      allMarkups.unshift(markups)

      node = node.parentNode
    }

    if (node === elem)
      break

    node = node.nextSibling
  }

  s.addMarkups(allMarkups.reduce(function (arr, markups) {
    return arr.concat(markups)
  }, []))
}
