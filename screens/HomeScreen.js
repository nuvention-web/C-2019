import React, { Component,  TouchableHighlight  } from 'react';
import {
  AppRegistry,
  StyleSheet,
  ListView,
  ScrollView,
  Text,
  Modal,
  View
} from 'react-native';

import { Input, Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';



import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-material-cards';
import { FloatingAction } from 'react-native-floating-action';
import Form from 'react-native-form'


export default class HomeScreen extends Component {
  static navigationOptions = {
    title: 'Plant Tracker',
  };

  constructor(props) {
    super(props);
    this.state = {
      isVisible: false, //state of modal default false

    };
  }


  render() {
    data = {'Plant 1' : {'image' : '../src/static/plant1.jpg', 'strain': 'sativa', 'age' : 22},
    'Plant 2' : {'image' : '../src/static/plant2.jpg', 'strain': 'sativa', 'age' : 52},
    'Plant 3' : {'image' : '../src/static/plant3.jpg', 'strain': 'sativa', 'age' : 77}};

    cards = [];
    for (var key in data) {
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
      <View>
      <ScrollView>
      {cards}
      </ScrollView>

      <View style={styles.modal}>

      <Modal animationType = {"fade"} transparent = {false}
      visible = {this.state.isVisible}
      onRequestClose = {() =>{ console.log("Modal has been closed.") } }>

      <View style={styles.modalForm}>
        <Text style={styles.headerText}>New Plant Form</Text>
        <Input label='Strain' />
        <Input label='Description' />
        <Input label='Age' />
      </View>


      <Button
        onPress={() => this.setState({ isVisible: false})}
        icon={
          <Icon
            name="check"
            size={25}
            color="white"
          />
        }
        title="Submit"
      />

      </Modal>
      </View>

      <FloatingAction
      showBackground = {true}
      overlayColor = 'rgba(0, 0, 0, 0)'
      onPressMain = {() => {this.setState({ isVisible: true})}}
      />
      </View>

    );
  }
}


const styles = StyleSheet.create({
  submitButton:{
    alignItems: 'center',
    justifyContent: 'center',
    margin: 'auto',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    marginTop:30
  },
  modal: {
    flex: 1,
    alignItems: 'center',
    padding: 5,
    width: '90%',
    height: '30%',
    margin: 5
  },
  text: {
    color: '#3f2949',
    marginTop: 10
  },
  ModalInsideView:{

    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor : "#00BCD4",
    height: 300 ,
    width: '90%',
    borderRadius:10,
    borderWidth: 1,
    borderColor: '#fff'

  },
  modalForm:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  }
});
