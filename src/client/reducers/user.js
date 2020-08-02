const user = (state = {id: 0}, action) => { //initiates state to default value or new given state if exists
    switch (action.type) {
      case 'SET_USER':
        return {
            id: action.id,
          }
      case 'DISCONNECT_USER':
        return {
            id: 0,
          }
      default:
        return state
    }
  }
  
  export default user