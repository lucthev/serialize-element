/* global describe, it, expect, Serialize, beforeEach, afterEach */

'use strict';

var Types = Serialize.types

describe('Serialize#substr', function () {

  beforeEach(function () {
    this.elem = document.createElement('h2')

    document.body.appendChild(this.elem)
  })

  afterEach(function () {
    document.body.removeChild(this.elem)
  })

  it('should handle empty serializations.', function () {
    this.elem.innerHTML = ''

    var result = new Serialize(this.elem),
        substr = result.substr(-1, 0)

    expect(substr.type).toEqual('h2')
    expect(substr.length).toEqual(0)
    expect(substr.text).toEqual('')
    expect(substr.markups).toEqual([])
  })

  it('should handle empty serializations (2).', function () {
    this.elem.innerHTML = ''

    var result = new Serialize(this.elem),
        substr = result.substr(0, 0)

    expect(substr.length).toEqual(0)
    expect(substr.text).toEqual('')
    expect(substr.markups).toEqual([])
  })

  it('should handle empty serializations (3).', function () {
    this.elem.innerHTML = ''

    var result = new Serialize(this.elem),
        substr = result.substr(1, 0)

    expect(substr.length).toEqual(0)
    expect(substr.text).toEqual('')
    expect(substr.markups).toEqual([])
  })

  it('should handle plain text.', function () {
    this.elem.innerHTML = 'abc'

    var result = new Serialize(this.elem),
        substr = result.substr(0)

    expect(substr.length).toEqual(3)
    expect(substr.text).toEqual('abc')
    expect(substr.markups).toEqual([])
  })

  it('should handle plain text (2).', function () {
    this.elem.innerHTML = 'abc'

    var result = new Serialize(this.elem),
        substr = result.substr(1, 1)

    expect(substr.length).toEqual(1)
    expect(substr.text).toEqual('b')
    expect(substr.markups).toEqual([])
  })

  it('should handle plain text (3).', function () {
    this.elem.innerHTML = 'abc'

    var result = new Serialize(this.elem),
        substr = result.substr(-2, 1)

    expect(substr.length).toEqual(1)
    expect(substr.text).toEqual('b')
    expect(substr.markups).toEqual([])
  })

  it('should adjust markups appropriately.', function () {
    this.elem.innerHTML = '<code>abc</code>'

    var result = new Serialize(this.elem),
        substr = result.substr(0)

    expect(substr.length).toEqual(3)
    expect(substr.text).toEqual('abc')
    expect(substr.markups).toEqual([{
      type: Types.code,
      start: 0,
      end: 3
    }])
  })

  it('should adjust markups appropriately (1).', function () {
    this.elem.innerHTML = '<code>abc</code>'

    var result = new Serialize(this.elem),
        substr = result.substr(1)

    expect(substr.length).toEqual(2)
    expect(substr.text).toEqual('bc')
    expect(substr.markups).toEqual([{
      type: Types.code,
      start: 0,
      end: 2
    }])
  })

  it('should adjust markups appropriately (2).', function () {
    this.elem.innerHTML = '<code>abc</code>'

    var result = new Serialize(this.elem),
        substr = result.substr(0, 2)

    expect(substr.length).toEqual(2)
    expect(substr.text).toEqual('ab')
    expect(substr.markups).toEqual([{
      type: Types.code,
      start: 0,
      end: 2
    }])
  })

  it('should adjust markups appropriately (3).', function () {
    this.elem.innerHTML = '<code>abc</code>'

    var result = new Serialize(this.elem),
        substr = result.substr(-2, 1)

    expect(substr.length).toEqual(1)
    expect(substr.text).toEqual('b')
    expect(substr.markups).toEqual([{
      type: Types.code,
      start: 0,
      end: 1
    }])
  })

  it('should adjust markups appropriately (4).', function () {
    this.elem.innerHTML = '<code>abc</code>'

    var result = new Serialize(this.elem),
        substr = result.substr(2, -1)

    expect(substr.length).toEqual(0)
    expect(substr.text).toEqual('')
    expect(substr.markups).toEqual([])
  })

  it('should adjust markups appropriately (5).', function () {
    this.elem.innerHTML = '<code>abc</code>'

    var result = new Serialize(this.elem),
        substr = result.substr(0, 0)

    expect(substr.length).toEqual(0)
    expect(substr.text).toEqual('')
    expect(substr.markups).toEqual([])
  })

  it('should adjust markups appropriately (6).', function () {
    this.elem.innerHTML = 'abc<em>def</em>ghi'

    var result = new Serialize(this.elem),
        substr = result.substr(0)

    expect(substr.length).toEqual(9)
    expect(substr.text).toEqual('abcdefghi')
    expect(substr.markups).toEqual([{
      type: Types.italic,
      start: 3,
      end: 6
    }])
  })

  it('should adjust markups appropriately (7).', function () {
    this.elem.innerHTML = 'abc<em>def</em>ghi'

    var result = new Serialize(this.elem),
        substr = result.substr(0, 3)

    expect(substr.length).toEqual(3)
    expect(substr.text).toEqual('abc')
    expect(substr.markups).toEqual([])
  })

  it('should adjust markups appropriately (8).', function () {
    this.elem.innerHTML = 'abc<em>def</em>ghi'

    var result = new Serialize(this.elem),
        substr = result.substr(3, 3)

    expect(substr.length).toEqual(3)
    expect(substr.text).toEqual('def')
    expect(substr.markups).toEqual([{
      type: Types.italic,
      start: 0,
      end: 3
    }])
  })

  it('should adjust markups appropriately (9).', function () {
    this.elem.innerHTML = 'abc<em>def</em>ghi'

    var result = new Serialize(this.elem),
        substr = result.substr(-3, 4)

    expect(substr.length).toEqual(3)
    expect(substr.text).toEqual('ghi')
    expect(substr.markups).toEqual([])
  })

  it('should adjust markups appropriately (10).', function () {
    this.elem.innerHTML = 'abc<em>def</em>ghi'

    var result = new Serialize(this.elem),
        substr = result.substr(1, 4)

    expect(substr.length).toEqual(4)
    expect(substr.text).toEqual('bcde')
    expect(substr.markups).toEqual([{
      type: Types.italic,
      start: 2,
      end: 4
    }])
  })

  it('should adjust markups appropriately (11).', function () {
    this.elem.innerHTML = 'abc<em>def</em>ghi'

    var result = new Serialize(this.elem),
        substr = result.substr(-8, 7)

    expect(substr.length).toEqual(7)
    expect(substr.text).toEqual('bcdefgh')
    expect(substr.markups).toEqual([{
      type: Types.italic,
      start: 2,
      end: 5
    }])
  })

  it('should adjust markups appropriately (12).', function () {
    this.elem.innerHTML = 'abc<em>def</em>ghi'

    var result = new Serialize(this.elem),
        substr = result.substr(4)

    expect(substr.length).toEqual(5)
    expect(substr.text).toEqual('efghi')
    expect(substr.markups).toEqual([{
      type: Types.italic,
      start: 0,
      end: 2
    }])
  })

  it('should adjust markups appropriately (13).', function () {
    this.elem.innerHTML = 'abc<em>def</em>ghi'

    var result = new Serialize(this.elem),
        substr = result.substr(4, 1)

    expect(substr.length).toEqual(1)
    expect(substr.text).toEqual('e')
    expect(substr.markups).toEqual([{
      type: Types.italic,
      start: 0,
      end: 1
    }])
  })

  it('should adjust markups appropriately (14).', function () {
    this.elem.innerHTML = 'a<em>bcd</em>efg<strong>hij</strong>k'

    var result = new Serialize(this.elem),
        substr = result.substr(0)

    expect(substr.length).toEqual(11)
    expect(substr.text).toEqual('abcdefghijk')
    expect(substr.markups).toEqual([{
      type: Types.bold,
      start: 7,
      end: 10
    }, {
      type: Types.italic,
      start: 1,
      end: 4
    }])
  })

  it('should adjust markups appropriately (15).', function () {
    this.elem.innerHTML = 'a<em>bcd</em>efg<strong>hij</strong>k'

    var result = new Serialize(this.elem),
        substr = result.substr(0, 7)

    expect(substr.length).toEqual(7)
    expect(substr.text).toEqual('abcdefg')
    expect(substr.markups).toEqual([{
      type: Types.italic,
      start: 1,
      end: 4
    }])
  })

  it('should adjust markups appropriately (16).', function () {
    this.elem.innerHTML = 'a<em>bcd</em>efg<strong>hij</strong>k'

    var result = new Serialize(this.elem),
        substr = result.substr(4)

    expect(substr.length).toEqual(7)
    expect(substr.text).toEqual('efghijk')
    expect(substr.markups).toEqual([{
      type: Types.bold,
      start: 3,
      end: 6
    }])
  })

  it('should adjust markups appropriately (17).', function () {
    this.elem.innerHTML = 'a<em>bcd</em>efg<strong>hij</strong>k'

    var result = new Serialize(this.elem),
        substr = result.substr(3, 5)

    expect(substr.length).toEqual(5)
    expect(substr.text).toEqual('defgh')
    expect(substr.markups).toEqual([{
      type: Types.bold,
      start: 4,
      end: 5
    }, {
      type: Types.italic,
      start: 0,
      end: 1
    }])
  })

  it('should adjust markups appropriately (18).', function () {
    this.elem.innerHTML = 'a<em>bcd</em>efg<strong>hij</strong>k'

    var result = new Serialize(this.elem),
        substr = result.substr(0, 8)

    expect(substr.length).toEqual(8)
    expect(substr.text).toEqual('abcdefgh')
    expect(substr.markups).toEqual([{
      type: Types.bold,
      start: 7,
      end: 8
    }, {
      type: Types.italic,
      start: 1,
      end: 4
    }])
  })
})

