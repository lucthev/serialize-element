'use strict';

var LinkType = require('./types').link

/**
 * canMerge(m1, m2) determines if two markups can be merged. If so,
 * return the result of merging both markups; otherwise, returns false.
 *
 * @param {Object} m1
 * @param {Object} m2
 * @return {Object || false}
 */
function canMerge (m1, m2) {

  // Check for matching types first. If the types are links, check also
  // for matching hrefs.
  if (m1.type !== m2.type || (m1.type === LinkType && m1.href !== m2.href))
    return false

  // We can rely on the fact that the markups are sorted, so the start of
  // the second markup is >= start of the first.
  if (m2.start <= m1.end) {
    m1.end = Math.max(m1.end, m2.end)

    return m1
  }

  return false
}

/**
 * mergeAdjacent(markups) takes a sorted array of markups and merges
 * adjacent or overlapping markups.
 *
 * @param {Array}
 * @return {Array}
 */
function mergeAdjacent (markups) {
  var mergeable,
      i

  for (i = 0; i < markups.length - 1; i += 1) {
    mergeable = canMerge(markups[i], markups[i + 1])

    if (mergeable) {
      markups.splice(i, 2, mergeable)

      // We want to merge all mergeable markups into one.
      i -= 1
    }
  }

  return markups
}

module.exports = mergeAdjacent
