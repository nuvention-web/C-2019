import React from "react";
import { GiftedChat } from "react-native-gifted-chat";
import {
  Text,
  TextInput,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { ChatManager, TokenProvider } from "@pusher/chatkit-client";
import { List, ListItem } from "react-native-elements";

import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import { db } from "../src/config";

const axios = require("axios");
const querystring = require("querystring");

const CHATKIT_TOKEN_PROVIDER_ENDPOINT =
  "https://us1.pusherplatform.io/services/chatkit_token_provider/v1/a97ef8a7-e054-49cf-abc5-cfd2f278baf3/token"; // 'PUSHER_TOKEN_ENDPOINT';
const CHATKIT_INSTANCE_LOCATOR = "v1:us1:a97ef8a7-e054-49cf-abc5-cfd2f278baf3"; //'PUSHER_INSTANCE_LOCATOR';
const growiy = "growiydotcom@gmail.com";
const CHATKIT_CONSULTANT = growiy;
let CHATKIT_USER_NAME = ""; //'growiydotcom@gmail.com' ;

const chatServer =
  "https://us-central1-growiy-37e6e.cloudfunctions.net/getRooms";

export default class ChatRoomList extends React.Component {
  static navigationOptions = {
    title: "Chats"
  };

  constructor(props) {
    super(props);

    this.state = {
      roomIds: [],
      isLoading: true,
    };

    CHATKIT_USER_NAME = firebase.auth().currentUser.email;
    console.log("Username " + CHATKIT_USER_NAME);
    this.getRooms();
  }

  getRooms() {
    let that = this;
    that.setState({ isLoading: true });
    let newRoomIds = [];
    axios
      .post(
        chatServer,
        querystring.stringify({
          id: CHATKIT_USER_NAME
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }
      )
      .then(function(response) {
        that.setState({ isLoading: true });
        newRoomIds = that.state.roomIds;
        response = response["data"];
        //alert("61\n" + (JSON.stringify(response)));
        let numRooms = response.length;
        if (numRooms <= 0) {
          alert("Error: No chats found");
        }
        while (numRooms > 0) {
          let id = response[numRooms - 1]["id"];
          let user = response[numRooms - 1]["created_by_id"];
          newRoomIds.push({ key: user, roomId: id });
          numRooms = numRooms - 1;
        }

        that.setState({ roomIds: newRoomIds }, function() {
          that.setState({ isLoading: false });
        });
      })

      

      .catch(err => {
        console.log(JSON.stringify(err));
      });

      that.setState({ isLoading: false });

  }

  componentDidMount() {
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
      })
      .catch(err => {
        alert("error: " + err);
      });
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }

    if (
      CHATKIT_USER_NAME != growiy &&
      CHATKIT_USER_NAME != "" &&
      this.state.roomIds.length == 1
    ) {
      console.log("skipping chat room list screeen");
      this.props.navigation.navigate("Consulting", {
        roomID: this.state.roomIds[0]["roomId"],
        userID: this.state.roomIds[0]["key"]
      });
    }

      return (
        <View minHeight="100%">
          <FlatList
            data={this.state.roomIds}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate("Consulting", {
                    roomID: item.roomId,
                    userID: item.key
                  })
                }
              >
                <ListItem
                  topDivider="true"
                  bottomDivider="true"
                  title={item.key}
                />
              </TouchableOpacity>
            )}
          />
        </View>
      );
  }
}
