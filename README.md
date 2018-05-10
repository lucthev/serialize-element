# serialize-elem

Manipulate block elements as if they were text.

## Installation

Install [using npm][]:

`npm install serialize-elem`

## Usage

The primary use case for this module is as a building block for web-based rich text editors. Serialize abstracts differences in DOM representation, enabling easier and more consistent editing experiences. For example, consider the following fragments of HTML:

```html
<strong><em>Baggins</em></strong>
<em><strong>Baggins</strong></em>
<em><strong>Bagg</strong><strong>ins</strong></em>
<em><strong>Bagg</strong></em><strong><em>ins</em></strong>
```

These fragments are indistinguishable once rendered, but the differences in structure can be difficult to work with when building a rich text editor. Serialize abstracts away the differences by storing block elements as strings of text, and inline markup as styles that can be applied to the text. By converting to and from DOM elements in a consistent manner, Serialize makes RTE operations simpler and easier to reason about.

Example usage:

```js
import Serialize from 'serialize-elem'

let p = document.createElement('p')
p.innerHTML = 'Some <em>sample text</em>'

let block = new Serialize(p)
// Serialize {
//   type: "p",
//   text: "Some sample text",
//   length: 16,
//   markups: [
//     {
//       type: Serialize.types.italic,
//       start: 5,
//       end: 16
//     }
//   ]
// }

block.type = 'h2'
block.removeMarkup({               // Remove emphasis from " text"
  type: Serialize.types.italic,
  start: 11,
  end: 16
})
block.replace('sample', 'cool')

block.toElement()
// <h2>Some <em>cool</em> text</h2>
```

## API

#### new Serialize( element )

Constructor. A `Serialize` object has the following properties:

- `type`: String, the lowercase `tagName` of `element`
- `text`: String, the text contained in `element`
- `length`: getter for the length of `text`
- `markups`: Array of markup objects. Each markup object has the following properties:
  - `type`: Number representing the type of markup. One of `Serialize.types.{bold,italic,link,code}`
  - `start`: index indicating the start of the markup in the text
  - `end`: index indicating the end of the markup in the text
  - `href`: for link types, the `href` attribute of the link

#### Serialize#addMarkup( markup )

Applies the given markup to the `Serialize` instance. Overlapping or adjacent markups of the same type are merged together. When adding a link, existing links are truncated or removed so that no two links overlap.

#### Serialize#removeMarkup( markup )

Removes or truncates the instance's markups so that no markups of the same type as `markup` overlap the range of `markup`.

_Note_: when removing a link type, the `href` is ignored.

#### Serialize#substr( start [, length] )

Returns the part of a `Serialize` instance between the start index and a number of characters after it, with markups.

Analogous to [`String#substr`][substr].

#### Serialize#substring( start [, end] )

Returns the part of a `Serialize` instance between the start and end indexes (or to the end of the text), with markups.

Analogous to [`String#substring`][substring].

#### Serialize#replace( pattern, replacement )

Returns a new `Serialize` object with some or all matches of `pattern` replaced by `replacement`. If a match partially overlaps a markup, that markup is truncated so as to not overlap the match.

Analogous to [`String#replace`][replace]. Has the same signature as `String#replace`; that is, `pattern` can be a string or RegExp, and `replacement` can be a string or function. See the [`String#replace` documentation][replace] for more details.

#### Serialize#append( other )

Returns a new `Serialize` object resulting from appending the serialization `other` to the instance. Similar to the `+` operator for strings.

#### Serialize#equals( other )

Returns true if the serializations are equivalent, i.e. they would produce identical elements. Otherwise, returns false. Similar to the `==` operator for strings.

#### Serialize#toElement( )

Returns a DOM element corresponding to the `Serialize` instance. When converting to an element, overlapping markups are applied in order of ascending `type` value, i.e. the markup with the lowest type value will be the outermost markup in the returned element. For example:

```js
let s = Serialize.fromText('Example', 'p')
s.addMarkup({
  type: Serialize.types.code, // 2
  start: 0,
  end: 5
})
s.addMarkup({
  type: Serialize.types.italic, // 4
  start: 2,
  end: 7
})
s.toElement()
// <p><code>Ex<em>amp</em></code><em>le</em></p>
```

This ordering ensures consistent results when converting to an element.

_Note_: the `link` type currently has the lowest value, meaning that if it overlaps any other markups it will always be the outermost markup. This prevents a single "logical" link from being converted into multiple links in the DOM.

#### Serialize#toString( )

Returns the outerHTML of the element corresponding to the `Serialize` instance.

#### Serialize.fromText( text [, tag] )

Creates a serialization with the given `text`. The serialization will have no markups. The `type` property of the returned instance can be specified using the `tag` argument, defaulting to `p`.

#### Serialize.fromJSON( json )

Creates a Serialize object from a JSON string representing a stringified Serialize object.

#### Serialize.types

A dictionary of numeric constants corresponding to markup types. Currently supported markup types are `link`, `code`, `bold`, and `italic`.

See [Serialize#toElement](#serializetoelement-) for a description of how these constants relate to element conversion.

## License

[MIT][license]

[replace]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace
[substr]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substr
[substring]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/substring
[license]: https://github.com/lucthev/serialize/blob/master/LICENSE
[using npm]: https://docs.npmjs.com/getting-started/installing-npm-packages-locally
