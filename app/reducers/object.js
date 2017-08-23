export default (SET, CLEAR, REMOVE) => (state = {}, action) => {
  switch (action.type) {
    case SET: {
      return Object.assign({}, state, action.props)
    }
    case REMOVE: {
      if (REMOVE === undefined) return state
      const newObj = Object.assign({}, state)
      for (let prop of action.props) delete newObj[prop]
      return newObj
    }
    case CLEAR: {
      if (CLEAR !== undefined) return {}
      else return state
    }
    default:
      return state
  }
}
