import React, { Component } from 'react';
import './app.css';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { AwesomeComponent } from './spnr';
import { updateStateLDR } from './spnr';
import { MDBDataTable } from 'mdbreact';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';


// function updateStateLDR(text){
//   this.setState({text})
// }

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

    //this.loader2 = new AwesomeComponent().render.bind(this);

  }

  updateChild = (text) => {
    updateStateLDR(text);
  }

  testButton = () => {

    alert("test");
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
    //alert('request submitted: ' + this.state.textbox);
    event.preventDefault();
    //this.sendTextbox();
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
   
    (function(d, s, id){
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement(s); js.id = id;
      js.src = "https://apis.google.com/js/platform.js?onload=googleSDKLoaded";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'google-jssdk'));
   
  }




  //wait 5 sec for DAWIN, then start real loading (should be complete by then though)
  //ffs fix this strings to an array and make a function to check it
  submitMainForm = () => {
    if (this.state.textbox == "request pool LOADED" ||
      this.state.textbox == "L O A D I N G . . . . . . " ||
      this.state.textbox == "S E N D I N G . . . . . . " ||
      this.state.textbox == "" ||
      this.state.textbox == "your request was successfully added to review pool :)") return;
    this.setState({ loading: true });
    
    this.updateChild({ loading: true });
    this.setState({ textboxToSend: this.state.textbox });
    this.setState({ textbox: "S E N D I N G . . . . . . " });
    setTimeout(() => { this.sendTextbox();  }, 1500);
    setTimeout(this.waitForSub(true, 0, 3000, 200), 200);
    


    //    setTimeout(this.loadingTextTimeFunc(this.state.loading,0,"loading...............", 5000), 100); 

  }
  ////



   waitForSub =  (isWaiting, time, maxTimeLim, interval) => {

    return () => {
        if (!isWaiting) {
          this.renderReqTableAll();
          return;
        }
        if(maxTimeLim<=time){return}
        time += interval;
        if(this.state.loading == false) {
          isWaiting = false;
        }

        setTimeout(this.waitForSub(isWaiting, time, maxTimeLim, interval), interval); 

    }   

  }

    //    setTimeout(this.loadingTextTimeFunc(this.state.loading,0,"loading...............", 5000), 100); 

    
  //  loadingTextTimeFunc =  (isWaiting, i, loadingTextString, minimumTimeLim) => {

  //   return () => {
  //       if (!isWaiting && minimumTimeLim<=0) {
  //         this.setState({textbox: loadingTextString});
  //         return;
  //       }
  //       minimumTimeLim -= 100;
  //       var textString = loadingTextString.slice(0, i) +'_'+ loadingTextString.slice(i+1, loadingTextString.length)
  //       this.setState({textbox: textString});
  //       if (i<loadingTextString.length){
  //         i++
  //       }
  //       else{
  //         i=0;
  //       }

  //       if(this.state.loading == false) {
  //         isWaiting = false;
  //       }

  //       setTimeout(this.loadingTextTimeFunc(isWaiting, i, loadingTextString, minimumTimeLim), 100); 

  //   }   

  // }



  sendTextbox() {

    console.log('sending')
    axios.post(
      '/api/sendTextbox',
      { data: this.state.textboxToSend, name: this.state.userbox, mail: this.state.mailbox }
    )
      .then((response) => {
        console.log(response.data.message);
        this.updateChild({ loading: false });
        this.setState({ loading: false });
        this.setState({ textbox: response.data.message });
        this.setState({ userbox: "" });
        this.setState({ mailbox: "" });
        setTimeout(() => { this.setState({ textbox: "" }); }, 2000);

      }, (error) => {
        this.setState({ textbox: "" });
        this.updateChild({ loading: false });
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
        this.setState({ userbox: profile.getGivenName().substring(0,7) });
        this.setState({ mailbox: profile.getEmail() });
        //YOUR CODE HERE
     
     
        }, (error) => {
        console.log("error with google login: "+ JSON.stringify(error, undefined, 2));
        });
     
    }

  //here is some ugly code until i get the serenity to learn how to do it properly:

  componentDidMount(){

    this.googleSDK();
    this.renderReqTableAll();
    

  }

  changeActiveButton(option){
    this.setState({ allTable: (option == "all" ? "success" : "secondary") });
    this.setState({ doneTable: (option == "done" ? "success" : "secondary") });
    this.setState({ todoTable: (option == "todo" ? "success" : "secondary") });
  }

  renderReqTableAll = () => {
    this.changeActiveButton("all");
    this.renderReqTable("all");
  }

  renderReqTableDone = () => {
    this.changeActiveButton("done");
    this.renderReqTable("done");
  }

  renderReqTableTodo = () => {
    this.changeActiveButton("todo");
    this.renderReqTable("todo");
  }

  renderReqTable = async (option) => {
    


    this.setState({ loading: true });
    this.updateChild({ loading: true });
    this.setState({ textboxToSend: this.state.textbox });
    this.setState({ textbox: "L O A D I N G . . . . . . " });
    var myTable = await this.DatatablePage(option);
    this.setState({ poolTable: myTable })
  }

  getReqPool = async () => {



    //this.updateChild({loading: false});
    var answer = await this.getReqPool2();
    // var returnString = "";
    // var tableBody = [];


    // for (var i = 0; i < answer.results.length; i++) {
    //   // returnString += answer.results[i].id + ") ";
    //   // returnString += answer.results[i].request + "\n\n";

    //   let done = answer.results[i].done;
    //   let reqStack = [];

    //   if (done) {
    //     reqStack.push(
    //       <s>{answer.results[i].request}</s>);
    //   } else {
    //     reqStack.push(answer.results[i].request);
    //   }

    //   tableBody.push(
    //     <tr key={answer.results[i].id}>
    //       <td>
    //         {answer.results[i].id}
    //       </td>
    //       <td>
    //         {reqStack}
    //       </td>
    //       <td>
    //         {answer.results[i].owner}
    //       </td>
    //       <td>
    //         {answer.results[i].date}
    //       </td>
    //     </tr>
    //   )
    // }
    // return tableBody;

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

  addKey = (obj) =>{
    var i;
    for (i = 0; i < obj.length; i++) {
    obj[i].key = i;
    }
  }


  DatatablePage = async (option) => {

    var rows
    if (option == "all"){
      const tRows = await this.getReqPool();
      rows = tRows.results;
      this.addKey(rows);
      this.setState({tableData: rows});
      }
      if (option == "todo"){
        rows = this.state.tableData.filter( request => request.done== false)
        }
      if (option == "done"){
        rows = this.state.tableData.filter( request => request.done== true) 
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
        )}
    }, {
      dataField: 'owner',
      text: 'Owner',
      sort: true
    }, {
      dataField: 'date',
      text: 'Date'
    }
    ];

   
    //this.setState({ tableData : rows }); 
    console.log(rows);
    const CaptionElement = () => <h3 style={{  textAlign: 'center', color: 'black' }}>Request Pool</h3>;
    this.setState({ textbox: "request pool LOADED" +(option == "done" ? " with COMPLETED filter" : "") +(option == "todo" ? " with TODO filter" : "") });
    this.updateChild({ loading: false });
    this.setState({ loading: false });


    setTimeout(() => {
      this.setState({
        textbox: ( //add these strings to an array and make a function ffs
          this.state.textboxToSend == "request pool LOADED" ||
          this.state.textboxToSend == "request pool LOADED with COMPLETED filter" ||
          this.state.textboxToSend == "request pool LOADED with TODO filter" ||
            this.state.textboxToSend == "L O A D I N G . . . . . . " ||
            this.state.textboxToSend == "S E N D I N G . . . . . . " ||
            this.state.textboxToSend == "your request was successfully added to review pool :)"
            ? "" : this.state.textboxToSend)
      });
    }, 1500);

    const customTotal = (from, to, size) => (
      <span className="react-bootstrap-table-pagination-total">
          &nbsp;&nbsp;Showing requests { from } to { to } out of { size }
      </span>
    );

    var  rowClasses = row => (rows[row.key].done ? "doneReq"
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
        //pagination={ paginationFactory(options) }
        caption={<CaptionElement />}
        rowClasses={rowClasses}
      />
    );
  }




  // renderReqTable2 = async () => {
  //   var tableBody = await this.getReqPool();
  //   let res = []
  //   res.push(
  //     <div>
  //       <h1 id='title'>Request Table</h1>
  //       <Table size="sm" bordered='true' id='requestTable' condensed="true" >
  //         <tbody>
  //           <tr>
  //             <th>ID</th>
  //             <th>Request</th>
  //             <th>Owner</th>
  //             <th>Date</th>
  //           </tr>
  //           {tableBody}
  //         </tbody>
  //       </Table>
  //     </div>
  //    )
  //   this.setState({ poolTable: res });
  //   this.setState({ textbox: "request pool LOADED" });
  //   this.updateChild({ loading: false });
  //   this.setState({ loading: false });


  //   setTimeout(()=>{this.setState({ textbox: ( //add these strings to an array and make a function ffs
  //     this.state.textboxToSend=="request pool LOADED" ||
  //     this.state.textboxToSend=="L O A D I N G . . . . . . " ||
  //     this.state.textboxToSend=="S E N D I N G . . . . . . " || 
  //     this.state.textboxToSend=="your request was successfully added to review pool :)"
  //     ? "" : this.state.textboxToSend ) });},1500);
  // }


  //bad func
  //   getReqPool = () =>{

  //     alert (this.getStoredRequests());
  //  }


  // getStoredRequestsPromise(){ //testing split callback

  //     console.log('asking server for stored requests')
  //       axios.get('/api/db')
  //       }

  //       getReqPool(){ //testing split callback - other half

  //         this.getStoredRequestsPromise().then((response) => {
  //               console.log(response.data);
  //             }, (error) => {
  //               console.log(error);
  //             });
  //             }





  //here is some ugly code until i get the serenity to learn how to do it properly: fublicate

  //  getStoredRequestsPromise(){ //testing split callback

  //   console.log('asking server for stored requests')
  //     axios.get('/api/db')
  //   }

  //   getReqPool = () =>{ //testing split callback - other half

  //     this.getStoredRequestsPromise().then((response) => {
  //     alert(response.data);
  //   }, (error) => {
  //     console.log(error);
  //   });
  //}



  /////////////////////END OF REALLY UGLY



  //backup:
  // getStoredRequests(){

  //   console.log('asking server for stored requests')
  //     axios.get('/api/db')
  //   .then((response) => {
  //     console.log(response.data);
  //   }, (error) => {
  //     console.log(error);
  //   });
  //   }












  render() {
    return (
      <div>
        <button className="loginBtn loginBtn--google" ref="googleLoginBtn">
                                        Login with Google
                                    </button>
      
      <div align="center">

        <form onSubmit={this.handleSubmit} >



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
          
          
          
          <Button type="submit" value="Submit" variant="danger">submit</Button> {' '}  <br/><br/><AwesomeComponent /><br />
          
          <Button size="sm"variant={this.state.allTable} onClick={this.renderReqTableAll} >Request pool</Button> &nbsp;
          <Button size="sm" variant={this.state.doneTable} onClick={this.renderReqTableDone} >COMPLETED</Button> &nbsp;
          <Button size="sm" variant={this.state.todoTable} onClick={this.renderReqTableTodo} >TODO</Button>
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













// export default class App extends Component {

//   constructor() {
//     super()
//     this.state = {
//       username: `BITCH`,
//       page: 0
//     }
//   }

//   async setUsername() {
//       const response = await fetch('/api/getUsername');
//       const userData = await response.json();
//       setTimeout(() => {
//         this.setState({username: userData.username, page: 1});
//       }, 2000)
//   }

//   componentDidMount() {
//     this.setUsername();
//     // const usernamePromise = fetch('/api/getUsername');
//     // usernamePromise.then((response) => response.json()).then((data) => console.log(data));

//     // const getPersonPromise = new Promise((resolve, reject) => {
//     //   setTimeout(() => {
//     //     const myObject = { name: "sgil", surname: "weiss" }
//     //     if (myObject.name === 'gil') {
//     //       reject()
//     //     }
//     //     else {
//     //       resolve(myObject)
//     //     }
//     //   }, 2000);
//     // });
//     // getPersonPromise.then((person) => console.log(person)).catch(() => console.log('rejected!'));
//   }

//   render() {
//       return this.state.page === 1 ? (
//       <div>
//     <h1>Hello {this.state.username}!</h1>
//       < img src = { Hardon } alt = "mordehai" width = "500" />
//       </div >
//     ) : (<div>
//       <h1>
//         LOADING
//       </h1>
//     </div>);
//   }


// }
