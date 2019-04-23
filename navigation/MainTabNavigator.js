import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import TimelineScreen from '../screens/TimelineScreen';

import ConsultingScreen from '../screens/ConsultingScreen';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
  Timeline: TimelineScreen,
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

const TimelineStack = createStackNavigator({
  Timeline: TimelineScreen,
});

export default createBottomTabNavigator({
  HomeStack,
  ConsultingStack,
});
