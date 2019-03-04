import React, { Component } from 'react'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import BugReportIcon from '@material-ui/icons/BugReport'
import NoteAddIcon from '@material-ui/icons/NoteAdd'
import AddPhotoIcon from '@material-ui/icons/AddPhotoAlternate'
import DeleteIcon from '@material-ui/icons/Delete'
import './Room.scss'

class Room extends Component {
    render() {
        return (
            <div class='card'>
                <Card className='card'>
                    <CardContent className='CardContent'>
                        <Typography gutterBottom variant="h5" component="h2">
                            {this.props.name}
                        </Typography>
                        <Typography gutterBottom component="p">
                            Height: {this.props.room["height"]}
                        </Typography>
                        <Typography gutterBottom component="p">
                            Width: {this.props.room["width"]}
                        </Typography>
                        <Typography gutterBottom component="p">
                            Length: {this.props.room["length"]}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        {/* <IconButton aria-label="Add General Note">
                            <NoteAddIcon />
                        </IconButton>
                        <IconButton aria-label="Add Bug/Pest Note">
                            <BugReportIcon />
                        </IconButton>
                        <IconButton aria-label="Add Picture Note">
                            <AddPhotoIcon />
                        </IconButton> */}
                        <IconButton aria-label="Delete Room">
                            <DeleteIcon />
                        </IconButton>
                    </CardActions>
                </Card>
            </div>
        );
    }
}

export default Room;
