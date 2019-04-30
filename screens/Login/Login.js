import React, { Component } from 'react';
import { Text, TextInput } from 'react-native';
import { Form, Item, Input, Label, Button } from 'native-base';
import * as firebase from "firebase/app";
import "firebase/auth";
import styles from './styles';

const {
    containerStyle,
} = styles;



class LoginCompoenent extends Component {
  static navigationOptions = {
    title: 'Login',
  };

  constructor(props) {
    super(props);
    this.state = { email: '', password: '', error: '' };
  }

  submitLogin = () => {
    this.setState({ error: '', loading: true })
    const { email, password } = this.state;
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(this.onLoginSuccess.bind(this))
      .catch(() => {
        firebase.auth().createUserWithEmailAndPassword(email, password)
          .then(this.onLoginSuccess.bind(this))
          .catch((error) => {
            alert(error);
            let errorCode = error.code
            let errorMessage = error.message;
            if (errorCode == 'auth/weak-password') {
              this.onLoginFailure.bind(this)('Weak password!')
            } else {
              this.onLoginFailure.bind(this)(errorMessage)
            }
            return;
          });
      });
  }


    onLoginSuccess() {
      this.setState({
        email: '', password: '', error: '', loading: false
      });
      this.props.navigation.navigate('Main');
    }

    onLoginFailure(errorMessage) {
      this.setState({ error: errorMessage, loading: false })
    }


  render() {
    return (
            <Form style = {containerStyle}>
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
                <Button block onPress={this.submitLogin}>
                    <Text>Login</Text>
                </Button>
            </Form>


    );
  }
}

export { LoginCompoenent };
export const Login = LoginCompoenent
