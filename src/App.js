import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import InputBase from '@material-ui/core/InputBase';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Checkbox from '@material-ui/core/Checkbox';
import Gallery from './gallery';
import React from 'react';
import Images from './images';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import SearchIcon from '@material-ui/icons/Search';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { fade, makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import LinearProgress from '@material-ui/core/LinearProgress';
import ethan from './ethan.jpg';
import './App.css';

const images = new Images();

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

function App() {
  const classes = useStyles();

  const [checked, setChecked] = React.useState([]);

  const [results, setResults] = React.useState([]);

  const [manualSearch, setManualSearch] = React.useState("");

  const [hasSearch, setHasSearch] = React.useState(false);

  const [loading, setLoading] = React.useState(false);

  const [hasError, setHasError] = React.useState(false);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    const search = newChecked.length > 0 ? newChecked.join(' OR ') : ""
    setManualSearch(search);
  };

  const search = manualSearch || "clock"

  return (
    <div className={classes.root}>
      <AppBar position="sticky">
        <Toolbar>
          <img src={ethan} alt="" width={50} height={50} />
          <Typography className={classes.title} variant="h6" noWrap>
            <Link href="/" color="inherit">
              &nbsp;&nbsp;Ethan's Search!
          </Link>
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
              value={manualSearch}
              onChange={e => {
                setManualSearch(e.target.value)
              }}
            />
          </div>
          <Button variant="contained" onClick={() => {
            setLoading(true);
            setHasError(false);
            images.NewSearch(search, images => {
              setResults(images);
              setHasSearch(true);
              setLoading(false);
            }, () => {
              setHasError(true);
              setLoading(false);
            }
            )
          }}>Search</Button>
          <Button color="inherit" disabled={!hasSearch} startIcon={<NavigateBeforeIcon />} onClick={() => {
            setLoading(true);
            images.LoadPrevious(images => {
              setResults(images);
              setLoading(false);
            })
          }}>Back</Button>
          <Button color="inherit" disabled={!hasSearch} endIcon={<NavigateNextIcon />} onClick={() => {
            setLoading(true);
            images.LoadNext(images => {
              setResults(images);
              setLoading(false);
            })
          }}>Next</Button>
        </Toolbar>
      </AppBar>
      { loading && <LinearProgress color="secondary" />}
      { hasError && <Alert severity="error">"Error! Please try again tomorrow!"</Alert>}
      <List style={{
        display: 'flex',
        flexDirection: 'row',
        padding: 0,
      }}>
        {["Pendulum Clock", "Grandfather Clock", "Mantel Clock", "Cuckoo Clock", "Alarm Clock", "Hourglass"].map((value) => {
          const labelId = `checkbox-list-label-${value}`;

          return (
            <ListItem key={value} role={undefined} dense button onClick={handleToggle(value)}>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`${value}`} />
            </ListItem>
          );
        })}
      </List>
      { results && <Gallery images={results} onError={(url) => images.OnFaultyImage(url, (images) => setResults(images))} />}
    </div >
  );
}

export default App;
