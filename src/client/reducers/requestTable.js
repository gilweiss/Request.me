const requestTable = (state = {requestTable : ''}, action) => { //initiates state to default value or new given state if exists
    switch (action.type) {
      case 'SET_REQUEST_TABLE':
        return {
          requestTable: action.requestTable,
          }
      default:
        return state
    }
  }
  export default requestTable