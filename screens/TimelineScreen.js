import React, { Component, forwardRef } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Text,
  TouchableHighlight,
  Modal,
  Dimensions,
  ActivityIndicator
} from "react-native";

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
  var dateVal = parseInt(date.substring(6, 10)) * 10000;
  dateVal += parseInt(date.substring(3, 5));
  dateVal += parseInt(date.substring(0, 2)) * 100;
  return dateVal.toString();
}

function sortEntries(data) {
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
    this.ref = db
      .collection("Users")
      .doc(this.userEmail)
      .collection("Plants")
      .doc(plantID)
      .collection("Timeline");

    console.log("53");
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
      pH: "",
      temperature: "",
      image: "nothing",
      data: [],
      isLoading: true,
      downloadURL: "",
      userEmail: this.userEmail,
      plantID: plantID,
      modalVisible: false,
      modalImg: null,
      modalTitle: "",
      modalDescription: ""
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

    this.setState({
      isLoading: false
    });
  };

  submitNewEntry = async () => {
    let fullDescription =
      this.state.description +
      "\npH: " +
      this.state.pH +
      "\nTemperature: " +
      this.state.temperature;
    this.setState({
      isLoading: true
    });
    if (this.state.image != "nothing") {
      console.log("IMAGE SUPPLIED 151")
      this.uploadImage(this.state.image)
        .then(() => {
          this.ref.add({
            date: this.state.date,
            title: this.state.title,
            description: fullDescription
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
          description: fullDescription
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
    console.log(182)
    const permissions = Permissions.CAMERA_ROLL;
    const { status } = await Permissions.askAsync(permissions);
    let result = null;
    console.log(186)
    if (status === "granted") {
      console.log(188)
      result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3]
      });
    }
    console.log(194)
    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };

  uploadImage = async uri => {
    let fullDescription =
      this.state.description +
      "\npH: " +
      this.state.pH +
      "\nTemperature: " +
      this.state.temperature;
    console.log(201);
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

    console.log(216)
    var imageName = md5(
      this.state.userEmail +
        this.state.date +
        this.state.title +
        fullDescription +
        this.state.plantID
    );
    console.log(224)
    var ref = firebase
      .storage()
      .ref()
      .child("images/" + imageName + ".jpg");
    console.log(229);
    return ref.put(blob);
  };

  renderDetail(rowData) {
    let title = <Text style={[styles.title]}>{rowData.title}</Text>;
    var desc = null;
    if (rowData.description && rowData.imageUrl) {
      desc = (
        <View style={styles.descriptionContainer}>
          <Image source={{ uri: rowData.imageUrl }} style={styles.image} />
          <Text style={[styles.textDescription]}>{rowData.description}</Text>
        </View>
      );
      return (
        <View style={{ flex: 1 }}>
          {title}
          {desc}
        </View>
      );
    } else if (rowData.description) {
      desc = (
        <View style={styles.descriptionContainer}>
          <Text style={[styles.textDescription]}>{rowData.description}</Text>
        </View>
      );
      return (
        <View style={{ flex: 1 }}>
          {title}
          {desc}
        </View>
      );
    }
  }

  onEventPress = data => {
    this.setState({
      modalVisible: true,
      modalImg: data.imageUrl,
      modalDescription: data.description,
      modalTitle: data.title
    });
    console.log(data.imageUrl);
    console.log(data.title);
    console.log(data.description);
  };

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

  renderModalImage() {
    console.log("rendering modal");
    if (this.state.modalImg) {
      console.log("modal image not null");
      return (
        <Image
          source={{ uri: this.state.modalImg }}
          style={{
            marginTop: 20,
            marginBottom: 20,
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height * 0.5
          }}
        />
      );
    }
    return null;
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  render() {
    var message = null;
    if (this.state.data.length == 0) {
      message = (
        <Text style={{ marginVertical: 10 }}>
          You have no timeline entries for this plant. Press the plus button to
          start tracking!
        </Text>
      );
    }

    if (this.state.isLoading) {
      return (
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    } else {
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
            <Input label="pH" onChangeText={pH => this.setState({ pH })} />
            <Input
              label="Temperature"
              onChangeText={temperature => this.setState({ temperature })}
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
              removeClippedSubviews: false,
              style: { paddingTop: 5 }
            }}
            circleSize={20}
            innerCircle={"dot"}
            circleColor="green"
            lineColor="green"
            timeContainerStyle={{ minWidth: 52, marginTop: -5 }}
            timeStyle={{
              textAlign: "center",
              backgroundColor: "green",
              color: "white",
              padding: 5,
              borderRadius: 5
            }}
            descriptionStyle={{ color: "gray" }}
            style={styles.list}
            data={this.state.data}
            renderDetail={this.renderDetail}
            onEventPress={this.onEventPress}
          >
            {/* // onEventPress={this.onEventPress}> */}
          </Timeline>

          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
            }}
          >
            <View style={{ marginTop: 50 }}>
              <View
                style={{
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text style={{ fontSize: 40 }}>{this.state.modalTitle}</Text>

                {this.renderModalImage()}

                <Text style={{ fontSize: 30, padding: 5 }}>
                  {this.state.modalDescription}
                </Text>
                <Button
                  style={{ margin: 10 }}
                  block
                  onPress={() => {
                    this.setModalVisible(!this.state.modalVisible);
                  }}
                  title="Back to Timeline"
                />
              </View>
            </View>
          </Modal>

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
