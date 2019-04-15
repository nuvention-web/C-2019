import React from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity  } from 'react-native';

import AddPlant from '../components/AddPlant'

export default class TrackerScreen extends React.Component {
  static navigationOptions = {
    title: 'Track Plant Progress',
  };

  constructor(props) {
    super(props),
    this.state = {
      noteArray: [],
      noteText: 'TEST',
    }
  }

  render() {
    let notes = this.state.noteArray.map((val,key) => {
      return <AddPlant key={key} keyval={key} val ={val}
        deleteMethod={()=> this.deleteMethod(key)}/>});

    return (
      <View style={styles.container}>
      <View style={styles.header}>
      <Text style={styles.headerText}>PLANTS</Text>
      </View>

      <ScrollView style={styles.scrollContainer}>
      { notes}
      </ScrollView>


      <TouchableOpacity onPress={ this.addPlant.bind(this) } style={styles.addButton}>
      <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      </View>


    )

  }
  addPlant() {
      this.state.noteArray.push({'note': this.state.noteText});
      this.setState({ noteArray: this.state.noteArray })
      // this.setState({ noteText: ''});
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    backgroundColor: "#A04A75",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 10,
    borderBottomColor: "#ddd"
  },
  headerText: {
    color: "white",
    fontSize: 18,
    padding: 26
  },
  scrollContainer: {
    flex: 1,
    marginBottom: 100
  },
  // footer: {
  //   position: "absolute",
  //   bottom: 0,
  //   left: 0,
  //   right: 0,
  //   zIndex: 10
  // },
  textInput: {
    alignSelf: "stretch",
    color: "#fff",
    padding: 20,
    backgroundColor: "#252525",
    borderTopWidth: 2,
    borderTopColor: "#ededed"
  },
  addButton: {
    position: "absolute",
    zIndex: 4,
    right: 20,
    bottom: 20,
    backgroundColor: "#A04A75",
    width: 40,
    height: 40,
    borderRadius: 59,
    alignItems: "center",
    justifyContent: "center",
    elevation:5
  },
  addButtonText: {
    color: "#fff",
    fontSize: 24
  }
});﻿
