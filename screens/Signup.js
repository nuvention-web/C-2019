import React, { Component } from 'react';
import { Text, TextInput } from 'react-native';
import { Form, Item, Input, Label, Button } from 'native-base';
import * as firebase from "firebase/app";
import "firebase/auth";
import { Dimensions } from 'react-native';
const axios = require("axios");
const querystring = require("querystring");
const xhr = require("xhr");



const chatServer = "http://localhost:3001/users";

styles =  {
  flex: 1,
  width: Dimensions.get('window').width * 1,
  justifyContent: "center",
  alignItems: "center",
}


export default class Signup extends Component {
  static navigationOptions = {
    title: 'Signup',
  };

  constructor(props) {
    super(props);
    this.state = { email: '', password: '', error: '' };
  }

  submitSignup = () => {
    this.setState({ error: '', loading: true })
    const { email, password } = this.state;

    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(this.onSignupSuccess.bind(this))
    .catch((error) => {
      alert(error);
      let errorCode = error.code
      let errorMessage = error.message;
      if (errorCode == 'auth/weak-password') {
        this.onSignupFailure.bind(this)('Weak password!')
      } else {
        this.onSignupFailure.bind(this)(errorMessage)
      }
      return;
    });


  };

  onSignupSuccess() {

    fetch('https://www.google.com/').then((response) => alert(JSON.stringify(response.json())));



    axios.get(chatServer).then((response) => alert(response.body));

    // axios.post(chatServer,
    //   querystring.stringify({
    //     id: 'abcd',
    //     name: '1235',
    //   }), {
    //     headers: {
    //       "Content-Type": "application/x-www-form-urlencoded"
    //     }
    //   }).then(function(response) {
    //     alert(response.body);
    //   });
    //
    //   fetch(chatServer, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/x-www-form-urlencoded"
    //     },
    //     body: querystring.stringify({
    //         id: 'abcd',
    //         name: '1235',
    //       }),
    //     }).then(response => { alert(response.body); });


    var data = "id=kylied&name=kylied";

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        console.log(this.responseText);
      }
    });


      // this.setState({
      //   email: '', password: '', error: '', loading: false
      // });
    //  this.props.navigation.navigate('Main');
    }

    onSignupFailure(errorMessage) {
      this.setState({ error: errorMessage, loading: false })
    }

    onLoginClick = () => {
      this.props.navigation.navigate('Login');
    }


    render() {
      return (
        <Form style = {styles}>
        <Text style = {{fontSize: 30, fontWeight: "bold", color: "green"}}>
        Growiy
        </Text>
        <Item last>
        <Input
        label="Email"
        placeholder="Email"
        value={this.state.email}
        secureTextEntry={false}
        onChangeText={email => this.setState({ email })}  />
        </Item>
        <Item last>
        <Input
        secureTextEntry={true}
        value={this.state.password}
        onChangeText={password => this.setState({ password })}
        placeholder="Password"
        label="Password"
        />
        </Item>
        <Button style = {{margin: 10}} block onPress={this.onSignupSuccess}>
        <Text>Signup</Text>
        </Button>
        <Button style = {{margin: 10}} block onPress={this.onLoginClick}>
        <Text>Have an account? Login</Text>
        </Button>
        </Form>


      );
    }

  }
