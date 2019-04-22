import React, { Component,  TouchableHighlight  } from 'react';
import {
  AppRegistry,
  StyleSheet,
  ListView,
  ScrollView,
  TouchableOpacity,
  Text,
  Image,
  Modal,
  View
} from 'react-native';

import { Input, Button, Overlay} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-material-cards';
import { FloatingAction } from 'react-native-floating-action';
import Form from 'react-native-form';
import Timeline from 'react-native-timeline-listview'

export default class TimelineScreen extends Component {
  static navigationOptions = {
    title: 'Timeline',
  };

  constructor(props) {
    super(props);
    this.data = [
      {time: '01/04/19', title: 'Seedling', description: 'Watering daily'},
      {time: '01/15/19', title: 'Sprout', description: 'Watering weekly'},
      {time: '02/02/19', title: 'First leaf', description: 'Adjusted lamps'},
      {time: '03/17/19', title: 'Wilting leaves', description: 'Too much water'},
    ]
  }


  render(){
    return(
      <View style={styles.container}>
      <Button
      buttonStyle={{ position: 'absolute', top: -40, left: 8, zIndex: 10, borderRadius: '50%', paddingLeft: 10, paddingRight: 10, paddingTop: 8, paddingBottom: 8}}
      icon={<Icon name="arrow-left" size={30} color="white"/>}
      onPress={()=>this.props.navigation.navigate('Home')}
      type="solid"
      />
      <Timeline
        style={styles.list}
        data={this.data}>
      </Timeline>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
		paddingTop:65,
		backgroundColor:'white'
  },
  list: {
    flex: 1,
    marginTop:20,
  },
});
