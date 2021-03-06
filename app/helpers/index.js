export const filterObject = (object, filter) => {
  var result = {}
  for (let key in object) {
    if (filter(object[key], key)) result[key] = object[key]
  }
  return result
}

export const repeat = (arr, n) => {
  let output = []
  for (let i = 0; i < n; i++) output = output.concat(arr)
  return output
}

export const arrayEqual = (a, b) => {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false
  }
  return true
}
