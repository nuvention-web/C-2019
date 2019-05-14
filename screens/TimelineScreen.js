import React, { Component, forwardRef } from "react";
import { StyleSheet, View, TouchableOpacity, Image, Text } from "react-native";

import { ImagePicker, Permissions } from "expo";
import { Input, Button, Overlay } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import Timeline from "react-native-timeline-listview";
import { db } from "../src/config";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import DatePicker from "react-native-datepicker";
import md5 from "md5";

function dateToInt(date) {
  console.log("15 " + JSON.stringify(date));
  var dateVal = parseInt(date.substring(6, 10)) * 10000;
  dateVal += parseInt(date.substring(3, 5)) * 100;
  dateVal += parseInt(date.substring(0, 2));
  return dateVal.toString();
}

function sortEntries(data) {
    console.log("24 " + JSON.stringify(data));
  return data.sort(function(a, b) {
    console.log(dateToInt(a["time"]));
    aVal = dateToInt(a["time"]);
    bVal = dateToInt(b["time"]);
    if (aVal < bVal) {
      return -1;
    } else {
      return 1;
    }
  });
}

export default class TimelineScreen extends Component {
  static navigationOptions = {
    title: "Timeline"
  };

  constructor(props) {
    super(props);
    const plantID = this.props.navigation.state.params["plantID"];
    this.userEmail = this.props.navigation.state.params["userEmail"]; //firebase.auth().currentUser.email;
    console.log("44 " + plantID + " " + this.userEmail)
    this.ref = db
      .collection("Users")
      .doc(this.userEmail)
      .collection("Plants")
      .doc(plantID)
      .collection("Timeline");

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    today = mm + "/" + dd + "/" + yyyy;

    this.state = {
      isVisible: false, //state of modal default false
      date: today,
      title: "",
      description: "",
      image: "nothing",
      data: [],
      isLoading: true,
      downloadURL: "",
      userEmail: this.userEmail,
      plantID: plantID
    };

    this.renderDetail = this.renderDetail.bind(this);
  }

  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }

  onCollectionUpdate = async querySnapshot => {
    this.setState({
      isLoading: true
    });
    var newData = [];
    await querySnapshot.forEach(doc => {
      const { date, title, description } = doc.data();
      console.log(description);``
      var imageName = md5(
        this.state.userEmail + date + title + description + this.state.plantID
      );
      var ref = firebase
        .storage()
        .ref()
        .child("images/" + imageName + ".jpg");
      ref
        .getDownloadURL()
        .then(function(url) {
          newData.push({
            time: date,
            title: title,
            description: description,
            imageUrl: url
          });
        })
        .catch(function(error) {
          newData.push({
            time: date,
            title: title,
            description: description,
            imageUrl: ""
          });
        })
        .finally(() => {
          this.setState({
            data: sortEntries(newData),
            isLoading: false
          });
        });
    });
  };

  submitNewEntry = async () => {
    this.setState({
      isLoading: true
    });
    if (this.state.image != "nothing") {
      this.uploadImage(this.state.image)
        .then(() => {
          this.ref.add({
            date: this.state.date,
            title: this.state.title,
            description: this.state.description
          });
        })
        .then(() => {
          this.setState({
            isLoading: false,
            isVisible: false
          });
        });
    } else {
      this.ref
        .add({
          date: this.state.date,
          title: this.state.title,
          description: this.state.description
        })
        .then(() => {
          this.setState({
            isLoading: false,
            isVisible: false
          });
        });
    }
  };

  _pickImage = async () => {
    const permissions = Permissions.CAMERA_ROLL;
    const { status } = await Permissions.askAsync(permissions);
    let result = null;

    if (status === "granted") {
      result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3]
      });
    }

    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };

  uploadImage = async uri => {
    const response = await fetch(uri);
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      };
      xhr.onerror = function(e) {
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    var imageName = md5(
      this.state.userEmail +
        this.state.date +
        this.state.title +
        this.state.description +
        this.state.plantID
    );
    var ref = firebase
      .storage()
      .ref()
      .child("images/" + imageName + ".jpg");

    return ref.put(blob);
  };

  renderDetail(rowData) {
    let title = <Text style={[styles.title]}>{rowData.title}</Text>;
    var desc = null;
    if (rowData.description && rowData.imageUrl){
      desc = (
        <View style={styles.descriptionContainer}>
          <Image source={{ uri: rowData.imageUrl }} style={styles.image} />
          <Text style={[styles.textDescription]}>{rowData.description}</Text>
        </View>
      );
    } else if(rowData.description){
      desc = (
        <View style={styles.descriptionContainer}>
          <Text style={[styles.textDescription]}>{rowData.description}</Text>
        </View>
      );
    }

    return (
      <View style={{ flex: 1 }}>
        {title}
        {desc}
      </View>
    );
  }

  onEventPress(data) {
    this.setState({ selected: data });
  }

  renderSelected() {
    if (this.state.selected) {
      return (
        <Text style={{ marginTop: 10 }}>
          Selected event: {this.state.selected.title} at{" "}
          {this.state.selected.date}
        </Text>
      );
    }
  }

  render() {
    var message = null;
    if(this.state.data.length == 0){
      message = (<Text style={{ marginVertical: 10 }}>You have no timeline entries for this plant. Press the plus button to start tracking!</Text>);
    }

    return (
      <View style={styles.container} minHeight="100%">
        {message}
        <Overlay
          isVisible={this.state.isVisible}
          height="auto"
          fullScreen={false}
          onBackdropPress={() => this.setState({ isVisible: false })}
        >
          <Input
            label="Title"
            onChangeText={title => this.setState({ title })}
          />
          <Input
            label="Description"
            onChangeText={description => this.setState({ description })}
          />
          <DatePicker
            style={{ width: 200 }}
            date={this.state.date}
            mode="date"
            placeholder="select date"
            format="MM/DD/YYYY"
            minDate="01-01-2016"
            maxDate="01-01-2021"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateIcon: {
                position: "absolute",
                left: 8,
                top: 4,
                marginLeft: 0,
                marginTop: 5
              },
              dateInput: {
                marginTop: 5,
                marginLeft: 44,
                borderRadius: 2
              }
            }}
            onDateChange={date => {
              this.setState({ date: date });
            }}
          />
          <Button
            title="Upload Image"
            onPress={this._pickImage}
            style={{
              marginVertical: 10
            }}
          />
          <Button title="OK" onPress={this.submitNewEntry} type="solid" />
        </Overlay>

        {this.renderSelected()}
        <Timeline
          options={{
            removeClippedSubviews: false
          }}
          style={styles.list}
          data={this.state.data}
          renderDetail={this.renderDetail}
        >
          {/* // onEventPress={this.onEventPress}> */}
        </Timeline>
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
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 0,
    backgroundColor: "white"
  },
  list: {
    flex: 1,
    marginTop: 20
  },
  title: {
    fontSize: 16,
    fontWeight: "bold"
  },
  descriptionContainer: {
    flexDirection: "row",
    paddingRight: 50
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25
  },
  textDescription: {
    marginLeft: 10,
    color: "gray"
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
  }
});
