# Changelog

This document tracks features added, behaviour changes, and bugs fixed in Serialize. Generally, Serialize follows [Semver](http://semver.org/); unless you’ve been relying on buggy behaviour, you should have no problem upgrading to new minor and patch versions.

### 2.2.2

- Serialize now recognizes only text and element nodes when creating the serialization. All other nodes (e.g. comment nodes) are ignored.

### 2.2.1

- `Serialize#replace` now returns a new serialization.
- Fixed a minor bug that caused `Serialize#append` to return `undefined` when called with an empty string or other falsy value.

### 2.2.0

- Defines a custom `toString` method that returns the outerHTML of `Serialize#toElement`.

### 2.1.3

- Fixed a minor bug where `Serialize#removeMarkup` did not return the context, as it is supposed to.

### 2.1.2

- Fixed a relatively serious issue whereby markups of type `Serialize.types.link` did not conserve their `href` property when calling methods such as `substr` and `append`.

### 2.1.1

- Fixed the `href` property of `Serialize.types.link` markups not being preserved when part of such a markup is truncated.

### 2.1.0

- Allowed passing a string to `Serialize#append`. The string is appended to the serialization’s text and any markups that previously terminated at the end of the serialization are extended so that they terminate at the end of the newly extended serialization.

### 2.0.1

- Fixed a bug whereby `Serialize#replace` didn’t pay attention to special replacement patterns ([more](https://github.com/lucthev/serialize/issues/2)).

### 2.0.0

- The `length` property of Serializations is now automatically updated when one manually changes a serialization’s text. For example:
    ```js
    var p = document.createElement('p')
    p.textContent = 'foo'

    var s = new Serialize(p)
    console.log(s.length) // 3

    s.text += '\n'
    console.log(s.length) // 4
    ```

---

### 1.x.y

The `1.x.y` releases are backports of the respective `2.x.y` changes.

### 1.0.0

- No major changes. This release was mainly to avoid odd behaviour in the Semver spec regarding `0.x.y` releases.

### 0.5.0

- Added the `Serialize#removeMarkup` method.

### 0.4.0

- Added the `Serialize#equals` method to succintly compare two serializations.

### 0.3.3

- Added the `Serialize.fromText` function.

### 0.3.2

- Fixed Serialize’s CommonJS compatibility; previously, the bundled, minified version of Serialize was served when `require`-ing the package.

### 0.3.1

- Addresses some style nits.

### 0.3.0

- Added the `Serialize#append` method.

### 0.2.0

- Added the `Serialize#substr` method.

### 0.1.1

- Changed `Serialize.fromJSON`; the only mandatory properties when creating an instance of Serialize from a JSON object are now `text` and `type`.

### 0.1.0

- Adds the `Serialize#replace` method.