describe('Serialize#substring', function () {
  beforeEach(function () {
    this.elem = document.createElement('h2')

    document.body.appendChild(this.elem)
  })

  afterEach(function () {
    document.body.removeChild(this.elem)
  })

  it('should handle empty serializations.', function () {
    this.elem.innerHTML = ''

    var result = new Serialize(this.elem),
        substr = result.substring(0, 0)

    expect(substr.type).toEqual('h2')
    expect(substr.length).toEqual(0)
    expect(substr.text).toEqual('')
    expect(substr.markups).toEqual([])
  })

  it('should handle empty serializations (2).', function () {
    this.elem.innerHTML = ''

    var result = new Serialize(this.elem),
        substr = result.substring(-2, 1)

    expect(substr.length).toEqual(0)
    expect(substr.text).toEqual('')
    expect(substr.markups).toEqual([])
  })

  it('should handle empty serializations (3).', function () {
    this.elem.innerHTML = ''

    var result = new Serialize(this.elem),
        substr = result.substring(1, -2)

    expect(substr.length).toEqual(0)
    expect(substr.text).toEqual('')
    expect(substr.markups).toEqual([])
  })

  it('should handle plain text.', function () {
    this.elem.innerHTML = 'abc'

    var result = new Serialize(this.elem),
        substr = result.substring(0)

    expect(substr.length).toEqual(3)
    expect(substr.text).toEqual('abc')
    expect(substr.markups).toEqual([])
  })

  it('should handle plain text (2).', function () {
    this.elem.innerHTML = 'abc'

    var result = new Serialize(this.elem),
        substr = result.substring(1, 2)

    expect(substr.length).toEqual(1)
    expect(substr.text).toEqual('b')
    expect(substr.markups).toEqual([])
  })

  it('should adjust markups appropriately.', function () {
    this.elem.innerHTML = '<code>abc</code>'

    var result = new Serialize(this.elem),
        substr = result.substring(0)

    expect(substr.length).toEqual(3)
    expect(substr.text).toEqual('abc')
    expect(substr.markups).toEqual([{
      type: Types.code,
      start: 0,
      end: 3
    }])
  })

  it('should adjust markups appropriately (1).', function () {
    this.elem.innerHTML = '<code>abc</code>'

    var result = new Serialize(this.elem),
        substr = result.substring(1)

    expect(substr.length).toEqual(2)
    expect(substr.text).toEqual('bc')
    expect(substr.markups).toEqual([{
      type: Types.code,
      start: 0,
      end: 2
    }])
  })

  it('should adjust markups appropriately (2).', function () {
    this.elem.innerHTML = '<code>abc</code>'

    var result = new Serialize(this.elem),
        substr = result.substring(0, 2)

    expect(substr.length).toEqual(2)
    expect(substr.text).toEqual('ab')
    expect(substr.markups).toEqual([{
      type: Types.code,
      start: 0,
      end: 2
    }])
  })

  it('should adjust markups appropriately (3).', function () {
    this.elem.innerHTML = '<code>abc</code>'

    var result = new Serialize(this.elem),
        substr = result.substring(1, 2)

    expect(substr.length).toEqual(1)
    expect(substr.text).toEqual('b')
    expect(substr.markups).toEqual([{
      type: Types.code,
      start: 0,
      end: 1
    }])
  })

  it('should adjust markups appropriately (4).', function () {
    this.elem.innerHTML = '<code>abc</code>'

    var result = new Serialize(this.elem),
        substr = result.substring(-3, 123)

    expect(substr.length).toEqual(3)
    expect(substr.text).toEqual('abc')
    expect(substr.markups).toEqual([{
      type: Types.code,
      start: 0,
      end: 3
    }])
  })

  it('should adjust markups appropriately (5).', function () {
    this.elem.innerHTML = '<code>abc</code>'

    var result = new Serialize(this.elem),
        substr = result.substring(0, 0)

    expect(substr.length).toEqual(0)
    expect(substr.text).toEqual('')
    expect(substr.markups).toEqual([])
  })

  it('should adjust markups appropriately (6).', function () {
    this.elem.innerHTML = 'abc<em>def</em>ghi'

    var result = new Serialize(this.elem),
        substr = result.substring(0)

    expect(substr.length).toEqual(9)
    expect(substr.text).toEqual('abcdefghi')
    expect(substr.markups).toEqual([{
      type: Types.italic,
      start: 3,
      end: 6
    }])
  })

  it('should adjust markups appropriately (7).', function () {
    this.elem.innerHTML = 'abc<em>def</em>ghi'

    var result = new Serialize(this.elem),
        substr = result.substring(0, 3)

    expect(substr.length).toEqual(3)
    expect(substr.text).toEqual('abc')
    expect(substr.markups).toEqual([])
  })

  it('should adjust markups appropriately (8).', function () {
    this.elem.innerHTML = 'abc<em>def</em>ghi'

    var result = new Serialize(this.elem),
        substr = result.substring(3, 6)

    expect(substr.length).toEqual(3)
    expect(substr.text).toEqual('def')
    expect(substr.markups).toEqual([{
      type: Types.italic,
      start: 0,
      end: 3
    }])
  })

  it('should adjust markups appropriately (9).', function () {
    this.elem.innerHTML = 'abc<em>def</em>ghi'

    var result = new Serialize(this.elem),
        substr = result.substring(6, 12)

    expect(substr.length).toEqual(3)
    expect(substr.text).toEqual('ghi')
    expect(substr.markups).toEqual([])
  })

  it('should adjust markups appropriately (10).', function () {
    this.elem.innerHTML = 'abc<em>def</em>ghi'

    var result = new Serialize(this.elem),
        substr = result.substring(1, 5)

    expect(substr.length).toEqual(4)
    expect(substr.text).toEqual('bcde')
    expect(substr.markups).toEqual([{
      type: Types.italic,
      start: 2,
      end: 4
    }])
  })

  it('should adjust markups appropriately (11).', function () {
    this.elem.innerHTML = 'abc<em>def</em>ghi'

    var result = new Serialize(this.elem),
        substr = result.substring(1, 8)

    expect(substr.length).toEqual(7)
    expect(substr.text).toEqual('bcdefgh')
    expect(substr.markups).toEqual([{
      type: Types.italic,
      start: 2,
      end: 5
    }])
  })

  it('should adjust markups appropriately (12).', function () {
    this.elem.innerHTML = 'abc<em>def</em>ghi'

    var result = new Serialize(this.elem),
        substr = result.substring(4)

    expect(substr.length).toEqual(5)
    expect(substr.text).toEqual('efghi')
    expect(substr.markups).toEqual([{
      type: Types.italic,
      start: 0,
      end: 2
    }])
  })

  it('should adjust markups appropriately (13).', function () {
    this.elem.innerHTML = 'abc<em>def</em>ghi'

    var result = new Serialize(this.elem),
        substr = result.substring(4, 5)

    expect(substr.length).toEqual(1)
    expect(substr.text).toEqual('e')
    expect(substr.markups).toEqual([{
      type: Types.italic,
      start: 0,
      end: 1
    }])
  })

  it('should adjust markups appropriately (14).', function () {
    this.elem.innerHTML = 'a<em>bcd</em>efg<strong>hij</strong>k'

    var result = new Serialize(this.elem),
        substr = result.substring(0)

    expect(substr.length).toEqual(11)
    expect(substr.text).toEqual('abcdefghijk')
    expect(substr.markups).toEqual([{
      type: Types.bold,
      start: 7,
      end: 10
    }, {
      type: Types.italic,
      start: 1,
      end: 4
    }])
  })

  it('should adjust markups appropriately (15).', function () {
    this.elem.innerHTML = 'a<em>bcd</em>efg<strong>hij</strong>k'

    var result = new Serialize(this.elem),
        substr = result.substring(0, 7)

    expect(substr.length).toEqual(7)
    expect(substr.text).toEqual('abcdefg')
    expect(substr.markups).toEqual([{
      type: Types.italic,
      start: 1,
      end: 4
    }])
  })

  it('should adjust markups appropriately (16).', function () {
    this.elem.innerHTML = 'a<em>bcd</em>efg<strong>hij</strong>k'

    var result = new Serialize(this.elem),
        substr = result.substring(4)

    expect(substr.length).toEqual(7)
    expect(substr.text).toEqual('efghijk')
    expect(substr.markups).toEqual([{
      type: Types.bold,
      start: 3,
      end: 6
    }])
  })

  it('should adjust markups appropriately (17).', function () {
    this.elem.innerHTML = 'a<em>bcd</em>efg<strong>hij</strong>k'

    var result = new Serialize(this.elem),
        substr = result.substring(3, 8)

    expect(substr.length).toEqual(5)
    expect(substr.text).toEqual('defgh')
    expect(substr.markups).toEqual([{
      type: Types.bold,
      start: 4,
      end: 5
    }, {
      type: Types.italic,
      start: 0,
      end: 1
    }])
  })

  it('should adjust markups appropriately (18).', function () {
    this.elem.innerHTML = 'a<em>bcd</em>efg<strong>hij</strong>k'

    var result = new Serialize(this.elem),
        substr = result.substring(0, 8)

    expect(substr.length).toEqual(8)
    expect(substr.text).toEqual('abcdefgh')
    expect(substr.markups).toEqual([{
      type: Types.bold,
      start: 7,
      end: 8
    }, {
      type: Types.italic,
      start: 1,
      end: 4
    }])
  })
})
