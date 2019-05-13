import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { Text, TextInput, View, FlatList } from 'react-native';
import { ChatManager, TokenProvider } from '@pusher/chatkit-client';

import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import { db } from '../src/config';

const axios = require("axios");
const querystring = require("querystring");



const CHATKIT_TOKEN_PROVIDER_ENDPOINT = 'https://us1.pusherplatform.io/services/chatkit_token_provider/v1/a97ef8a7-e054-49cf-abc5-cfd2f278baf3/token'; // 'PUSHER_TOKEN_ENDPOINT';
const CHATKIT_INSTANCE_LOCATOR = 'v1:us1:a97ef8a7-e054-49cf-abc5-cfd2f278baf3'; //'PUSHER_INSTANCE_LOCATOR';
const CHATKIT_CONSULTANT = 'growiydotcom@gmail.com';
let CHATKIT_USER_NAME = '' ;

const chatServer = 'https://us-central1-growiy-37e6e.cloudfunctions.net/getRooms';


export default class ChatRoomList extends React.Component {


  static navigationOptions = {
    title: 'ChatRoomList',
  };


  state = {
    chats: [],
  };

  getRooms = () =>  {
    axios.post(chatServer,
      querystring.stringify({
        id: CHATKIT_USER_NAME,
      }), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }).then(function(response) {
        response = response['data'];
        //alert(JSON.stringify(response));
        numRooms = response.length;
        if (numRooms <= 0){
          alert("No chats found");
        }
        while(numRooms > 0){
          let id = response[numRooms-1]["id"];
          alert("54 " + JSON.stringify(roomIds));
          roomIds.push({key: id});
          alert("56 " + JSON.stringify(roomIds));
          alert(id);
          numRooms = numRooms - 1;
        }
      }).catch(err => {
        alert(err.error);
      });
    };



    componentDidMount() {
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
      })
      .catch(err => {
        alert(err);
      });


    }



    render() {
      CHATKIT_USER_NAME = firebase.auth().currentUser.email;

      alert("calling room ids 94");
      var roomIds = [];
      this.getRooms;
      alert("95" + JSON.stringify(roomIds));
      return (
        <FlatList
          data={[{key: 'a'}, {key: 'b'}]}
          renderItem={({item}) => <Text>{item.key}</Text>}
        />
      );
    }
  }
