import React, { Component } from "react";
import { StyleSheet, Text, ScrollView, ActivityIndicator, TouchableOpacity, View } from "react-native";
import { Input, Button, Overlay } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { Card, CardTitle, CardImage } from "react-native-material-cards";
import { db } from "../src/config";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

export default class HomeScreen extends Component {
  static navigationOptions = {
    title: "Home"
  };

  constructor(props) {
    super(props);
    this.userEmail = firebase.auth().currentUser.email;
    this.ref = db
      .collection("Users")
      .doc(this.userEmail)
      .collection("Plants");
    
    this.state = {
      isVisible: false, //state of modal default false
      strain: "",
      title: "",
      age: "",
      isLoading: true,
      cards: []
    };
  }

  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }

  onCollectionUpdate = (querySnapshot) => {
    const cards = [];
    querySnapshot.forEach((doc) => {
      const { age, strain } = doc.data();
      cards.push(
        <TouchableOpacity onPress={() => this.props.navigation.navigate("Timeline")}>
          <Card>
            <CardImage
              source={require("../src/static/plant1.jpg")}
              title={"Day " + age}
            />
            <CardTitle title={doc.id} subtitle={strain} />
          </Card>
        </TouchableOpacity>
      );
    });
    this.setState({
      cards,
      isLoading: false,
   });
  }

  submitNewPlant = () => {
    this.setState({
      isLoading: true,
    });
    this.ref.doc(this.state.title).set({
      strain: this.state.strain,
      age: this.state.age
    })
    .then(
      this.setState({
        isLoading: false,
        isVisible: false
      })
    )
  }

  render() {
    if(this.state.isLoading){
      return(
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#0000ff"/>
        </View>
      )
    }

    return (
      <View>
        <ScrollView>{this.state.cards}</ScrollView>
        <Overlay
          isVisible={this.state.isVisible}
          height="30%"
          fullScreen={false}
          onBackdropPress={() => this.setState({ isVisible: false })}
        >
          <Input
            label="Strain"
            onChangeText={strain => this.setState({ strain })}
          />
          <Input
            label="Title"
            onChangeText={title => this.setState({ title })}
          />
          <Input label="Age" onChangeText={age => this.setState({ age })} />
          <Button
            title="OK"
            onPress={() => this.submitNewPlant()}
            type="solid"
          />
        </Overlay>
        <Button
          buttonStyle={{
            position: "absolute",
            bottom: 10,
            right: 10,
            zIndex: 10,
            borderRadius: "50%",
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 8,
            paddingBottom: 8
          }}
          icon={<Icon name="plus" size={30} color="white" />}
          onPress={() => this.setState({ isVisible: true })}
          type="solid"
        />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  submitButton: {
    alignItems: "center",
    justifyContent: "center",
    margin: "auto"
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
    marginTop: 30
  },
  modal: {
    flex: 1,
    alignItems: "center",
    padding: 5,
    width: "90%",
    height: "30%",
    margin: 5
  },
  text: {
    color: "#3f2949",
    marginTop: 10
  },
  ModalInsideView: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00BCD4",
    height: 300,
    width: "90%",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff"
  },
  modalForm: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 5
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    alignSelf: "center"
  },
  button: {
    height: 36,
    backgroundColor: "#48BBEC",
    borderColor: "#48BBEC",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: "stretch",
    justifyContent: "center"
  },
  TouchableOpacityStyle: {
    position: "absolute",
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    right: 30,
    bottom: 30
  },

  FloatingButtonStyle: {
    resizeMode: "contain",
    width: 50,
    height: 50
  }
});
