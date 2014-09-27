/* global describe, it, expect, Serialize, beforeEach, afterEach */

'use strict';

var Types = Serialize.types

describe('Serialize#append', function () {

  beforeEach(function () {
    this.p = document.createElement('p')
    this.pre = document.createElement('pre')

    document.body.appendChild(this.p)
    document.body.appendChild(this.pre)
  })

  afterEach(function () {
    document.body.removeChild(this.p)
    document.body.removeChild(this.pre)
  })

  it('concatenates empty serializations.', function () {
    this.p.innerHTML = ''
    this.pre.innerHTML = ''

    var first = new Serialize(this.p),
        second = new Serialize(this.pre),
        result = first.append(second)

    expect(result.type).toEqual('p')
    expect(result.length).toEqual(0)
    expect(result.text).toEqual('')
    expect(result.markups).toEqual([])
  })

  it('concatenates empty serializations (2).', function () {
    this.p.innerHTML = ''
    this.pre.innerHTML = ''

    var first = new Serialize(this.pre),
        second = new Serialize(this.p),
        result = first.append(second)

    expect(result.type).toEqual('pre')
    expect(result.length).toEqual(0)
    expect(result.text).toEqual('')
    expect(result.markups).toEqual([])
  })

  it('concatenates empty serializations (3).', function () {
    this.p.innerHTML = 'a'
    this.pre.innerHTML = ''

    var first = new Serialize(this.p),
        second = new Serialize(this.pre),
        result = first.append(second)

    expect(result.type).toEqual('p')
    expect(result.length).toEqual(1)
    expect(result.text).toEqual('a')
    expect(result.markups).toEqual([])
  })

  it('concatenates empty serializations (4).', function () {
    this.p.innerHTML = ''
    this.pre.innerHTML = 'a'

    var first = new Serialize(this.p),
        second = new Serialize(this.pre),
        result = first.append(second)

    expect(result.type).toEqual('p')
    expect(result.length).toEqual(1)
    expect(result.text).toEqual('a')
    expect(result.markups).toEqual([])
  })

  it('concatenates empty serializations (5).', function () {
    this.p.innerHTML = '<code>a</code>'
    this.pre.innerHTML = ''

    var first = new Serialize(this.p),
        second = new Serialize(this.pre),
        result = first.append(second)

    expect(result.type).toEqual('p')
    expect(result.length).toEqual(1)
    expect(result.text).toEqual('a')
    expect(result.markups).toEqual([{
      type: Types.code,
      start: 0,
      end: 1
    }])
  })

  it('concatenates empty serializations (6).', function () {
    this.p.innerHTML = ''
    this.pre.innerHTML = '<code>a</code>'

    var first = new Serialize(this.p),
        second = new Serialize(this.pre),
        result = first.append(second)

    expect(result.type).toEqual('p')
    expect(result.length).toEqual(1)
    expect(result.text).toEqual('a')
    expect(result.markups).toEqual([{
      type: Types.code,
      start: 0,
      end: 1
    }])
  })

  it('concatenates non-empty serializations (1)', function () {
    this.p.innerHTML = 'a'
    this.pre.innerHTML = 'b'

    var first = new Serialize(this.p),
        second = new Serialize(this.pre),
        result = first.append(second)

    expect(result.type).toEqual('p')
    expect(result.length).toEqual(2)
    expect(result.text).toEqual('ab')
    expect(result.markups).toEqual([])
  })

  it('concatenates non-empty serializations (2)', function () {
    this.p.innerHTML = 'b'
    this.pre.innerHTML = 'a'

    var first = new Serialize(this.pre),
        second = new Serialize(this.p),
        result = first.append(second)

    expect(first.length).toEqual(1)
    expect(first.text).toEqual('a')
    expect(first.markups).toEqual([])

    expect(result.type).toEqual('pre')
    expect(result.length).toEqual(2)
    expect(result.text).toEqual('ab')
    expect(result.markups).toEqual([])
  })

  it('concatenates non-empty serializations (3)', function () {
    this.p.innerHTML = '<em>a</em>'
    this.pre.innerHTML = 'b'

    var first = new Serialize(this.p),
        second = new Serialize(this.pre),
        result = first.append(second)

    expect(first.length).toEqual(1)
    expect(first.text).toEqual('a')
    expect(first.markups).toEqual([{
      type: Types.italic,
      start: 0,
      end: 1
    }])

    expect(result.type).toEqual('p')
    expect(result.length).toEqual(2)
    expect(result.text).toEqual('ab')
    expect(result.markups).toEqual([{
      type: Types.italic,
      start: 0,
      end: 1
    }])
  })

  it('concatenates non-empty serializations (4)', function () {
    this.p.innerHTML = 'a'
    this.pre.innerHTML = '<em>b</em>'

    var first = new Serialize(this.p),
        second = new Serialize(this.pre),
        result = first.append(second)

    expect(first.length).toEqual(1)
    expect(first.text).toEqual('a')
    expect(first.markups).toEqual([])

    expect(result.type).toEqual('p')
    expect(result.length).toEqual(2)
    expect(result.text).toEqual('ab')
    expect(result.markups).toEqual([{
      type: Types.italic,
      start: 1,
      end: 2
    }])
  })

  it('concatenates non-empty serializations (5)', function () {
    this.p.innerHTML = '<em>a</em>'
    this.pre.innerHTML = '<em>b</em>'

    var first = new Serialize(this.p),
        second = new Serialize(this.pre),
        result = first.append(second)

    expect(first.length).toEqual(1)
    expect(first.text).toEqual('a')
    expect(first.markups).toEqual([{
      type: Types.italic,
      start: 0,
      end: 1
    }])

    expect(result.type).toEqual('p')
    expect(result.length).toEqual(2)
    expect(result.text).toEqual('ab')
    expect(result.markups).toEqual([{
      type: Types.italic,
      start: 0,
      end: 2
    }])
  })

  it('concatenates non-empty serializations (6)', function () {
    this.p.innerHTML = '<code>a</code>'
    this.pre.innerHTML = '<em>b</em>'

    var first = new Serialize(this.p),
        second = new Serialize(this.pre),
        result = first.append(second)

    expect(first.length).toEqual(1)
    expect(first.text).toEqual('a')
    expect(first.markups).toEqual([{
      type: Types.code,
      start: 0,
      end: 1
    }])

    expect(result.type).toEqual('p')
    expect(result.length).toEqual(2)
    expect(result.text).toEqual('ab')
    expect(result.markups).toEqual([{
      type: Types.code,
      start: 0,
      end: 1
    }, {
      type: Types.italic,
      start: 1,
      end: 2
    }])
  })

  it('concatenates non-empty serializations (7)', function () {
    this.p.innerHTML = '<em>a</em>'
    this.pre.innerHTML = '<code>b</code>'

    var first = new Serialize(this.p),
        second = new Serialize(this.pre),
        result = first.append(second)

    expect(first.length).toEqual(1)
    expect(first.text).toEqual('a')
    expect(first.markups).toEqual([{
      type: Types.italic,
      start: 0,
      end: 1
    }])

    expect(result.type).toEqual('p')
    expect(result.length).toEqual(2)
    expect(result.text).toEqual('ab')
    expect(result.markups).toEqual([{
      type: Types.code,
      start: 1,
      end: 2
    }, {
      type: Types.italic,
      start: 0,
      end: 1
    }])
  })

  it('should preserve links', function () {
    this.p.innerHTML = '<a href="/x">1</a>2'
    this.pre.innerHTML = '<a href="/y">3</a>4'

    var first = new Serialize(this.p),
        second = new Serialize(this.pre),
        result = first.append(second)

    expect(result.length).toEqual(4)
    expect(result.text).toEqual('1234')
    expect(result.markups).toEqual([{
      type: Types.link,
      start: 0,
      end: 1,
      href: '/x'
    }, {
      type: Types.link,
      start: 2,
      end: 3,
      href: '/y'
    }])
  })

  it('can append to itself (i.e. x + x).', function () {
    this.p.innerHTML = '<code>a<em>b</em>c</code>'

    var first = new Serialize(this.p),
        result = first.append(first)

    expect(first.length).toEqual(3)
    expect(first.text).toEqual('abc')
    expect(first.markups).toEqual([{
      type: Types.code,
      start: 0,
      end: 3
    }, {
      type: Types.italic,
      start: 1,
      end: 2
    }])

    expect(result.type).toEqual('p')
    expect(result.length).toEqual(6)
    expect(result.text).toEqual('abcabc')
    expect(result.markups).toEqual([{
      type: Types.code,
      start: 0,
      end: 6
    }, {
      type: Types.italic,
      start: 1,
      end: 2
    }, {
      type: Types.italic,
      start: 4,
      end: 5
    }])
  })

  it('can append text.', function () {
    this.p.innerHTML = 'Stuff'

    var first = new Serialize(this.p),
        result = first.append(' and things')

    expect(first.type).toEqual('p')
    expect(first.length).toEqual(5)
    expect(first.text).toEqual('Stuff')
    expect(first.markups).toEqual([])

    expect(result.type).toEqual('p')
    expect(result.length).toEqual(16)
    expect(result.text).toEqual('Stuff and things')
    expect(result.markups).toEqual([])
  })

  it('should extend markups when appending text.', function () {
    this.p.innerHTML = '1<em>2</em><b><code>3</code></b>'

    var first = new Serialize(this.p),
        result = first.append('45')

    expect(first.type).toEqual('p')
    expect(first.length).toEqual(3)
    expect(first.text).toEqual('123')
    expect(first.markups).toEqual([{
      type: Types.code,
      start: 2,
      end: 3
    }, {
      type: Types.bold,
      start: 2,
      end: 3
    }, {
      type: Types.italic,
      start: 1,
      end: 2
    }])

    expect(result.type).toEqual('p')
    expect(result.length).toEqual(5)
    expect(result.text).toEqual('12345')
    expect(result.markups).toEqual([{
      type: Types.code,
      start: 2,
      end: 5
    }, {
      type: Types.bold,
      start: 2,
      end: 5
    }, {
      type: Types.italic,
      start: 1,
      end: 2
    }])
  })
})
