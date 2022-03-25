let store = {}

function get(key) {
  if (key) {
    return store[key]
  }

  return store
}

function set(object) {
  store = object
}

function reset() {
  store = {}
}

module.exports = { get, set, reset }
