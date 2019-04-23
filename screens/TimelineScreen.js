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
    this.state = {
      isVisible: false, //state of modal default false
      time: '',
      title: '',
      description: '',
    };
  }

  submitNewEntry = ()=> {
    this.data.push({time: this.state.time, title: this.state.title, description: this.state.description});
    this.setState({ isVisible: false });

  }




  render(){
    return(
      <View style={styles.container}>
      <Overlay isVisible={this.state.isVisible} height='50%' fullScreen={false}   onBackdropPress={() => this.setState({ isVisible: false })}>
        <Input label='Time' onChangeText={time=>this.setState({time})} />
        <Input label='Title'  onChangeText={title=>this.setState({title})} />
        <Input label='Description'  onChangeText={description=>this.setState({description})} />
        <Button
        title="OK"
        onPress={this.submitNewEntry}
        type="solid"
        />
      </Overlay>
      <Timeline
        style={styles.list}
        data={this.data}>
      </Timeline>
      <Button
      buttonStyle={{ position: 'absolute', bottom: 10, right: 10, zIndex: 10, borderRadius: '50%', paddingLeft: 10, paddingRight: 10, paddingTop: 8, paddingBottom: 8}}
      icon={<Icon name="plus" size={30} color="white"/>}
      onPress={() => this.setState({ isVisible: true })}
      type="solid"
      />

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
		paddingTop:0,
		backgroundColor:'white'
  },
  list: {
    flex: 1,
    marginTop:20,
  },
});
