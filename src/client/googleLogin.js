import React from 'react';
import { connect } from 'react-redux'             //for redux
import { setUser, disconnectUser } from './actions'   //TODO: later add disconnectUser
import { getUserLikesFromServer } from './serverUtils';

// button type, active, changing state function

class ConnectedGoogleLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
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
    this.auth2.attachClickHandler(this.refs.googleLoginBtn, {},
      (googleUser) => {
        let profile = googleUser.getBasicProfile();
        //this.props.dispatch(setUser(profile.getId()))

        

        var userName = profile.getGivenName().substring(0, 14);
        this.setState({ name: profile.getGivenName() })
        var userEmail = profile.getEmail();
        this.props.dispatch(setUser(profile.getId(), userName, userEmail))
        this.props.fillBoxesFunction(userName, userEmail);
      }, (error) => {
        console.log("error with google login: " + JSON.stringify(error, undefined, 2));
      });

  }


  logout = () => {

    this.props.dispatch(disconnectUser());
    this.setState({ name: "" });
    this.props.fillBoxesFunction("", "");
    this.googleSDK();

  }


  render() {
    return (
      <div className='google-log-in'>
        <div>
          <button className={this.props.user.id === 0 ? "loginBtn loginBtn--google" : "loginBtn loginBtn--google-hidden"} ref="googleLoginBtn">
            Login with Google
          </button>
        </div>
        {this.props.user.id !== 0 ?
          <button className="loginBtn loginBtn--google" onClick={() => this.logout()}>
            Logout ({this.state.name})
        </button>
          : ""
        }
      </div>
    )
  }
}


const mapStateToProps = state => {
  return { user: state.user }
}

const GoogleLogin = connect(
  mapStateToProps
)(ConnectedGoogleLogin);


export default GoogleLogin;