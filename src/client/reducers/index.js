import { combineReducers } from 'redux'
import user from './user'    
import requestTable from './requestTable'   
import likeTable from './likeTable'   
import likeMaxSum from './likeMaxSum'                             

export default combineReducers({ //for now we got only user as a global state
    user, 
    requestTable,
    likeTable,
    likeMaxSum
})