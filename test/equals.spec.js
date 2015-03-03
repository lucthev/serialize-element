/* jshint jasmine:true *//* global Serialize */

'use strict';

describe('Serialize#equals', function () {

  it('determines if two serializations are equivalent.', function () {
    var p1 = document.createElement('p'),
        p2 = document.createElement('p')

    p1.innerHTML = 'Stuff'
    p2.innerHTML = 'Stuff'

    expect(new Serialize(p1).equals(new Serialize(p2))).toBe(true)
  })

  it('determines if two serializations are equivalent (2).', function () {
    var p1 = document.createElement('p'),
        p2 = document.createElement('p')

    p1.innerHTML = 'Stuff'
    p2.innerHTML = 'Stfuf'

    expect(new Serialize(p1).equals(new Serialize(p2))).toBe(false)
  })

  it('determines if two serializations are equivalent (3).', function () {
    var p1 = document.createElement('p'),
        p2 = document.createElement('p')

    p1.innerHTML = '<code>Word</code>'
    p2.innerHTML = '<code>Word</code>'

    expect(new Serialize(p1).equals(new Serialize(p2))).toBe(true)
  })

  it('determines if two serializations are equivalent (4).', function () {
    var p1 = document.createElement('p'),
        p2 = document.createElement('p')

    p1.innerHTML = '<a href="#">Link</a>'
    p2.innerHTML = '<a href="/">Link</a>'

    expect(new Serialize(p1).equals(new Serialize(p2))).toBe(false)
  })

  it('determines if two serializations are equivalent (5).', function () {
    var p = document.createElement('p'),
        pre = document.createElement('pre')

    p.innerHTML = 'Some <em>rich</em> text'
    pre.innerHTML = 'Some <em>rich</em> text'

    expect(new Serialize(p).equals(new Serialize(pre))).toBe(false)
  })

  it('determines if two serializations are equivalent (6).', function () {
    var p1 = document.createElement('p'),
        p2 = document.createElement('p')

    p1.innerHTML = 'x<em>x</em>x'
    p2.innerHTML = 'xx<em>x</em>'

    expect(new Serialize(p1).equals(new Serialize(p2))).toBe(false)
  })
})
