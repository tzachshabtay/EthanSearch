import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import React from 'react';
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Toolbar from '@material-ui/core/Toolbar';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function Gallery(props) {
    const [selectedTile, setSelectedTile] = React.useState(null);

    const handleClickOpen = tile => {
        setSelectedTile(tile);
    };

    const handleClose = () => {
        setSelectedTile(null);
    };

    return (
        <>
            <GridList cols={6} spacing={3}>
                {props.images.map(image => (
                    <GridListTile key={image.url}>
                        <img alt="" onError={() => props.onError(image.url)} onClick={() => handleClickOpen(image)} src={image.url} style={{ height: "95%", width: "95%", verticalAlign: "middle", textAlign: "center", whiteSpace: "nowrap", objectFit: "contain", border: "1px solid lightgray", borderRadius: "15px", cursor: "pointer" }}></img>
                    </GridListTile>
                ))}
            </GridList>
            <Dialog
                fullScreen
                open={selectedTile !== null}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleClose}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                    <IconButton
                        edge="end"
                        color="inherit"
                        aria-label="play"
                    >
                        <NotificationsActiveIcon />
                    </IconButton>
                </Toolbar>
                {selectedTile && (
                    <img alt="" src={selectedTile.url} style={{ width: "100%", height: "90%", objectFit: "contain" }}></img>
                )}
            </Dialog>
        </>
    )
}
