import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { ChatManager, TokenProvider } from '@pusher/chatkit-client';

import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import { db } from '../src/config';

const CHATKIT_TOKEN_PROVIDER_ENDPOINT = 'https://us1.pusherplatform.io/services/chatkit_token_provider/v1/a97ef8a7-e054-49cf-abc5-cfd2f278baf3/token'; // 'PUSHER_TOKEN_ENDPOINT';
const CHATKIT_INSTANCE_LOCATOR = 'v1:us1:a97ef8a7-e054-49cf-abc5-cfd2f278baf3'; //'PUSHER_INSTANCE_LOCATOR';
const CHATKIT_ROOM_ID = '20687595';
const CHATKIT_CONSULTANT = '1234567';
let CHATKIT_USER_NAME = '2948752' ;





export default class MyChat extends React.Component {


  static navigationOptions = {
    title: 'Consulting',
  };


  state = {
    messages: [],
    oldMessages: [],
    init: 0,
    loadEarlier: true,
    isLoadingEarlier: false,
  };




  onLoadEarlier = () => {


    this.setState((previousState) => {
      return {
        isLoadingEarlier: true,
      };
    });

    setTimeout(() => {
      this.setState((previousState) => {
        return {
          messages: GiftedChat.prepend(previousState.messages,this.state.oldMessages),
          loadEarlier: false,
          isLoadingEarlier: false,
          init: 1,
        };
      });
    }, 1000); // simulating network
  };


  componentDidMount() {

    CHATKIT_USER_NAME = firebase.auth().currentUser.email;

    const defaultMessage = {
      _id: CHATKIT_USER_NAME,
      text: "Welcome to Growiy consulting, how can we help you?",
      createdAt:  new Date(),
      user: {
        _id: CHATKIT_CONSULTANT,
        name: "React Native",
        avatar: require('../assets/images/growiy-logo-round.png')
      }
    };

    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages,defaultMessage),
    }));

    const tokenProvider = new TokenProvider({
      url: CHATKIT_TOKEN_PROVIDER_ENDPOINT,
    });

    const chatManager = new ChatManager({
      instanceLocator: CHATKIT_INSTANCE_LOCATOR,
      userId: CHATKIT_USER_NAME,
      tokenProvider: tokenProvider,
    });

    chatManager
    .connect()
    .then(currentUser => {
      this.currentUser = currentUser;
      this.currentUser.subscribeToRoom({
        roomId: CHATKIT_ROOM_ID,
        hooks: {
          onMessage: this.onReceive,
        },
      });
    })
    .catch(err => {
      console.log(err);
    });
  }

  onReceive = data => {
    const { id, senderId, text, createdAt } = data;
    const incomingMessage = {
      _id: id,
      text: text,
      createdAt: new Date(createdAt),
      user: {
        _id: senderId,
        name: senderId,
        avatar: require('../assets/images/growiy-logo-round.png'),
      },
    };

    if (this.state.init == 0){
      this.setState(previousState => ({
        oldMessages: GiftedChat.prepend(previousState.oldMessages, incomingMessage),
      }));
    }
    else{
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, incomingMessage),
      }));
    }

  };

  onSend = (messages = []) => {
    this.setState(previousState => ({
      init: 1,
    }));

    messages.forEach(message => {
      this.currentUser
      .sendMessage({
        text: message.text,
        roomId: CHATKIT_ROOM_ID,
      })
      .then(() => {})
      .catch(err => {
        console.log(err);
      });
    });
  };


  render() {


    return (
      <GiftedChat
      messages={this.state.messages}
      onSend={messages => this.onSend(messages)}
      loadEarlier={this.state.loadEarlier}
      onLoadEarlier={this.onLoadEarlier}
      isLoadingEarlier={this.state.isLoadingEarlier}
      user={{
        _id: CHATKIT_USER_NAME ,
      }}
      />
    );
  }
}
