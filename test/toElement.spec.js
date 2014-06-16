/* global describe, it, expect, Serialize, beforeEach, afterEach */

'use strict';

var Types = Serialize.types

describe('Serialize#toElement', function () {

  beforeEach(function () {
    this.elem = document.createElement('p')

    document.body.appendChild(this.elem)
  })

  afterEach(function () {
    document.body.removeChild(this.elem)
  })

  it('should convert serializations to elements.', function () {
    this.elem.innerHTML = 'Once upon a time'

    var result = new Serialize(this.elem),
        elem = result.toElement()

    expect(elem.nodeName.toLowerCase()).toEqual('p')
    expect(elem.innerHTML).toEqual('Once upon a time')
  })

  it('should apply markups to elements.', function () {
    var goodHTML = 'Black <em>out</em> days'

    this.elem.innerHTML = goodHTML

    var result = new Serialize(this.elem),
        elem = result.toElement()

    expect(elem.innerHTML).toEqual(goodHTML)
  })

  it('should apply markups to elements (2).', function () {
    var goodHTML = '<a href="#">Gold on the ceiling</a>'

    this.elem.innerHTML = goodHTML

    var result = new Serialize(this.elem),
        elem = result.toElement()

    expect(elem.innerHTML).toEqual(goodHTML)
  })

  it('should apply markups to elements (3).', function () {
    var goodHTML = 'The <em>great </em><code>Gatsby</code>'

    this.elem.innerHTML = goodHTML

    var result = new Serialize(this.elem),
        elem = result.toElement()

    expect(elem.innerHTML).toEqual(goodHTML)
  })

  it('should apply markups to elements (4).', function () {
    var badHTML = 'Little <i><em>black</em> sub</i>marine',
        goodHTML = 'Little <em>black sub</em>marine'

    this.elem.innerHTML = badHTML

    var result = new Serialize(this.elem),
        elem = result.toElement()

    expect(elem.innerHTML).toEqual(goodHTML)
  })

  it('should apply markups to trickier situations.', function () {
    var goodHTML = '<em>Dream </em><code><em>within a</em></code><em> dream</em>'

    this.elem.innerHTML = goodHTML

    var result = new Serialize(this.elem),
        elem = result.toElement()

    expect(result.markups).toEqual([{
      type: Types.code,
      start: 6,
      end: 14
    }, {
      type: Types.italic,
      start: 0,
      end: 20
    }])
    expect(elem.innerHTML).toEqual(goodHTML)
  })

  it('should respect the hieriarchy of types.', function () {
    var badHTML = '<a href="#">Romeo </a><em><a href="#">kiffe</a></em> Juliette',
        goodHTML = '<a href="#">Romeo <em>kiffe</em></a> Juliette'

    this.elem.innerHTML = badHTML

    var result = new Serialize(this.elem),
        elem = result.toElement()

    expect(elem.innerHTML).toEqual(goodHTML)
  })

  it('should respect the hieriarchy of types (2).', function () {
    var badHTML = 'Éducat<em><code><a href="/somewhere">ion nat</a></code></em>ionale',
        goodHTML = 'Éducat<a href="/somewhere"><code><em>ion nat</em></code></a>ionale'

    this.elem.innerHTML = badHTML

    var result = new Serialize(this.elem),
        elem = result.toElement()

    expect(elem.innerHTML).toEqual(goodHTML)
  })

  it('should treat <br>s as newlines.', function () {
    var goodHTML = 'One<br>two'

    this.elem.innerHTML = goodHTML

    var result = new Serialize(this.elem),
        elem = result.toElement()

    expect(elem.innerHTML).toEqual(goodHTML)
  })

  it('should treat <br>s as newlines (2).', function () {
    var goodHTML = '<strong>One<br>two</strong>'

    this.elem.innerHTML = goodHTML

    var result = new Serialize(this.elem),
        elem = result.toElement()

    expect(elem.innerHTML).toEqual(goodHTML)
  })

  it('should treat <br>s as newlines (3).', function () {
    var goodHTML = '<strong>One</strong><br><strong>two</strong>'

    this.elem.innerHTML = goodHTML

    var result = new Serialize(this.elem),
        elem = result.toElement()

    expect(elem.innerHTML).toEqual(goodHTML)
  })

  it('should treat <br>s as newlines (4).', function () {
    var goodHTML = '<br><em>I walked</em> the long <strong>path</strong>'

    this.elem.innerHTML = goodHTML

    var result = new Serialize(this.elem),
        elem = result.toElement()

    expect(elem.innerHTML).toEqual(goodHTML)
  })

  it('should treat <br>s as newlines (5).', function () {
    var goodHTML = '<code>alone</code>, my feet hurt.<br>'

    this.elem.innerHTML = goodHTML

    var result = new Serialize(this.elem),
        elem = result.toElement()

    expect(elem.innerHTML).toEqual(goodHTML)
  })

  it('should treat <br>s as newlines (6).', function () {
    var goodHTML = 'One<br>two<br>three<br>'

    this.elem.innerHTML = goodHTML

    var result = new Serialize(this.elem),
        elem = result.toElement()

    expect(elem.innerHTML).toEqual(goodHTML)
  })
})
