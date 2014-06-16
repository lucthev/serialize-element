# Serialize

Serialize an element into an abstract, JSON-ifiable object and back again.

## Installation

```
$ npm install serialize-elem
```

## Motivation

Serialize's primary use case is in-browser rich text editing. The tree structure of HTML documents can be a pain to work with. Serialize aims to absctract away some of the difficulties by focusing on the text; inline elements are stored as abstract markups that are applied to the text. A subset of [`String`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) methods are available as well, to be able to manipulate serialized block elements as you would normally with plain text.

## API

### var serialization = new Serialize( element )

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

Where `Serialize.types.*` is a number. Currently, only `<code>`, `<a>`, and various italic and bold types (elements, like `<b>`, `<strong>`, etc, but also other elements with, say, `style="font-weight: bold"`) are supported. If you need to support a broader range of inline elements, adding support is trivial.

### serialization.addMarkups( markups )

Adds the array of markups to the serialization’s markups, ordering them first by type, then by start index, then by end index. This method is chainable.

### serialization.mergeAdjacent( )

Merges adjacent or overlapping markups of the same type. If you've recently added a markup, you should call this method to normalize things.

### serialization.toElement( )

Return a new element resembling the one that was serialized.

### serialization.replace( pattern, substr )

Works like [`String#replace`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace) on the serialization’s text, but updates the markups appropriately. Same signature as [`String#replace`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace). Returns the context, to allow for chaining.

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

### serialization.substr( start [, length] )

Works the same as [`String.substr`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substr). Returns a __new__ serialization representing the extracting substring, complete with the appropriate markups.

### serialization.substring( start [, end] )

Like [`String.substr`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substring). Returns a __new__ serialization.

### Serialize.fromJSON( )

If you have previously `JSON.stringify`’d a serialization, you can get convert it to a “live” instance of Serialize by using this method.

## License

MIT.
