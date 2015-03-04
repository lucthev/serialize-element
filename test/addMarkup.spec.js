/* jshint jasmine:true *//* global Serialize */
'use strict';

var types = Serialize.types

describe('Serialize#addMarkup should', function () {
  var p

  beforeEach(function () {
    p = document.createElement('p')
  })

  it('add markups to a serialization', function () {
    p.innerHTML = 'One'

    var result = new Serialize(p)
    result.addMarkup({
      type: types.bold,
      start: 0,
      end: 3
    })

    expect(result.markups).toEqual([{
      type: types.bold,
      start: 0,
      end: 3
    }])
  })

  it('not add a collapsed or backwards markup', function () {
    p.innerHTML = 'One'

    var result = new Serialize(p)
    result.addMarkup({
      type: types.bold,
      start: 1,
      end: 1
    })

    result.addMarkup({
      type: types.italic,
      start: 2,
      end: 1
    })

    expect(result.markups).toEqual([])
  })

  it('place higher types after lower ones', function () {
    p.innerHTML = '<strong>One</strong> two'

    var result = new Serialize(p)
    result.addMarkup({
      type: types.italic, // Assuming italic > bold
      start: 4,
      end: 7
    })

    expect(result.markups).toEqual([{
      type: types.bold,
      start: 0,
      end: 3,
    }, {
      type: types.italic,
      start: 4,
      end: 7
    }])
  })

  it('place lower types before higher ones', function () {
    p.innerHTML = '<em>One</em> two'

    var result = new Serialize(p)
    result.addMarkup({
      type: types.bold,
      start: 4,
      end: 7
    })

    expect(result.markups).toEqual([{
      type: types.bold,
      start: 4,
      end: 7,
    }, {
      type: types.italic,
      start: 0,
      end: 3
    }])
  })

  it('order same markups by start point', function () {
    p.innerHTML = 'One <em>two</em>'

    var result = new Serialize(p)
    result.addMarkup({
      type: types.italic,
      start: 0,
      end: 3
    })

    expect(result.markups).toEqual([{
      type: types.italic,
      start: 0,
      end: 3
    }, {
      type: types.italic,
      start: 4,
      end: 7
    }])
  })

  it('merge previous, adjacent links with the same href', function () {
    p.innerHTML = '<a href="http://www.example.com">X</a>Y'

    var result = new Serialize(p)
    result.addMarkup({
      type: types.link,
      start: 1,
      end: 2,
      href: 'http://www.example.com'
    })

    expect(result.markups).toEqual([{
      type: types.link,
      start: 0,
      end: 2,
      href: 'http://www.example.com'
    }])
  })

  it('merge subsequent, adjacent links with the same href', function () {
    p.innerHTML = 'X<a href="http://www.example.com">Y</a>'

    var result = new Serialize(p)
    result.addMarkup({
      type: types.link,
      start: 0,
      end: 1,
      href: 'http://www.example.com'
    })

    expect(result.markups).toEqual([{
      type: types.link,
      start: 0,
      end: 2,
      href: 'http://www.example.com'
    }])
  })

  it('merge previous, overlapping links with the same href', function () {
    p.innerHTML = '<a href="http://www.example.com">XY</a>Z'

    var result = new Serialize(p)
    result.addMarkup({
      type: types.link,
      start: 1,
      end: 3,
      href: 'http://www.example.com'
    })

    expect(result.markups).toEqual([{
      type: types.link,
      start: 0,
      end: 3,
      href: 'http://www.example.com'
    }])
  })

  it('merge subsequent, overlapping links with the same href', function () {
    p.innerHTML = 'X<a href="http://www.example.com">YZ</a>'

    var result = new Serialize(p)
    result.addMarkup({
      type: types.link,
      start: 0,
      end: 2,
      href: 'http://www.example.com'
    })

    expect(result.markups).toEqual([{
      type: types.link,
      start: 0,
      end: 3,
      href: 'http://www.example.com'
    }])
  })

  it('not merge adjacent links with different hrefs', function () {
    p.innerHTML = '<a href="http://foo.com">X</a>Y'

    var result = new Serialize(p)
    result.addMarkup({
      type: types.link,
      start: 1,
      end: 2,
      href: 'http://bar.com'
    })

    expect(result.markups).toEqual([{
      type: types.link,
      start: 0,
      end: 1,
      href: 'http://foo.com'
    }, {
      type: types.link,
      start: 1,
      end: 2,
      href: 'http://bar.com'
    }])
  })

  it('truncate a previous, overlapping, non-identical link', function () {
    p.innerHTML = '<a href="http://foo.com">XY</a>Z'

    var result = new Serialize(p)
    result.addMarkup({
      type: types.link,
      start: 1,
      end: 3,
      href: 'http://bar.com'
    })

    expect(result.markups).toEqual([{
      type: types.link,
      start: 0,
      end: 1,
      href: 'http://foo.com'
    }, {
      type: types.link,
      start: 1,
      end: 3,
      href: 'http://bar.com'
    }])
  })

  it('truncate a subsequent, overlapping, non-identical link', function () {
    p.innerHTML = 'X<a href="http://bar.com">YZ</a>'

    var result = new Serialize(p)
    result.addMarkup({
      type: types.link,
      start: 0,
      end: 2,
      href: 'http://foo.com'
    })

    expect(result.markups).toEqual([{
      type: types.link,
      start: 0,
      end: 2,
      href: 'http://foo.com'
    }, {
      type: types.link,
      start: 2,
      end: 3,
      href: 'http://bar.com'
    }])
  })

  it('truncate all subsequent, overlapping links', function () {
    p.innerHTML = 'One <a href="http://bar.com">two</a> <a href="http://baz.com">three</a> <a href="http://quux.com">four</a>'

    var result = new Serialize(p)
    result.addMarkup({
      type: types.link,
      start: 1,
      end: 16,
      href: 'http://foo.com'
    })

    expect(result.markups).toEqual([{
      type: types.link,
      start: 1,
      end: 16,
      href: 'http://foo.com'
    }, {
      type: types.link,
      start: 16,
      end: 18,
      href: 'http://quux.com'
    }])
  })

  it('merge previous, adjacent non-link markups', function () {
    p.innerHTML = '<em>X</em>Y'

    var result = new Serialize(p)
    result.addMarkup({
      type: types.italic,
      start: 1,
      end: 2
    })

    expect(result.markups).toEqual([{
      type: types.italic,
      start: 0,
      end: 2
    }])
  })

  it('merge subsequent, adjacent non-link markups', function () {
    p.innerHTML = 'X<em>Y</em>'

    var result = new Serialize(p)
    result.addMarkup({
      type: types.italic,
      start: 0,
      end: 1
    })

    expect(result.markups).toEqual([{
      type: types.italic,
      start: 0,
      end: 2
    }])
  })

  it('merge a previous, overlapping markup', function () {
    p.innerHTML = '<em>XY</em>Z'

    var result = new Serialize(p)
    result.addMarkup({
      type: types.italic,
      start: 1,
      end: 3
    })

    expect(result.markups).toEqual([{
      type: types.italic,
      start: 0,
      end: 3
    }])
  })

  it('merge a subsequent, overlapping markup', function () {
    p.innerHTML = 'X<em>YZ</em>'

    var result = new Serialize(p)
    result.addMarkup({
      type: types.italic,
      start: 0,
      end: 2
    })

    expect(result.markups).toEqual([{
      type: types.italic,
      start: 0,
      end: 3
    }])
  })

  it('merge all subsequent, overlapping markups', function () {
    p.innerHTML = 'One <em>two</em> <em>three</em> <em>four</em>'

    var result = new Serialize(p)
    result.addMarkup({
      type: types.italic,
      start: 1,
      end: 16
    })

    expect(result.markups).toEqual([{
      type: types.italic,
      start: 1,
      end: 18
    }])
  })
})
