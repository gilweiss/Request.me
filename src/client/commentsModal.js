import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import './app.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CommentsShell } from './commentsShell';
import commentIcon from './res/comment.png';
import likeIcon from './res/like.png';

export class CommentModal extends React.Component {
  //prop id: request id
  constructor() {
    super();
    this.state = {
      showHide: false
    }
  }

  handleModalShowHide() {
    this.setState({ showHide: !this.state.showHide })
  }

  render() {
    return (
      <div>
        <input className="commentTableButton" type="image" src={commentIcon} onClick={() => this.handleModalShowHide()} />

        <Modal
          show={this.state.showHide}
          size='xl'
          onHide={() => this.handleModalShowHide()}
        >
          <Modal.Header closeButton onClick={() => this.handleModalShowHide()}>
            <Modal.Title>
              Comments
          </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <CommentsShell id={this.props.id} refreshReqTable={this.props.refreshReqTable} />
          </Modal.Body>
        </Modal>



      </div>
    )
  }

}
