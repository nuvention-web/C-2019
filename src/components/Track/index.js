import React, { Component } from 'react';
import PropTypes from 'prop-types';
import firebase from "firebase";
import AddRoomForm from "./AddRoomForm";
import RoomList from "./RoomList";
import RoomNotes from "./RoomNotes";
import Typography from '@material-ui/core/Typography'


class Track extends Component {
    constructor(props) 
    {
      super(props)
      this.state = {
        rooms: {},
        selectedRoom: {}
      }
    }

    componentDidMount() {
        if(this.props.uid) {
            var rooms = {};
            firebase.database().ref('Rooms/' + this.props.uid + '/').once('value', function (snapshot) {
                if(snapshot.val()){
                    Object.keys(snapshot.val()).forEach(name => {
                        rooms[name] = snapshot.val()[name]
                    });
                }
            }).then(data => {
                this.setState({rooms: rooms});
            });
        }
    }

    addRoom(name, height, width, length){
        firebase.database().ref('Rooms/' + this.props.uid + '/' + name + "/").set({
            height: height,
            width: width,
            length: length
        });
        var rooms = {};
        firebase.database().ref('Rooms/' + this.props.uid + '/').once('value', function (snapshot) {
            if(snapshot.val()){
                Object.keys(snapshot.val()).forEach(name => {
                    rooms[name] = snapshot.val()[name]
                });
            }
        }).then(data => {
            this.setState({rooms: rooms});
        });
    }

    render() {
        return (
            <div>
                <RoomList rooms={this.state.rooms}/>
                <RoomNotes room={this.state.selectedRoom}/>
                <AddRoomForm uid={this.props.uid} addRoom={this.addRoom.bind(this)}/>
            </div>
        );
    }
}

export default Track;