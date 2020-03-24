import React, { Component } from 'react';
import './app.css';
import Hardon from './react.png';

export default class App extends Component {
  
  constructor() {
    super()
    this.state = {
      username: `BITCH`,
      page: 0
    }
  }

  async setUsername() {
      const response = await fetch('/api/getUsername');
      const userData = await response.json();
      setTimeout(() => {
        this.setState({username: userData.username, page: 1});
      }, 2000)
  }

  componentDidMount() {
    this.setUsername();
    // const usernamePromise = fetch('/api/getUsername');
    // usernamePromise.then((response) => response.json()).then((data) => console.log(data));

    // const getPersonPromise = new Promise((resolve, reject) => {
    //   setTimeout(() => {
    //     const myObject = { name: "sgil", surname: "weiss" }
    //     if (myObject.name === 'gil') {
    //       reject()
    //     }
    //     else {
    //       resolve(myObject)
    //     }
    //   }, 2000);
    // });
    // getPersonPromise.then((person) => console.log(person)).catch(() => console.log('rejected!'));
  }

  render() {
      return this.state.page === 1 ? (
      <div>
    <h1>Hello {this.state.username}!</h1>
      < img src = { Hardon } alt = "mordehai" width = "500" />
      </div >
    ) : (<div>
      <h1>
        LOADING
      </h1>
    </div>);
  }

  
}
