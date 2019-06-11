import React from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { ChatManager, TokenProvider } from "@pusher/chatkit-client";

import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import { db } from "../src/config";

const CHATKIT_TOKEN_PROVIDER_ENDPOINT =
  "https://us1.pusherplatform.io/services/chatkit_token_provider/v1/a97ef8a7-e054-49cf-abc5-cfd2f278baf3/token"; // 'PUSHER_TOKEN_ENDPOINT';
const CHATKIT_INSTANCE_LOCATOR = "v1:us1:a97ef8a7-e054-49cf-abc5-cfd2f278baf3"; //'PUSHER_INSTANCE_LOCATOR';
var CHATKIT_ROOM_ID = "";
var growiy = "growiydotcom@gmail.com";
var CHATKIT_CONSULTANT = growiy;
var CHATKIT_USER_NAME = "";

export default class MyChat extends React.Component {
  static navigationOptions = {
    title: "Consulting"
  };

  constructor(props) {
    super(props);
    CHATKIT_ROOM_ID = this.props.navigation.state.params["roomID"];
    this.state = {
      messages: [],
      oldMessages: [],
      init: 0,
      loadEarlier: true,
      isLoadingEarlier: false
    };
  }

  

  onLoadEarlier = () => {
    this.setState(previousState => {
      return {
        isLoadingEarlier: true
      };
    });

    setTimeout(() => {
      this.setState(previousState => {
        return {
          messages: GiftedChat.append(
            previousState.messages,
            this.state.oldMessages
          ),
          loadEarlier: false,
          isLoadingEarlier: false,
          init: 1
        };
      });
    }, 1000); // simulating network
    // this.setState(previousState => ({
    //   oldMessages: this.sortEntries(this.state.oldMessages)
    // }));
    

  };

  dateToInt = (date) => {
    var dateVal = parseInt(date.substring(0, 4)) * 10000;
    dateVal += parseInt(date.substring(5, 7)) * 100;
    dateVal += parseInt(date.substring(8, 10));
    return dateVal.toString();
  };

  sortEntries = (data) => {
    return data.sort(function(a, b) {
      console.log(this.dateToInt(a["time"]));
      aVal = this.dateToInt(a["time"]);
      bVal = this.dateToInt(b["time"]);
      if (aVal > bVal) {
        return -1;
      } else {
        return 1;
      }
    });
  }



  componentDidMount() {
    CHATKIT_USER_NAME = firebase.auth().currentUser.email;

    if (CHATKIT_USER_NAME == growiy) {
      CHATKIT_CONSULTANT = this.props.navigation.state.params["userID"];
    }

    const defaultMessage = {
      _id: CHATKIT_USER_NAME,
      text: "Welcome to Growiy consulting, how can we help you?",
      createdAt: new Date(),
      user: {
        _id: growiy,
        name: "React Native",
        avatar: require("../assets/images/growiy-logo-round.png")
      }
    };

    //  if (CHATKIT_USER_NAME != 'growiydotcom@gmail.com'){
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, defaultMessage)
    }));
    //}

    const tokenProvider = new TokenProvider({
      url: CHATKIT_TOKEN_PROVIDER_ENDPOINT
    });

    const chatManager = new ChatManager({
      instanceLocator: CHATKIT_INSTANCE_LOCATOR,
      userId: CHATKIT_USER_NAME,
      tokenProvider: tokenProvider
    });

    chatManager
      .connect()
      .then(currentUser => {
        this.currentUser = currentUser;
        this.currentUser.subscribeToRoom({
          roomId: CHATKIT_ROOM_ID,
          hooks: {
            onMessage: this.onReceive
          }
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
        avatar: require("../assets/images/growiy-logo-round.png")
      }
    };

    if (this.state.init == 0) {
      this.setState(previousState => ({
        oldMessages: GiftedChat.prepend(
          previousState.oldMessages,
          incomingMessage
        )
      }));
    } else {
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, incomingMessage)
      }));
    }
  };
  onSend = (messages = []) => {
    this.setState(previousState => ({
      init: 1
    }));

    messages.forEach(message => {
      this.currentUser
        .sendMessage({
          text: message.text,
          roomId: CHATKIT_ROOM_ID
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
          _id: CHATKIT_USER_NAME
        }}
      />
    );
  }
}
