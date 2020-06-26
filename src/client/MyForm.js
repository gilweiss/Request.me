import React, { Component } from 'react';
import './app.css';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { AwesomeComponent } from './spnr';
import { FilterButtons } from './filterButtons';
// import { updateStateLDR } from './spnr';  //was previously used for component communication
import { MDBDataTable } from 'mdbreact';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';

//last commit separated buttons(and logic) to another component as things should be

class MyForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      textbox: '',
      poolTable: '',
      mailbox: '',
      requestSent: 'true',
      userbox: '',
      loading: false,
      textboxToSend: '',
      allTable: 'success',
      doneTable: 'secondary',
      todoTable: 'secondary',
      tableData: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeTB = this.handleChangeTB.bind(this);
    this.handleChangeUB = this.handleChangeUB.bind(this);
    this.handleChangeMB = this.handleChangeMB.bind(this);
    this.renderReqTable = this.renderReqTable.bind(this);

  }


  handleChangeTB(event) {
    this.setState({ textbox: event.target.value });
  }

  handleChangeUB(event) {
    this.setState({ userbox: event.target.value });
  }

  handleChangeMB(event) {
    this.setState({ mailbox: event.target.value });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.submitMainForm();
    this.setState({ requestSent: "false" });

  }



  googleSDK() {


    window['googleSDKLoaded'] = () => {
      window['gapi'].load('auth2', () => {
        this.auth2 = window['gapi'].auth2.init({
          client_id: '765105250063-0rtg2noaagpp7tfsteeiv1noibs70vkd.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
          scope: 'profile email'
        });
        this.prepareLoginButton();
      });
    }


    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = "https://apis.google.com/js/platform.js?onload=googleSDKLoaded";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'google-jssdk'));
  }




  isTextBoxOccupied = () => {
    console.log('test');
    return (this.state.textbox == "request pool LOADED" ||
      this.state.textbox == "L O A D I N G . . . . . . " ||
      this.state.textbox == "S E N D I N G . . . . . . " ||
      this.state.textbox == "" ||
      this.state.textbox == "request pool LOADED with COMPLETED filter" ||
      this.state.textbox == "request pool LOADED with TODO filter" ||
      this.state.textbox == "your request was successfully added to review pool :)");
  }

  //wait some time for loading DAWIN, then start real loading (should be complete by then though)
  submitMainForm = () => {
    if (this.isTextBoxOccupied() || this.state.loading == true) return;
    this.setState({ loading: true });
    this.setState({ textboxToSend: this.state.textbox });
    this.setState({ textbox: "S E N D I N G . . . . . . " });
    setTimeout(() => { this.sendTextbox(); }, 1500);
    setTimeout(this.waitForSub(true, 0, 3000, 200), 200);

  }



  //awaits until the loading process is complete to render the request table
  //TODO this may seem broken or modified from a previouse version, fix it!
  waitForSub = (isWaiting, time, maxTimeLim, interval) => {

    return () => {
      if (!isWaiting) {
        this.renderReqTable("all");
        return;
      }
      if (maxTimeLim <= time) { return }
      time += interval;
      if (this.state.loading == false) {
        isWaiting = false;
      }

      setTimeout(this.waitForSub(isWaiting, time, maxTimeLim, interval), interval);

    }

  }


  sendTextbox() {

    console.log('sending')
    axios.post(
      '/api/sendTextbox',
      { data: this.state.textboxToSend, name: this.state.userbox, mail: this.state.mailbox }
    )
      .then((response) => {
        console.log(response.data.message);

        this.setState({ loading: false });
        this.setState({ textbox: response.data.message });
        this.setState({ userbox: "" });
        this.setState({ mailbox: "" });
        setTimeout(() => { this.setState({ textbox: "" }); }, 2000);

      }, (error) => {
        this.setState({ textbox: "" });

        this.setState({ loading: false });
        this.setState({ userbox: "" });
        this.setState({ mailbox: "" });
        console.log(error);
        alert("something went wrong, sorry");
      });
  }

  prepareLoginButton = () => {


    console.log(this.refs.googleLoginBtn);

    this.auth2.attachClickHandler(this.refs.googleLoginBtn, {},
      (googleUser) => {


        let profile = googleUser.getBasicProfile();
        console.log('Token || ' + googleUser.getAuthResponse().id_token);
        console.log('ID: ' + profile.getId());
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail());
        this.setState({ userbox: profile.getGivenName().substring(0, 7) });
        this.setState({ mailbox: profile.getEmail() });


      }, (error) => {
        console.log("error with google login: " + JSON.stringify(error, undefined, 2));
      });

  }


  componentDidMount() {

    this.googleSDK();
    this.renderReqTable("all");
  }


  renderReqTable = async (option) => {


    this.setState({ loading: true });
    this.setState({ textboxToSend: this.state.textbox });
    this.setState({ textbox: "L O A D I N G . . . . . . " });
    var myTable = await this.DatatablePage(option);
    this.setState({ poolTable: myTable })
  }

  getReqPool = async () => {

    var answer = await this.getReqPool2();
    return answer;
  }

  getReqPool2 = () => {

    console.log('asking server for stored requests')
    return new Promise(function (resolve, reject) {
      axios.get('/api/db')
        .then((response) => {
          console.log("response from server: " + response.data);
          resolve(response.data);
        }, (error) => {
          console.log(error);
        });
    });
  }


  addKey = (obj) => {
    var i;
    for (i = 0; i < obj.length; i++) {
      obj[i].key = i;

    }
  }


  DatatablePage = async (option) => {

    var rows
    if (option == "all") {
      const tRows = await this.getReqPool();
      rows = tRows.results;
      this.addKey(rows);
      this.setState({ tableData: rows });
    }
    if (option == "todo") {
      rows = this.state.tableData.filter(request => !request.done)
    }
    if (option == "done") {
      rows = this.state.tableData.filter(request => request.done)
    }
    this.addKey(rows);




    var columns = [{
      dataField: 'id',
      text: 'ID',
      sort: true,
      isKey: true

    }, {
      dataField: 'request',
      text: 'Request',
      headerStyle: (colum, colIndex) => {
        return { width: '2000px', textAlign: 'center' };
      },
      formatter: (status, row) => {
        return (
          <div >
            <span>
              {rows[row.key].done && (
                <s>{status} </s>
              )}

              {!rows[row.key].done && (
                <span>{status}</span>
              )}
            </span>
          </div>
        )
      }

    }, {
      dataField: 'owner',
      text: 'Owner',
      sort: true
    }, {
      dataField: 'date',
      text: 'Date'
    }
    ];


    console.log(rows);
    const CaptionElement = () => <h3 style={{ textAlign: 'center', color: 'black' }}>Request Pool</h3>;
    this.setState({ textbox: "request pool LOADED" + (option == "done" ? " with COMPLETED filter" : "") + (option == "todo" ? " with TODO filter" : "") });
    this.setState({ loading: false });


    setTimeout(() => {
      this.setState({
        textbox: (this.isTextBoxOccupied()
          ? "" : this.state.textboxToSend)
      });
    }, 1500);

    const customTotal = (from, to, size) => (
      <span className="react-bootstrap-table-pagination-total">
        &nbsp;&nbsp;Showing requests { from} to { to} out of { size}
      </span>
    );

    var rowClasses = row => (rows[row.key].done ? "doneReq"
      : "undoneReq");

    const options = {
      paginationSize: 4,
      pageStartIndex: 0,
      // alwaysShowAllBtns: true, // Always show next and previous button
      // withFirstAndLast: false, // Hide the going to First and Last page button
      // hideSizePerPage: true, // Hide the sizePerPage dropdown always
      // hidePageListOnlyOnePage: true, // Hide the pagination list when only one page
      firstPageText: 'First',
      prePageText: 'Back',
      nextPageText: 'Next',
      lastPageText: 'Last',
      nextPageTitle: 'First page',
      prePageTitle: 'Pre page',
      firstPageTitle: 'Next page',
      lastPageTitle: 'Last page',
      paginationTotalRenderer: customTotal,
      showTotal: true,
      disablePageTitle: true,
      sizePerPageList: [{
        text: '20 per page', value: 40
      }, {
        text: '50 per page', value: 80
      }, {
        text: 'Show all', value: rows.length
      }] // A numeric array is also available. the purpose of above example is custom the text
    };
    return (

      <BootstrapTable
        bootstrap4
        keyField="id"
        data={rows}
        columns={columns}
        condensed
        //pagination={ paginationFactory(options) } //when pagination will be needed
        caption={<CaptionElement />}
        rowClasses={rowClasses}
      />
    );
  }



  render() {
    return (
      <div>
        <button className="loginBtn loginBtn--google" ref="googleLoginBtn">
          Login with Google
                                    </button>

        <div align="center">

          <form onSubmit={this.handleSubmit} >


            <br />
            <h1>Ask for stuff</h1>


            <br />

            <textarea rows="6" cols="50" placeholder="Please be reasonable with your request" value={this.state.textbox} onChange={this.handleChangeTB} />

            <br />
            <label value=" "><b> Request owner: &nbsp;&nbsp; </b> </label>
            <input type="text" id="name" name="name" placeholder="your name" maxLength="8" value={this.state.userbox} onChange={this.handleChangeUB} />
            <br />
            <label value=" "><b> EMAIL to update about your request : &nbsp;&nbsp; </b> </label>
            <input type="text" id="mail" name="email" placeholder="@optional field" value={this.state.mailbox} onChange={this.handleChangeMB} />
            <br /><br />



            <Button type="submit" value="Submit" variant="danger">submit</Button> {' '}  <br /><br /><AwesomeComponent loading={this.state.loading} /><br />

            <FilterButtons renderfunction={this.renderReqTable} />

          </form>
          <br />
          {this.state.poolTable}
          <br /> <br /><br /> <br />

          <p id="hidden button, you can also copy paste the suffix" hidden onClick={() => this.getStoredRequests()} >/api/getRequests</p>
        </div>
      </div>
    );
  }
}

export default MyForm;

