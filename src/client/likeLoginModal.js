import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
//import './app.css';
import 'bootstrap/dist/css/bootstrap.min.css';



export class LikeLoginModal extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            showHide : false,
            invoked : false
        }
    }

    handleModalShowHide() {
        this.setState({ showHide: !this.state.showHide })
    }

componentDidUpdate(){
  if (this.props.invoke && this.state.invoked === false){
  this.handleModalShowHide()
  this.setState({invoked : true})
  }
  if (!this.props.invoke && this.state.invoked === true){
    this.setState({invoked : false})
    }


}

    render(){
        return(
            <div>
                <Modal
        show={this.state.showHide}
        size='small'
        onHide={() => this.handleModalShowHide()}
        
      >
        <Modal.Header closeButton onClick={() => this.handleModalShowHide()}>
          <Modal.Title>
          {this.props.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            {this.props.body}
          </p>
        </Modal.Body>
      </Modal>



            </div>
        )
    }
    
}
