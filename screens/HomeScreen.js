import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  View,
  Picker,
  Alert
} from "react-native";
import { Input, Button, Overlay } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  Card,
  CardTitle,
  CardImage,
  CardAction,
  CardButton
} from "react-native-material-cards";
import { db } from "../src/config";
import * as firebase from "firebase/app";
import "firebase/auth";
import SearchBar from "react-native-dynamic-search-bar";
import "firebase/database";
import { Dropdown } from 'react-native-material-dropdown';

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

    userEmail = firebase.auth().currentUser.email;

    this.ref = db.collection("Users");
  }

  componentDidMount() {
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

  deletePlant = title => {
    let userRef = this.ref.doc(userEmail).collection("Plants");
    userRef.doc(title).delete();
  };

  onCollectionUpdate = querySnapshot => {
    const cards = [];
    imageVal = 0;
    querySnapshot.forEach(doc => {
      const { age, strain } = doc.data();
      var image1;
      if(doc.id == "Grow Tent"){
        image1 = (
          <CardImage
            source={require("../src/static/growroom.jpg")}
          />
        )
      } else if(imageVal == 0){
        image1 = (
          <CardImage
            source={require("../src/static/plant1.jpg")}
          />
        )
      } else if(imageVal == 1){
        image1 = (
          <CardImage
            source={require("../src/static/plant2.jpg")}
          />
        )
      } else if(imageVal == 2){
        image1 = (
          <CardImage
            source={require("../src/static/plant3.jpg")}
          />
        )
      }
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
            {image1}
            <CardTitle title={doc.id} subtitle={strain} />
            <CardAction inColumn={false}>
              <CardButton
                onPress={() => {
                  let userRef = this.ref.doc(userEmail).collection("Plants");
                  Alert.alert(
                    "Are you sure you want to delete your plant?",
                    "Your plant's data will be permanently lost.",
                    [
                      { text: "No", onPress: () => console.log("No pressed") },
                      {
                        text: "Yes",
                        onPress: () => userRef.doc(doc.id).delete()
                      }
                    ],
                    { cancelable: false }
                  );
                }}
                title="Delete"
                color="green"
              />
            </CardAction>
          </Card>
        </TouchableOpacity>
      );
      imageVal++;
      imageVal = imageVal % 3;
    });

    this.setState({
      cards,
      isLoading: false
    });
  };

  submitNewPlant = () => {
    if (this.state.title == "" || this.state.strain == "") {
      this.setState({
        isLoading: false,
        isVisible: false
      });
      return;
    }

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
    if (this.state.cards.length == 0) {
      message = (
        <Text style={{ margin: 10 }}>
          You have no active timelines. Press the plus button to start tracking
          your plants!
        </Text>
      );
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
              label="Name"
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
        <ScrollView>
          {message}
          {this.state.cards}
        </ScrollView>
        <Overlay
          isVisible={this.state.isVisible}
          height="auto"
          fullScreen={false}
          onBackdropPress={() => this.setState({ isVisible: false })}
        >
          <Dropdown
            label='Strain Type'
            containerStyle = {{marginLeft: 10, marginRight: 10, marginBottom: 10, marginTop: 5}}
            labelFontSize = '16'
            labelTextStyle = {{ fontWeight: 'bold'}}
            data={[{value: 'Sativa'},{value: 'Indica'},{value: 'Other'}]}
            onChangeText={strain => this.setState({ strain })}
          />
          <Input
            label="Name"
            onChangeText={title => this.setState({ title })}
          />
          <Button
            style={{ margin: 5 }}
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
    width: "100%",
    height: "50%",
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
    height: '50%',
    width: "100%",
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
