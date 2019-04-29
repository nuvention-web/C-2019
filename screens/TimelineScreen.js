import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Text,
  
} from 'react-native';

import { ImagePicker , Permissions} from 'expo';
import { Input, Button, Overlay} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
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
      image: "nothing",
    };
  }


  submitNewEntry = ()=> {
    this.data.push({time: this.state.time, title: this.state.title, description: this.state.description});
    this.setState({ isVisible: false });

  }

  _pickImage = async () => {
    const permissions = Permissions.CAMERA_ROLL;
    const { status } = await Permissions.askAsync(permissions);
    let result = null;

    if(status === 'granted') {
    result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });
    console.log(result);
  }

    

    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };
  render(){
    return(
      <View style={styles.container}>
      <Overlay isVisible={this.state.isVisible} height='50%' fullScreen={false}   onBackdropPress={() => this.setState({ isVisible: false })}>
        <Input label='Time' onChangeText={time=>this.setState({time})} />
        <Input label='Title'  onChangeText={title=>this.setState({title})} />
        <Input label='Description'  onChangeText={description=>this.setState({description})} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button
          title="Pick an image from camera roll"
          onPress={this._pickImage}
        />

      </View>
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
      <Image source={{ uri: this.state.image }} style={{ width: 200, height: 200 }} />
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
