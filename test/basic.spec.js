/* jshint jasmine:true *//* global Serialize */

'use strict';

var Types = Serialize.types

describe('Serialize', function () {

  beforeEach(function () {
    this.elem = document.createElement('p')

    document.body.appendChild(this.elem)
  })

  afterEach(function () {
    document.body.removeChild(this.elem)
  })

  it('serializes elements into abstract objects.', function () {
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

  xit('should subtract markups where appropriate', function () {
    this.elem.innerHTML = '<em><span style="font-style: normal;">One</span></em>'

    var result = new Serialize(this.elem)

    expect(result.length).toEqual(3)
    expect(result.text).toEqual('One')
    expect(result.markups).toEqual([])
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

  it('should automatically update length when setting text.', function () {
    this.elem.innerHTML = 'One'

    var result = new Serialize(this.elem)

    expect(result.length).toEqual(3)
    expect(result.text).toEqual('One')
    expect(result.markups).toEqual([])

    result.text = 'New text'

    expect(result.length).toEqual(8)
    expect(result.text).toEqual('New text')
    expect(result.markups).toEqual([])
  })

  it('ignore non-element and non-text nodes (e.g. comments)', function () {
    this.elem.innerHTML = 'Stuff<!-- But not this! -->Things'

    var result = new Serialize(this.elem)

    expect(result.text).toEqual('StuffThings')
    expect(result.length).toEqual('StuffThings'.length)
    expect(result.markups).toEqual([])
  })

  it('identify bold styling on the paragraph itself', function () {
    this.elem.innerHTML = 'Stuff <b>and</b> <em>things</em>'
    this.elem.style.fontWeight = 'bold'

    var result = new Serialize(this.elem)

    expect(result.text).toEqual('Stuff and things')
    expect(result.length).toEqual(16)
    expect(result.markups).toEqual([{
      type: Serialize.types.bold,
      start: 0,
      end: 16
    }, {
      type: Serialize.types.italic,
      start: 10,
      end: 16
    }])
  })

  it('identify italic styling on the paragraph itself', function () {
    this.elem.innerHTML = 'Stuff <b>and</b> <em>things</em>'
    this.elem.style.fontStyle = 'italic'

    var result = new Serialize(this.elem)

    expect(result.text).toEqual('Stuff and things')
    expect(result.length).toEqual(16)
    expect(result.markups).toEqual([{
      type: Serialize.types.bold,
      start: 6,
      end: 9
    }, {
      type: Serialize.types.italic,
      start: 0,
      end: 16
    }])
  })

  describe('Serialize.fromJSON', function () {

    it('converts a stringified serialization to a live one.', function () {
      this.elem.innerHTML = 'One <strong>two</strong> three'

      var result = new Serialize(this.elem)

      expect(Serialize.fromJSON(JSON.stringify(result)))
        .toEqual(result)
    })
  })

  describe('Serialize & JSON', function () {
    it('should include all properties', function () {
      this.elem.innerHTML = 'One'

      var result = new Serialize(this.elem)

      expect(JSON.parse(JSON.stringify(result))).toEqual({
        text: 'One',
        length: 3,
        markups: [],
        type: 'p'
      })
    })

    it('should include custom properties', function () {
      this.elem.innerHTML = 'One'

      var result = new Serialize(this.elem)
      result.foo = 'bar'

      expect(JSON.parse(JSON.stringify(result))).toEqual({
        text: 'One',
        length: 3,
        markups: [],
        type: 'p',
        foo: 'bar'
      })
    })
  })

  describe('Serialize.fromText', function () {

    it('creates a serialization from a string.', function () {
      var str = 'Stuff'

      this.elem.innerHTML = str

      var result = new Serialize(this.elem)

      expect(Serialize.fromText(str))
        .toEqual(result)
    })
  })

  describe('Serialize#toString', function () {

    it('returns the outerHTML of the equivalent element', function () {
      var p = document.createElement('p')

      p.innerHTML = 'One <em>two</em> three'

      var result = new Serialize(p)

      var html = '<p>One <em>two</em> three</p>'
      expect(result.toString()).toEqual(html)
      expect('' + result).toEqual(html)
    })
  })

  describe('subclassing', function () {
    function inherits (ctor, superCtor) {
      ctor.super_ = superCtor;
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
    }

    it('should be subclassable', function () {
      function X (elem) {
        Serialize.call(this, elem)
      }

      inherits(X, Serialize)
      X.fromJSON = Serialize.fromJSON
      X.fromText = Serialize.fromText
      X.types = Serialize.types

      var p = document.createElement('p')
      p.innerHTML = '<em>A</em>BC'

      var s = new X(p)

      expect(s.type).toEqual('p')
      expect(s.text).toEqual('ABC')
      expect(s.length).toEqual(3)
      expect(s.markups).toEqual([{
        type: X.types.italic,
        start: 0,
        end: 1
      }])

      expect(s.substr(0) instanceof X).toBe(true)
      expect(s.append('foo') instanceof X).toBe(true)
      expect(s.substring(0) instanceof X).toBe(true)
      expect(s.replace('A', 'B') instanceof X).toBe(true)
      expect(X.fromText('foo') instanceof X).toBe(true)
      expect(X.fromJSON(JSON.stringify(s)) instanceof X).toBe(true)
    })
  })
})
