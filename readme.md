CopyTo
=======

[![Build Status](https://travis-ci.org/hanrea/copyto.svg?branch=master)](https://travis-ci.org/hanrea/copyto)

copy an object's properties to another one, include propertiy, getter and setter.

## Install

```
npm install copyto
```

## Usage

```js
copy(src).to(des);
copy(src).toCover(des);
copy(src).override(des);

copy(src).pick('name', 'age').to(des);
copy(src).pick('name', 'age').toCover(des);
copy(src).pick('name', 'age').override(des);

copy(src).unpick('pass').to(des);
copy(src).unpick('pass').toCover(des);
copy(src).unpick('pass').override(des);

copy(src).and(other).to(des);
copy(src).and(other).toCover(des);
copy(src).and(second).and(third).to(des);

copy(src).and(other).pick('name', 'age').to(des);
copy(src).and(other).pick('name', 'age').toCover(des);
copy(src).and(second).and(third).pick('name', 'age').to(des);



```

It won't copy access(getter / setter) by default, if you want to copy them, please use:

```js
copy(src,true).and(other).to(des);
copy(src).withAccess().and(other).to(des);
```

## Example

```js
var copy = require('copyto');

var src = {
  _name: 'foo',
  set name(val) {
    this._name = val;
  },
  get name() {
    return this._name;
  },
  show: function () {
    console.log(this._name);
  }
};

var des = {
  _name: 'bar'
};

copy(src).to(des);
copy(src).toCover(des);
copy(src).pick('name').to(des);
copy(src).unpick('name').to(des);
```

## License
MIT