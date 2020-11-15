import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import likeIMG from '../res/like.png';
import likedIMG from '../res/like2.png';
import { updateServerLikes } from '../serverUtils';
import { LikeLoginModal } from '../likeLoginModal';
import { useDispatch, useSelector } from "react-redux";
import { getUserLikesFromServer } from '../serverUtils';
import { updateRequestTable } from "../actions";
import { updateLikeTable } from "../actions";



export const LikeComponentTemp = (props) => { //props: requestId
    
    const dispatch = useDispatch();
    const storedCurrentUser = useSelector(state => state.user.id);
    const storedLikeTable = useSelector(state => state.likeTable.likeTable);
    const storedRequestTable = useSelector(state => state.requestTable.requestTable);


    useEffect(() => {

            const storedRequest = storedRequestTable[props.id];
            setIsLiked (props.id in storedLikeTable);
            setLikeSum (storedRequest.like_sum);
            setChangable(storedCurrentUser != 0);
            console.log("USE EFFECT ACTIVATED!!!")
        
          return () => {
            //cleanup
            setIsLiked(false);
            setChangable(false);
        }
    }, [storedCurrentUser, storedRequestTable, storedLikeTable]) //TODO dont forget to add cleanup function

    
    const [isChangable, setChangable] = useState(
        false
    )

    const [isLiked, setIsLiked] = useState(
        false
    )

    const [likeSum, setLikeSum] = useState(
        0
    )

    const [invokeLoginRequest, setInvokeLoginRequest] = useState(
        false
    )
    

        const click =async () => {
            if (!isChangable) { 
                setInvokeLoginRequest(true);
                setTimeout(()=>setInvokeLoginRequest(false),300)
            }
            else {
                updateServerLikes(props.id, storedCurrentUser, !isLiked);
                //change local to store for future reloading
                storedRequestTable[props.id].like_sum = isLiked? likeSum-1 : likeSum+1
                console.log("new reqTable to update: "+ JSON.stringify(storedRequestTable))
                dispatch(updateRequestTable(storedRequestTable))
                isLiked ? delete storedLikeTable[props.id] : storedLikeTable[props.id] = null;
                dispatch(updateLikeTable(storedLikeTable));
                //change local state for current use
                setIsLiked(!isLiked);
                setLikeSum(isLiked? likeSum-1 : likeSum+1);
            }
        }


        return (
            <div>
                
                 <LikeLoginModal title='Hello request.me user!' body = 'Please use google-login to like a request' invoke = {invokeLoginRequest}/>
                {likeSum > 0 && (<span className="bulk2">{likeSum}</span>)}
                <input className="commentTableButton" type="image" src={isLiked ? likedIMG : likeIMG} onClick={() => click()} />
                <span className="bulk2">{" "}</span>
            </div>
           
        );
    }

