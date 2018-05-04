var path = require('path')
var test = require('tape')

var level = require('../')

// Tests copied from https://github.com/Level/packager
// and modified to run in browsers
var location = path.join(__dirname, 'level-test.db')

test('Level constructor provides access to levelup errors', function (t) {
  t.ok(level.errors, '.errors property set on constructor')
  t.end()
})

test('test db open and use, level(location, cb)', function (t) {
  level(location, function (err, db) {
    t.notOk(err, 'no error')
    db.put('test1', 'success', function (err) {
      t.notOk(err, 'no error')
      db.close(t.end.bind(t))
    })
  })
})

test('test db open and use, level(location, options, cb)', function (t) {
  level(location, { createIfMissing: false, errorIfExists: false }, function (err, db) {
    t.notOk(err, 'no error')
    db.put('test2', 'success', function (err) {
      t.notOk(err, 'no error')
      db.close(t.end.bind(t))
    })
  })
})

test('test db open and use, level(location, options, cb) force error', function (t) {
  level(location, { errorIfExists: true }, function (err, db) {
    t.ok(err, 'got error opening existing db')
    t.notOk(db, 'no db')
    t.end()
  })
})

test('test db open and use, db=level(location)', function (t) {
  var db = level(location)
  db.put('test3', 'success', function (err) {
    t.notOk(err, 'no error')
    db.close(t.end.bind(t))
  })
})

test('test db values', function (t) {
  var c = 0
  var db = level(location)

  function read (err, value) {
    t.notOk(err, 'no error')
    t.equal(value, 'success')
    if (++c === 3) { db.close(t.end.bind(t)) }
  }

  db.get('test1', read)
  db.get('test2', read)
  db.get('test3', read)
})

test('options.keyEncoding and options.valueEncoding are passed on to encoding-down', function (t) {
  var db = level(location, { keyEncoding: 'json', valueEncoding: 'json' })
  db.on('ready', function () {
    var codec = db.db.codec
    t.equal(codec.opts.keyEncoding, 'json', 'keyEncoding correct')
    t.equal(codec.opts.valueEncoding, 'json', 'valueEncoding correct')
    db.close(t.end.bind(t))
  })
})

test('encoding options default to utf8', function (t) {
  var db = level(location)
  db.on('ready', function () {
    var codec = db.db.codec
    t.equal(codec.opts.keyEncoding, 'utf8', 'keyEncoding correct')
    t.equal(codec.opts.valueEncoding, 'utf8', 'valueEncoding correct')
    db.close(t.end.bind(t))
  })
})

test('test destroy', function (t) {
  level.destroy(location, function (err) {
    t.notOk(err, 'no error')
    t.end()
  })
})
