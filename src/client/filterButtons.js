import React from 'react';
import Button from 'react-bootstrap/Button';

// button type, active, changing state function

export class FilterButtons extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allTable: 'secondary',
      doneTable: 'secondary',
      todoTable: 'warning',
    };

    //  updateStateLDR = updateStateLDR.bind(this);  //was previously used for component communication
  }



  //filter is "done","all" or "todo"
  loadReqTable = (filter) => {
    this.changeActiveButton(filter);
    this.props.renderfunction(filter);
  }

  changeActiveButton(filter) {

    this.setState({ allTable: (filter == "all" ? "warning" : "secondary") });
    this.setState({ doneTable: (filter == "done" ? "warning" : "secondary") });
    this.setState({ todoTable: (filter == "todo" ? "warning" : "secondary") });
  }

  render() {
    return (

      <div className='buttons'>
        <Button size="sm" variant={this.state.todoTable} onClick={() => this.loadReqTable("todo")} >TODO</Button> &nbsp;
        <Button size="sm" variant={this.state.doneTable} onClick={() => this.loadReqTable("done")} >COMPLETED</Button> &nbsp;
        <Button size="sm" variant={this.state.allTable} onClick={() => this.loadReqTable("all")} >ALL REQUESTS</Button> 

      </div>
    )
  }
}