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
import {Link} from 'react-router-native';

import ConsultingScreen from './ConsultingScreen';

import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-material-cards';
import { FloatingAction } from 'react-native-floating-action';
import Form from 'react-native-form';


export default class HomeScreen extends Component {
  static navigationOptions = {
    title: 'Plant Tracker',
  };

  constructor(props) {
    super(props);

    data = {'Plant 1' : {'image' : '../src/static/plant1.jpg', 'strain': 'sativa', 'age' : 22},
    'Plant 2' : {'image' : '../src/static/plant2.jpg', 'strain': 'sativa', 'age' : 52},
    'Plant 3' : {'image' : '../src/static/plant3.jpg', 'strain': 'sativa', 'age' : 77}};

    cards = [];
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        image = data[key]['image'];
        cards.push(
          <TouchableOpacity
                onPress={()=>this.props.navigation.navigate('Consulting')}>
                <Card>
                  <CardImage
                  source={require('../src/static/plant1.jpg')}
                  title={"Day " + data[key]['age']}
                  />
                  <CardTitle
                  title={key}
                  subtitle={data[key]['strain']}
                  />
                </Card>
            </TouchableOpacity>

        )
      }
    }


    this.state = {
      isVisible: false, //state of modal default false
      strain: '',
      description: '',
      age: '',
      cards
    };
  }

  submitNewPlant = ()=> {
    this.setState((prevState)=>{
      let oldCards = prevState.cards;
      oldCards.push(
        <Card>
        <CardImage
        source={require('../src/static/plant1.jpg')}
        title={"Day " + prevState.age}
        />
        <CardTitle
        title={this.state.description}
        subtitle={this.state.strain}
        />
        {/* <CardContent text="Your device will reboot in few seconds once successful, be patient meanwhile" /> */}
        </Card>
      );
      return {
        cards: oldCards,
        isVisible: false
      }
    })

  }

  render() {


    return (
      <View>
      <ScrollView>
      {cards}
      </ScrollView>
      <Overlay isVisible={this.state.isVisible} height='50%' fullScreen={false}   onBackdropPress={() => this.setState({ isVisible: false })}>
      <Input label='Strain' onChangeText={strain=>this.setState({strain})} />
      <Input label='Description'  onChangeText={description=>this.setState({description})} />
      <Input label='Age'  onChangeText={age=>this.setState({age})} />
      <Button
      title="OK"
      onPress={this.submitNewPlant}
      type="solid"
      />
      </Overlay>

      <Button
      buttonStyle={{ position: 'absolute', bottom: 10, right: 10, zIndex: 10, borderRadius: '50%', paddingLeft: 10, paddingRight: 10, paddingTop: 8, paddingBottom: 8}}
      icon={<Icon name="plus" size={30} color="white"/>}
      onPress={() => this.setState({ isVisible: true })}
      type="solid"
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
  },
  TouchableOpacityStyle:{

    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
  },

  FloatingButtonStyle: {

    resizeMode: 'contain',
    width: 50,
    height: 50,
  }
});
