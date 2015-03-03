'use strict';

module.exports = mergeAdjacent

/**
 * mergeAdjacent(markups) takes a sorted array of markups and merges
 * adjacent or overlapping markups.
 *
 * @param {Array}
 */
function mergeAdjacent (markups) {
  var i

  for (i = 0; i < markups.length - 1; i += 1) {
    if (!canMerge(markups[i], markups[i + 1]))
      continue

    markups[i].end = Math.max(markups[i].end, markups[i + 1].end)
    markups.splice(i + 1, 1)
    i -= 1
  }
}

/**
 * canMerge(m1, m2) determines if two markups can be merged.
 *
 * @param {Object} m1
 * @param {Object} m2
 * @return {Boolean}
 */
function canMerge (m1, m2) {
  return (
    m1.type === m2.type &&
    m1.href === m2.href &&
    m1.end >= m2.start
  )
}
