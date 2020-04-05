import React, { Component } from 'react';
import './app.css';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { AwesomeComponent } from './spnr';
import { updateStateLDR } from './spnr';


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
      textboxToSend: ''
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

  //wait 5 sec for DAWIN, then start real loading (should be complete by then though)
  submitMainForm = () => {
    this.setState({ loading: true });
    this.updateChild({ loading: true });
    this.setState({ textboxToSend: this.state.textbox });
    this.setState({ textbox: "S E N D I N G . . . . . . " });
    setTimeout(()=>{this.sendTextbox();},2000);
    
    
    //    setTimeout(this.loadingTextTimeFunc(this.state.loading,0,"loading...............", 5000), 100); 

  }
  ////


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
        setTimeout(()=>{this.setState({ textbox: "" });},5000);
        
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



  //here is some ugly code until i get the serenity to learn how to do it properly:


  renderReqTable =  () => {
    this.setState({ loading: true });
    this.updateChild({ loading: true });
    this.setState({ textbox: "L O A D I N G . . . . . . " });
    setTimeout(()=>{this.renderReqTable2();},1500);
  }

  getReqPool = async () => {

    

    //this.updateChild({loading: false});
    var answer = await this.getReqPool2();
    // var returnString = "";
    var tableBody = [];


    for (var i = 0; i < answer.results.length; i++) {
      // returnString += answer.results[i].id + ") ";
      // returnString += answer.results[i].request + "\n\n";

      let done = answer.results[i].done;
      let reqStack = [];

      if (done) {
        reqStack.push(
          <s>{answer.results[i].request}</s>);
      } else {
        reqStack.push(answer.results[i].request);
      }

      tableBody.push(
        <tr key={answer.results[i].id}>
          <td>
            {answer.results[i].id}
          </td>
          <td>
            {reqStack}
          </td>
          <td>
            {answer.results[i].owner}
          </td>
        </tr>
      )
    }
    return tableBody;
  }

  getReqPool2 = () => {

    console.log('asking server for stored requests')
    return new Promise(function (resolve, reject) {
      axios.get('/api/db')
        .then((response) => {
          console.log(response.data);
          resolve(response.data);
        }, (error) => {
          console.log(error);
        });
    });
  }





  renderReqTable2 = async () => {
    var tableBody = await this.getReqPool();
    let res = []
    res.push(
      <div>
        <h1 id='title'>Request Table</h1>
        <Table size="sm" bordered='true' id='requestTable' condensed="true" >
          <tbody>
            <tr>
              <th>ID</th>
              <th>Request</th>
              <th>Owner</th>
            </tr>
            {tableBody}
          </tbody>
        </Table>
      </div>
    )
    this.setState({ poolTable: res });
    this.setState({ textbox: "request pool LOADED" });
    this.updateChild({ loading: false });
    this.setState({ loading: false });

  
    setTimeout(()=>{this.setState({ textbox: "" });},2000);
  }


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
      <div align="center">

        <form onSubmit={this.handleSubmit} >



          <h1>Ask for stuff</h1>
          <br />

          <textarea rows="6" cols="50" placeholder="Please be reasonable with your request" value={this.state.textbox} onChange={this.handleChangeTB} />

          <br />

          <label value=" "><b> Request owner: &nbsp;&nbsp; </b> </label>
          <input type="text" id="name" name="fname" placeholder="your name" value={this.state.userbox} onChange={this.handleChangeUB} />
          <br />
          <label value=" "><b> EMAIL to update about your request : &nbsp;&nbsp; </b> </label>
          <input type="text" id="mail" name="fmail" placeholder="@optional field" value={this.state.mailbox} onChange={this.handleChangeMB} />
          <br />

          <div><AwesomeComponent /></div>
          <Button type="submit" value="Submit" variant="danger">submit</Button> {' '}
          <Button variant="warning" onClick={this.renderReqTable} >request pool table</Button>
        </form>
        <br /> <br />
        {this.state.poolTable}


        <p id="hidden button, you can also copy paste the suffix" hidden onClick={() => this.getStoredRequests()} >/api/getRequests</p>
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
