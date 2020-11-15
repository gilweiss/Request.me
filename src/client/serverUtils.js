
import React, { Component } from 'react';
import axios from 'axios';


//  '/api/inc_comment_sum', 
export const getReqPool3 = () => {  //TODO: refactor to main method

    console.log('asking server for stored requests')
    return new Promise(function (resolve, reject) {
        axios.get('/api/db')
            .then((response) => {
                let results = response.data.results;
                let indexedResultsById = results.reduce(function(accumulator, currentVal) {
                    accumulator[currentVal.id] = currentVal;
                    return accumulator;
                  }, {});
                console.log(indexedResultsById);
                resolve(indexedResultsById);
            }, (error) => {
                console.log(error);
            });
    });
}


export const incCommentSum = (id) => {

    axios.post(
        '/api/inc_comment_sum',
        {
            id: id
        }
    )
        .then((response) => {
            console.log(response.data.message);
            //inc
        }, (error) => {
            console.log(error);
        });
}

export const updateServerLikes = (commentId, userId, actionAdd) => { //actionAdd is boolean to determin add\delete

    axios.post(
        '/api/add_del_like',
        {
            commentId: commentId,
            userId: userId,
            actionAdd: actionAdd,
        }
    )
        .then((response) => {
            console.log(response.data.message);
            //inc
        }, (error) => {
            console.log(error);
        });
}

export const sendComment = async (id, comment) => {

    console.log('sending comment')
    console.log(comment.text)
    try {
        const response = await axios.post(
            '/api/sendcomment',
            {
                id: id,
                authorUrl: comment.authorUrl,
                avatarUrl: comment.avatarUrl,
                createdAt: comment.createdAt,
                fullName: comment.fullName,
                text: comment.text,
            }
        )
        console.log(response.data.message);
        incCommentSum(id);
    } catch (e) {
        console.error(e);
    }

}

export const getCommentsFromServer = (id) => {

    console.log('asking server for stored comments of request: ' + id);
    return new Promise(function (resolve, reject) {
        axios.get('/api/getComments',
            {
                params: {
                    id: id
                }
            }
        )
            .then((response) => {
                console.log("response from server: " + response.data);
                resolve(response.data);
            }, (error) => {
                console.log(error);
            });
    });
}


export const getUserLikesFromServer = (userId) => {

    console.log('asking server for stored likes of request from user: ' + userId);
    return new Promise(function (resolve, reject) {
        axios.get('/api/getUserLikes',
            {
                params: {
                    userId: userId
                }
            }
        )
            .then((response) => {
                let results = {};
                response.data.results.forEach(elem => { results[elem.commentid] = null });
                console.log("liked comments from server: " + JSON.stringify(results));
                //console.log("test: " + (3 in results));
                resolve(results);
            }, (error) => {
                console.log(error);
            });
    });
}

