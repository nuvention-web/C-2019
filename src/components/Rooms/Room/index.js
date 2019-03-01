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


const styles = {
    card: {
      width: 275,
    }
}

class Room extends Component {
    render() {
        return (
            <div class='card'>
                <Card className={styles.card}>
                    <CardContent>
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
                        <IconButton aria-label="Add to favorites">
                            <NoteAddIcon />
                        </IconButton>
                        <IconButton aria-label="Add to favorites">
                            <BugReportIcon />
                        </IconButton>
                        <IconButton aria-label="Add to favorites">
                            <AddPhotoIcon />
                        </IconButton>
                    </CardActions>
                </Card>
            </div>
        );
    }
}

export default Room;