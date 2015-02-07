/* global describe, it, expect, Serialize, beforeEach, afterEach */

'use strict';

var Types = Serialize.types

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

    result = result.replace(/\.\.\./g, '…')

    expect(result.length).toEqual(1)
    expect(result.text).toEqual('…')
    expect(result.markups).toEqual([])
    expect(result.type).toEqual('p')
  })

  it('should update markups.', function () {
    this.elem.innerHTML = '<em>...</em>'

    var result = new Serialize(this.elem)

    result = result.replace(/\.\.\./g, '…')

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

    result = result.replace(/\.\.\./g, '…')

    expect(result.length).toEqual(1)
    expect(result.text).toEqual('…')
    expect(result.markups).toEqual([])
  })

  it('should update markups (3).', function () {
    this.elem.innerHTML = '.<em>.</em>.'

    var result = new Serialize(this.elem)

    result = result.replace(/\.\.\./g, '…')

    expect(result.length).toEqual(1)
    expect(result.text).toEqual('…')
    expect(result.markups).toEqual([])
  })

  it('should update markups (4).', function () {
    this.elem.innerHTML = '..<em>.</em>'

    var result = new Serialize(this.elem)

    result = result.replace(/\.\.\./g, '…')

    expect(result.length).toEqual(1)
    expect(result.text).toEqual('…')
    expect(result.markups).toEqual([])
  })

  it('should update markups (5).', function () {
    this.elem.innerHTML = '<b>a.</b>..c'

    var result = new Serialize(this.elem)

    result = result.replace(/\.\.\./g, '…')

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

    result = result.replace(/\.\.\./g, '…')

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

    result = result.replace(/\.\.\./g, '…')

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

    result = result.replace(/\.\.\./g, '…')

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

    result = result.replace(/\.\.\./g, '…')

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

    result = result.replace(/\.\.\./g, '…')

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

    result = result.replace(/\.\.\./g, '…')

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

    result = result.replace(/\.\.\./g, '…')

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

    result = result.replace(/\.\.\./g, '…')

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

    result = result.replace(/\.\.\./g, '…')

    expect(result.length).toEqual(2)
    expect(result.text).toEqual('……')
    expect(result.markups).toEqual([])
  })

  it('should update markups (15).', function () {
    this.elem.innerHTML = '<code>......</code>'

    var result = new Serialize(this.elem)

    result = result.replace(/\.\.\./g, '…')

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

    result = result.replace(/\.\.\./g, '…')

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

    result = result.replace(/\.\.\./g, '…')

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

    result = result.replace(/\.\.\./g, '…')

    expect(result.length).toEqual(2)
    expect(result.text).toEqual('……')
    expect(result.markups).toEqual([])
  })

  it('should update markups (19).', function () {
    this.elem.innerHTML = '<code>........</code>.'

    var result = new Serialize(this.elem)

    result = result.replace(/\.\.\./g, '…')

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
    result = result.replace(/x/g, 'y')

    expect(result.length).toEqual(1)
    expect(result.text).toEqual('y')
    expect(result.markups).toEqual([])
  })

  it('should update markups only when necessary (2).', function () {
    this.elem.innerHTML = '<b>x</b>'

    var result = new Serialize(this.elem)

    // In this case, the replacement has no net effet on the length
    // of the text, and so should not actually affect markups.
    result = result.replace(/x/g, 'y')

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

    result = result.replace(/x/g, 'y')

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

    result = result.replace(/x/g, 'y')

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

    result = result.replace(/x/g, 'y')

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

    result = result.replace(/#/g, '')

    expect(result.length).toEqual(0)
    expect(result.text).toEqual('')
    expect(result.markups).toEqual([])
  })

  it('should handle deletions (2).', function () {
    this.elem.innerHTML = '<code>#</code>'

    var result = new Serialize(this.elem)

    result = result.replace(/#/g, '')

    expect(result.length).toEqual(0)
    expect(result.text).toEqual('')
    expect(result.markups).toEqual([])
  })

  it('should handle deletions (3).', function () {
    this.elem.innerHTML = 'a<code>#</code>b'

    var result = new Serialize(this.elem)

    result = result.replace(/#/g, '')

    expect(result.length).toEqual(2)
    expect(result.text).toEqual('ab')
    expect(result.markups).toEqual([])
  })

  it('should handle deletions (3).', function () {
    this.elem.innerHTML = 'a<code>#b</code>'

    var result = new Serialize(this.elem)

    result = result.replace(/#/g, '')

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

    result = result.replace(/#/g, '')

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

    result = result.replace(/#/g, '')

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

    result = result.replace(/#/g, 'xyz')

    expect(result.length).toEqual(3)
    expect(result.text).toEqual('xyz')
    expect(result.markups).toEqual([])
  })

  it('should handle expansions (2).', function () {
    this.elem.innerHTML = '<b>#</b>'

    var result = new Serialize(this.elem)

    result = result.replace(/#/g, 'xyz')

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

    result = result.replace(/#/g, 'xyz')

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

    result = result.replace(/#/g, 'xyz')

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

    result = result.replace(/#/g, 'xyz')

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

    result = result.replace(/#/g, 'xyz')

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

    result = result.replace(/#/g, 'xyz')

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

    result = result.replace(/#/g, 'xyz')

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

    result = result.replace(/##/g, 'vwxyz')

    expect(result.length).toEqual(5)
    expect(result.text).toEqual('vwxyz')
    expect(result.markups).toEqual([])
  })

  it('should handle expansions (10).', function () {
    this.elem.innerHTML = '<strong>a##b<strong>'

    var result = new Serialize(this.elem)

    result = result.replace(/##/g, 'vwxyz')

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

    result = result.replace(/##/g, 'vwxyz')

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

    result = result.replace(/##/g, 'vwxyz')

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

    result = result.replace(/##/g, 'vwxyz')

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

    result = result.replace(/##/g, 'vwxyz')

    expect(result.length).toEqual(7)
    expect(result.text).toEqual('avwxyzb')
    expect(result.markups).toEqual([])
  })

  it('should handle expansions (15).', function () {
    this.elem.innerHTML = 'a#<code>#</code>b'

    var result = new Serialize(this.elem)

    result = result.replace(/##/g, 'vwxyz')

    expect(result.length).toEqual(7)
    expect(result.text).toEqual('avwxyzb')
    expect(result.markups).toEqual([])
  })

  it('should handle expansions (16).', function () {
    this.elem.innerHTML = 'a##b##c'

    var result = new Serialize(this.elem)

    result = result.replace(/##/g, 'vwxyz')

    expect(result.length).toEqual(13)
    expect(result.text).toEqual('avwxyzbvwxyzc')
    expect(result.markups).toEqual([])
  })

  it('should handle expansions (17).', function () {
    this.elem.innerHTML = 'a#<code>#b</code>##c'

    var result = new Serialize(this.elem)

    result = result.replace(/##/g, 'vwxyz')

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

    result = result.replace(/##/g, 'vwxyz')

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

    result = result.replace(/##/g, 'vwxyz')

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

    result = result.replace(/\.\.\./g, function (match, pos) {
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

    result = result.replace(/\.\.\./g, function (match, pos) {
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

    result = result.replace(/\.\.\./g, function (match, pos) {
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

    result = result.replace(/\.\.\./g, function (match, pos) {
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

    result = result.replace(/\.\.\./g, function (match, pos) {
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

    result = result.replace(/(\d)['"](\d)?/g, function (match, digit, after, pos) {
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

  it('can use the $\\d replacement pattern.', function () {
    this.elem.innerHTML = 'busybee'

    var result = new Serialize(this.elem)

    result = result.replace(/b(.)/g, 'a$1')

    expect(result.text).toEqual('ausyaee')
    expect(result.length).toEqual(7)
    expect(result.markups).toEqual([])
  })

  it('can use the $$ replacement pattern.', function () {
    this.elem.innerHTML = '<em>busy</em>bee'

    var result = new Serialize(this.elem)

    result = result.replace(/b/g, 'b$$')

    expect(result.text).toEqual('b$usyb$ee')
    expect(result.length).toEqual(9)
    expect(result.markups).toEqual([{
      type: Types.italic,
      start: 0,
      end: 5
    }])
  })

  it('can use the $` replacement pattern.', function () {
    this.elem.innerHTML = '<code>abcde</code>f'

    var result = new Serialize(this.elem)

    result = result.replace(/[be]/g, '$`')

    expect(result.text).toEqual('aacdabcdf')
    expect(result.length).toEqual(9)
    expect(result.markups).toEqual([{
      type: Types.code,
      start: 0,
      end: 8
    }])
  })

  it('can use the $\' replacement pattern.', function () {
    this.elem.innerHTML = 'abcdef'

    var result = new Serialize(this.elem)

    result = result.replace(/[be]/g, '$\'')

    expect(result.text).toEqual('acdefcdff')
    expect(result.length).toEqual(9)
    expect(result.markups).toEqual([])
  })

  it('can use the $& replacement pattern.', function () {
    this.elem.innerHTML = 'ab<em>\n</em>cd'

    var result = new Serialize(this.elem)

    result = result.replace(/./g, '$&$&')

    expect(result.text).toEqual('aabb\nccdd')
    expect(result.length).toEqual(9)
    expect(result.markups).toEqual([{
      type: Types.italic,
      start: 4,
      end: 5
    }])
  })

  it('ignore wrong $\\d patterns (1).', function () {
    this.elem.innerHTML = 'a1a2a3'

    var result = new Serialize(this.elem)

    result = result.replace(/a(\d)/g, '$0')

    expect(result.text).toEqual('$0$0$0')
    expect(result.length).toEqual(6)
    expect(result.markups).toEqual([])
  })

  it('ignore wrong $\\d patterns (2).', function () {
    this.elem.innerHTML = 'a1a2a3'

    var result = new Serialize(this.elem)

    result = result.replace(/a(\d)/g, '$2')

    expect(result.text).toEqual('$2$2$2')
    expect(result.length).toEqual(6)
    expect(result.markups).toEqual([])
  })
})
