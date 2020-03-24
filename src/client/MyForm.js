import React, { Component } from 'react';
import './app.css';
import axios from 'axios';


import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";


class MyForm extends React.Component {
  constructor(props) {
     super(props);
     this.state = {
      textbox: 'Please be reasonable with your request'
     };
     this.handleSubmit = this.handleSubmit.bind(this);
     this.handleChange = this.handleChange.bind(this);
   }

   testButton = () =>{
     
      alert("test");
   }
 
   handleChange(event) {
     this.setState({textbox: event.target.value});
   }
 
   handleSubmit(event) {
     //alert('request submitted: ' + this.state.textbox);
     event.preventDefault();
     this.sendTextbox();
    
     
   }
 
   

   sendTextbox(){
     
    console.log('sending')
      axios.post(
        '/api/sendTextbox',
       {data : this.state.textbox}
       )
    .then((response) => {
      console.log(response);
    }, (error) => {
      console.log(error);
    });
    }

    getStoredRequests(){
     
      console.log('asking server for stored requests')
        axios.get('/api/getRequests')
      .then((response) => {
        console.log(response.data);
      }, (error) => {
        console.log(error);
      });
      }
  

   render() {
     return (
       <div align="center">
       <form onSubmit={this.handleSubmit} >
         
           <h1>Ask for stuff</h1>
           
           <textarea rows="6" cols="50" value={this.state.textbox} onChange={this.handleChange}/>
         
         <br/><br/>
         <input type="submit" value="Submit"/>
       </form>
       <br/> <br/>
       <button onClick={() =>this.getStoredRequests()} >get all past requests</button>
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
