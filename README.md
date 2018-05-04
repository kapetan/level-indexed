# level-indexed

A convenience package bundling [levelup](https://github.com/level/levelup) and [indexeddown](https://github.com/kapetan/indexeddown) and exposing the `levelup` constructor.

    npm install level-indexed

## Usage

The usual `levelup` API is available.

```javascript
var level = require('level-indexed')

var db = level('mydb')

db.put('key', 'value', function (err) {
  db.get('key', function (err, value) {
    console.log(value)
  })
})
```
