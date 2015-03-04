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
  var node = elem,
      children = [],
      info,
      i

  while (node) {
    if (node.nodeType === Node.ELEMENT_NODE && node.firstChild) {
      info = serializeInline(node)
      for (i = 0; i < info.length; i += 1)
        info[i].start = s.length

      children.push(info)

      node = node.firstChild
      continue
    }

    if (node.nodeType === Node.TEXT_NODE)
      s.text += node.data
    else if (node.nodeName === 'BR')
      s.text += '\n'

    while (!node.nextSibling && node !== elem) {
      info = children.pop()
      for (i = 0; i < info.length; i += 1)
        info[i].end = s.length

      s.addMarkups(info)

      node = node.parentNode
    }

    if (node === elem)
      break

    node = node.nextSibling
  }
}
