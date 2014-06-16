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

    it('should ignore empty elements (2).', function () {
      this.elem.innerHTML = 'while <em>I<span></span></em> pondered, weak and weary'

      var result = new Serialize(this.elem)

      expect(result.length).toEqual(32)
      expect(result.text).toEqual('while I pondered, weak and weary')
      expect(result.markups).toEqual([{
        type: Types.italic,
        start: 6,
        end: 7
      }])
    })

    it('should ignore empty elements (3).', function () {
      this.elem.innerHTML = 'while <em>I<br></em>pondered, weak and weary'

      var result = new Serialize(this.elem)

      expect(result.length).toEqual(32)
      expect(result.text).toEqual('while I\npondered, weak and weary')
      expect(result.markups).toEqual([{
        type: Types.italic,
        start: 6,
        end: 8
      }])
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

  describe('Serialize#replace', function () {

    beforeEach(function () {
      this.elem = document.createElement('p')

      document.body.appendChild(this.elem)
    })

    afterEach(function () {
      document.body.removeChild(this.elem)
    })

    it('replaces text in the serialization.', function () {
      this.elem.innerHTML = '...'

      var result = new Serialize(this.elem)

      result.replace(/\.\.\./g, '…')

      expect(result.length).toEqual(1)
      expect(result.text).toEqual('…')
      expect(result.markups).toEqual([])
      expect(result.type).toEqual('p')
    })

    it('should update markups.', function () {
      this.elem.innerHTML = '<em>...</em>'

      var result = new Serialize(this.elem)

      result.replace(/\.\.\./g, '…')

      expect(result.length).toEqual(1)
      expect(result.text).toEqual('…')
      expect(result.markups).toEqual([{
        type: Types.italic,
        start: 0,
        end: 1
      }])
    })

    it('should update markups (2).', function () {
      this.elem.innerHTML = '<em>.</em>..'

      var result = new Serialize(this.elem)

      result.replace(/\.\.\./g, '…')

      expect(result.length).toEqual(1)
      expect(result.text).toEqual('…')
      expect(result.markups).toEqual([])
    })

    it('should update markups (3).', function () {
      this.elem.innerHTML = '.<em>.</em>.'

      var result = new Serialize(this.elem)

      result.replace(/\.\.\./g, '…')

      expect(result.length).toEqual(1)
      expect(result.text).toEqual('…')
      expect(result.markups).toEqual([])
    })

    it('should update markups (4).', function () {
      this.elem.innerHTML = '..<em>.</em>'

      var result = new Serialize(this.elem)

      result.replace(/\.\.\./g, '…')

      expect(result.length).toEqual(1)
      expect(result.text).toEqual('…')
      expect(result.markups).toEqual([])
    })

    it('should update markups (5).', function () {
      this.elem.innerHTML = '<b>a.</b>..c'

      var result = new Serialize(this.elem)

      result.replace(/\.\.\./g, '…')

      expect(result.length).toEqual(3)
      expect(result.text).toEqual('a…c')
      expect(result.markups).toEqual([{
        type: Types.bold,
        start: 0,
        end: 1
      }])
    })

    it('should update markups (6).', function () {
      this.elem.innerHTML = 'a..<strong>.c</strong>'

      var result = new Serialize(this.elem)

      result.replace(/\.\.\./g, '…')

      expect(result.length).toEqual(3)
      expect(result.text).toEqual('a…c')
      expect(result.markups).toEqual([{
        type: Types.bold,
        start: 2,
        end: 3
      }])
    })

    it('should update markups (7).', function () {
      this.elem.innerHTML = '<i>a...</i>c'

      var result = new Serialize(this.elem)

      result.replace(/\.\.\./g, '…')

      expect(result.length).toEqual(3)
      expect(result.text).toEqual('a…c')
      expect(result.markups).toEqual([{
        type: Types.italic,
        start: 0,
        end: 2
      }])
    })

    it('should update markups (8).', function () {
      this.elem.innerHTML = 'a<i>...c</i>'

      var result = new Serialize(this.elem)

      result.replace(/\.\.\./g, '…')

      expect(result.length).toEqual(3)
      expect(result.text).toEqual('a…c')
      expect(result.markups).toEqual([{
        type: Types.italic,
        start: 1,
        end: 3
      }])
    })

    it('should update markups (9).', function () {
      this.elem.innerHTML = 'a<strong>...</strong>c'

      var result = new Serialize(this.elem)

      result.replace(/\.\.\./g, '…')

      expect(result.length).toEqual(3)
      expect(result.text).toEqual('a…c')
      expect(result.markups).toEqual([{
        type: Types.bold,
        start: 1,
        end: 2
      }])
    })

    it('should update markups (10).', function () {
      this.elem.innerHTML = 'a...<em>b</em>...c'

      var result = new Serialize(this.elem)

      result.replace(/\.\.\./g, '…')

      expect(result.length).toEqual(5)
      expect(result.text).toEqual('a…b…c')
      expect(result.markups).toEqual([{
        type: Types.italic,
        start: 2,
        end: 3
      }])
    })

    it('should update markups (11).', function () {
      this.elem.innerHTML = 'a.<em>..b</em>...c'

      var result = new Serialize(this.elem)

      result.replace(/\.\.\./g, '…')

      expect(result.length).toEqual(5)
      expect(result.text).toEqual('a…b…c')
      expect(result.markups).toEqual([{
        type: Types.italic,
        start: 2,
        end: 3
      }])
    })

    it('should update markups (12).', function () {
      this.elem.innerHTML = 'a...<em>b..</em>.c'

      var result = new Serialize(this.elem)

      result.replace(/\.\.\./g, '…')

      expect(result.length).toEqual(5)
      expect(result.text).toEqual('a…b…c')
      expect(result.markups).toEqual([{
        type: Types.italic,
        start: 2,
        end: 3
      }])
    })

    it('should update markups (13).', function () {
      this.elem.innerHTML = 'a.<em>..b..</em>.c'

      var result = new Serialize(this.elem)

      result.replace(/\.\.\./g, '…')

      expect(result.length).toEqual(5)
      expect(result.text).toEqual('a…b…c')
      expect(result.markups).toEqual([{
        type: Types.italic,
        start: 2,
        end: 3
      }])
    })

    it('should update markups (14).', function () {
      this.elem.innerHTML = '......'

      var result = new Serialize(this.elem)

      result.replace(/\.\.\./g, '…')

      expect(result.length).toEqual(2)
      expect(result.text).toEqual('……')
      expect(result.markups).toEqual([])
    })

    it('should update markups (15).', function () {
      this.elem.innerHTML = '<code>......</code>'

      var result = new Serialize(this.elem)

      result.replace(/\.\.\./g, '…')

      expect(result.length).toEqual(2)
      expect(result.text).toEqual('……')
      expect(result.markups).toEqual([{
        type: Types.code,
        start: 0,
        end: 2
      }])
    })

    it('should update markups (16).', function () {
      this.elem.innerHTML = '.<code>.....</code>'

      var result = new Serialize(this.elem)

      result.replace(/\.\.\./g, '…')

      expect(result.length).toEqual(2)
      expect(result.text).toEqual('……')
      expect(result.markups).toEqual([{
        type: Types.code,
        start: 1,
        end: 2
      }])
    })

    it('should update markups (17).', function () {
      this.elem.innerHTML = '<code>.....</code>.'

      var result = new Serialize(this.elem)

      result.replace(/\.\.\./g, '…')

      expect(result.length).toEqual(2)
      expect(result.text).toEqual('……')
      expect(result.markups).toEqual([{
        type: Types.code,
        start: 0,
        end: 1
      }])
    })

    it('should update markups (18).', function () {
      this.elem.innerHTML = '.<code>....</code>.'

      var result = new Serialize(this.elem)

      result.replace(/\.\.\./g, '…')

      expect(result.length).toEqual(2)
      expect(result.text).toEqual('……')
      expect(result.markups).toEqual([])
    })

    it('should update markups (19).', function () {
      this.elem.innerHTML = '<code>........</code>.'

      var result = new Serialize(this.elem)

      result.replace(/\.\.\./g, '…')

      expect(result.length).toEqual(3)
      expect(result.text).toEqual('………')
      expect(result.markups).toEqual([{
        type: Types.code,
        start: 0,
        end: 2
      }])
    })

    it('should update markups only when necessary.', function () {
      this.elem.innerHTML = 'x'

      var result = new Serialize(this.elem)

      // In this case, the replacement has no net effet on the length
      // of the text, and so should not actually affect markups.
      result.replace(/x/g, 'y')

      expect(result.length).toEqual(1)
      expect(result.text).toEqual('y')
      expect(result.markups).toEqual([])
    })

    it('should update markups only when necessary (2).', function () {
      this.elem.innerHTML = '<b>x</b>'

      var result = new Serialize(this.elem)

      // In this case, the replacement has no net effet on the length
      // of the text, and so should not actually affect markups.
      result.replace(/x/g, 'y')

      expect(result.length).toEqual(1)
      expect(result.text).toEqual('y')
      expect(result.markups).toEqual([{
        type: Types.bold,
        start: 0,
        end: 1
      }])
    })

    it('should update markups only when necessary (2).', function () {
      this.elem.innerHTML = 'a<em>xb</em>'

      var result = new Serialize(this.elem)

      result.replace(/x/g, 'y')

      expect(result.length).toEqual(3)
      expect(result.text).toEqual('ayb')
      expect(result.markups).toEqual([{
        type: Types.italic,
        start: 1,
        end: 3
      }])
    })

    it('should update markups only when necessary (3).', function () {
      this.elem.innerHTML = '<em>ax</em>b'

      var result = new Serialize(this.elem)

      result.replace(/x/g, 'y')

      expect(result.length).toEqual(3)
      expect(result.text).toEqual('ayb')
      expect(result.markups).toEqual([{
        type: Types.italic,
        start: 0,
        end: 2
      }])
    })

    it('should update markups only when necessary (4).', function () {
      this.elem.innerHTML = 'a<em>x</em>b'

      var result = new Serialize(this.elem)

      result.replace(/x/g, 'y')

      expect(result.length).toEqual(3)
      expect(result.text).toEqual('ayb')
      expect(result.markups).toEqual([{
        type: Types.italic,
        start: 1,
        end: 2
      }])
    })

    it('should handle deletions.', function () {
      this.elem.innerHTML = '#'

      var result = new Serialize(this.elem)

      result.replace(/#/g, '')

      expect(result.length).toEqual(0)
      expect(result.text).toEqual('')
      expect(result.markups).toEqual([])
    })

    it('should handle deletions (2).', function () {
      this.elem.innerHTML = '<code>#</code>'

      var result = new Serialize(this.elem)

      result.replace(/#/g, '')

      expect(result.length).toEqual(0)
      expect(result.text).toEqual('')
      expect(result.markups).toEqual([])
    })

    it('should handle deletions (3).', function () {
      this.elem.innerHTML = 'a<code>#</code>b'

      var result = new Serialize(this.elem)

      result.replace(/#/g, '')

      expect(result.length).toEqual(2)
      expect(result.text).toEqual('ab')
      expect(result.markups).toEqual([])
    })

    it('should handle deletions (3).', function () {
      this.elem.innerHTML = 'a<code>#b</code>'

      var result = new Serialize(this.elem)

      result.replace(/#/g, '')

      expect(result.length).toEqual(2)
      expect(result.text).toEqual('ab')
      expect(result.markups).toEqual([{
        type: Types.code,
        start: 1,
        end: 2
      }])
    })

    it('should handle deletions (4).', function () {
      this.elem.innerHTML = '<code>a#</code>b'

      var result = new Serialize(this.elem)

      result.replace(/#/g, '')

      expect(result.length).toEqual(2)
      expect(result.text).toEqual('ab')
      expect(result.markups).toEqual([{
        type: Types.code,
        start: 0,
        end: 1
      }])
    })

    it('should handle deletions (5).', function () {
      this.elem.innerHTML = '<code>a#b</code>'

      var result = new Serialize(this.elem)

      result.replace(/#/g, '')

      expect(result.length).toEqual(2)
      expect(result.text).toEqual('ab')
      expect(result.markups).toEqual([{
        type: Types.code,
        start: 0,
        end: 2
      }])
    })

    it('should handle expansions.', function () {
      this.elem.innerHTML = '#'

      var result = new Serialize(this.elem)

      result.replace(/#/g, 'xyz')

      expect(result.length).toEqual(3)
      expect(result.text).toEqual('xyz')
      expect(result.markups).toEqual([])
    })

    it('should handle expansions (2).', function () {
      this.elem.innerHTML = '<b>#</b>'

      var result = new Serialize(this.elem)

      result.replace(/#/g, 'xyz')

      expect(result.length).toEqual(3)
      expect(result.text).toEqual('xyz')
      expect(result.markups).toEqual([{
        type: Types.bold,
        start: 0,
        end: 3
      }])
    })

    it('should handle expansions (3).', function () {
      this.elem.innerHTML = '<i>a#b</i>'

      var result = new Serialize(this.elem)

      result.replace(/#/g, 'xyz')

      expect(result.length).toEqual(5)
      expect(result.text).toEqual('axyzb')
      expect(result.markups).toEqual([{
        type: Types.italic,
        start: 0,
        end: 5
      }])
    })

    it('should handle expansions (4).', function () {
      this.elem.innerHTML = '<i>a</i>#b'

      var result = new Serialize(this.elem)

      result.replace(/#/g, 'xyz')

      expect(result.length).toEqual(5)
      expect(result.text).toEqual('axyzb')
      expect(result.markups).toEqual([{
        type: Types.italic,
        start: 0,
        end: 1
      }])
    })

    it('should handle expansions (5).', function () {
      this.elem.innerHTML = 'a#<i>b</i>'

      var result = new Serialize(this.elem)

      result.replace(/#/g, 'xyz')

      expect(result.length).toEqual(5)
      expect(result.text).toEqual('axyzb')
      expect(result.markups).toEqual([{
        type: Types.italic,
        start: 4,
        end: 5
      }])
    })

    it('should handle expansions (6).', function () {
      this.elem.innerHTML = '<i>a#</i>b'

      var result = new Serialize(this.elem)

      result.replace(/#/g, 'xyz')

      expect(result.length).toEqual(5)
      expect(result.text).toEqual('axyzb')
      expect(result.markups).toEqual([{
        type: Types.italic,
        start: 0,
        end: 4
      }])
    })

    it('should handle expansions (7).', function () {
      this.elem.innerHTML = 'a<i>#b</i>'

      var result = new Serialize(this.elem)

      result.replace(/#/g, 'xyz')

      expect(result.length).toEqual(5)
      expect(result.text).toEqual('axyzb')
      expect(result.markups).toEqual([{
        type: Types.italic,
        start: 1,
        end: 5
      }])
    })

    it('should handle expansions (8).', function () {
      this.elem.innerHTML = 'a<i>#</i>b'

      var result = new Serialize(this.elem)

      result.replace(/#/g, 'xyz')

      expect(result.length).toEqual(5)
      expect(result.text).toEqual('axyzb')
      expect(result.markups).toEqual([{
        type: Types.italic,
        start: 1,
        end: 4
      }])
    })

    it('should handle expansions (9).', function () {
      this.elem.innerHTML = '##'

      var result = new Serialize(this.elem)

      result.replace(/##/g, 'vwxyz')

      expect(result.length).toEqual(5)
      expect(result.text).toEqual('vwxyz')
      expect(result.markups).toEqual([])
    })

    it('should handle expansions (10).', function () {
      this.elem.innerHTML = '<strong>a##b<strong>'

      var result = new Serialize(this.elem)

      result.replace(/##/g, 'vwxyz')

      expect(result.length).toEqual(7)
      expect(result.text).toEqual('avwxyzb')
      expect(result.markups).toEqual([{
        type: Types.bold,
        start: 0,
        end: 7
      }])
    })

    it('should handle expansions (11).', function () {
      this.elem.innerHTML = '<code>a#</code>#b'

      var result = new Serialize(this.elem)

      result.replace(/##/g, 'vwxyz')

      expect(result.length).toEqual(7)
      expect(result.text).toEqual('avwxyzb')
      expect(result.markups).toEqual([{
        type: Types.code,
        start: 0,
        end: 1
      }])
    })

    it('should handle expansions (12).', function () {
      this.elem.innerHTML = 'a#<code>#b</code>'

      var result = new Serialize(this.elem)

      result.replace(/##/g, 'vwxyz')

      expect(result.length).toEqual(7)
      expect(result.text).toEqual('avwxyzb')
      expect(result.markups).toEqual([{
        type: Types.code,
        start: 6,
        end: 7
      }])
    })

    it('should handle expansions (13).', function () {
      this.elem.innerHTML = 'a<code>##</code>b'

      var result = new Serialize(this.elem)

      result.replace(/##/g, 'vwxyz')

      expect(result.length).toEqual(7)
      expect(result.text).toEqual('avwxyzb')
      expect(result.markups).toEqual([{
        type: Types.code,
        start: 1,
        end: 6
      }])
    })

    it('should handle expansions (14).', function () {
      this.elem.innerHTML = 'a<code>#</code>#b'

      var result = new Serialize(this.elem)

      result.replace(/##/g, 'vwxyz')

      expect(result.length).toEqual(7)
      expect(result.text).toEqual('avwxyzb')
      expect(result.markups).toEqual([])
    })

    it('should handle expansions (15).', function () {
      this.elem.innerHTML = 'a#<code>#</code>b'

      var result = new Serialize(this.elem)

      result.replace(/##/g, 'vwxyz')

      expect(result.length).toEqual(7)
      expect(result.text).toEqual('avwxyzb')
      expect(result.markups).toEqual([])
    })

    it('should handle expansions (16).', function () {
      this.elem.innerHTML = 'a##b##c'

      var result = new Serialize(this.elem)

      result.replace(/##/g, 'vwxyz')

      expect(result.length).toEqual(13)
      expect(result.text).toEqual('avwxyzbvwxyzc')
      expect(result.markups).toEqual([])
    })

    it('should handle expansions (17).', function () {
      this.elem.innerHTML = 'a#<code>#b</code>##c'

      var result = new Serialize(this.elem)

      result.replace(/##/g, 'vwxyz')

      expect(result.length).toEqual(13)
      expect(result.text).toEqual('avwxyzbvwxyzc')
      expect(result.markups).toEqual([{
        type: Types.code,
        start: 6,
        end: 7
      }])
    })

    it('should handle expansions (18).', function () {
      this.elem.innerHTML = 'a##<code>b#</code>#c'

      var result = new Serialize(this.elem)

      result.replace(/##/g, 'vwxyz')

      expect(result.length).toEqual(13)
      expect(result.text).toEqual('avwxyzbvwxyzc')
      expect(result.markups).toEqual([{
        type: Types.code,
        start: 6,
        end: 7
      }])
    })

    it('should handle expansions (19).', function () {
      this.elem.innerHTML = 'a#<code>#b#</code>#c'

      var result = new Serialize(this.elem)

      result.replace(/##/g, 'vwxyz')

      expect(result.length).toEqual(13)
      expect(result.text).toEqual('avwxyzbvwxyzc')
      expect(result.markups).toEqual([{
        type: Types.code,
        start: 6,
        end: 7
      }])
    })

    it('can take a standard replace function.', function () {
      this.elem.innerHTML = '...'

      var result = new Serialize(this.elem),
          index = 0

      result.replace(/\.\.\./g, function (match, pos) {
        if (index > pos && index < pos + match.length)
          return match
        else
          return '…'
      })

      expect(result.length).toEqual(1)
      expect(result.text).toEqual('…')
      expect(result.markups).toEqual([])
    })

    it('can take a standard replace function (2).', function () {
      this.elem.innerHTML = '...'

      var result = new Serialize(this.elem),
          index = 2

      result.replace(/\.\.\./g, function (match, pos) {
        if (index > pos && index < pos + match.length)
          return match
        else
          return '…'
      })

      expect(result.length).toEqual(3)
      expect(result.text).toEqual('...')
      expect(result.markups).toEqual([])
    })

    it('can take a standard replace function (3).', function () {
      this.elem.innerHTML = '<b>..</b>.'

      var result = new Serialize(this.elem),
          index = 2

      result.replace(/\.\.\./g, function (match, pos) {
        if (index > pos && index < pos + match.length)
          return false
        else
          return '…'
      })

      expect(result.length).toEqual(3)
      expect(result.text).toEqual('...')
      expect(result.markups).toEqual([{
        type: Types.bold,
        start: 0,
        end: 2
      }])
    })

    it('can take a standard replace function (4).', function () {
      this.elem.innerHTML = '<b>..</b>.'

      var result = new Serialize(this.elem),
          index = 3

      result.replace(/\.\.\./g, function (match, pos) {
        if (index > pos && index < pos + match.length)
          return match
        else
          return '…'
      })

      expect(result.length).toEqual(1)
      expect(result.text).toEqual('…')
      expect(result.markups).toEqual([])
    })

    it('can take a standard replace function (5).', function () {
      this.elem.innerHTML = 'a<code>...b...</code>c...d'

      var result = new Serialize(this.elem),
          index = 11,
          shift = 0

      result.replace(/\.\.\./g, function (match, pos) {
        if (index > pos && index < pos + match.length)
          return match
        else {
          if (pos < index) shift -= match.length - '…'.length
          return '…'
        }
      })

      expect(shift).toEqual(-4)
      expect(result.length).toEqual(9)
      expect(result.text).toEqual('a…b…c...d')
      expect(result.markups).toEqual([{
        type: Types.code,
        start: 1,
        end: 4
      }])
    })

    it('should not get tripped up by matching RegExes.', function () {
      this.elem.innerHTML = '11"2 and things.'

      var result = new Serialize(this.elem),
          matched = false

      result.replace(/(\d)['"](\d)?/g, function (match, digit, after, pos) {
        matched = true

        expect(digit).toEqual('1')
        expect(after).toEqual('2')
        expect(pos).toEqual(1)
        return digit + '″' + after
      })

      expect(matched).toBe(true)
      expect(result.length).toEqual(16)
      expect(result.text).toEqual('11″2 and things.')
      expect(result.markups).toEqual([])
    })
  })

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

      expect(substr.length).toEqual(4)
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
