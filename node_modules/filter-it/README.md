# filter-iterable-javascript

A handy function for filtering any iterable and objects in javascript.

## Installation

```bash
$ yarn add filter-it
# or
$ npm i -S filter-it
```

## Usage

The api is straight forward and oriented on [Array.prototype.filter](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Array/filter).

```js
const newIterable = filter(iterable, callback);
```

### Parameters

#### iterable
The iterable or object to filter.
Supported types are String, Array, TypedArray, Map, Set, (any Iterable) & Object.

#### callback
A function to test every element or value of the iterable.
The current item will be preserved when the callback returns a truthy value.

The function takes 3 parameters:

* **value**: The current element being processed.
* **key**: The corresponding key
* **iterable**: The iterable passed to filter

### Return Value
`filter()` returns a new instance of the iterable with only the entries passed the callback.

### Examples

#### Filtering strings
```js
filter("a1b2c3d4e5", char => char >= "0" && char <= "9"); 
// => "12345"
filter(new String("a1b2c3d4e5"), (char, index) => index & 1); 
// => [String: '12345']
```

#### Filtering maps
```js
const map = new Map([['a', 1], ['b', 2], ['c', 3], ['d', 4], ['e', 5]]);

filter(map, (value, key) => key === 'b' || value & 1); 
// => Map { 'a' => 1, 'b' => 2, 'c' => 3, 'e' => 5 } 
```

#### Filtering sets
```js
const set = new Set(['a', 1, 'b', 2, 'c', 3]);

filter(set, (value, key) => value === key && typeof value === 'string'); 
// => Set { 'a', 'b', 'c' } 
```

#### Filtering arrays
```js
const arr = ['a', 1, 'b', 2, 'c', 3];

filter(arr, (value, index) => index & 1); 
// => [ '1', '2', '3' ] 
```

#### Filtering typed arrays
```js
const typedArr = new Int32Array([1, 2, -3, -4, 5]);

filter(typedArr, i => i < 0);
// => Int32Array [ -3, -4 ]
```

#### Filtering plain objects
```js
const obj = { a: 1, b: 2, c: 3, d: 4, e: 5 };

filter(obj, (value, key) => key === 'b' || value & 1); 
// => { a: 1, b: 2, c: 3, e: 5 } 
```
