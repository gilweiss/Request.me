import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
//import './app.css';
import 'bootstrap/dist/css/bootstrap.min.css';



export class ReactModal extends React.Component{

    constructor(){
        super();
        this.state = {
            showHide : false
        }
    }

    handleModalShowHide() {
        this.setState({ showHide: !this.state.showHide })
    }

    render(){
        return(
            <div>
                <Button variant="primary" onClick={() => this.handleModalShowHide()}>
                    Launch demo modal
                </Button>

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
          <p>
            say what?
          </p>
        </Modal.Body>
      </Modal>



            </div>
        )
    }
    
}
