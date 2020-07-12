
import React, { Component } from 'react';
import axios from 'axios';



//  '/api/inc_comment_sum', 

export const incCommentSum = (id) => {

    console.log('incrementing comment sum')
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

export const sendComment = (id, comment) => {

    console.log('sending comment')
    console.log(comment.text)
    axios.post(
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
      .then((response) => { 
        console.log(response.data.message);
        incCommentSum(id);
      }, (error) => {
        console.log(error);
      });
  }

export const getCommentsFromServer = (id) => {

    console.log('asking server for stored comments of request: '+id);
    return new Promise(function (resolve, reject) {
      axios.get('/api/getComments',
      {params: {
        id: id
    }}
      )
        .then((response) => {
          console.log("response from server: " + response.data);
          resolve(response.data);
        }, (error) => {
          console.log(error);
        });
    });
  }

