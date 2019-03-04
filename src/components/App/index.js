import React, { Component } from 'react';
import logo from './logo.svg';
import './App.scss';
import PropTypes from 'prop-types';
import firebase from "firebase";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import Button from '@material-ui/core/Button';

import Track from "../Track";
import Plan from "../Plan";

import {Helmet} from 'react-helmet';
import {
  Route,
  NavLink,
  HashRouter
} from "react-router-dom";



firebase.initializeApp({
  apiKey: "AIzaSyCju6D0x2H9-NbekJS_1TLkaTmke7DuaSQ",
  authDomain: "growiy.firebaseapp.com",
  databaseURL: "https://growiy.firebaseio.com",
  projectId: "growiy"
})

class App extends Component {
  constructor(props)
  {
    super(props)
    this.state = {
      isSignedIn: false,
      user: null,
      rooms: {},
      action: 'track'
    }
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({isSignedIn:!!user, user:user});
    });
  }

  uiConfig = {
    signInFlow: "popup",
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      signInSuccessWithAuthResult: () => false
    }
  }

  uiConfig = {
    signInFlow: "popup",
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      signInSuccessWithAuthResult: () => false
    }
  }

  render() {
    if(this.state.isSignedIn && this.state.action == 'track'){
      return (
        <div class="app">
          <Helmet>
                <style>{'body { background-color: lightgreen; }'}</style>
          </Helmet>
          <HashRouter>
            <div>
              <NavLink to="/Plan"><Button color='tertiary'>Plan</Button></NavLink>
              <NavLink to="/Track"><Button color='tertiary'>Track</Button></NavLink>
              <div className="content">
                <Route
                  path='/Plan'
                  render={(props) => <Plan {...props} />}
                />               
                <Route
                  path='/Track'
                  render={(props) => <Track {...props} uid={this.state.user.uid} rooms={this.state.rooms} />}
                />
              </div>
            </div>
          </HashRouter>
          <Button variant="contained" color="tertiary" onClick={()=>firebase.auth().signOut()}>
              Sign Out!
          </Button>
        </div>
      );
    } else {
      return (
        <div class="login">
          <div class="fire_login">
            <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()}/>
          </div>
        </div>
      )
    }
  }
}

export default App;
