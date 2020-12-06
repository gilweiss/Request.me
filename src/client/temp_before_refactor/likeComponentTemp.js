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
import { updateLikeMaxSum} from "../actions";



export const LikeComponentTemp = (props) => { //props: requestId

    const dispatch = useDispatch();
    const storedCurrentUser = useSelector(state => state.user.id);
    const storedLikeTable = useSelector(state => state.likeTable.likeTable);
    const storedRequestTable = useSelector(state => state.requestTable.requestTable);
    const storedLikeMaxSum = useSelector(state => state.likeMaxSum.likeMaxSum);

    useEffect(() => {
        const storedRequest = storedRequestTable[props.id];
        setIsLiked(props.id in storedLikeTable);
        setLikeSum(storedRequest.like_sum);
        setChangable(storedCurrentUser != 0);
        if (storedLikeMaxSum == storedRequestTable[props.id].like_sum) setmaxLikesSum(true);
        return () => {
            //cleanup
            setIsLiked(false);
            setChangable(false);
        }
    }, [storedCurrentUser, storedRequestTable, storedLikeTable]) 

    useEffect(() => { //this is here to update the system`s max-likes value, it should be performed only: 1) once a like click was made 2) on a potential candidtate of causing a difference 3)store was already updated with new like_sum value
        if (maxLikesSum && clickedInCurrentRender)
        dispatch(updateLikeMaxSum());
    }, [storedRequestTable])



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
    const [clickedInCurrentRender, setclickedInCurrentRender] = useState(
        false
    )

    const [maxLikesSum, setmaxLikesSum] = useState(
        false
    )
    

    const click = async () => {
        if (!isChangable) {
            setInvokeLoginRequest(true);
            setTimeout(() => setInvokeLoginRequest(false), 300)
        }
        else {
            setclickedInCurrentRender(true);
            updateServerLikes(props.id, storedCurrentUser, !isLiked);
            //change local to store for future reloading
            storedRequestTable[props.id].like_sum = isLiked ? likeSum - 1 : likeSum + 1
            dispatch(updateRequestTable(JSON.parse(JSON.stringify(storedRequestTable)))); //deep copy enables auto self update
            isLiked ? delete storedLikeTable[props.id] : storedLikeTable[props.id] = null;
            dispatch(updateLikeTable(JSON.parse(JSON.stringify(storedLikeTable))));
        }
    }


    return (
        <div>
            <LikeLoginModal title='Hello request.me user!' body='Please use google-login to like a request' invoke={invokeLoginRequest} />
            {likeSum > 0 && (<span className="bulk2">{likeSum}</span>)}
            <input className="commentTableButton" type="image" src={isLiked ? likedIMG : likeIMG} onClick={() => click()} />
            <span className="bulk2">{" "}</span>
        </div>

    );
}

