'use strict';

var createInline = require('./inline').createInline

/**
 * applyMarkup(elem, markup) applies the given markup to the given
 * element.
 *
 * @param {Element} elem
 * @param {Object} markup
 */
function applyMarkup (elem, markup) {
  var node = elem.firstChild,
      index = 0,
      depth = 0,
      markupElem,
      next

  while (node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      node = node.firstChild
      depth += 1

      continue
    }

    if (index + node.data.length > markup.start) {

      if (index < markup.start) {
        next = node.splitText(markup.start - index)
        index += node.data.length

        node = next
      }

      if (index + node.data.length > markup.end) {
        node.splitText(markup.end - index)
      }

      markupElem = createInline(markup)
      node.parentNode.replaceChild(markupElem, node)
      markupElem.appendChild(node)

      index += node.data.length

      node = markupElem
    } else index += node.data.length

    if (index >= markup.end) break

    while (!node.nextSibling) {
      if (!depth) break

      depth -= 1
      node = node.parentNode
    }

    node = node.nextSibling
  }
}

module.exports = applyMarkup
