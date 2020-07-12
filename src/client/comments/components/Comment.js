import { css } from 'emotion';
import  React from 'react';
import { CssComment } from '../styles/Comment.css';
import { Link } from './Link';


//props:

// reactRouter
// comment.
// reactRouter
// authorUrl
// avatarUrl
// fullName
// createdAt


export class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }


   textHtml = () => (
    <React.Fragment>
      {this.props.comment.text.split('\n').map(
        (chunk, inx, arr) =>
          inx !== arr.length - 1 ? (
            <React.Fragment key={chunk + inx}>
              {chunk}
              <br />
            </React.Fragment>
          ) : (
            chunk
          ),
      )}
    </React.Fragment>
  );


    
     //<link> will work if you choose to use it
  render() {
        return (
          <div className={'comment-style'}>
            
              <div
                className={`comment-avatar`}
                style={{
                  backgroundImage: `url(${this.props.comment.avatarUrl})`,
                }}
              />
            
            <div className={`comment-col-right`}>
              
                <div className={`comment-name`}>{this.props.comment.fullName}</div>
              
              <div className={`comment-time`}>
                {this.props.comment.createdAt.toLocaleDateString()}
              </div>
              <div className={`comment-content`}>{this.textHtml()}</div>
            </div>
          </div>
        );
      
              }
 }



