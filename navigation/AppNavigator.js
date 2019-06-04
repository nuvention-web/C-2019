import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import { Login } from '../screens';
import HomeScreen from '../screens/HomeScreen';
import ConsultingScreen from '../screens/ConsultingScreen';
import TimelineScreen from '../screens/TimelineScreen';
import SignupScreen from '../screens/Signup';
import ChatRoomList from '../screens/ChatRoomListScreen'
import SettingsScreen from '../screens/Settings';



export default createAppContainer(createSwitchNavigator({
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  Main: MainTabNavigator,
  Login: Login,
  Signup: SignupScreen,
  Home: HomeScreen,
  Consulting: ConsultingScreen,
  Timeline: TimelineScreen,
  ChatRoomList: ChatRoomList,
  Settings: SettingsScreen
},
{
  initialRouteName: 'Login',
}));
