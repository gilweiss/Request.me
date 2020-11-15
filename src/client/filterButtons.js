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
    this.props.setFilterCallback(filter);
  }

  changeActiveButton(filter) {

    this.setState({ allTable: (filter == "ALL" ? "warning" : "secondary") });
    this.setState({ doneTable: (filter == "DONE" ? "warning" : "secondary") });
    this.setState({ todoTable: (filter == "TODO" ? "warning" : "secondary") });
  }

  render() {
    return (

      <div className='buttons'>
        <Button size="sm" variant={this.state.todoTable} onClick={() => this.loadReqTable("TODO")} >TODO</Button> &nbsp;
        <Button size="sm" variant={this.state.doneTable} onClick={() => this.loadReqTable("DONE")} >COMPLETED</Button> &nbsp;
        <Button size="sm" variant={this.state.allTable} onClick={() => this.loadReqTable("ALL")} >ALL REQUESTS</Button> 

      </div>
    )
  }
}