import React, { Component } from 'react';
import { Text, TextInput } from 'react-native';
import { Form, Item, Input, Label, Button } from 'native-base';
import * as firebase from "firebase/app";
import "firebase/auth";
import { Dimensions } from 'react-native';

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
    this.setState({
      email: '', password: '', error: '', loading: false
    });
    this.props.navigation.navigate('Main');
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
      <Button style = {{margin: 10}} block onPress={this.submitSignup}>
      <Text>Signup</Text>
      </Button>
      <Button style = {{margin: 10}} block onPress={this.onLoginClick}>
      <Text>Have an account? Login</Text>
      </Button>
      </Form>


    );
  }

}
