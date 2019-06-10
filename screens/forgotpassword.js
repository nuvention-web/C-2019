import React, {Component} from 'react';
import {Text, TextInput, View} from 'react-native';
import { Form, Item, Input, Label, Button } from 'native-base';
import * as firebase from "firebase/app";
import "firebase/auth";
import {Dimensions} from 'react-native';

styles = {
  flex: 1,
  width: Dimensions.get('window').width * 1,
  justifyContent: "center",
  alignItems: "center",
}


export default class Settings extends Component {
  static navigationOptions = {
    title: 'Password Reset',
  };

  constructor(props) {
    super(props);
    this.state = {
      email: "",
    };
  };

  
  forgotPassword = async () => {
    let yourEmail = this.state.email;

    try {
        await firebase.auth().sendPasswordResetEmail(yourEmail);
        alert("Email sent")
        this.props.navigation.navigate('Login');

    } catch (e) {
        alert('Please check your email is entered correctly');
        console.log(e);
    }
  };

  render() {
    return ( 
      <View style = {{
          justifyContent: 'center', 
          alignItems: 'center',
          flex: 1,
      }}>
        <Item>
          <Input label = "Email"
          placeholder = "Email"
          value = {
            this.state.email
          }
          secureTextEntry = {
            false
          }
          onChangeText = {
            email => this.setState({
              email
            })
          }
          />
        </Item>
      <Button style = {
        {
          margin: 10,
        }
      }
      block onPress = {
        this.forgotPassword
      } >
      <Text> Email Reset </Text> 
      </Button> 
      </View>
    );
  };
}