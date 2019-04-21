import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import { Login } from '../screens';
import HomeScreen from '../screens/HomeScreen';
import ConsultingScreen from '../screens/ConsultingScreen';


export default createAppContainer(createSwitchNavigator({
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  Main: MainTabNavigator,
  Login: Login,
  Home: HomeScreen,
  Consulting: ConsultingScreen,
},
{
  initialRouteName: 'Login',
}));
