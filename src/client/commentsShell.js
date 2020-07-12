import React from 'react';
import Button from 'react-bootstrap/Button';
import { CommentsBlock } from './comments/components/CommentsBlock';
import { commentsData } from './exdata/comments.ts'; // Some comment data
import { sendComment } from './serverUtils';
import { getCommentsFromServer } from './serverUtils';



export class CommentsShell extends React.Component {
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
               


              if (name === "Gil!!!"){
                await sendComment(this.props.id,
                 {
                   authorUrl: '',
                   avatarUrl: 'https://i.imgur.com/U1lBFYA.png',
                   createdAt: new Date(),
                   fullName: "Gil",
                   text,
                 }
               );
               }
               else{
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


              //BAD coding, but i wanna relaese an update already
               setTimeout(() => { 
                  this.loadComments(this.props.id);
                this.props.refreshReqTable("same");
               }, 500);
                  
                
                
           
                

            }
          }}
        />
      </div>
    );
  }








}