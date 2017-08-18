export default (SET, CLEAR, REMOVE) => (state = {}, action) => {
  switch (action.type) {
    case SET: {
      return Object.assign({}, state, action.props)
    }
    case REMOVE: {
      if (REMOVE === undefined) return state
      return Object.assign({}, state, action.props.reduce((sum, value) => {
        return Object.assign(sum, {[value]: undefined})
      }, {}))
    }
    case CLEAR: {
      if (CLEAR !== undefined) return {}
      else return state
    }
    default:
      return state
  }
}
