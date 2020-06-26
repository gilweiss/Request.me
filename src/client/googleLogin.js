import React from 'react';

// button type, active, changing state function

export class GoogleLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }


  componentDidMount() {
    this.googleSDK();
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
 

  prepareLoginButton = () => {


    //console.log(this.refs.googleLoginBtn);

    this.auth2.attachClickHandler(this.refs.googleLoginBtn, {},
      (googleUser) => {


        let profile = googleUser.getBasicProfile();
        // console.log('Token || ' + googleUser.getAuthResponse().id_token);
        // console.log('ID: ' + profile.getId());
        // console.log('Name: ' + profile.getName());
        // console.log('Image URL: ' + profile.getImageUrl());
        // console.log('Email: ' + profile.getEmail());
        var userName = profile.getGivenName().substring(0, 7);
        var address= profile.getEmail();
        this.props.fillBoxesFunction(userName, address);


      }, (error) => {
        console.log("error with google login: " + JSON.stringify(error, undefined, 2));
      });

  }

  render() {
    return (

      <div className='google-log-in'>
          <button className="loginBtn loginBtn--google" ref="googleLoginBtn">
          Login with Google
                                    </button>
      </div>
    )
  }
}