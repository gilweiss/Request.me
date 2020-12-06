const likeMaxSum = (state = { likeMaxSum: 1000000 }, action) => { //initiates state to default value or new given state if exists, i dont expect to reach a 1000000 likes, please prove me wrong
  switch (action.type) {
    case 'UPDATE_LIKE_MAX_SUM':
      return {
        likeMaxSum: action.likeMaxSum,
      }
    default:
      return state
  }
}

export default likeMaxSum