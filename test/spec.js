/* global describe, it, expect, Serialize, beforeEach, afterEach */

'use strict';

var Types = Serialize.types

describe('Serialize', function () {

  describe('can be used as a function', function () {

    beforeEach(function () {
      this.elem = document.createElement('p')

      document.body.appendChild(this.elem)
    })

    afterEach(function () {
      document.body.removeChild(this.elem)
    })

    it('to serialize elements into abstract objects.', function () {
      this.elem.innerHTML = 'Once upon a time'

      var result = new Serialize(this.elem)

      expect(result.length).toEqual(16)
      expect(result.text).toEqual('Once upon a time')
      expect(result.markups).toEqual([])
      expect(result.type).toEqual('p')
    })

    it('accounts for inline markup.', function () {
      this.elem.innerHTML = 'Once <em>upon</em> a time'

      var result = new Serialize(this.elem)

      expect(result.length).toEqual(16)
      expect(result.text).toEqual('Once upon a time')
      expect(result.markups).toEqual([{
        type: Types.italic,
        start: 5,
        end: 9
      }])
      expect(result.type).toEqual('p')
    })

    it('should keep attributes where appropriate.', function () {
      this.elem.innerHTML = 'Once <a href="http://www.example.com">upon a ti</a>me'

      var result = new Serialize(this.elem)

      expect(result.length).toEqual(16)
      expect(result.text).toEqual('Once upon a time')
      expect(result.markups).toEqual([{
        type: Types.link,
        href: 'http://www.example.com',
        start: 5,
        end: 14
      }])
    })

    it('should convert inline styles to markups.', function () {
      this.elem.innerHTML = 'Once <span style="font-weight: bold;">upon</span> a <span style="font-style: italic;">time</span>'

      var result = new Serialize(this.elem)

      expect(result.length).toEqual(16)
      expect(result.text).toEqual('Once upon a time')
      expect(result.markups).toEqual([{
        type: Types.bold,
        start: 5,
        end: 9
      }, {
        type: Types.italic,
        start: 12,
        end: 16
      }])
    })

    it('should order markups by type.', function () {
      this.elem.innerHTML = 'Blue <em>is</em> not <code>red</code>'

      var result = new Serialize(this.elem)

      expect(result.length).toEqual(15)
      expect(result.text).toEqual('Blue is not red')
      expect(result.markups).toEqual([{
        type: Types.code,
        start: 12,
        end: 15
      }, {
        type: Types.italic,
        start: 5,
        end: 7
      }])
    })

    it('and then by start index.', function () {
      this.elem.innerHTML = 'Blue <em>is</em> not <em>red</em>'

      var result = new Serialize(this.elem)

      expect(result.length).toEqual(15)
      expect(result.text).toEqual('Blue is not red')
      expect(result.markups).toEqual([{
        type: Types.italic,
        start: 5,
        end: 7
      }, {
        type: Types.italic,
        start: 12,
        end: 15
      }])
    })

    it('should ignore empty elements.', function () {
      this.elem.innerHTML = 'Once upon<span></span> a <a href="#raven"></a>midnight dreary'

      var result = new Serialize(this.elem)

      expect(result.length).toEqual(27)
      expect(result.text).toEqual('Once upon a midnight dreary')
      expect(result.markups).toEqual([])
    })

    it('should work with multiple markups on the same element.', function () {
      this.elem.innerHTML = 'Blue <a href="/" style="font-weight: bold; font-style: italic">is not</a> red'

      var result = new Serialize(this.elem)

      expect(result.length).toEqual(15)
      expect(result.text).toEqual('Blue is not red')
      expect(result.markups).toEqual([{
        type: Types.link,
        href: '/',
        start: 5,
        end: 11
      }, {
        type: Types.bold,
        start: 5,
        end: 11
      }, {
        type: Types.italic,
        start: 5,
        end: 11
      }])
    })

    it('should work with nested elements', function () {
      this.elem.innerHTML = 'Blue <a href="#"><em>is <strong>not</strong></em></a> red'

      var result = new Serialize(this.elem)

      expect(result.length).toEqual(15)
      expect(result.text).toEqual('Blue is not red')
      expect(result.markups).toEqual([{
        type: Types.link,
        href: '#',
        start: 5,
        end: 11
      }, {
        type: Types.bold,
        start: 8,
        end: 11
      }, {
        type: Types.italic,
        start: 5,
        end: 11
      }])
    })

    it('should merge adjacent elements of the same type.', function () {
      this.elem.innerHTML = 'Blue <em>is </em><em>not</em> red'

      var result = new Serialize(this.elem)

      expect(result.length).toEqual(15)
      expect(result.text).toEqual('Blue is not red')
      expect(result.markups).toEqual([{
        type: Types.italic,
        start: 5,
        end: 11
      }])
    })

    it('should merge adjacent elements of the same type (2).', function () {
      this.elem.innerHTML = 'Man <em>I</em><i> used</i><strong><span style="font-style:italic;"> to </span></strong>be'

      var result = new Serialize(this.elem)

      expect(result.length).toEqual(16)
      expect(result.text).toEqual('Man I used to be')
      expect(result.markups).toEqual([{
        type: Types.bold,
        start: 10,
        end: 14
      }, {
        type: Types.italic,
        start: 4,
        end: 14
      }])
    })

    it('should merge overlapping markups of the same type.', function () {
      this.elem.innerHTML = 'Feels like we <em><i>only go</i></em> backwards'

      var result = new Serialize(this.elem)

      expect(result.length).toEqual(31)
      expect(result.text).toEqual('Feels like we only go backwards')
      expect(result.markups).toEqual([{
        type: Types.italic,
        start: 14,
        end: 21
      }])
    })

    it('should treat <br>s as newlines.', function () {
      this.elem.innerHTML = 'One<br>two'

      var result = new Serialize(this.elem)

      expect(result.length).toEqual(7)
      expect(result.text).toEqual('One\ntwo')
      expect(result.markups).toEqual([])
    })

    it('should treat <br>s as newlines (2).', function () {
      this.elem.innerHTML = '<strong>One<br>two</strong>'

      var result = new Serialize(this.elem)

      expect(result.length).toEqual(7)
      expect(result.text).toEqual('One\ntwo')
      expect(result.markups).toEqual([{
        type: Types.bold,
        start: 0,
        end: 7
      }])
    })

    it('should treat <br>s as newlines (3).', function () {
      this.elem.innerHTML = 'One<br>two<br>three<br>'

      var result = new Serialize(this.elem)

      expect(result.length).toEqual(14)
      expect(result.text).toEqual('One\ntwo\nthree\n')
      expect(result.markups).toEqual([])
    })
  })

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

  describe('Serialize.fromJSON', function () {

    beforeEach(function () {
      this.elem = document.createElement('p')

      document.body.appendChild(this.elem)
    })

    afterEach(function () {
      document.body.removeChild(this.elem)
    })

    it('converts a stringified serialization to a live one.', function () {
      this.elem.innerHTML = 'One <strong>two</strong> three'

      var result = new Serialize(this.elem)

      expect(Serialize.fromJSON(JSON.stringify(result)))
        .toEqual(result)
    })
  })
})
