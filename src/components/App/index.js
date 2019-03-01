import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import PropTypes from 'prop-types';
import firebase from "firebase";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import Button from '@material-ui/core/Button';

import Rooms from "../Rooms";
import {Helmet} from 'react-helmet';


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
                <style>{'body { background-color: lightblue; }'}</style>
          </Helmet>
          <Button color='primary'>Track</Button>
          <Button >Plan</Button>
          <Rooms uid={this.state.user.uid} rooms={this.state.rooms} /> <br/>
          <Button variant="contained" color="primary" onClick={()=>firebase.auth().signOut()}>
              Sign Out!
          </Button>
        </div>
      );
    } else if (this.state.isSignedIn && this.state.action == 'plan') {
      return (
        <div class="app">
          <Helmet>
                <style>{'body { background-color: lightblue; }'}</style>
          </Helmet>
          <Button color='primary'>Track</Button>
          <Button color='primary'>Plan</Button>
          <Button variant="contained" color="primary" onClick={()=>firebase.auth().signOut()}>
              Sign Out!
          </Button>
        </div>
      );
    } else {
      return (
        <div>
            <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()}/>
        </div>
      )
    }
  }
}

export default App;
