'use strict';

var Types = require('./types')

/**
 * serializeInline(elem) returns the markups that represent the given
 * element.
 *
 * @param {Element}
 * @return {Array}
 */
exports.serializeInline = function (elem) {
  var name = elem.nodeName.toLowerCase(),
      markups = []

  if (name === 'a')
    markups.push({ type: Types.link, href: elem.getAttribute('href') })
  else if (name === 'code')
    markups.push({ type: Types.code })
  else if (/^(strong|b)$/.test(name))
    markups.push({ type: Types.bold })
  else if (/^(em|i)$/.test(name))
    markups.push({ type: Types.italic })

  if (/italic|oblique/.test(elem.style.fontStyle))
    markups.push({ type: Types.italic })
  if (elem.style.fontWeight === 'bold' || elem.style.fontWeight >= 700)
    markups.push({ type: Types.bold })

  return markups
}

/**
 * createInline(markup) creates an element from the given markup.
 *
 * @param {Object} markup
 * @return {Element}
 */
exports.createInline = function (markup) {
  var markupElem

  switch (markup.type) {
    case Types.link:
      markupElem = 'a'
      break
    case Types.code:
      markupElem = 'code'
      break
    case Types.bold:
      markupElem = 'strong'
      break
    case Types.italic:
      markupElem = 'em'
      break

    default:
      throw new Error('Unknown markup type')
  }

  markupElem = document.createElement(markupElem)

  // The the markup represents a link, add an href attribute.
  if (markup.type === Types.link)
    markupElem.setAttribute('href', markup.href)

  return markupElem
}
