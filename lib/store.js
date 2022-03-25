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

function empty() {
  store = {}
}

module.exports = { get, set, reset }
