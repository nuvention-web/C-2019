import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { GiftedChat } from "react-native-gifted-chat";

export default class ConsultingScreen extends React.Component {
  state = {
    messages: []
  };

  componentWillMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: "Welcome to Growiy consulting, how can we help you?",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "React Native",
            avatar: require('../assets/images/growiy-logo-round.png')
          }
        }
      ]
    });
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }));
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: 1
        }}
      />
    );
  }
}
