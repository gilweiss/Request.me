import { css } from 'emotion';
import  React from 'react';
import { commentButton } from '../styles/Btn.css';
import { commentTextarea } from '../styles/Textarea.css';






export class CommentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      enterPressed: false,
      text: '',
      name: '',
    };
  }

   render() {



          return (
            <div className={'formBox'}>
            <form onSubmit={this.onSubmit}>
              <textarea
                className={'commentNameArea'}
                name="comment-name"
                id="comment-name"
                placeholder="your name"
                value={this.state.name}
                onChange={this.onChangeName}
               
              />

              <textarea
                className={'commentTextarea'}
                name="comment-text"
                id="comment-text"
                placeholder="your comment"
                value={this.state.text}
                onChange={this.onChangeText}
               
              />
              
              <button className={'commentButton'}>
                Comment</button>  
            </form>
            </div>
          )
          }

   onChangeText = (event) => {
    this.setState({ text: event.target.value });
  }
  onChangeName = (event) => {
    this.setState({ name: event.target.value });
  }

   onSubmit = (event) => {
    event.preventDefault();
    const text = this.state.text.trim().replace(/\n{3,}/g, '\n\n');
    const name = this.state.name.trim().replace(/\n{3,}/g, '\n\n');
    this.props.onSubmit(text, name);
    this.setState({ text: '' });
    this.setState({ name: '' });
    
  }
}

export default CommentForm;
