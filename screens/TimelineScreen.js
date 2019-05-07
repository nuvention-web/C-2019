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
import { db } from "../src/config";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

export default class TimelineScreen extends Component {
  static navigationOptions = {
    title: 'Timeline',
  };

  constructor(props) {
    super(props);
    const plantID = this.props.navigation.state.params['plantID'];
    this.userEmail = firebase.auth().currentUser.email;
    this.ref = db
      .collection("Users")
      .doc(this.userEmail)
      .collection("Plants")
      .doc(plantID)
      .collection("Timeline");

    this.state = {
      isVisible: false, //state of modal default false
      time: '',
      title: '',
      description: '',
      image: "nothing",
      data: [],
      isLoading: true
    };

    this.renderDetail = this.renderDetail.bind(this)
  }

  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }

  onCollectionUpdate = (querySnapshot) => {
    const newData = [];
    querySnapshot.forEach((doc) => {
      const { date, title, description } = doc.data();
      newData.push(
        { time: date, title: title, description: description, imageUrl: "https://cloud.githubusercontent.com/assets/21040043/24240422/20d84f6c-0fe4-11e7-8f1d-9dbc594d0cfa.jpg" }
      );
    });
    this.setState({
      data: newData,
      isLoading: false,
   });
  }

  submitNewEntry = () => {
    this.setState({
      isLoading: true,
    });
    this.ref.add({
      time: this.state.time,
      title: this.state.title,
      description: this.state.description,
      imageUrl: "https://cloud.githubusercontent.com/assets/21040043/24240422/20d84f6c-0fe4-11e7-8f1d-9dbc594d0cfa.jpg"
    })
    .then(
      this.setState({
        isLoading: false,
        isVisible: false
      })
    )
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

  renderDetail(rowData) {
    let title = <Text style={[styles.title]}>{rowData.title}</Text>
    var desc = null
    if(rowData.description && rowData.imageUrl)
      desc = (
        <View style={styles.descriptionContainer}>   
          <Image source={{uri: rowData.imageUrl}} style={styles.image}/>
          <Text style={[styles.textDescription]}>{rowData.description}</Text>
        </View>
      )
    
    return (
      <View style={{flex:1}}>
        {title}
        {desc}
      </View>
    )
  }

  onEventPress(data){
    this.setState({selected: data})
  }

  renderSelected(){
    if(this.state.selected){
      return <Text style={{marginTop:10}}>Selected event: {this.state.selected.title} at {this.state.selected.time}</Text>
    }
  }

  render(){
    return(
      <View style={styles.container} minHeight="100%">
      
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

      {this.renderSelected()}
      <Timeline
        style={styles.list}
        data={this.state.data}
        renderDetail={this.renderDetail}
        onEventPress={this.onEventPress}>
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
  // list: {
  //   flex: 1,
  //   marginTop:20,
  // },
  list: {
    flex: 1,
    marginTop:20,
  },
  title:{
    fontSize:16,
    fontWeight: 'bold'
  },
  descriptionContainer:{
    flexDirection: 'row',
    paddingRight: 50
  },
  image:{
    width: 50,
    height: 50,
    borderRadius: 25
  },
  textDescription: {
    marginLeft: 10,
    color: 'gray'
  }
});
