import React from 'react';
import { Comment } from './Comment';

//prop comments
//prop reactRouter

export class CommentsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }


  renderComments = () => {
    let comments = this.props.comments;

    if (comments == null || (Array.isArray(comments) && !comments.length)) {
      console.log('recieved empty comments array');
      console.log(comments);
      return (<br />);
    }
    console.log(comments);

    return comments.map((comment, index) => {
      //parse lower-upper-case
      comment.createdAt = new Date(comment.createdat);
      comment.authorUrl = comment.authorurl;
      comment.fullName = comment.fullname;
      comment.avatarUrl = comment.avatarurl;

      return (
        <Comment
          key={comment.fullName + comment.createdAt.getTime() + index}
          comment={comment}
          reactRouter={this.props.reactRouter}
        />
      );
    }
    )
  }

  // comment
  // reactRouter
  // authorUrl
  // avatarUrl
  // fullName
  // createdAt

  render() {
    return (

      <div>{this.renderComments()}</div>
    )
  }

}


