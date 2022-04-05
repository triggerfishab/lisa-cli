let store = {}

export function get(key) {
  if (key) {
    return store[key]
  }

  return store
}

export function set(key, data) {
  store[key] = data
}

export function reset() {
  store = {}
}
