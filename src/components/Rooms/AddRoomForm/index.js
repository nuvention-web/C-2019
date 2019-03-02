import React, { Component } from 'react';
import PropTypes from 'prop-types';
import firebase from "firebase";
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import Typography from '@material-ui/core/Typography'
import './AddRoomForm.scss'


class AddRoomForm extends Component {
    addRoom(event){
        var name = document.getElementById("room_name").value;
        var height = document.getElementById("room_height").value;
        var width = document.getElementById("room_width").value;
        var length = document.getElementById("room_length").value;
        if(name != "" && height != "" && width != "" && length != "" && !isNaN(height) && !isNaN(width) && !isNaN(length)){
            this.props.addRoom(name, height, width, length);
        }
    }

    render() {
        return (
            <div class='addroomform'>
                <Typography variant="h5" gutterBottom>
                    Add Room
                </Typography>
                <Input
                    placeholder="Name"
                    inputProps={{
                    'aria-label': 'Description',
                    }}
                    id="room_name"
                /> <br/>
                <Input
                    placeholder="Height"
                    inputProps={{
                    'aria-label': 'Description',
                    }}
                    id="room_height"
                /> <br/>
                <Input
                    placeholder="Width"
                    inputProps={{
                    'aria-label': 'Description',
                    }}
                    id="room_width"
                /> <br/>
                <Input
                    placeholder="Length"
                    inputProps={{
                    'aria-label': 'Description',
                    }}
                    id="room_length"
                /> <br/> <br/>
                <Button variant="contained" color="primary" onClick={this.addRoom.bind(this)}>
                    Add
                </Button>
            </div>
        );
    }
}

export default AddRoomForm;
