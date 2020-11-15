import { getReqPool3 } from '../serverUtils'; //TODO refactor name when done
import { getUserLikesFromServer } from '../serverUtils';


export const setUser = (userId) => {
  return async dispatch =>                           //thank you thunk
  {
    const userLikeTable = await getUserLikesFromServer(userId);
    dispatch({
      type: 'SET_USER',                             //const name for action
      userId, userLikeTable					                //transfered data
    })
  }
}

export const disconnectUser = () => ({
  type: 'DISCONNECT_USER'                           //const name for action
})


export const setRequestTable = () => {
  return async dispatch =>                          //thank you thunk
  {
    const requestTable = await getReqPool3();
    dispatch({
      type: 'SET_REQUEST_TABLE',                    //const name for action
      requestTable					                        //transfered data
    })
  }
}

export const updateRequestTable = (requestTable) => ({
      type: 'SET_REQUEST_TABLE',                    //const name for action
      requestTable					                        //transfered data
})

export const updateLikeTable = (likeTable) => ({
  type: 'UPDATE_LIKE_TABLE',                    //const name for action
  likeTable					                        //transfered data
})

