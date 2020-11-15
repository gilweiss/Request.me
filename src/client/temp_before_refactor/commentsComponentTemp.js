import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import '../app.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import  CommentsShellTemp  from './commentsShellTemp';
import commentIcon from '../res/comment.png';
import likeIcon from '../res/like.png';
import { connect } from 'react-redux'

  class ConnectedCommentsComponentTemp extends React.Component {
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
          
          <span className = "bulk2">
          {this.props.requestTable.comment_sum!="" && this.props.requestTable.comment_sum + ""}
          </span>
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
              <CommentsShellTemp id={this.props.id} refreshReqTable={this.props.refreshReqTable} />
            </Modal.Body>
          </Modal>
  
  
  
        </div>
      )
    }
  
  }
  
  const mapStateToProps = (state, ownProps) => {
    return { requestTable: state.requestTable.requestTable[ownProps.id] }
  }
  
  const CommentsComponentTemp = connect(
    mapStateToProps
  )(ConnectedCommentsComponentTemp);
  
  export default CommentsComponentTemp;
  