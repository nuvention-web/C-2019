import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import ConsultingScreen from '../screens/ConsultingScreen';


const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-home`
          : 'md-home'
      }
    />
  ),
};

const ConsultingStack = createStackNavigator({
  Consulting: ConsultingScreen,
});


ConsultingStack.navigationOptions = {
  tabBarLabel: 'Consulting',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-chatbubbles`
          : 'md-chatbubbles'
      }
    />
  ),
};

export default createBottomTabNavigator({
  HomeStack,
  ConsultingStack,
});
