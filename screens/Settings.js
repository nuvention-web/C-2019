import React, { Component } from 'react';
import { Text, TextInput, View } from 'react-native';
import { Button } from 'native-base';
import * as firebase from "firebase/app";
import "firebase/auth";
import { Dimensions } from 'react-native';

styles =  {
  flex: 1,
  width: Dimensions.get('window').width * 1,
  justifyContent: "center",
  alignItems: "center",
}


export default class Settings extends Component {
  static navigationOptions = {
    title: 'Settings',
  };

  constructor(props) {
    super(props);
    this.state = { };
  };

  signOutUser = async () => {
    try {
        await firebase.auth().signOut();
        this.props.navigation.navigate('Login');

    } catch (e) {
        console.log(e);
    }
}

  render() {
    return (
      <View>
      <Button style = {{margin: 10}} block onPress={this.signOutUser}>
      <Text>Log out</Text>
      </Button>
      </View>
    );
  };
}
