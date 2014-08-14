/* global describe, it, expect, Serialize, beforeEach, afterEach */
'use strict';

var Types = Serialize.types

describe('Serialize#removeMarkup should', function () {

  beforeEach(function () {
    this.elem = document.createElement('p')

    document.body.appendChild(this.elem)
  })

  afterEach(function () {
    document.body.removeChild(this.elem)
  })

  it('do nothing when there are no markups.', function () {
    this.elem.innerHTML = 'One'

    var result = new Serialize(this.elem)

    expect(result.markups).toEqual([])

    result.removeMarkup({
      type: Types.bold,
      start: 0,
      end: 3
    })

    expect(result.markups).toEqual([])
  })

  it('do nothing when there are no markups of that type.', function () {
    this.elem.innerHTML = '<em>We Swarm</em>'

    var result = new Serialize(this.elem)

    expect(result.markups).toEqual([{
      type: Types.italic,
      start: 0,
      end: 8
    }])

    result.removeMarkup({
      type: Types.bold,
      start: 1,
      end: 2
    })

    expect(result.markups).toEqual([{
      type: Types.italic,
      start: 0,
      end: 8
    }])
  })

  it('do nothing when the markups don’t overlap.', function () {
    this.elem.innerHTML = '<em>La</em> nuit'

    var result = new Serialize(this.elem)

    expect(result.markups).toEqual([{
      type: Types.italic,
      start: 0,
      end: 2
    }])

    result.removeMarkup({
      type: Types.italic,
      start: 5,
      end: 7
    })

    expect(result.markups).toEqual([{
      type: Types.italic,
      start: 0,
      end: 2
    }])
  })

  it('do nothing when the markups are adjacent (1).', function () {
    this.elem.innerHTML = 'Jour <b>de</b> doute'

    var result = new Serialize(this.elem)

    expect(result.markups).toEqual([{
      type: Types.bold,
      start: 5,
      end: 7
    }])

    result.removeMarkup({
      type: Types.bold,
      start: 0,
      end: 5
    })

    expect(result.markups).toEqual([{
      type: Types.bold,
      start: 5,
      end: 7
    }])
  })

  it('do nothing when the markups are adjacent (2).', function () {
    this.elem.innerHTML = 'Jour <b>de</b> doute'

    var result = new Serialize(this.elem)

    expect(result.markups).toEqual([{
      type: Types.bold,
      start: 5,
      end: 7
    }])

    result.removeMarkup({
      type: Types.bold,
      start: 7,
      end: 13
    })

    expect(result.markups).toEqual([{
      type: Types.bold,
      start: 5,
      end: 7
    }])
  })

  it('truncate overlapping markups (1).', function () {
    this.elem.innerHTML = 'Wide <i>web</i> world'

    var result = new Serialize(this.elem)

    expect(result.markups).toEqual([{
      type: Types.italic,
      start: 5,
      end: 8
    }])

    result.removeMarkup({
      type: Types.italic,
      start: 0,
      end: 6
    })

    expect(result.markups).toEqual([{
      type: Types.italic,
      start: 6,
      end: 8
    }])
  })

  it('truncate overlapping markups (2).', function () {
    this.elem.innerHTML = 'Wide <i>web</i> world'

    var result = new Serialize(this.elem)

    expect(result.markups).toEqual([{
      type: Types.italic,
      start: 5,
      end: 8
    }])

    result.removeMarkup({
      type: Types.italic,
      start: 7,
      end: 14
    })

    expect(result.markups).toEqual([{
      type: Types.italic,
      start: 5,
      end: 7
    }])
  })

  it('truncate overlapping markups (3).', function () {
    this.elem.innerHTML = 'Wide <i>web</i> world'

    var result = new Serialize(this.elem)

    expect(result.markups).toEqual([{
      type: Types.italic,
      start: 5,
      end: 8
    }])

    result.removeMarkup({
      type: Types.italic,
      start: 5,
      end: 7
    })

    expect(result.markups).toEqual([{
      type: Types.italic,
      start: 7,
      end: 8
    }])
  })

  it('truncate overlapping markups (4).', function () {
    this.elem.innerHTML = 'Wide <i>web</i> world'

    var result = new Serialize(this.elem)

    expect(result.markups).toEqual([{
      type: Types.italic,
      start: 5,
      end: 8
    }])

    result.removeMarkup({
      type: Types.italic,
      start: 6,
      end: 8
    })

    expect(result.markups).toEqual([{
      type: Types.italic,
      start: 5,
      end: 6
    }])
  })

  it('remove containing markups (1).', function () {
    this.elem.innerHTML = 'Wide <i>web</i> world'

    var result = new Serialize(this.elem)

    expect(result.markups).toEqual([{
      type: Types.italic,
      start: 5,
      end: 8
    }])

    result.removeMarkup({
      type: Types.italic,
      start: 0,
      end: 8
    })

    expect(result.markups).toEqual([])
  })

  it('remove containing markups (2).', function () {
    this.elem.innerHTML = 'Wide <i>web</i> world'

    var result = new Serialize(this.elem)

    expect(result.markups).toEqual([{
      type: Types.italic,
      start: 5,
      end: 8
    }])

    result.removeMarkup({
      type: Types.italic,
      start: 5,
      end: 14
    })

    expect(result.markups).toEqual([])
  })

  it('remove containing markups (3).', function () {
    this.elem.innerHTML = 'Wide <i>web</i> world'

    var result = new Serialize(this.elem)

    expect(result.markups).toEqual([{
      type: Types.italic,
      start: 5,
      end: 8
    }])

    result.removeMarkup({
      type: Types.italic,
      start: 4,
      end: 9
    })

    expect(result.markups).toEqual([])
  })

  it('remove containing markups (4).', function () {
    this.elem.innerHTML = 'Wide <i>web</i> world'

    var result = new Serialize(this.elem)

    expect(result.markups).toEqual([{
      type: Types.italic,
      start: 5,
      end: 8
    }])

    result.removeMarkup({
      type: Types.italic,
      start: 5,
      end: 8
    })

    expect(result.markups).toEqual([])
  })

  it('truncate multiple markups.', function () {
    this.elem.innerHTML = 'Feels <i>like</i> <em>we</em> only ' +
      '<span style="font-style: oblique;" >go</span> backwards'

    var result = new Serialize(this.elem)

    expect(result.markups).toEqual([{
      type: Types.italic,
      start: 6,
      end: 10
    }, {
      type: Types.italic,
      start: 11,
      end: 13
    }, {
      type: Types.italic,
      start: 19,
      end: 21
    }])

    result.removeMarkup({
      type: Types.italic,
      start: 8,
      end: 20
    })

    expect(result.markups).toEqual([{
      type: Types.italic,
      start: 6,
      end: 8
    }, {
      type: Types.italic,
      start: 20,
      end: 21
    }])
  })
})
