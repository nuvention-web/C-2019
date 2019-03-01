import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './RoomList.css';
import Room from "../Room";

class RoomList extends Component {
    render() {
        var rooms = [];
        Object.keys(this.props.rooms).forEach(name => {
            rooms.push(
                <div>
                    <Room name={name} room={this.props.rooms[name]}/> <br/>
                </div>
            )
        });

        return (
            <div class='roomlist'>
                {rooms}
            </div>
        );
    }
}

export default RoomList;