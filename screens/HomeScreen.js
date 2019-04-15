import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  ListView,
  ScrollView,
  Text,
  View
} from 'react-native';

import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-material-cards';

export default class HomeScreen extends Component {
  static navigationOptions = {
    title: 'Your Timelines',
  };

  constructor(props) {
    super(props)
  }

  render() {
    data = {'Plant 1' : {'image' : '../src/static/plant1.jpg', 'strain': 'sativa', 'age' : 22},
            'Plant 2' : {'image' : '../src/static/plant2.jpg', 'strain': 'sativa', 'age' : 52},
            'Plant 3' : {'image' : '../src/static/plant3.jpg', 'strain': 'sativa', 'age' : 77}};

    cards = [];
    for (var key in data) {
      // check if the property/key is defined in the object itself, not in parent
      if (data.hasOwnProperty(key)) {   
        image = data[key]['image'];
        cards.push(
          <Card>
            <CardImage
              source={require('../src/static/plant1.jpg')}
              title={"Day " + data[key]['age']}
            />
            <CardTitle 
              title={key} 
              subtitle={data[key]['strain']}
            />
            {/* <CardContent text="Your device will reboot in few seconds once successful, be patient meanwhile" /> */}
          </Card>
        )
      }
    }

    return (
      <ScrollView>
        {cards}
      </ScrollView>
    );
  }
}



