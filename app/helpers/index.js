export const filterObject = (object, filter) => {
  var result = {}
  for (let key in object) {
    if (filter(object[key], key)) result[key] = object[key]
  }
  return result
}
