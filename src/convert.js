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
  var node = elem.firstChild,
      children = [],
      depth = 0,
      info,
      i

  function pop () {
    while (!node.nextSibling && depth > 0) {
      info = children.pop()
      for (i = 0; i < info.length; i += 1)
        info[i].end = s.length

      s.addMarkups(info)

      depth -= 1
      node = node.parentNode
    }

    return node.nextSibling
  }

  while (node) {
    if (node.nodeType === Node.ELEMENT_NODE) {

      // <br>s are interpreted as newlines.
      if (node.nodeName === 'BR')
        s.text += '\n'

      // If the element has no children, we just ignore it.
      if (!node.firstChild) {

        // But we still have to account for the possibility it's the
        // last element.
        node = pop()
        continue
      }

      info = serializeInline(node)
      for (i = 0; i < info.length; i += 1)
        info[i].start = s.length

      children.push(info)

      depth += 1
      node = node.firstChild
      continue
    }

    if (node.nodeType === Node.TEXT_NODE)
      s.text += node.data

    node = pop()
  }

  // Account for styles on the element itself:
  info = serializeInline(elem)
  for (i = 0; i < info.length; i += 1) {
    info[i].start = 0
    info[i].end = s.length
    s.addMarkups(info)
  }

  s.mergeAdjacent()
}
