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

  it('concatenates non-empty serializations.', function () {
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

  it('concatenates non-empty serializations (2).', function () {
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

  it('concatenates non-empty serializations (2).', function () {
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

  it('concatenates non-empty serializations (2).', function () {
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

  it('concatenates non-empty serializations (2).', function () {
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

  it('concatenates non-empty serializations (2).', function () {
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

  it('concatenates non-empty serializations (2).', function () {
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
})
