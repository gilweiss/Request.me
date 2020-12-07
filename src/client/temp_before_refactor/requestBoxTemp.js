import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import { useDispatch, useSelector } from "react-redux";
import { setRequestTable } from "../actions";
import Card, { CardBody } from 'react-bootstrap/Card';
import { LikeComponentTemp } from "./likeComponentTemp";
import CommentsComponentTemp from './commentsComponentTemp';
import ReactTooltip from "react-tooltip";




export const RequestBoxTemp = (props) => { //props: id
    const storedRequest = useSelector(state => state.requestTable.requestTable[props.id]);
    const storedLikeMaxSum = useSelector(state => state.likeMaxSum.likeMaxSum);


    return (
        <span className="RequestBox">
            <Card>
                <Card.Header>
                    <span className="requestbox id">
                        <span className="requestbox id number">
                            #{props.id}
                        </span>
                        <span className="requestbox id preOwner">
                            by
                        </span>
                        <span className="requestbox id owner">
                            {storedRequest.owner}
                        </span>
                        {((storedRequest.like_sum == storedLikeMaxSum) && !storedRequest.done ? <span className="requestbox id header">
                        <span  data-tip data-for="like-leader"> &#11088; </span>
                         <ReactTooltip id="like-leader" className="customeToolTipTheme" effect="solid">
                        <span>Like leader!</span>
                         </ReactTooltip>
                              
                               
                        </span> : "")}
                    </span>
                    <span className="requestbox date">
                        {storedRequest.date}
                    </span>
                </Card.Header>
                <Card.Body className={storedRequest.done ? "card-body-done" : (storedRequest.like_sum == storedLikeMaxSum ? "card-body-likeLeader" : "card-body")}>
                    <span className={storedRequest.done ? "requestbox body-done" : "requestbox body"}>
                        {storedRequest.request}
                    </span>
                    <span className="bulk">
                        <LikeComponentTemp id={props.id} />
                        <CommentsComponentTemp id={props.id} />
                    </span>
                </Card.Body>
            </Card>
            <br />
        </span>
    );
}


