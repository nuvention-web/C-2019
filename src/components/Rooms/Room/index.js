import React, { Component } from 'react'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

const styles = {
    card: {
      width: 275,
    }
}

class Room extends Component {
    render() {
        var rooms = [];
        var class_name = "room_tile_closed";
        return (
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
                    <Button size="small" color="primary">
                        Add Note
                    </Button>
                </CardActions>
            </Card>
        );
    }
}

export default Room;