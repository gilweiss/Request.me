import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import likeIMG from './res/like.png';
import likedIMG from './res/like2.png';
import { updateServerLikes } from './serverUtils';
import { LikeLoginModal } from './likeLoginModal';

const ConnectedLikeComponent = (props) => { //props: likeSum, userLikesList, requestId
    const [isLiked, setLiked] = useState(
        props.liked
    )

    const [isChangable, setChangable] = useState(
        false
    )


    const [localInc, setlocalInc] = useState(
        0
    )

    const [invokeLoginRequest, setInvokeLoginRequest] = useState(
        false
    )

    useEffect(() => {
        if (props.user.id !== 0) {
            setChangable(true);
            setLiked(props.liked);
        }

        return () => {
            //cleanup
            setLiked(false);
            setChangable(false);
            setlocalInc(0);
            //refresh req table - callback in props
        }
    }
        , [props.user.id]);

    useEffect(() => {
        if (props.user.id !== 0) {
            setLiked(props.liked);
        }
    }
        , [props.liked]);

    useEffect(() => {
        setlocalInc(0);
    }
        , [props.likeSum]);


        const click = () => {
            if (!isChangable) { 
                setInvokeLoginRequest(true);
                console.log(invokeLoginRequest)
                setTimeout(()=>setInvokeLoginRequest(false),300)
                
            }
            else {
                toggleLiked();
            }
        }

        const LocalyToggle = () => {
            let difference;
            isLiked ? difference=-1 : difference=1;
            setlocalInc(localInc + difference);
            props.incCallback(props.commentId , difference);
            
        }


        const toggleLiked = () => {
            //server logic and in the end an if-success statement following:
            updateServerLikes(props.commentId, props.user.id, !isLiked);//props
            LocalyToggle();
            setLiked(like => !like);
        }



        return (
            <span className="bulk">
                 <LikeLoginModal title='Hello request.me user!' body = 'Please use google-login to like a request' invoke = {invokeLoginRequest}/>
                {props.likeSum + localInc > 0 && (<div className="bulk2"> {props.likeSum + localInc}  </div>)}
                <input className="commentTableButton" type="image" src={isLiked ? likedIMG : likeIMG} onClick={() => click()} />
            </span>
           
        );
    }

const mapStateToProps = state => {
        return { user: state.user }
    }

    const LikeComponent = connect(
        mapStateToProps
    )(ConnectedLikeComponent);

    export default LikeComponent;