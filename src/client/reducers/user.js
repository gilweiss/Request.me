const user = (state = {id: 0}, action) => { //initiates state to default value or new given state if exists
    switch (action.type) {
      case 'SET_USER':
        return {
            id: action.userId,
            name: action.userName,
            email: action.userEmail,
          }
      case 'DISCONNECT_USER':
        return {
            id: 0,
            name: null,
            email: null,
          }
      default:
        return state
    }
  }
  
  export default user