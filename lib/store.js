let store = {}

function get(key) {
  if (key) {
    return store[key]
  }

  return store
}

function set(key, data) {
  store[key] = data
}

function reset() {
  store = {}
}

module.exports = { get, set, reset }
