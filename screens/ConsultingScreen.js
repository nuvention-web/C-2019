import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { ChatManager, TokenProvider } from '@pusher/chatkit-client';

const CHATKIT_TOKEN_PROVIDER_ENDPOINT = 'https://us1.pusherplatform.io/services/chatkit_token_provider/v1/a97ef8a7-e054-49cf-abc5-cfd2f278baf3/token'; // 'PUSHER_TOKEN_ENDPOINT';
const CHATKIT_INSTANCE_LOCATOR = 'v1:us1:a97ef8a7-e054-49cf-abc5-cfd2f278baf3'; //'PUSHER_INSTANCE_LOCATOR';
const CHATKIT_ROOM_ID = '20687595';
const CHATKIT_USER_NAME = '2948752';
const CHATKIT_CONSULTANT = '1234567';

export default class MyChat extends React.Component {
  state = {
    messages: [],

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
              messages: GiftedChat.prepend(previousState.messages, earlierMessages),
              loadEarlier: false,
              isLoadingEarlier: false,
            };
          });
      }, 1000); // simulating network
    };


  componentDidMount() {

    this.setState({
      messages: [
        {
          _id: CHATKIT_USER_NAME,
          text: "Welcome to Growiy consulting, how can we help you?",
          createdAt:  new Date(),
          user: {
            _id: CHATKIT_CONSULTANT,
            name: "React Native",
            avatar: require('../assets/images/growiy-logo-round.png')
          }
        }
      ]
    });
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
          messageLimit: 0
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


    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, incomingMessage),
    }));

  };

  onSend = (messages = []) => {
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
        loadEarlier={true}

        user={{
          _id: CHATKIT_USER_NAME,
        }}
      />
    );
  }
}
