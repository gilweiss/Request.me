import React from 'react';
import Button from 'react-bootstrap/Button';
import { CommentsBlock } from '../comments/components/CommentsBlock';
import { commentsData } from '../exdata/comments.ts'; // Some comment data
import { sendComment } from '../serverUtils';
import { getCommentsFromServer } from '../serverUtils';
import { connect } from 'react-redux'
import { setRequestTable } from "../actions";


class ConnectedCommentsShellTemp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: null,
    };
  }

  getComments = async (id) => {
    var answer = "";
    try {
      answer = await getCommentsFromServer(id);
      console.log('comment answer from server is: ');
      console.log(answer.results.toString());
      return answer.results;
    }
    catch{
    }
    console.log("no comments or error");

    return { comments: [] };
  }

  loadComments = async (id) => {
    let comments = await this.getComments(id);
    this.setState({ comments: comments });
  }

  componentDidMount() {
    this.loadComments(this.props.id)
  }

  render() {
    return (
      <div>
        <CommentsBlock
          comments={this.state.comments}
          reactRouter={false} // set to true if you are using react-router
          onSubmit={async (text, name) => {
            if (text.length > 0 && name.length > 0) {
              console.log('submit:', text);
              if (this.props.userId === "108994789524467119648") {
                await sendComment(this.props.id,
                 {
                   authorUrl: '',
                   avatarUrl: 'https://i.imgur.com/U1lBFYA.png',
                   createdAt: new Date(),
                   fullName: "Gil",
                   text,
                 }
               );
               } else {
                 await sendComment(this.props.id,
                   {
                     authorUrl: '',
                     avatarUrl: 'https://i.imgur.com/Vqfb6Vh.png',
                     createdAt: new Date(),
                     fullName: name,
                     text,
                   }
                 );
               }
               this.loadComments(this.props.id);
               this.props.dispatch(setRequestTable())
            }
          }}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return { userId: state.user.id }
}

const CommentsShellTemp = connect(mapStateToProps
)(ConnectedCommentsShellTemp);

export default CommentsShellTemp;
