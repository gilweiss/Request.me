import React from 'react';
import { css } from '@emotion/core';
import Button from 'react-bootstrap/Button';

// button type, active, changing state function

export class FilterButtons extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allTable: 'success',
      doneTable: 'secondary',
      todoTable: 'secondary',
    };

    //  updateStateLDR = updateStateLDR.bind(this);  //was previously used for component communication
  }



  //filter is "done","all" or "todo"
  loadReqTable = (filter) => {
    this.changeActiveButton(filter);
    this.props.renderfunction(filter);
  }

  changeActiveButton(filter) {

    this.setState({ allTable: (filter == "all" ? "success" : "secondary") });
    this.setState({ doneTable: (filter == "done" ? "success" : "secondary") });
    this.setState({ todoTable: (filter == "todo" ? "success" : "secondary") });
  }

  render() {
    return (

      <div className='buttons'>
        <Button size="sm" variant={this.state.allTable} onClick={() => this.loadReqTable("all")} >Request pool</Button> &nbsp;
        <Button size="sm" variant={this.state.doneTable} onClick={() => this.loadReqTable("done")} >COMPLETED</Button> &nbsp;
        <Button size="sm" variant={this.state.todoTable} onClick={() => this.loadReqTable("todo")} >TODO</Button>
      </div>
    )
  }
}