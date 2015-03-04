# Serialize

Manipulate block elements as if they were text.

## Installation

```
$ npm install serialize-elem
```

## Motivation

Serialize’s primary use case is in-browser rich text editing. Serialize enables a powerful method of making edits to the DOM by abstracting away its difficulties and normalizing certain behaviours. For example, consider the following fragments of HTML:

```html
<strong><em>Baggins</em></strong>
<em><strong>Baggins</strong></em>
<em><strong>Bagg</strong><strong>ins</strong></em>
<em><strong>Bagg</strong></em><strong><em>ins</em></strong>
```

Although nothing visually distinguishes these snippets once rendered, your editor needs to know how to recognize and deal with all of the different forms; this is hard to reason about, and prone to error. Serialize eliminates these frustrations by representing block elements as text; inline stylings are stored as markups that can be applied to the text. By merging similar adjacent or overlapping markups, and applying those markups in a consistent manner when converting back to DOM elements, Serialize eliminates these inconsistencies.

If you’d like to gain a better understanding of the motivations behind Serialize, see [here][medium].

## API

### var s = new Serialize( element )

Serializes the element into an object. Example:

```html
<p>Some <b>bold</b> and <em>italic</em> text</p>
```

gets converted to:

```js
{
    type: 'p'
    text: 'Some bold and italic text',
    length: 25,
    markups: [{
        type: Serialize.types.bold,
        start: 5,
        end: 9
    }, {
        type: Serialize.types.italic,
        start: 14,
        end: 20
    }]
}
```

Where `Serialize.types.*` is a number. Currently, only `code`, `link`, `bold`, and `italic` types are supported. If you need to support a broader range of markups, adding support is trivial.

__Note__: Serialize use getters and setters to automagically update the `length` property of a serialization when its text is changed; in most cases, there should be no reason to set the length of a serialization.

### Serialize#addMarkup( markup )

Adds the given markup to the serialization. Markups are ordered first by type, then by start index. If identical markups would overlap, they are merged into one. If adding a link, existing links will be truncated or removed so as to avoid overlapping with the link being added.

Returns the context to allow chaining.

### Serialize#addMarkups( markups )

As above, but with an array of markups.

### Serialize#removeMarkup( markup )

Removes or truncates a serialization’s markups such that no markups of the same type as the given markup overlap the given markup’s range.

__Note__: for the link type, this method does not check the `href`.

### Serialize#substr( start [, length] )

Works the same as [`String#substr`][substr]. Returns a new serialization representing the duplicated substring, complete with the appropriate markups.

### Serialize#substring( start [, end] )

Like [`String#substring`][substring]. Returns a new serialization.

### Serialize#replace( pattern, substr )

Works like [`String#replace`][replace] on the serialization’s text, but updates the markups appropriately. Same signature as [`String#replace`][replace]. Returns a new serialization.

If a match overlaps a markup, that markup is truncated so as to make it smaller. Consider the following element:

```html
<p>One..<em>. two</em></p>
```

This gets serialized as:

```js
{
    type: 'p',
    text: 'One... two',
    length: 10,
    markups: [{
        type: Serialize.types.italic,
        start: 5,
        end: 10
    }]
}
```

Replacing adjacent periods with ellipses by calling

```js
.replace(/\.\.\./, '…')
```

on this serialization results in the following:

```js
{
    type: 'p',
    text: 'One… two',
    length: 8,
    markups: [{
        type: Serialize.types.italic,
        start: 4,
        end: 8
    }]
}
```

which, when converted back to en element, will look like:

```html
<p>One…<em> two</em></p>
```

### Serialize#append( other )

Returns a new serialization which results from appending the serialization `other` to the current serialization. This is similar to how the addition operator works on strings.

If `other` is a string, the returned serialization will have that string appended to its text, and any markups that previously terminated at the end of the serialization are extended such that they terminate at the end of the new serialization. For example:

```html
<p><em>1</em><strong>2</strong></p>
<!-- Serializing, then calling .append('345'), results in: -->
<p><em>1</em><strong>2345</strong></p>
```

If you wish to avoid extending markups, simply add your text directly to the serialization’s.

### Serialize#equals( other )

Returns a boolean; true if the serializations are equivalent (i.e. they would produce identical elements by calling [`Serialize#toElement`][toElement]), false otherwise. Continuing the comparison to Strings, `Serialize#equals` is like the equality operator.

### Serialize#toElement( )

Return a new element resembling the one that was serialized. See [below][types] for a description of how markups are applied when converting serializations back to elements.

### Serialize#toString( )

This overrides the inherited `toString` to return the outerHTML of the Serialization’s equivalent element. For example:

```js
var p = document.createElement('p')
p.innerHTML = 'A <em>B</em> C'

var s = new Serialize(p)
console.log('' + s)
// "<p>A <em>B</em> C</p>"
```

### Serialize.fromText( text [, tag] )

Creates a serialization with the given String. The serialization will have no markups. The `type` property of the returned instance can optionally be specified using the `tag` argument, defaulting to `p`.

### Serialize.fromJSON( json )

If you have previously `JSON.stringify`’d a serialization, you can convert it to a “live” instance of Serialize by using this method.

### Serialize.types

An object with the numeric constants corresponding to the various markup types supported by Serialize. They are:

```js
Serialize.types = {
  link: 1,
  code: 2,
  bold: 3,
  italic: 4
}
```

Usage of `Serialize.types.*` in your code is preferred over their numeric equivalents; doing so will not only result in clearer code, but it will make your code future-proof should these numbers ever change.

When converting serializations into DOM elements, markups are applied in order of ascending type; markups with a lower type are prioritized over those with a higher type. For example, consider the following element:

```html
<p><strong><a href="/foo">Some</a></strong><a href="/foo"> text</a></p>
```

Serializing, then deserializing this element will merge the identical, adjacent links, resulting in:

```html
<p><a href="/foo"><strong>Some</strong> text</a></p>
```

## License

[MIT][license]

[medium]: https://medium.com/medium-eng/why-contenteditable-is-terrible-122d8a40e480
[replace]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace
[substr]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substring
[substring]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/substring
[toElement]: #serializationtoelement-
[types]: #serializetypes
[license]: https://github.com/lucthev/serialize/blob/master/LICENSE
