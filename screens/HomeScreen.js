import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  View
} from "react-native";
import { Input, Button, Overlay } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { Card, CardTitle, CardImage } from "react-native-material-cards";
import { db } from "../src/config";
import * as firebase from "firebase/app";
import "firebase/auth";
import SearchBar from "react-native-dynamic-search-bar";
import "firebase/database";
import AutoSuggest from 'react-native-autosuggest'

const growiy = "growiydotcom@gmail.com";
var userEmail = "";

export default class HomeScreen extends Component {
  static navigationOptions = {
    title: "Your Plants"
  };

  constructor(props) {
    super(props);

    this.state = {
      isVisible: false, //state of modal default false
      strain: "",
      title: "",
      age: "0",
      isLoading: true,
      cards: []
    };

    console.log(39);
    userEmail = firebase.auth().currentUser.email;

    this.ref = db.collection("Users");
  }

  componentDidMount() {
    console.log(50);
    console.log(userEmail);
    let userRef = this.ref.doc(userEmail).collection("Plants");

    this.unsubscribe = userRef.onSnapshot(this.onCollectionUpdate);
  }

  userLookup = text => {
    this.setState({
      isLoading: true
    });
    let oldUserEmail = userEmail;
    userEmail = text;
    try {
      let userRef = this.ref.doc(userEmail).collection("Plants");
      this.unsubscribe = userRef.onSnapshot(this.onCollectionUpdate);
    } catch (err) {
      userEmail = oldUserEmail;
    }

    this.setState({
      isLoading: false
    });
  };

  onCollectionUpdate = querySnapshot => {
    console.log(76);
    const cards = [];
    querySnapshot.forEach(doc => {
      console.log("81 " + JSON.stringify(doc.data()));
      const { age, strain } = doc.data();

      cards.push(
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate("Timeline", {
              plantID: doc.id,
              userEmail: userEmail
            })
          }
        >
          <Card>
            <CardImage
              source={require("../src/static/plant1.jpg")}
              // title={"Day " + age}
            />
            <CardTitle title={doc.id} subtitle={strain} />
          </Card>
        </TouchableOpacity>
      );
    });
    this.setState({
      cards,
      isLoading: false
    });
  };

  submitNewPlant = () => {
    console.log(102 + this.state.title + this.state.strain)

    if (this.state.title == "" || this.state.strain == ""){
      this.setState({
        isLoading: false,
        isVisible: false
      });

      //
      // this.setState({    isVisible: false}, function () {
      //           alert("Please fill out all form fields");
      // });
      //


      return;
    }
    console.log(113)

    let userRef = this.ref.doc(userEmail).collection("Plants");

    this.setState({
      isLoading: true
    });

    userRef
      .doc(this.state.title)
      .set({
        strain: this.state.strain,
        age: this.state.age
      })
      .then(
        this.setState({
          isLoading: false,
          isVisible: false
        })
      );
  };

  render() {
    var message = null;
    if(this.state.cards.length == 0){
      message = (<Text style={{ margin: 10 }}>You have no active timelines. Press the plus button to start tracking your plants!</Text>);
    }

    if (this.state.isLoading) {
      return (
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }

    if (firebase.auth().currentUser.email == growiy) {
      return (
        <View minHeight="100%">
          <View style={{ margin: 10 }}>
            <SearchBar
              placeholder="Search for users here"
              onPressCancel={() => {
                console.log("cancel");
              }}
              onChangeText={text => this.userLookup(text)}
            />
          </View>
          <ScrollView>{this.state.cards}</ScrollView>
          <Overlay
            isVisible={this.state.isVisible}
            height="auto"
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

            <Button
              title="OK"
              onPress={() => this.submitNewPlant()}
              type="solid"
            />
          </Overlay>
          <TouchableOpacity
            onPress={() => this.setState({ isVisible: true })}
            style={styles.button}
          >
            <Icon name="plus" size={30} color="white" />
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View minHeight="100%">
        <ScrollView>{message}{this.state.cards}</ScrollView>
        <Overlay
          isVisible={this.state.isVisible}
          height="auto"
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

          <Button
            title="OK"
            onPress={() => this.submitNewPlant()}
            type="solid"
          />
        </Overlay>
        <TouchableOpacity
          onPress={() => this.setState({ isVisible: true })}
          style={styles.button}
        >
          <Icon name="plus" size={30} color="white" />
        </TouchableOpacity>
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
    position: "absolute",
    bottom: 10,
    right: 10,
    zIndex: 10,
    borderRadius: 25,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 8,
    paddingBottom: 8,
    shadowColor: "rgba(0,0,0, .4)", // IOS
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    backgroundColor: "#2f95dc",
    elevation: 2 // Android
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
