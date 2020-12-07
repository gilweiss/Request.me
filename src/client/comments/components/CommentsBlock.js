import * as React from 'react';
import CommentForm from './CommentForm';
import { CommentsList } from './CommentsList';


//props comments
//props onSubmit

export class CommentsBlock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //add state vars
    };
  }

  render() {
    return (
      
        <div>
          <CommentsList comments={this.props.comments} reactRouter={this.props.reactRouter} />
            <CommentForm onSubmit={this.props.onSubmit} />
        </div>
    );
  }
}

//export default CommentsBlock;
