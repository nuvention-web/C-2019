import React, { Component } from 'react';
import { Text } from 'react-native';
import { Form, Item, Input, Label, Button } from 'native-base';

import styles from './styles';

const {
    containerStyle,
} = styles;

class LoginCompoenent extends Component {
  static navigationOptions = {
    title: 'Login',
  };

  render() {
    return (
            <Form style = {containerStyle}>
                <Text style = {{fontSize: 30, fontWeight: "bold", color: "green"}}>
                    Growiy
                </Text>
                <Item last>
                    <Input placeholder="Username" />
                </Item>
                <Item last>
                    <Input placeholder="Password" />
                </Item>
                <Button block onPress={() => this.props.navigation.navigate('Main')}>
                    <Text>Login</Text>
                </Button>
            </Form>


    );
  }
}

export { LoginCompoenent };
export const Login = LoginCompoenent
