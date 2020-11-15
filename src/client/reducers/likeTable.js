const likeTable = (state = { likeTable: {} }, action) => { //initiates state to default value or new given state if exists
  switch (action.type) {
    case 'SET_USER':
      return {
        likeTable: action.userLikeTable,
      }
    case 'DISCONNECT_USER':
      return {
        likeTable: {},
      }
    case 'UPDATE_LIKE_TABLE':
      return {
        likeTable: action.likeTable,
      }
    default:
      return state
  }
}

export default likeTable