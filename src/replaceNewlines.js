'use strict';

/**
 * replaceNewlines(elem) replaces newlines in the element's text with
 * <br>s.
 *
 * @param {Element} elem
 */
function replaceNewlines (elem) {
  var node = elem.firstChild,
      depth = 0,
      br

  while (node) {
    if (node.nodeType === 1) { // Node.ELEMENT_NODE

      if (node.firstChild) {
        depth += 1
        node = node.firstChild
      }
      else node = node.nextSibling

      continue
    }

    if (/\n/.test(node.data)) {
      node.splitText(node.data.indexOf('\n') + 1)

      br = node.splitText(node.data.length - 1)

      // We now have a lone text with \n as data.
      // Replace it with a <br>
      br.parentNode.replaceChild(document.createElement('br'), br)

      node = node.nextSibling
    }

    while (!node.nextSibling) {
      if (!depth) break

      depth -= 1
      node = node.parentNode
    }

    node = node.nextSibling
  }
}

module.exports = replaceNewlines
